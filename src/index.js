import { drizzle } from 'drizzle-orm/neon-http';
import { config } from './config/config.js';

export const db = drizzle(config.databaseUrl);
