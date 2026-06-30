import { useState, useEffect } from 'react';
import { notesService } from '../services/notes.service';
import { useBlog } from '../contexts/blog.context';

export const useFetchNotes = () => {

  const {notes, setNotes, loading, error, refetchNotes } = useBlog();

  // Retornamos setNotes para poder actualizar la UI optimísticamente en ManageNotes
  return { notes, setNotes, loading, error, refetch: refetchNotes };
};

interface CreateNoteArgs {
  title: string;
  description: string;
  imageFile: File; 
  urlReference: string;
}

export const useCreateNote = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

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

export const useEditNote = () => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateExistingNote = async (id: number, title: string, description: string, urlReference: string, imageFile?: File) => {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('note_title', title);
        formData.append('note_description', description);
        formData.append('url_reference', urlReference);
        
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const result = await notesService.editNote(id, formData);
            return result; 
        } catch (err: any) {
            setError(err.message || 'Error al editar la nota');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateExistingNote, isUpdating: isLoading, editError: error };
};

export const useDeleteNote = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteExistingNote = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await notesService.deleteNote(id);
      return true; 
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al eliminar la nota');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteExistingNote, isDeleting: isLoading, deleteError: error };
};