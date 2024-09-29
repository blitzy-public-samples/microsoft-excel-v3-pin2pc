import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { Workbook } from '../models/workbook';
import { Worksheet } from '../models/worksheet';
import { Cell } from '../models/cell';
import { Formula } from '../models/formula';
import { User } from '../models/user';
import { connectDatabase } from '../config/database';

// Global constants
const NUM_USERS = 10;
const NUM_WORKBOOKS = 20;
const MAX_WORKSHEETS_PER_WORKBOOK = 5;
const MAX_ROWS = 100;
const MAX_COLS = 26;

/**
 * Generates a specified number of mock users
 * @param count Number of users to generate
 * @returns Array of generated User objects
 */
async function generateUsers(count: number): Promise<User[]> {
    const users: User[] = [];
    for (let i = 0; i < count; i++) {
        const user = new User({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: await bcrypt.hash(faker.internet.password(), 10),
        });
        users.push(user);
    }
    return users;
}

/**
 * Generates a specified number of mock workbooks
 * @param count Number of workbooks to generate
 * @param users Array of User objects to assign as owners
 * @returns Array of generated Workbook objects
 */
async function generateWorkbooks(count: number, users: User[]): Promise<Workbook[]> {
    const workbooks: Workbook[] = [];
    for (let i = 0; i < count; i++) {
        const workbook = new Workbook({
            name: faker.lorem.words(3),
            owner: users[Math.floor(Math.random() * users.length)]._id,
            createdAt: faker.date.past(),
            updatedAt: faker.date.recent(),
        });
        await generateWorksheets(workbook);
        workbooks.push(workbook);
    }
    return workbooks;
}

/**
 * Generates a random number of worksheets for a workbook
 * @param workbook Workbook object to add worksheets to
 */
async function generateWorksheets(workbook: Workbook): Promise<void> {
    const numWorksheets = faker.number.int({ min: 1, max: MAX_WORKSHEETS_PER_WORKBOOK });
    for (let i = 0; i < numWorksheets; i++) {
        const worksheet = new Worksheet({
            name: `Sheet${i + 1}`,
            workbook: workbook._id,
        });
        await generateCells(worksheet);
        workbook.worksheets.push(worksheet);
    }
}

/**
 * Generates cells for a worksheet
 * @param worksheet Worksheet object to add cells to
 */
async function generateCells(worksheet: Worksheet): Promise<void> {
    const numRows = faker.number.int({ min: 1, max: MAX_ROWS });
    const numCols = faker.number.int({ min: 1, max: MAX_COLS });
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const cell = new Cell({
                worksheet: worksheet._id,
                row,
                col,
                value: faker.number.float({ min: 0, max: 1000, precision: 0.01 }),
            });
            if (faker.datatype.boolean(0.1)) { // 10% chance of being a formula
                cell.formula = await generateRandomFormula();
            }
            worksheet.cells.push(cell);
        }
    }
}

/**
 * Generates a random formula for a cell
 * @returns A randomly generated formula
 */
async function generateRandomFormula(): Promise<string> {
    const functions = ['SUM', 'AVERAGE', 'MAX', 'MIN', 'COUNT'];
    const selectedFunction = faker.helpers.arrayElement(functions);
    const numArgs = faker.number.int({ min: 2, max: 5 });
    const args = Array.from({ length: numArgs }, () => 
        `${String.fromCharCode(65 + faker.number.int({ min: 0, max: 25 }))}${faker.number.int({ min: 1, max: 100 })}`
    );
    return `=${selectedFunction}(${args.join(',')})`;
}

/**
 * The main function to execute the mock data generation
 */
async function main(): Promise<void> {
    try {
        await connectDatabase();
        console.log('Connected to the database');

        const users = await generateUsers(NUM_USERS);
        console.log(`Generated ${users.length} users`);

        const workbooks = await generateWorkbooks(NUM_WORKBOOKS, users);
        console.log(`Generated ${workbooks.length} workbooks`);

        // Save all generated data to the database
        await User.insertMany(users);
        for (const workbook of workbooks) {
            await workbook.save();
            for (const worksheet of workbook.worksheets) {
                await worksheet.save();
                await Cell.insertMany(worksheet.cells);
            }
        }

        console.log('Mock data generation completed successfully');
    } catch (error) {
        console.error('Error generating mock data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from the database');
    }
}

// Execute the main function
main();

// Human tasks:
// TODO: Review and adjust the mock data generation logic to ensure it covers all required scenarios
// TODO: Implement error handling and logging for the data generation process
// TODO: Create a configuration file to easily adjust the number and complexity of generated mock data