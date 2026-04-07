import postgres from 'postgres';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import 'dotenv/config';

async function migrate() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined');
  }

  const sql = postgres(databaseUrl);

  // Create migrations tracking table
  await sql`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Get already executed migrations
  const executed = await sql<{ name: string }[]>`SELECT name FROM migrations ORDER BY id`;
  const executedNames = new Set(executed.map((m) => m.name));

  // Read migration files
  const migrationsDir = join(__dirname, '../migrations');
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (executedNames.has(file)) {
      console.log(`⏭️  Skipping ${file} (already executed)`);
      continue;
    }

    console.log(`▶️  Running ${file}...`);
    const content = readFileSync(join(migrationsDir, file), 'utf-8');

    await sql.begin(async (tx) => {
      await tx.unsafe(content);
      await tx`INSERT INTO migrations (name) VALUES (${file})`;
    });

    console.log(`✅ ${file} done`);
  }

  await sql.end();
  console.log('🎉 All migrations executed');
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
