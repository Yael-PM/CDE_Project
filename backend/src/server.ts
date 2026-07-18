import app from './app';
import { env, validateEnvironment } from './config/env';
import { pool } from './config/db';
import { waitForSessionStore } from './config/session-store';

const startServer = async () => {
  try {
    validateEnvironment();
    await pool.query('SELECT 1');
    await waitForSessionStore();

    app.listen(env.PORT, '0.0.0.0', () => {
      console.log(`Servidor CDE escuchando en 0.0.0.0:${env.PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
};

void startServer();
