import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../../config/db';
import { env } from '../../config/env';
import { mg } from '../../config/mailgun';

type UserRow = RowDataPacket & {
  user_id: number;
  first_name: string;
  last_name: string;
  second_last_name: string;
  email: string;
  password: string;
  password_reset_token_hash?: string | null;
  password_reset_expires_at?: Date | null;
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

const hashResetToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        message: 'El correo es obligatorio'
      });
    }

    const genericResponse = {
      message: 'Si el correo existe, enviaremos instrucciones para restablecer la contraseña'
    };

    const [rows] = await pool.execute<UserRow[]>(
      `SELECT user_id, first_name, email
       FROM \`user\`
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    const user = rows[0];

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = hashResetToken(resetToken);

    await pool.execute(
      `UPDATE \`user\`
       SET password_reset_token_hash = ?,
           password_reset_expires_at = DATE_ADD(NOW(), INTERVAL 1 HOUR)
       WHERE user_id = ?`,
      [resetTokenHash, user.user_id]
    );

    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const emailData = {
      from: env.MAILGUN_FROM,
      to: [user.email],
      subject: 'Restablecimiento de contraseña - Soluciones Integrales',
      text: `
          Restablecimiento de contraseña

          Hola ${user.first_name},

          Recibimos una solicitud para restablecer tu contraseña.

          Abre este enlace:
          ${resetUrl}

          Este enlace expirará en 1 hora.

          Si tú no solicitaste este cambio, puedes ignorar este correo.
      `.trim(),
      html: `
        <div style="background-color: #f4f7f6; padding: 40px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <tr>
              <td align="center" bgcolor="#0b132b" style="padding: 40px 20px;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">
                  Recuperación de Contraseña
                </h1>
              </td>
            </tr>
            
            <tr>
              <td style="padding: 40px 30px;">
                <p style="color: #1c2541; font-size: 16px; margin-bottom: 20px; font-weight: 500;">
                  Hola ${user.first_name},
                </p>
                <p style="color: #4b5563; font-size: 15px; margin-bottom: 30px; line-height: 1.6;">
                  Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si fuiste tú, haz clic en el siguiente botón para crear una nueva contraseña.
                </p>
                
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="padding-bottom: 30px;">
                      <a href="${resetUrl}" style="background-color: #38bdf8; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
                        Restablecer mi contraseña
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
                  <em>Este enlace es válido por 1 hora.</em>
                </p>
                <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin: 0;">
                  Si no solicitaste este cambio, no es necesario realizar ninguna acción y tu cuenta sigue segura.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" bgcolor="#f8fafc" style="padding: 20px; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} Soluciones Integrales. Todos los derechos reservados.
                </p>
              </td>
            </tr>
          </table>
        </div>
      `
    };

    await mg.messages.create(env.MAILGUN_DOMAIN, emailData);

    return res.status(200).json(genericResponse);
  } catch (error: any) {
    console.error('forgotPassword error:', error);

    return res.status(500).json({
      message: 'No se pudo procesar la recuperación de contraseña',
      error: error?.message || 'Error desconocido'
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const token = String(req.body.token || '').trim();
    const password = String(req.body.password || req.body.newPassword || '');
    const confirmPassword = req.body.confirmPassword
      ? String(req.body.confirmPassword)
      : null;

    if (!token || !password) {
      return res.status(400).json({
        message: 'Token y nueva contraseña son obligatorios'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        message: 'Las contraseñas no coinciden'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    const resetTokenHash = hashResetToken(token);

    const [rows] = await pool.execute<UserRow[]>(
      `SELECT user_id
       FROM \`user\`
       WHERE password_reset_token_hash = ?
         AND password_reset_expires_at > NOW()
       LIMIT 1`,
      [resetTokenHash]
    );

    const user = rows[0];

    if (!user) {
      return res.status(400).json({
        message: 'El enlace de recuperación es inválido o expiró'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await pool.execute(
      `UPDATE \`user\`
       SET password = ?,
           password_reset_token_hash = NULL,
           password_reset_expires_at = NULL
       WHERE user_id = ?`,
      [hashedPassword, user.user_id]
    );

    return res.status(200).json({
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    console.error('resetPassword error:', error);

    return res.status(500).json({
      message: 'No se pudo restablecer la contraseña'
    });
  }
};