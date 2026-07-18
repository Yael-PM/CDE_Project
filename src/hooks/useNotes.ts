import { useState, useMemo } from 'react';
import { notesService } from '../services/notes.service';
import { useBlog } from './useBlog';
import type { Note } from '../types/notes.types';

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
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al editar la nota');
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

export const useNoteFilters = (initialNotes: Note[]) => {
  const [search, setSearch] = useState<string>("");
  const [filterMode, setFilterMode] = useState<'all' | 'day' | 'month'>('all');
  const [filterValue, setFilterValue] = useState<string>("");

  const filteredNotes = useMemo(() => {
    return initialNotes.filter((note) => {
      // 1. Filtro por Título (Buscador principal)
      const matchesSearch = note.note_title
        ? note.note_title.toLowerCase().includes(search.toLowerCase())
        : true;

      // Si no hay valor en el filtro de tiempo, pasa directo
      if (!filterValue || filterMode === 'all') return matchesSearch;

      // Extraemos la fecha de la base de datos
      const dbDate = note.creation_date || ""; // Ej: "2026-06-20 14:30:00"
      if (dbDate.length < 10) return false;

      // Modo por día
      if (filterMode === 'day') {
        // filterValue viene del calendario como "2026-06-20"
        // dbDate empieza como "2026-06-20..."
        // Al usar startsWith, la coincidencia es exacta y perfecta.
        return matchesSearch && dbDate.startsWith(filterValue);
      }

      // Modo por mes
      if (filterMode === 'month') {
        const month = dbDate.substring(5, 7); // Extrae el "06"
        const cleanInputValue = filterValue.trim().toLowerCase();
        
        const monthsText = [
          'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        const monthIndex = parseInt(month, 10) - 1;
        const noteMonthName = monthsText[monthIndex] || ""; 

        return matchesSearch && noteMonthName.includes(cleanInputValue);
      }

      return matchesSearch;
    });
  }, [initialNotes, search, filterMode, filterValue]);

  const handleModeChange = (mode: 'all' | 'day' | 'month') => {
    setFilterMode(mode);
    setFilterValue(""); 
  };

  return {
    search,
    setSearch,
    filterMode,
    filterValue,
    setFilterValue,
    filteredNotes,
    handleModeChange,
    clearAll: () => {
      setSearch("");
      setFilterMode("all");
      setFilterValue("");
    }
  };
};
