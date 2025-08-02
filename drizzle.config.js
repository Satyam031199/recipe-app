import { config } from './src/config/config.js';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/db/migrations',
  schema: './src/db/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.databaseUrl,
  },
});
