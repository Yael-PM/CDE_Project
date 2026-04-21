import { Request, Response } from 'express';
import { mg } from '../../config/mailgun';
import { env } from '../../config/env';

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
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    if (!privacyAccepted) {
      return res.status(400).json({ message: 'Debes aceptar la política de privacidad' });
    }

    await mg.messages.create(env.MAILGUN_DOMAIN, {
      from: env.MAILGUN_FROM,
      to: [env.CONTACT_TO_EMAIL],
      subject: `[Formulario CDE] ${subject}`,
      text: `
Nombre: ${fullName}
Empresa: ${company}
Correo: ${corporateEmail}
Teléfono: ${phone}
Cargo: ${position}

Mensaje:
${message}
      `,
      html: `
        <h2>Nuevo mensaje desde el formulario de contacto</h2>
        <p><strong>Nombre:</strong> ${fullName}</p>
        <p><strong>Empresa:</strong> ${company}</p>
        <p><strong>Correo:</strong> ${corporateEmail}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Cargo:</strong> ${position}</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <p><strong>Mensaje:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `,
      'h:Reply-To': corporateEmail
    });

    return res.json({ message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error('sendContactMessage error:', error);
    return res.status(500).json({ message: 'No se pudo enviar el mensaje' });
  }
};