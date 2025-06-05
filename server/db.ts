import { Pool, Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.SUPABASE_DATABASE_URL) {
  throw new Error("SUPABASE_DATABASE_URL must be set. Did you forget to provision a database?");
}

// Enhanced connection configuration to ensure complete data retrieval
const connectionConfig = {
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  allowExitOnIdle: false,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000
};

console.log('Using Supabase database from environment variable');

export const pool = new Pool(connectionConfig);

// Initialize connection with error handling
pool.on('connect', (client) => {
  console.log('Supabase database connection established');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Create dedicated client for large queries
export const createDedicatedClient = async () => {
  const client = new Client(connectionConfig);
  await client.connect();
  return client;
};

export const db = drizzle(pool, { schema, logger: false });