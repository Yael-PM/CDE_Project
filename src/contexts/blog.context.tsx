// context/BlogContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { notesService } from '../services/notes.service';
import type { Note } from '../types/notes.types';

interface BlogContextType {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  loading: boolean;
  error: string | null;
  refetchNotes: () => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // servicio centralizado en lugar de un fetch directo
      const result = await notesService.getNotes();
      setNotes(result.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado al cargar las notas');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch inicial una sola vez a nivel global cuando el Provider se monta
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <BlogContext.Provider value={{ notes, setNotes, loading, error, refetchNotes: fetchNotes }}>
      {children}
    </BlogContext.Provider>
  );
};

// Hook interno del context
export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog debe ser utilizado dentro de un BlogProvider');
  }
  return context;
};