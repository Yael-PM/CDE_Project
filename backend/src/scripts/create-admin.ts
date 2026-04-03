import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cde_db'
  });

  const passwordHash = await bcrypt.hash('Admin123*', 12);

  await connection.execute(
    `INSERT INTO user (first_name, last_name, second_last_name, email, password)
     VALUES (?, ?, ?, ?, ?)`,
    ['Admin', 'CDE', 'Principal', 'admin@cde.com', passwordHash]
  );

  console.log('Usuario admin creado');
  await connection.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});