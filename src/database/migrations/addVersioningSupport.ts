import { IDataStorage } from '../../interfaces/IDataStorage';
import { DbTypes } from '../../types/dbTypes';
import { TABLE_NAMES } from '../../constants/dbConstants';
import { applyMigration, rollbackMigration } from '../../utils/migrationHelper';

const MIGRATION_VERSION = '1.0.1';

async function up(dataStorage: IDataStorage): Promise<void> {
  // Create 'Versions' table
  await dataStorage.createTable(TABLE_NAMES.VERSIONS, {
    id: DbTypes.UUID,
    workbookId: DbTypes.UUID,
    versionNumber: DbTypes.INTEGER,
    createdAt: DbTypes.TIMESTAMP,
    state: DbTypes.STRING,
    description: DbTypes.STRING
  });

  // Add 'currentVersionId' column to the 'Workbooks' table
  await dataStorage.addColumn(TABLE_NAMES.WORKBOOKS, 'currentVersionId', DbTypes.UUID);

  // Add 'versionId' column to 'Worksheets', 'Cells', 'Formulas', and 'Charts' tables
  const tablesToUpdate = [TABLE_NAMES.WORKSHEETS, TABLE_NAMES.CELLS, TABLE_NAMES.FORMULAS, TABLE_NAMES.CHARTS];
  for (const table of tablesToUpdate) {
    await dataStorage.addColumn(table, 'versionId', DbTypes.UUID);
  }

  // Create indexes
  await dataStorage.createIndex(TABLE_NAMES.VERSIONS, ['workbookId']);
  await dataStorage.createIndex(TABLE_NAMES.VERSIONS, ['versionNumber']);

  for (const table of tablesToUpdate) {
    await dataStorage.createIndex(table, ['versionId']);
  }
}

async function down(dataStorage: IDataStorage): Promise<void> {
  // Drop 'Versions' table
  await dataStorage.dropTable(TABLE_NAMES.VERSIONS);

  // Remove 'currentVersionId' column from 'Workbooks' table
  await dataStorage.dropColumn(TABLE_NAMES.WORKBOOKS, 'currentVersionId');

  // Remove 'versionId' column from 'Worksheets', 'Cells', 'Formulas', and 'Charts' tables
  const tablesToUpdate = [TABLE_NAMES.WORKSHEETS, TABLE_NAMES.CELLS, TABLE_NAMES.FORMULAS, TABLE_NAMES.CHARTS];
  for (const table of tablesToUpdate) {
    await dataStorage.dropColumn(table, 'versionId');
  }

  // Drop related indexes
  await dataStorage.dropIndex(TABLE_NAMES.VERSIONS, ['workbookId']);
  await dataStorage.dropIndex(TABLE_NAMES.VERSIONS, ['versionNumber']);

  for (const table of tablesToUpdate) {
    await dataStorage.dropIndex(table, ['versionId']);
  }
}

export const addVersioningSupport: DbTypes.Migration = {
  version: MIGRATION_VERSION,
  name: 'Add versioning support',
  up: applyMigration(up),
  down: rollbackMigration(down)
};

// Human tasks:
// TODO: Review the migration to ensure it covers all necessary changes for versioning support
// TODO: Test the migration on a copy of production data to ensure it doesn't cause data loss or corruption
// TODO: Update application code to utilize the new versioning structure
// TODO: Create a data migration plan to populate initial versions for existing workbooks
// TODO: Update backup and restore procedures to account for the new versioning system