import { databaseConfig } from '../config/databaseConfig';
import { IDataStorage } from '../interfaces/IDataStorage';
import { azureSqlService, azureCosmosDbService, sqliteService } from '../services';
import { WorkbookRepository, WorksheetRepository, CellRepository, FormulaRepository, ChartRepository, UserRepository } from '../repositories';
import { Workbook, Worksheet, Cell, Formula, Chart, User } from '../models';
import { faker } from '@faker-js/faker';

// Function to get the appropriate data storage service based on the database configuration
const getDataStorageService = (): IDataStorage => {
  switch (databaseConfig.type) {
    case 'azure-sql':
      return azureSqlService;
    case 'azure-cosmos-db':
      return azureCosmosDbService;
    case 'sqlite':
      return sqliteService;
    default:
      throw new Error(`Unsupported database type: ${databaseConfig.type}`);
  }
};

// Function to seed users
const seedUsers = async (userRepo: UserRepository, count: number): Promise<void> => {
  console.log(`Seeding ${count} users...`);
  for (let i = 0; i < count; i++) {
    const user = new User({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    await userRepo.create(user);
  }
  console.log(`Seeded ${count} users successfully.`);
};

// Function to seed workbooks
const seedWorkbooks = async (workbookRepo: WorkbookRepository, count: number, users: User[]): Promise<Workbook[]> => {
  console.log(`Seeding ${count} workbooks...`);
  const workbooks: Workbook[] = [];
  for (let i = 0; i < count; i++) {
    const workbook = new Workbook({
      name: faker.lorem.words(3),
      owner: faker.helpers.arrayElement(users),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
    const createdWorkbook = await workbookRepo.create(workbook);
    workbooks.push(createdWorkbook);
  }
  console.log(`Seeded ${count} workbooks successfully.`);
  return workbooks;
};

// Function to seed worksheets
const seedWorksheets = async (worksheetRepo: WorksheetRepository, workbooks: Workbook[]): Promise<void> => {
  console.log('Seeding worksheets...');
  for (const workbook of workbooks) {
    const worksheetCount = faker.datatype.number({ min: 1, max: 5 });
    for (let i = 0; i < worksheetCount; i++) {
      const worksheet = new Worksheet({
        name: faker.lorem.word(),
        workbookId: workbook.id,
        index: i,
      });
      await worksheetRepo.create(worksheet);
    }
  }
  console.log('Seeded worksheets successfully.');
};

// Function to seed cells
const seedCells = async (cellRepo: CellRepository, worksheetRepo: WorksheetRepository): Promise<void> => {
  console.log('Seeding cells...');
  const worksheets = await worksheetRepo.findAll();
  for (const worksheet of worksheets) {
    const cellCount = faker.datatype.number({ min: 10, max: 100 });
    for (let i = 0; i < cellCount; i++) {
      const cell = new Cell({
        worksheetId: worksheet.id,
        column: String.fromCharCode(65 + faker.datatype.number({ min: 0, max: 25 })),
        row: faker.datatype.number({ min: 1, max: 100 }),
        value: faker.datatype.number({ min: 0, max: 1000 }).toString(),
        dataType: 'number',
      });
      await cellRepo.create(cell);
    }
  }
  console.log('Seeded cells successfully.');
};

// Function to seed formulas
const seedFormulas = async (formulaRepo: FormulaRepository, cellRepo: CellRepository): Promise<void> => {
  console.log('Seeding formulas...');
  const cells = await cellRepo.findAll();
  const formulaCells = faker.helpers.arrayElements(cells, Math.floor(cells.length * 0.1));
  for (const cell of formulaCells) {
    const formula = new Formula({
      cellId: cell.id,
      expression: `=SUM(A1:${cell.column}${cell.row})`,
    });
    await formulaRepo.create(formula);
    await cellRepo.update(cell.id, { ...cell, value: '=FORMULA' });
  }
  console.log('Seeded formulas successfully.');
};

// Function to seed charts
const seedCharts = async (chartRepo: ChartRepository, worksheetRepo: WorksheetRepository): Promise<void> => {
  console.log('Seeding charts...');
  const worksheets = await worksheetRepo.findAll();
  const chartWorksheets = faker.helpers.arrayElements(worksheets, Math.floor(worksheets.length * 0.2));
  for (const worksheet of chartWorksheets) {
    const chart = new Chart({
      worksheetId: worksheet.id,
      type: faker.helpers.arrayElement(['bar', 'line', 'pie', 'scatter']),
      title: faker.lorem.sentence(),
      xAxis: 'A1:A10',
      yAxis: 'B1:B10',
    });
    await chartRepo.create(chart);
  }
  console.log('Seeded charts successfully.');
};

// Main function to orchestrate the seeding process
const main = async (): Promise<void> => {
  console.log('Starting database seeding process...');

  const dataStorage = getDataStorageService();
  const userRepo = new UserRepository(dataStorage);
  const workbookRepo = new WorkbookRepository(dataStorage);
  const worksheetRepo = new WorksheetRepository(dataStorage);
  const cellRepo = new CellRepository(dataStorage);
  const formulaRepo = new FormulaRepository(dataStorage);
  const chartRepo = new ChartRepository(dataStorage);

  try {
    await seedUsers(userRepo, 10);
    const users = await userRepo.findAll();
    const workbooks = await seedWorkbooks(workbookRepo, 5, users);
    await seedWorksheets(worksheetRepo, workbooks);
    await seedCells(cellRepo, worksheetRepo);
    await seedFormulas(formulaRepo, cellRepo);
    await seedCharts(chartRepo, worksheetRepo);

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
};

export default main;

// Execute the main function if this script is run directly
if (require.main === module) {
  main();
}

// List of human tasks
/*
TODO: Review the seeding logic to ensure it covers all necessary scenarios for testing and development
TODO: Verify that the seeded data is representative of real-world Excel usage patterns
TODO: Ensure that the seeding script can handle large amounts of data without performance issues
TODO: Add configuration options to control the amount and types of data being seeded
TODO: Implement error handling and logging for the seeding process
*/