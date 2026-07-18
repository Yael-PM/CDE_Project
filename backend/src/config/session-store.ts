import session from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';
import { env } from './env';

const MySQLStore = MySQLStoreFactory(session);

export const sessionStore = new MySQLStore({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  clearExpired: true,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: env.SESSION_MAX_AGE_HOURS * 60 * 60 * 1000,
  createDatabaseTable: true,
  connectionLimit: 5,
  schema: {
    tableName: env.SESSION_TABLE_NAME,
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
});

export const waitForSessionStore = () => sessionStore.onReady();
