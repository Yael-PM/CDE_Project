import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../../config/db';
import { env } from '../../config/env';

type UserRow = RowDataPacket & {
  user_id: number;
  first_name: string;
  last_name: string;
  second_last_name: string;
  email: string;
  password: string;
};

export const register = async (req: Request, res: Response) => {
  try {
    const first_name = String(req.body.first_name || '').trim();
    const last_name = String(req.body.last_name || '').trim();
    const second_last_name = String(req.body.second_last_name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!first_name || !last_name || !second_last_name || !email || !password) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    const [existingRows] = await pool.execute<RowDataPacket[]>(
      'SELECT user_id FROM user WHERE email = ? LIMIT 1',
      [email]
    );

    if (existingRows.length > 0) {
      return res.status(409).json({
        message: 'Ya existe un usuario con ese correo'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO user (first_name, last_name, second_last_name, email, password)
       VALUES (?, ?, ?, ?, ?)`,
      [first_name, last_name, second_last_name, email, hashedPassword]
    );

    const fullName = `${first_name} ${last_name} ${second_last_name}`.trim();

    req.session.user = {
      userId: result.insertId,
      email,
      fullName
    };

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: req.session.user
    });
  } catch (error) {
    console.error('register error:', error);
    return res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y password son obligatorios' });
    }

    const [rows] = await pool.execute<UserRow[]>(
      'SELECT * FROM user WHERE email = ? LIMIT 1',
      [email]
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const fullName = `${user.first_name} ${user.last_name} ${user.second_last_name}`.trim();

    req.session.user = {
      userId: user.user_id,
      email: user.email,
      fullName
    };

    return res.json({
      message: 'Login exitoso',
      user: req.session.user
    });
  } catch (error) {
    console.error('login error:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const me = async (req: Request, res: Response) => {
  return res.json({
    authenticated: Boolean(req.session.user),
    user: req.session.user || null
  });
};

export const logout = async (req: Request, res: Response) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: 'No se pudo cerrar sesión' });
    }

    res.clearCookie(env.SESSION_NAME);
    return res.json({ message: 'Sesión cerrada' });
  });
};