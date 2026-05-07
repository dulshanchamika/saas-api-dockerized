import 'dotenv/config';
import { neon, Pool } from '@neondatabase/serverless';
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http';
import { drizzle as drizzleServerless } from 'drizzle-orm/neon-serverless';

let db;
let sql;

if (process.env.NODE_ENV === 'development') {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  db = drizzleServerless(pool);
  sql = pool;
} else {
  sql = neon(process.env.DATABASE_URL);
  db = drizzleHttp(sql);
}

export { db, sql };