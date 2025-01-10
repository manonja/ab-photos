import { Pool } from '@neondatabase/serverless';

export const config = {
    runtime: 'edge',
  };

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool; 