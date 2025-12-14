import { ENV } from './src/env.js';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './src/database/migrations',
  schema: './src/database/schemas.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: ENV.DATABASE_URL,
  },
  migrations: {
    schema: 'price_tracker',
  },
});
