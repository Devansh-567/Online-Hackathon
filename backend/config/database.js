/**
 * Database bootstrap placeholder.
 * Wire this to pg/mysql using schema in /database/schema.sql when deploying Postgres.
 * Dev mode uses in-memory repositories inside models/.
 */

export async function connectDatabase() {
  // Future: create pool from DATABASE_URL
  return { connected: true, driver: 'memory' };
}

export async function healthCheck() {
  return { ok: true, driver: 'memory' };
}
