import bcrypt from 'bcrypt';
import { pool } from '../config/db';

const requireValue = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Falta la variable ${name}`);
  return value;
};

async function main() {
  const firstName = requireValue('ADMIN_FIRST_NAME');
  const lastName = requireValue('ADMIN_LAST_NAME');
  const secondLastName = process.env.ADMIN_SECOND_LAST_NAME?.trim() || '';
  const email = requireValue('ADMIN_EMAIL').toLowerCase();
  const password = requireValue('ADMIN_PASSWORD');

  if (password.length < 12) {
    throw new Error('ADMIN_PASSWORD debe tener al menos 12 caracteres');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await pool.execute(
    `INSERT INTO user
      (first_name, last_name, second_last_name, email, password)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       first_name = VALUES(first_name),
       last_name = VALUES(last_name),
       second_last_name = VALUES(second_last_name),
       password = VALUES(password)`,
    [firstName, lastName, secondLastName, email, passwordHash]
  );

  console.log(`Cuenta de acceso configurada: ${email}`);
  await pool.end();
}

main().catch((error) => {
  console.error('No se pudo crear la cuenta de acceso:', error);
  process.exit(1);
});
