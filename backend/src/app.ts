import express from 'express';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import { env, sessionSecrets } from './config/env';
import { pool } from './config/db';
import { sessionStore } from './config/session-store';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware';

import authRoutes from './modules/auth/auth.routes';
import notesRoutes from './modules/notes/notes.routes';
import contactRoutes from './modules/contact/contact.routes';

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || env.CLIENT_URLS.includes(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    }

    const error = new Error('Origen no permitido por CORS') as Error & { status?: number };
    error.status = 403;
    return callback(error);
  },
  credentials: true
}));

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

app.use(
  session({
    name: env.SESSION_NAME,
    secret: sessionSecrets,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * env.SESSION_MAX_AGE_HOURS
    }
  })
);

app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)));

app.get('/api/health', (_, res) => {
  res.json({ ok: true, service: 'cde-api' });
});

app.get('/api/health/ready', async (_, res) => {
  try {
    await pool.query('SELECT 1');
    return res.json({ ok: true, database: 'connected' });
  } catch (error) {
    console.error('readiness error:', error);
    return res.status(503).json({ ok: false, database: 'unavailable' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/contact', contactRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
