import { Knex } from 'knex';
import { DB_CONSTANTS } from '../constants/dbConstants';
import { DbTypes } from '../types/dbTypes';
import { MigrationHelper } from '../utils/migrationHelper';

export async function up(knex: Knex): Promise<void> {
  // Create 'users' table
  await knex.schema.createTable(DB_CONSTANTS.TABLES.USERS, (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.timestamps(true, true);
  });

  // Create 'workbooks' table
  await knex.schema.createTable(DB_CONSTANTS.TABLES.WORKBOOKS, (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.uuid('owner_id').references('id').inTable(DB_CONSTANTS.TABLES.USERS).onDelete('CASCADE');
    table.timestamps(true, true);
  });

  // Create 'worksheets' table
  await knex.schema.createTable(DB_CONSTANTS.TABLES.WORKSHEETS, (table) => {
    table.uuid('id').primary();
    table.uuid('workbook_id').references('id').inTable(DB_CONSTANTS.TABLES.WORKBOOKS).onDelete('CASCADE');
    table.string('name').notNullable();
    table.integer('index').notNullable();
    table.timestamps(true, true);
  });

  // Create 'cells' table
  await knex.schema.createTable(DB_CONSTANTS.TABLES.CELLS, (table) => {
    table.uuid('id').primary();
    table.uuid('worksheet_id').references('id').inTable(DB_CONSTANTS.TABLES.WORKSHEETS).onDelete('CASCADE');
    table.string('column').notNullable();
    table.integer('row').notNullable();
    table.text('value');
    table.string('data_type').notNullable();
    table.timestamps(true, true);
  });

  // Create 'formulas' table
  await knex.schema.createTable(DB_CONSTANTS.TABLES.FORMULAS, (table) => {
    table.uuid('id').primary();
    table.uuid('cell_id').references('id').inTable(DB_CONSTANTS.TABLES.CELLS).onDelete('CASCADE');
    table.text('expression').notNullable();
    table.timestamps(true, true);
  });

  // Create 'charts' table
  await knex.schema.createTable(DB_CONSTANTS.TABLES.CHARTS, (table) => {
    table.uuid('id').primary();
    table.uuid('worksheet_id').references('id').inTable(DB_CONSTANTS.TABLES.WORKSHEETS).onDelete('CASCADE');
    table.string('type').notNullable();
    table.json('config').notNullable();
    table.timestamps(true, true);
  });

  // Create 'versions' table
  await knex.schema.createTable(DB_CONSTANTS.TABLES.VERSIONS, (table) => {
    table.uuid('id').primary();
    table.uuid('workbook_id').references('id').inTable(DB_CONSTANTS.TABLES.WORKBOOKS).onDelete('CASCADE');
    table.integer('version_number').notNullable();
    table.timestamp('timestamp').notNullable();
    table.json('delta_changes').notNullable();
    table.timestamps(true, true);
  });

  // Add foreign key constraints
  await MigrationHelper.addForeignKeyConstraints(knex);

  // Create indexes for performance optimization
  await MigrationHelper.createIndexes(knex);
}

export async function down(knex: Knex): Promise<void> {
  // Drop tables in reverse order to avoid foreign key constraint issues
  await knex.schema.dropTableIfExists(DB_CONSTANTS.TABLES.VERSIONS);
  await knex.schema.dropTableIfExists(DB_CONSTANTS.TABLES.CHARTS);
  await knex.schema.dropTableIfExists(DB_CONSTANTS.TABLES.FORMULAS);
  await knex.schema.dropTableIfExists(DB_CONSTANTS.TABLES.CELLS);
  await knex.schema.dropTableIfExists(DB_CONSTANTS.TABLES.WORKSHEETS);
  await knex.schema.dropTableIfExists(DB_CONSTANTS.TABLES.WORKBOOKS);
  await knex.schema.dropTableIfExists(DB_CONSTANTS.TABLES.USERS);
}

// Human tasks (commented)
/*
TODO: Review the initial schema to ensure it covers all necessary entities and relationships for the Excel application
TODO: Validate that the schema is optimized for the chosen database systems (Azure SQL Database, Azure Cosmos DB)
TODO: Ensure that the schema supports versioning and collaboration features
TODO: Confirm that the schema allows for efficient querying and data retrieval patterns specific to Excel operations
*/