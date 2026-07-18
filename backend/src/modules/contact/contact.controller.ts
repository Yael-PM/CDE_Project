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
    const privacyAccepted = req.body.privacyAccepted === true;

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
      subject: `[CDE Contacto] ${subject} - ${company}`,
      text: `
      Nuevo mensaje desde el formulario de contacto

      Nombre: ${fullName}
      Empresa: ${company}
      Correo corporativo: ${corporateEmail}
      Teléfono: ${phone || 'No proporcionado'}
      Puesto: ${position}

      Mensaje:
      ${message}
        `.trim(),
        html: `
          <div style="background-color: #f8fafc; padding: 40px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
              <tr>
                <td align="center" style="padding: 35px 20px 25px 20px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                  <img src="https://res.cloudinary.com/dgjtamzk1/image/upload/v1783813292/cde/notes/mwgfpikwz9o7rbpebvet.png?v=2" alt="CDE Logo" style="max-height: 50px; display: block; border: 0;" />
                </td>
              </tr>
              
              <!-- HEADER CON LA IDENTIDAD DE LA MARCA -->
              <tr>
                <td bgcolor="#00a8e8" style="padding: 24px 40px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td>
                        <span style="color: #ffffff; font-size: 11px; font-weight: bold; letter-spacing: 1.5px; uppercase; display: block; margin-bottom: 4px;">
                          FORMULARIO DE CONTACTO
                        </span>
                        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">
                          Nuevo Mensaje Recibido
                        </h1>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- CONTENIDO PRINCIPAL -->
              <tr>
                <td style="padding: 40px 40px 30px 40px;">
                  <p style="color: #334155; font-size: 15px; margin: 0 0 24px 0; font-weight: 500;">
                    Se ha registrado una nueva consulta desde el sitio web de CDE. A continuación se detallan los datos del interesado:
                  </p>
                  
                  <!-- TABLA DE DATOS DEL PROSPECTO -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="12" style="border-collapse: collapse; margin-bottom: 30px; background-color: #f8fafc; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td width="35%" style="color: #64748b; font-size: 14px; font-weight: 600; padding-left: 16px;">Nombre completo:</td>
                      <td width="65%" style="color: #0f172a; font-size: 14px; font-weight: 500; padding-right: 16px;">${fullName}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="color: #64748b; font-size: 14px; font-weight: 600; padding-left: 16px;">Empresa:</td>
                      <td style="color: #0f172a; font-size: 14px; font-weight: bold; padding-right: 16px;">${company}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="color: #64748b; font-size: 14px; font-weight: 600; padding-left: 16px;">Puesto / Cargo:</td>
                      <td style="color: #0f172a; font-size: 14px; padding-right: 16px;">${position}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="color: #64748b; font-size: 14px; font-weight: 600; padding-left: 16px;">Correo corporativo:</td>
                      <td style="color: #00a8e8; font-size: 14px; font-weight: 500; padding-right: 16px;">
                        <a href="mailto:${corporateEmail}" style="color: #00a8e8; text-decoration: none;">${corporateEmail}</a>
                      </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="color: #64748b; font-size: 14px; font-weight: 600; padding-left: 16px;">Teléfono:</td>
                      <td style="color: #0f172a; font-size: 14px; padding-right: 16px;">${phone || 'No proporcionado'}</td>
                    </tr>
                    <tr>
                      <td style="color: #64748b; font-size: 14px; font-weight: 600; padding-left: 16px;">Asunto original:</td>
                      <td style="color: #0f172a; font-size: 14px; font-style: italic; padding-right: 16px;">${subject}</td>
                    </tr>
                  </table>

                  <!-- SECCIÓN DEL MENSAJE -->
                  <h3 style="color: #0f172a; font-size: 15px; font-weight: 700; margin: 0 0 10px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
                    Mensaje enviado:
                  </h3>
                  <div style="background-color: #ffffff; border-left: 4px solid #00a8e8; padding: 4px 0 4px 16px; margin-bottom: 10px;">
                    <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-line;">
                      ${message}
                    </p>
                  </div>
                </td>
              </tr>

              <!-- PIE DE PÁGINA ACCIONABLE -->
              <tr>
                <td align="center" bgcolor="#f8fafc" style="padding: 24px; border-top: 1px solid #e2e8f0;">
                  <p style="color: #64748b; font-size: 12px; margin: 0 0 4px 0;">
                    Puedes responder directamente a este correo para contactar al cliente.
                  </p>
                  <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                    Sistema de Notificaciones Automáticas • CDE
                  </p>
                </td>
              </tr>
            </table>
          </div>
        `,
        'h:Reply-To': corporateEmail
    };

    await mg.messages.create(env.MAILGUN_DOMAIN, emailData);

    return res.status(200).json({
      message: 'Mensaje enviado correctamente',
    });
  } catch (error: unknown) {
    console.error('Mailgun send error:', error);

    return res.status(500).json({
      message: 'No se pudo enviar el mensaje'
    });
  }
};
