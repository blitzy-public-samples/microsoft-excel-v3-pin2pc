import { DbTypes } from '../types/dbTypes';
import { DB_CONSTANTS } from '../constants/dbConstants';
import { IDataStorage } from '../interfaces/IDataStorage';

/**
 * QueryBuilder class for building SQL queries with parameterized values
 */
class QueryBuilder {
  private query: string;
  private params: any[];

  constructor() {
    this.query = '';
    this.params = [];
  }

  /**
   * Adds a SELECT clause to the query
   * @param columns - Array of column names to select
   * @returns The current QueryBuilder instance
   */
  select(columns: string[]): QueryBuilder {
    this.query += `SELECT ${columns.join(', ')} `;
    return this;
  }

  /**
   * Adds a FROM clause to the query
   * @param table - The name of the table
   * @returns The current QueryBuilder instance
   */
  from(table: string): QueryBuilder {
    this.query += `FROM ${table} `;
    return this;
  }

  /**
   * Adds a WHERE clause to the query
   * @param condition - The WHERE condition
   * @param values - The values to be used in the condition
   * @returns The current QueryBuilder instance
   */
  where(condition: string, values: any[]): QueryBuilder {
    this.query += `WHERE ${condition} `;
    this.params.push(...values);
    return this;
  }

  /**
   * Adds an INSERT clause to the query
   * @param table - The name of the table
   * @param data - An object containing the column-value pairs to insert
   * @returns The current QueryBuilder instance
   */
  insert(table: string, data: Record<string, any>): QueryBuilder {
    const columns = Object.keys(data);
    const placeholders = columns.map(() => '?').join(', ');
    this.query += `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders}) `;
    this.params.push(...Object.values(data));
    return this;
  }

  /**
   * Adds an UPDATE clause to the query
   * @param table - The name of the table
   * @param data - An object containing the column-value pairs to update
   * @returns The current QueryBuilder instance
   */
  update(table: string, data: Record<string, any>): QueryBuilder {
    const setExpressions = Object.keys(data).map(key => `${key} = ?`).join(', ');
    this.query += `UPDATE ${table} SET ${setExpressions} `;
    this.params.push(...Object.values(data));
    return this;
  }

  /**
   * Adds a DELETE clause to the query
   * @param table - The name of the table
   * @returns The current QueryBuilder instance
   */
  delete(table: string): QueryBuilder {
    this.query += `DELETE FROM ${table} `;
    return this;
  }

  /**
   * Builds and returns the final query and parameters
   * @returns An object containing the query string and params array
   */
  build(): { query: string; params: any[] } {
    return { query: this.query.trim(), params: this.params };
  }
}

/**
 * Creates a SELECT query for a given entity type
 * @param entityType - The type of entity to query
 * @param id - The ID of the entity
 * @returns An object containing the query string and params array
 */
export function createSelectQuery(entityType: DbTypes.EntityType, id: string): { query: string; params: any[] } {
  const table = DB_CONSTANTS.TABLES[entityType];
  const queryBuilder = new QueryBuilder();
  return queryBuilder
    .select(['*'])
    .from(table)
    .where('id = ?', [id])
    .build();
}

/**
 * Creates an INSERT query for a given entity type
 * @param entityType - The type of entity to insert
 * @param data - The data to insert
 * @returns An object containing the query string and params array
 */
export function createInsertQuery(entityType: DbTypes.EntityType, data: DbTypes.EntityCreate): { query: string; params: any[] } {
  const table = DB_CONSTANTS.TABLES[entityType];
  const queryBuilder = new QueryBuilder();
  return queryBuilder
    .insert(table, data)
    .build();
}

/**
 * Creates an UPDATE query for a given entity type
 * @param entityType - The type of entity to update
 * @param id - The ID of the entity to update
 * @param data - The data to update
 * @returns An object containing the query string and params array
 */
export function createUpdateQuery(entityType: DbTypes.EntityType, id: string, data: DbTypes.EntityUpdate): { query: string; params: any[] } {
  const table = DB_CONSTANTS.TABLES[entityType];
  const queryBuilder = new QueryBuilder();
  return queryBuilder
    .update(table, data)
    .where('id = ?', [id])
    .build();
}

/**
 * Creates a DELETE query for a given entity type
 * @param entityType - The type of entity to delete
 * @param id - The ID of the entity to delete
 * @returns An object containing the query string and params array
 */
export function createDeleteQuery(entityType: DbTypes.EntityType, id: string): { query: string; params: any[] } {
  const table = DB_CONSTANTS.TABLES[entityType];
  const queryBuilder = new QueryBuilder();
  return queryBuilder
    .delete(table)
    .where('id = ?', [id])
    .build();
}

// Human tasks (commented)
/**
 * TODO: Review and optimize the QueryBuilder class for performance and edge cases
 * TODO: Ensure that the query building functions handle all possible entity types and their specific requirements
 * TODO: Implement proper SQL injection prevention measures in the QueryBuilder class
 * TODO: Add support for more complex queries, such as JOINs and subqueries, if required by the application
 */