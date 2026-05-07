import 'dotenv/config';

export const env = {
  PORT: Number(process.env.PORT || 4000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  DB_HOST: process.env.DB_HOST || '127.0.0.1',
  DB_PORT: Number(process.env.DB_PORT || 3306),
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'cde_db',

  SESSION_SECRET: process.env.SESSION_SECRET || 'change_this_secret',
  SESSION_NAME: process.env.SESSION_NAME || 'cde.sid',

  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',

  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY || '',
  MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN || '',
  MAILGUN_FROM: process.env.MAILGUN_FROM || '',
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL || '',
  MAILGUN_REGION: process.env.MAILGUN_REGION || 'US'
};