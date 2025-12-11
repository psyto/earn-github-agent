import { readFileSync } from 'fs';
import { join } from 'path';
import { getDatabase } from './index';

async function runMigrations() {
  const db = getDatabase();

  // Read migration file
  const migrationSQL = readFileSync(
    join(__dirname, 'migrations', '001_create_github_reviews_table.sql'),
    'utf-8'
  );

  // Split by semicolons and execute each statement
  const statements = migrationSQL
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    await db.execute(statement);
  }

  console.log('✅ Migrations completed');
}

runMigrations().catch(console.error);

