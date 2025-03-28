import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'test.db');

export function initializeDatabase() {
  try {
    const db = new Database(dbPath);

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        fullName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        userType TEXT NOT NULL CHECK(userType IN ('student', 'teacher', 'parent', 'private tutor')),
        createdDate TEXT NOT NULL
      )
    `;

    db.exec(createTableQuery);
    console.log('Database initialized successfully');

    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

const db = initializeDatabase();

export default db;

export function isDatabaseConnected(): boolean {
  try {
    const result = db.prepare('SELECT 1').get();
    return <boolean>result && (result as { '1': number })['1'] === 1;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}
