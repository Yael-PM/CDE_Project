import { useState } from 'react';
import { contactService } from '../services/contact.service';
import type { ContactData } from '../services/contact.service';

export const useContact = () => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSuccess, setContactSuccess] = useState<boolean>(false);

  const sendForm = async (formData: ContactData) => {
    setIsSending(true);
    setContactError(null);
    setContactSuccess(false);

    try {
      await contactService.sendContactMessage(formData);
      setContactSuccess(true);
      return true; // Retorna true si todo salió bien
    } catch (err: unknown) {
      setContactError(err instanceof Error ? err.message : 'Ocurrió un error inesperado');
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return { sendForm, isSending, contactError, contactSuccess };
};
