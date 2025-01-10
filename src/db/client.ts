import { neon, neonConfig } from '@neondatabase/serverless';
import { Pool } from '@neondatabase/serverless';

neonConfig.fetchConnectionCache = true;

// Get the database URL from environment variables
const getDatabaseUrl = () => {
    const url = process.env.DATABASE_URL;
    if (!url) {
        throw new Error('DATABASE_URL is not set');
    }
    return url;
};

// Create a connection pool for concurrent requests
export const pool = new Pool({ connectionString: getDatabaseUrl() });

// Create a direct SQL client for single queries
export const sql = neon(getDatabaseUrl()); 