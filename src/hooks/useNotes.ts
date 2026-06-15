import { useState } from 'react';
import { notesService } from '../services/notes.service';

// Definimos la estructura de los datos que recibirá la función
interface CreateNoteArgs {
  title: string;
  description: string;
  imageFile: File; // 'File' es el tipo nativo del navegador para los inputs de tipo archivo
  urlReference: string;
}

export const useCreateNote = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Tipamos el parámetro desestructurado usando la interfaz
  const createNewNote = async ({ title, description, imageFile, urlReference }: CreateNoteArgs) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('note_title', title);
    formData.append('note_description', description);
    formData.append('url_reference', urlReference);
    formData.append('image', imageFile); 

    try {
      const result = await notesService.createNote(formData);
      setSuccess(true);
      return result;
    } catch (err: unknown) {
      // Tipamos 'err' como 'any' o extraemos su mensaje de forma segura
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createNewNote, loading, error, success };
};