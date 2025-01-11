import { neon } from '@neondatabase/serverless';
import { Pool } from '@neondatabase/serverless';
import { DatabaseError } from './types';

// Get the database URL from environment variables
const getDatabaseUrl = () => {
    console.log('[DB] Client: Initializing database connection');
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('[Database Error] DATABASE_URL environment variable is not set. Please check your .env file.');
        throw new Error('DATABASE_URL is not set');
    }
    return url;
};

// Create a direct SQL client for single queries
export const sql = (() => {
    try {
        return neon(getDatabaseUrl());
    } catch (error) {
        console.error('[Database Error] Failed to create SQL client:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
        });
        throw error;
    }
})();

// Create a connection pool for concurrent requests
export const pool = (() => {
    try {
        return new Pool({ 
            connectionString: getDatabaseUrl(),
            max: 10,
            connectionTimeoutMillis: 5000,
            idleTimeoutMillis: 60000
        });
    } catch (error) {
        console.error('[Database Error] Failed to create connection pool:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
            config: {
                max: 10,
                connectionTimeoutMillis: 5000,
                idleTimeoutMillis: 60000
            }
        });
        throw error;
    }
})();

// Add event listeners for pool errors
pool.on('error', (err: Error) => {
    console.error('[Database Pool Error] Unexpected error on idle client:', {
        error: err.message,
        timestamp: new Date().toISOString(),
    });
}); 