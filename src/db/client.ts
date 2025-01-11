import { neon } from '@neondatabase/serverless';
import { Pool } from '@neondatabase/serverless';
import { DatabaseError } from './types';

// Get the database URL from environment variables
const getDatabaseUrl = () => {
    console.log('[DB] Client: Initializing database connection');
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('[DB] Client: Missing database configuration', {
            error: 'DATABASE_URL environment variable is not set',
            env: process.env.NODE_ENV
        });
        throw new Error('DATABASE_URL is not set');
    }
    return url;
};

// Create a direct SQL client for single queries
export const sql = neon(getDatabaseUrl());

// Create a connection pool for concurrent requests
export const pool = new Pool({ 
    connectionString: getDatabaseUrl(),
    // Add max connections to avoid overwhelming the serverless function
    max: 10,
    // Add connection timeout
    connectionTimeoutMillis: 5000,
    // Add idle timeout to clean up connections
    idleTimeoutMillis: 60000
}); 