import postgres from 'postgres';
import bcrypt from 'bcrypt';
import 'dotenv/config';

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined');
  }

  const sql = postgres(databaseUrl);

  // Seed admin user
  const email = 'admin@kpilrmen.fr';
  const password = await bcrypt.hash('changeme', 10);

  await sql`
    INSERT INTO admins (email, password)
    VALUES (${email}, ${password})
    ON CONFLICT (email) DO NOTHING
  `;

  console.log(`✅ Admin seeded: ${email}`);

  await sql.end();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
