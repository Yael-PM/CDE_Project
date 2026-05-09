import express from 'express';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import { env } from './config/env';

import authRoutes from './modules/auth/auth.routes';
import notesRoutes from './modules/notes/notes.routes';
import contactRoutes from './modules/contact/contact.routes';

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: env.SESSION_NAME,
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);

app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)));

app.get('/api/health', (_, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/contact', contactRoutes);

export default app;