import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { Workbook } from '../models/workbook';
import { Worksheet } from '../models/worksheet';
import { Cell } from '../models/cell';
import { User } from '../models/user';
import { dbConstants } from '../constants/dbConstants';

/**
 * Creates a set of sample users
 * @param count The number of users to create
 * @returns An array of created user documents
 */
async function seedUsers(count: number): Promise<User[]> {
  const users = Array.from({ length: count }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }));

  return User.insertMany(users);
}

/**
 * Creates sample workbooks with worksheets and cells
 * @param count The number of workbooks to create
 * @param users The array of users to assign as owners and shared users
 * @returns An array of created workbook documents
 */
async function seedWorkbooks(count: number, users: User[]): Promise<Workbook[]> {
  const workbooks = [];

  for (let i = 0; i < count; i++) {
    const workbook = new Workbook({
      name: faker.lorem.words(3),
      owner: faker.helpers.arrayElement(users)._id,
      sharedWith: faker.helpers.arrayElements(users, { min: 0, max: 3 }).map(user => user._id),
    });

    const worksheetCount = faker.number.int({ min: 1, max: 5 });
    const worksheets = [];

    for (let j = 0; j < worksheetCount; j++) {
      const worksheet = new Worksheet({
        name: `Sheet${j + 1}`,
        workbook: workbook._id,
      });

      const cellCount = faker.number.int({ min: 10, max: 50 });
      const cells = [];

      for (let k = 0; k < cellCount; k++) {
        const cell = new Cell({
          worksheet: worksheet._id,
          row: faker.number.int({ min: 1, max: 100 }),
          column: faker.number.int({ min: 1, max: 26 }),
          value: faker.helpers.arrayElement([
            faker.number.float(),
            faker.lorem.word(),
            faker.date.past().toISOString(),
          ]),
        });
        cells.push(cell);
      }

      await Cell.insertMany(cells);
      worksheet.cells = cells.map(cell => cell._id);
      worksheets.push(worksheet);
    }

    await Worksheet.insertMany(worksheets);
    workbook.worksheets = worksheets.map(worksheet => worksheet._id);
    workbooks.push(workbook);
  }

  return Workbook.insertMany(workbooks);
}

/**
 * Main function to seed the entire database with development data
 */
export async function seedDatabase(): Promise<void> {
  try {
    // Connect to the database
    await mongoose.connect(dbConstants.MONGODB_URI);

    // Clear existing data from all collections
    await Promise.all([
      User.deleteMany({}),
      Workbook.deleteMany({}),
      Worksheet.deleteMany({}),
      Cell.deleteMany({}),
    ]);

    // Seed users
    const users = await seedUsers(50);
    console.log(`Created ${users.length} users`);

    // Seed workbooks, worksheets, and cells
    const workbooks = await seedWorkbooks(20, users);
    console.log(`Created ${workbooks.length} workbooks`);

    const worksheetCount = await Worksheet.countDocuments();
    console.log(`Created ${worksheetCount} worksheets`);

    const cellCount = await Cell.countDocuments();
    console.log(`Created ${cellCount} cells`);

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
  }
}

// Run the seeder if this script is executed directly
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}
```

This implementation follows the JSON specification and includes the required functions: `seedUsers`, `seedWorkbooks`, and `seedDatabase`. It uses the Faker library to generate realistic sample data for users, workbooks, worksheets, and cells.

The `seedDatabase` function is the main entry point that connects to the database, clears existing data, seeds the database with new data, and then disconnects from the database.

Here are the commented human tasks within the file:

```typescript
// Human tasks:
// TODO: Review and adjust the number of entities created for optimal development database size
// TODO: Implement environment-specific seeding (e.g., different data for local, staging, and production)
// TODO: Add more diverse and realistic sample data for specific testing scenarios