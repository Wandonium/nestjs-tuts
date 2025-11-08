import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config();

const runMigrate = async () => {
  const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
  await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });
  console.log('Migrations ran successfully');
  await migrationClient.end();
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
