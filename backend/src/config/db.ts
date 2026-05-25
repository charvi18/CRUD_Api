import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'studentreg',
  password: 'postgres',
  port: 5432,
});

pool.connect()
  .then(() => {
    console.log('PostgreSQL Connected Successfully');
  })
  .catch((err) => {
    console.log('Database Connection Error:', err);
  });