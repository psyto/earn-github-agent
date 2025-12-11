import mysql from 'mysql2/promise';
import { createPool } from './pool';

let pool: mysql.Pool | null = null;

export async function initializeDatabase() {
  pool = createPool();
  
  // Test connection
  try {
    await pool.getConnection();
    console.log('✅ Database connected');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

export function getDatabase() {
  if (!pool) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return pool;
}

