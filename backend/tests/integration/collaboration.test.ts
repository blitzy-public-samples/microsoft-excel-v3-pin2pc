import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import { createSandbox, SinonSandbox } from 'sinon';
import io from 'socket.io-client';
import { CollaborationService } from '../../services/collaborationService';
import { Workbook } from '../../models/workbook';
import { User } from '../../models/user';
import { IDataStorage } from '../../../shared/interfaces/IDataStorage';

describe('Collaboration Integration Tests', () => {
  let sandbox: SinonSandbox;
  let collaborationService: CollaborationService;
  let dataStorage: IDataStorage;
  let testWorkbook: Workbook;
  let testUsers: User[];

  beforeEach(() => {
    sandbox = createSandbox();
    dataStorage = {} as IDataStorage; // Mock implementation
    collaborationService = new CollaborationService(dataStorage);
    testWorkbook = createTestWorkbook();
    testUsers = createTestUsers(3);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should allow multiple users to connect to a workbook', async () => {
    const connections = testUsers.map(user => 
      collaborationService.connectUser(user, testWorkbook.id)
    );
    const results = await Promise.all(connections);
    
    results.forEach((result, index) => {
      expect(result).to.be.true;
      expect(collaborationService.getActiveUsers(testWorkbook.id)).to.include(testUsers[index]);
    });
  });

  it('should broadcast cell changes to all connected users', async () => {
    const [user1, user2, user3] = testUsers;
    await Promise.all(testUsers.map(user => collaborationService.connectUser(user, testWorkbook.id)));

    const cellChange = { sheet: 'Sheet1', row: 1, col: 'A', value: 'New Value' };
    const user2Socket = io(); // Mocked socket for user2
    const user3Socket = io(); // Mocked socket for user3

    sandbox.stub(user2Socket, 'on').yields(cellChange);
    sandbox.stub(user3Socket, 'on').yields(cellChange);

    await collaborationService.updateCell(user1, testWorkbook.id, cellChange);

    expect(user2Socket.on).to.have.been.calledWith('cellUpdate');
    expect(user3Socket.on).to.have.been.calledWith('cellUpdate');
  });

  it('should handle concurrent edits without conflicts', async () => {
    const [user1, user2] = testUsers.slice(0, 2);
    await Promise.all([user1, user2].map(user => collaborationService.connectUser(user, testWorkbook.id)));

    const change1 = { sheet: 'Sheet1', row: 1, col: 'A', value: 'Value 1' };
    const change2 = { sheet: 'Sheet1', row: 2, col: 'B', value: 'Value 2' };

    await Promise.all([
      collaborationService.updateCell(user1, testWorkbook.id, change1),
      collaborationService.updateCell(user2, testWorkbook.id, change2)
    ]);

    const updatedWorkbook = await dataStorage.getWorkbook(testWorkbook.id);
    expect(updatedWorkbook.getCell('Sheet1', 1, 'A')).to.equal('Value 1');
    expect(updatedWorkbook.getCell('Sheet1', 2, 'B')).to.equal('Value 2');
  });

  it('should maintain data consistency across multiple users', async () => {
    await Promise.all(testUsers.map(user => collaborationService.connectUser(user, testWorkbook.id)));

    const changes = [
      { user: testUsers[0], change: { sheet: 'Sheet1', row: 1, col: 'A', value: 'User 1 Edit' } },
      { user: testUsers[1], change: { sheet: 'Sheet1', row: 2, col: 'B', value: 'User 2 Edit' } },
      { user: testUsers[2], change: { sheet: 'Sheet1', row: 3, col: 'C', value: 'User 3 Edit' } }
    ];

    await Promise.all(changes.map(({ user, change }) => 
      collaborationService.updateCell(user, testWorkbook.id, change)
    ));

    const finalWorkbook = await dataStorage.getWorkbook(testWorkbook.id);
    changes.forEach(({ change }) => {
      expect(finalWorkbook.getCell(change.sheet, change.row, change.col)).to.equal(change.value);
    });

    testUsers.forEach(user => {
      const userView = collaborationService.getUserView(user, testWorkbook.id);
      changes.forEach(({ change }) => {
        expect(userView.getCell(change.sheet, change.row, change.col)).to.equal(change.value);
      });
    });
  });

  // Helper functions
  function createTestUsers(count: number): User[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `user${i + 1}`,
      name: `Test User ${i + 1}`
    }));
  }

  function createTestWorkbook(): Workbook {
    return {
      id: 'test-workbook-id',
      name: 'Test Workbook',
      sheets: [{
        name: 'Sheet1',
        cells: {}
      }]
    };
  }
});

// TODO: Implement stress tests for large numbers of simultaneous collaborators
// TODO: Add tests for error scenarios and edge cases in collaboration