import 'dotenv/config';

const isProduction = process.env.NODE_ENV === 'production';

const parseList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim().replace(/\/$/, ''))
    .filter(Boolean);

const parseBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
};

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

export const env = {
  PORT: Number(process.env.PORT || 4000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: clientUrl.replace(/\/$/, ''),
  CLIENT_URLS: parseList(process.env.CLIENT_URLS || clientUrl),
  FRONTEND_URL: (process.env.FRONTEND_URL || clientUrl).replace(/\/$/, ''),

  DB_HOST: process.env.DB_HOST || process.env.MYSQLHOST || '127.0.0.1',
  DB_PORT: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
  DB_USER: process.env.DB_USER || process.env.MYSQLUSER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
  DB_NAME: process.env.DB_NAME || process.env.MYSQLDATABASE || 'cde_db',

  SESSION_SECRET: process.env.SESSION_SECRET || (
    isProduction ? '' : 'development-only-session-secret-change-before-production'
  ),
  SESSION_SECRET_PREVIOUS: parseList(process.env.SESSION_SECRET_PREVIOUS || ''),
  SESSION_NAME: process.env.SESSION_NAME || 'cde.sid',
  SESSION_TABLE_NAME: process.env.SESSION_TABLE_NAME || 'sessions',
  SESSION_MAX_AGE_HOURS: Number(process.env.SESSION_MAX_AGE_HOURS || 8),
  ALLOW_PUBLIC_REGISTRATION: parseBoolean(
    process.env.ALLOW_PUBLIC_REGISTRATION,
    !isProduction
  ),

  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY || '',
  MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN || '',
  MAILGUN_FROM: process.env.MAILGUN_FROM || '',
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL || '',
  MAILGUN_REGION: (process.env.MAILGUN_REGION || 'US').toUpperCase(),

};

export const sessionSecrets = [
  env.SESSION_SECRET,
  ...env.SESSION_SECRET_PREVIOUS
].filter(Boolean);

export const validateEnvironment = () => {
  const errors: string[] = [];

  if (!Number.isInteger(env.PORT) || env.PORT <= 0) {
    errors.push('PORT debe ser un entero positivo');
  }

  if (!Number.isInteger(env.SESSION_MAX_AGE_HOURS) || env.SESSION_MAX_AGE_HOURS <= 0) {
    errors.push('SESSION_MAX_AGE_HOURS debe ser un entero positivo');
  }

  if (isProduction) {
    const required = {
      CLIENT_URLS: env.CLIENT_URLS.join(','),
      FRONTEND_URL: env.FRONTEND_URL,
      DB_HOST: env.DB_HOST,
      DB_USER: env.DB_USER,
      DB_PASSWORD: env.DB_PASSWORD,
      DB_NAME: env.DB_NAME,
      SESSION_SECRET: env.SESSION_SECRET,
      CLOUDINARY_CLOUD_NAME: env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: env.CLOUDINARY_API_SECRET,
      MAILGUN_API_KEY: env.MAILGUN_API_KEY,
      MAILGUN_DOMAIN: env.MAILGUN_DOMAIN,
      MAILGUN_FROM: env.MAILGUN_FROM,
      CONTACT_TO_EMAIL: env.CONTACT_TO_EMAIL
    };

    for (const [key, value] of Object.entries(required)) {
      if (!value) errors.push(`Falta la variable de entorno ${key}`);
    }

    if (env.SESSION_SECRET.length < 64) {
      errors.push('SESSION_SECRET debe tener al menos 64 caracteres en producción');
    }

    if (!['US', 'EU'].includes(env.MAILGUN_REGION)) {
      errors.push('MAILGUN_REGION debe ser US o EU');
    }

    for (const value of [...env.CLIENT_URLS, env.FRONTEND_URL]) {
      try {
        const url = new URL(value);
        if (url.protocol !== 'https:') {
          errors.push(`La URL de producción debe usar HTTPS: ${value}`);
        }
      } catch {
        errors.push(`URL inválida: ${value}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Configuración inválida:\n- ${errors.join('\n- ')}`);
  }
};
