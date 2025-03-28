import { initializeDatabase, isDatabaseConnected } from './database';

describe('Database Connection', () => {
  test('should connect to the database successfully', () => {
    // This will use the existing connection or create a new one
    const db = initializeDatabase();

    // Verify the database is connected
    expect(db).toBeDefined();
    expect(isDatabaseConnected()).toBe(true);

    // Test a simple query
    const stmt = db.prepare('SELECT 1 as result');
    const result = stmt.get();
    expect(result).toEqual({ result: 1 });
  });

  test('should have created the users table', () => {
    const db = initializeDatabase();

    // Check if the users table exists
    const stmt = db.prepare(`
            SELECT name
            FROM sqlite_master
            WHERE type = 'table'
              AND name = 'users'
        `);

    const result = stmt.get() as { name: string };
    expect(result).toBeDefined();
    const { name } = result;
    expect(name).toBe('users');
  });
});
