import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Observable } from 'rxjs';
import { Workbook } from '../models/workbook';
import { User } from '../models/user';
import { IDataStorage } from '../../shared/interfaces/IDataStorage';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';

@Injectable()
export class CollaborationService {
  private activeCollaborations: Map<string, Set<string>> = new Map();

  constructor(private readonly dataStorage: IDataStorage) {}

  async joinCollaboration(workbookId: string, userId: string): Promise<boolean> {
    try {
      // Check if the user has access to the workbook
      const hasAccess = await this.dataStorage.checkUserAccess(workbookId, userId);
      if (!hasAccess) {
        throw new Error(ERROR_MESSAGES.ACCESS_DENIED_ERROR);
      }

      // Add the user to the activeCollaborations Map for the workbook
      if (!this.activeCollaborations.has(workbookId)) {
        this.activeCollaborations.set(workbookId, new Set());
      }
      this.activeCollaborations.get(workbookId).add(userId);

      // Emit a 'user_joined' event to other collaborators
      this.emitToCollaborators(workbookId, 'user_joined', { userId });

      return true;
    } catch (error) {
      console.error('Error joining collaboration:', error);
      return false;
    }
  }

  async leaveCollaboration(workbookId: string, userId: string): Promise<boolean> {
    try {
      // Remove the user from the activeCollaborations Map for the workbook
      if (this.activeCollaborations.has(workbookId)) {
        this.activeCollaborations.get(workbookId).delete(userId);

        // Emit a 'user_left' event to other collaborators
        this.emitToCollaborators(workbookId, 'user_left', { userId });

        // If no users are left, clean up any resources associated with the collaboration
        if (this.activeCollaborations.get(workbookId).size === 0) {
          this.activeCollaborations.delete(workbookId);
          // Perform any necessary cleanup
        }
      }

      return true;
    } catch (error) {
      console.error('Error leaving collaboration:', error);
      return false;
    }
  }

  async broadcastChange(workbookId: string, userId: string, change: any): Promise<void> {
    try {
      // Validate that the user is part of the active collaboration
      if (!this.activeCollaborations.has(workbookId) || !this.activeCollaborations.get(workbookId).has(userId)) {
        throw new Error(ERROR_MESSAGES.USER_NOT_IN_COLLABORATION);
      }

      // Emit a 'change' event to all other collaborators with the change data
      this.emitToCollaborators(workbookId, 'change', { userId, change }, userId);

      // Update the workbook in the data storage
      await this.dataStorage.updateWorkbook(workbookId, change);
    } catch (error) {
      console.error('Error broadcasting change:', error);
      throw error;
    }
  }

  async getActiveCollaborators(workbookId: string): Promise<User[]> {
    try {
      if (!this.activeCollaborations.has(workbookId)) {
        return [];
      }

      const userIds = Array.from(this.activeCollaborations.get(workbookId));
      const users = await this.dataStorage.getUsersByIds(userIds);
      return users;
    } catch (error) {
      console.error('Error getting active collaborators:', error);
      throw error;
    }
  }

  observeCollaboration(workbookId: string, userId: string): Observable<CollaborationEvent> {
    return new Observable<CollaborationEvent>((observer) => {
      this.joinCollaboration(workbookId, userId)
        .then((joined) => {
          if (joined) {
            // Set up event listeners for collaboration events
            const socket = this.getSocketForUser(userId);
            
            socket.on('user_joined', (data) => observer.next({ type: 'user_joined', data }));
            socket.on('user_left', (data) => observer.next({ type: 'user_left', data }));
            socket.on('change', (data) => observer.next({ type: 'change', data }));

            // Cleanup function when unsubscribing
            return () => {
              this.leaveCollaboration(workbookId, userId);
              socket.off('user_joined');
              socket.off('user_left');
              socket.off('change');
            };
          } else {
            observer.error(new Error(ERROR_MESSAGES.FAILED_TO_JOIN_COLLABORATION));
          }
        })
        .catch((error) => observer.error(error));
    });
  }

  private emitToCollaborators(workbookId: string, event: string, data: any, excludeUserId?: string): void {
    if (this.activeCollaborations.has(workbookId)) {
      const collaborators = this.activeCollaborations.get(workbookId);
      collaborators.forEach((userId) => {
        if (userId !== excludeUserId) {
          const socket = this.getSocketForUser(userId);
          socket.emit(event, data);
        }
      });
    }
  }

  private getSocketForUser(userId: string): Socket {
    // This is a placeholder. In a real implementation, you would maintain a mapping of user IDs to their socket connections.
    // For now, we'll return a mock socket object.
    return {
      emit: (event: string, data: any) => {
        console.log(`Emitting ${event} to user ${userId}:`, data);
      }
    } as any as Socket;
  }
}

interface CollaborationEvent {
  type: 'user_joined' | 'user_left' | 'change';
  data: any;
}

// Commented list of human tasks
/*
Human tasks:
1. Implement conflict resolution mechanism for simultaneous edits (Critical)
2. Add rate limiting to prevent abuse of the broadcastChange method (Required)
3. Implement error handling and logging for collaboration events (Required)
4. Optimize performance for large numbers of simultaneous collaborators (Optional)
5. Implement unit and integration tests for the CollaborationService (Required)
*/