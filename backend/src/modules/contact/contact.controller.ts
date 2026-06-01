import { Request, Response } from 'express';
import { mg } from '../../config/mailgun';
import { env } from '../../config/env';

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const sendContactMessage = async (req: Request, res: Response) => {
  try {
    const fullName = String(req.body.fullName || '').trim();
    const company = String(req.body.company || '').trim();
    const corporateEmail = String(req.body.corporateEmail || '').trim();
    const phone = String(req.body.phone || '').trim();
    const position = String(req.body.position || '').trim();
    const subject = String(req.body.subject || '').trim();
    const message = String(req.body.message || '').trim();
    const privacyAccepted = Boolean(req.body.privacyAccepted);

    if (!fullName || !company || !corporateEmail || !position || !subject || !message) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios'
      });
    }

    if (!isValidEmail(corporateEmail)) {
      return res.status(400).json({
        message: 'El correo electrónico no es válido'
      });
    }

    if (!privacyAccepted) {
      return res.status(400).json({
        message: 'Debes aceptar la política de privacidad'
      });
    }

    const emailData = {
      from: env.MAILGUN_FROM,
      to: [env.CONTACT_TO_EMAIL],
      subject: `[CDE Contact Us] ${subject}`,
      text: `
Nuevo mensaje desde el formulario de contacto

Nombre: ${fullName}
Empresa: ${company}
Correo corporativo: ${corporateEmail}
Teléfono: ${phone}
Puesto: ${position}

Mensaje:
${message}
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>CDE CONTACTO</h2>
          <p><strong>Nombre:</strong> ${fullName}</p>
          <p><strong>Empresa:</strong> ${company}</p>
          <p><strong>Correo corporativo:</strong> ${corporateEmail}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          <p><strong>Puesto:</strong> ${position}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <hr />
          <p><strong>Mensaje:</strong></p>
          <p>${message.replace(/\n/g, '<br />')}</p>
        </div>
      `,
      'h:Reply-To': corporateEmail
    };

    const result = await mg.messages.create(env.MAILGUN_DOMAIN, emailData);

    return res.status(200).json({
      message: 'Mensaje enviado correctamente',
    });
  } catch (error: any) {
    console.error('Mailgun send error:', error);

    return res.status(500).json({
      message: 'No se pudo enviar el mensaje',
      error: error?.message || 'Error desconocido'
    });
  }
};