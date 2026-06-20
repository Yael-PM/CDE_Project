const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface ContactData {
  fullName: string;
  company: string;
  corporateEmail: string;
  phone?: string;
  position?: string;
  subject: string;
  message: string;
  privacyAccepted: boolean;
}

export const contactService = {
  sendContactMessage: async (formData: ContactData) => {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Le avisamos al servidor que enviamos JSON
      },
      body: JSON.stringify(formData), // Convertimos el objeto JS a texto JSON
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al enviar el mensaje de contacto');
    }

    return data;
  }
};