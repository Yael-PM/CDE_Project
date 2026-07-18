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

type SessionUser = {
  userId: number;
  email: string;
  fullName: string;
};

const establishSession = (req: Request, user: SessionUser) =>
  new Promise<void>((resolve, reject) => {
    req.session.regenerate((regenerateError) => {
      if (regenerateError) return reject(regenerateError);

      req.session.user = user;
      req.session.save((saveError) => {
        if (saveError) return reject(saveError);
        resolve();
      });
    });
  });

export const register = async (req: Request, res: Response) => {
  try {
    if (!env.ALLOW_PUBLIC_REGISTRATION) {
      return res.status(404).json({ message: 'Ruta no encontrada' });
    }

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

    const sessionUser: SessionUser = {
      userId: result.insertId,
      email,
      fullName
    };

    await establishSession(req, sessionUser);

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: sessionUser
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

    const sessionUser: SessionUser = {
      userId: user.user_id,
      email: user.email,
      fullName
    };

    await establishSession(req, sessionUser);

    return res.json({
      message: 'Login exitoso',
      user: sessionUser
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

    res.clearCookie(env.SESSION_NAME, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/'
    });
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
      subject: 'Restablecimiento de contraseña - CDE',
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
        <div style="background-color: #f8fafc; padding: 40px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
            
            <tr>
              <td align="center" style="padding: 35px 20px 25px 20px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                <img src="https://res.cloudinary.com/dgjtamzk1/image/upload/v1783813292/cde/notes/mwgfpikwz9o7rbpebvet.png?v=2" alt="CDE Logo" style="max-height: 50px; display: block; border: 0;" />
              </td>
            </tr>
            
            <tr>
              <td style="padding: 40px 40px 30px 40px;">
                <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin: 0 0 16px 0; text-align: center;">
                  ¿Olvidaste tu contraseña?
                </h2>
                <p style="color: #334155; font-size: 15px; margin-bottom: 12px; font-weight: 500;">
                  Hola ${user.first_name},
                </p>
                <p style="color: #64748b; font-size: 15px; margin-bottom: 32px; line-height: 1.6;">
                  Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en nuestra plataforma de regulación sanitaria. Si fuiste tú, haz clic en el siguiente botón para continuar.
                </p>
                
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="padding-bottom: 32px;">
                      <a href="${resetUrl}" style="background-color: #00a8e8; color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: bold; display: inline-block; box-shadow: 0 4px 10px rgba(0, 168, 232, 0.25);">
                        Restablecer mi contraseña
                      </a>
                    </td>
                  </tr>
                </table>

                <div style="background-color: #fff5f5; border-left: 4px solid #ce2d30; padding: 12px 16px; border-radius: 4px; margin-bottom: 25px;">
                  <p style="color: #ce2d30; font-size: 13px; margin: 0; line-height: 1.4;">
                    <strong>Nota de seguridad:</strong> Este enlace es válido únicamente por 1 hora. Si tú no realizaste esta solicitud, puedes ignorar este mensaje de forma segura.
                  </p>
                </div>
              </td>
            </tr>

            <tr>
              <td align="center" bgcolor="#f8fafc" style="padding: 24px; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0 0 6px 0; font-weight: 600;">
                  CDE — Expertos en Regulación Sanitaria
                </p>
                <p style="color: #b2ccd6; font-size: 11px; margin: 0;">
                  © ${new Date().getFullYear()} CDE. Todos los derechos reservados.
                </p>
              </td>
            </tr>
          </table>
        </div>
      `
    };

    await mg.messages.create(env.MAILGUN_DOMAIN, emailData);

    return res.status(200).json(genericResponse);
  } catch (error: unknown) {
    console.error('forgotPassword error:', error);

    return res.status(500).json({
      message: 'No se pudo procesar la recuperación de contraseña'
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
