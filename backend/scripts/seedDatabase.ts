import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { getDatabaseConfig } from '../config/database';
import { WorkbookModel } from '../models/workbook';
import { WorksheetModel } from '../models/worksheet';
import { CellModel } from '../models/cell';
import { FormulaModel } from '../models/formula';
import { ChartModel } from '../models/chart';
import { UserModel } from '../models/user';

// Configuration
const NUM_USERS = 10;
const NUM_WORKBOOKS = 20;
const MAX_WORKSHEETS_PER_WORKBOOK = 5;
const MAX_ROWS = 100;
const MAX_COLS = 26; // A to Z
const FORMULA_PROBABILITY = 0.1;
const CHART_PROBABILITY = 0.2;

async function seedDatabase(): Promise<void> {
  console.log('Starting database seeding...');

  try {
    // Connect to the database
    const dbConfig = getDatabaseConfig();
    await mongoose.connect(dbConfig.uri, dbConfig.options);
    console.log('Connected to the database');

    // Clear existing data
    await Promise.all([
      UserModel.deleteMany({}),
      WorkbookModel.deleteMany({}),
      WorksheetModel.deleteMany({}),
      CellModel.deleteMany({}),
      FormulaModel.deleteMany({}),
      ChartModel.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Seed users
    await seedUsers();

    // Seed workbooks and related data
    await seedWorkbooks();

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

async function seedUsers(): Promise<void> {
  const users = Array.from({ length: NUM_USERS }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }));

  await UserModel.insertMany(users);
  console.log(`Seeded ${NUM_USERS} users`);
}

async function seedWorkbooks(): Promise<void> {
  const users = await UserModel.find();

  for (let i = 0; i < NUM_WORKBOOKS; i++) {
    const workbook = new WorkbookModel({
      name: faker.lorem.words(3),
      owner: faker.helpers.arrayElement(users)._id,
    });

    await workbook.save();

    const numWorksheets = faker.number.int({ min: 1, max: MAX_WORKSHEETS_PER_WORKBOOK });
    for (let j = 0; j < numWorksheets; j++) {
      await seedWorksheet(workbook._id);
    }

    console.log(`Seeded workbook ${i + 1} of ${NUM_WORKBOOKS}`);
  }
}

async function seedWorksheet(workbookId: mongoose.Types.ObjectId): Promise<void> {
  const worksheet = new WorksheetModel({
    name: faker.lorem.word(),
    workbook: workbookId,
  });

  await worksheet.save();

  const numRows = faker.number.int({ min: 10, max: MAX_ROWS });
  const numCols = faker.number.int({ min: 5, max: MAX_COLS });

  for (let row = 1; row <= numRows; row++) {
    for (let col = 1; col <= numCols; col++) {
      await seedCell(worksheet._id, row, col);
    }
  }

  if (Math.random() < CHART_PROBABILITY) {
    await seedChart(worksheet._id);
  }
}

async function seedCell(worksheetId: mongoose.Types.ObjectId, row: number, col: number): Promise<void> {
  const cell = new CellModel({
    worksheet: worksheetId,
    row,
    col,
    value: Math.random() < FORMULA_PROBABILITY ? null : getCellValue(),
  });

  await cell.save();

  if (Math.random() < FORMULA_PROBABILITY) {
    await seedFormula(cell._id);
  }
}

function getCellValue(): string | number | Date {
  const valueType = faker.number.int({ min: 1, max: 3 });
  switch (valueType) {
    case 1:
      return faker.lorem.word();
    case 2:
      return faker.number.float({ min: 0, max: 1000, precision: 0.01 });
    case 3:
      return faker.date.past();
    default:
      return '';
  }
}

async function seedFormula(cellId: mongoose.Types.ObjectId): Promise<void> {
  const formula = new FormulaModel({
    cell: cellId,
    expression: getRandomFormula(),
  });

  await formula.save();
}

function getRandomFormula(): string {
  const formulas = [
    '=SUM(A1:A10)',
    '=AVERAGE(B1:B5)',
    '=MAX(C1:C20)',
    '=MIN(D1:D15)',
    '=COUNT(E1:E30)',
    '=IF(A1>10,"High","Low")',
    '=CONCATENATE(A1," ",B1)',
    '=TODAY()',
    '=RAND()*100',
    '=VLOOKUP(A1,B1:C10,2,FALSE)',
  ];
  return faker.helpers.arrayElement(formulas);
}

async function seedChart(worksheetId: mongoose.Types.ObjectId): Promise<void> {
  const chart = new ChartModel({
    worksheet: worksheetId,
    type: faker.helpers.arrayElement(['bar', 'line', 'pie', 'scatter', 'area']),
    title: faker.lorem.sentence(),
    xAxis: {
      title: faker.lorem.word(),
      categories: Array.from({ length: 5 }, () => faker.lorem.word()),
    },
    yAxis: {
      title: faker.lorem.word(),
    },
    series: [
      {
        name: faker.lorem.word(),
        data: Array.from({ length: 5 }, () => faker.number.int({ min: 0, max: 100 })),
      },
    ],
  });

  await chart.save();
}

// Run the seeding process
seedDatabase().catch((error) => {
  console.error('Failed to seed database:', error);
  process.exit(1);
});

// Human tasks (commented)
/*
TODO: Review and adjust the number of entities to be seeded for each model
TODO: Ensure that the seeded data is representative of real-world scenarios
TODO: Implement error handling and logging for the seeding process
TODO: Create a mechanism to run this script in different environments (development, staging) without affecting production data
*/