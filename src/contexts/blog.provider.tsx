import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { notesService } from '../services/notes.service';
import type { Note } from '../types/notes.types';
import { BlogContext } from './blog.context';

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await notesService.getNotes();
      setNotes(result.data);
    } catch (err: unknown) {
      setError(err instanceof Error
        ? err.message
        : 'Ocurrió un error inesperado al cargar las notas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchNotes();
  }, [fetchNotes]);

  return (
    <BlogContext.Provider value={{ notes, setNotes, loading, error, refetchNotes: fetchNotes }}>
      {children}
    </BlogContext.Provider>
  );
};
