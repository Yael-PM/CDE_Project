import { createContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Note } from '../types/notes.types';

export interface BlogContextType {
  notes: Note[];
  setNotes: Dispatch<SetStateAction<Note[]>>;
  loading: boolean;
  error: string | null;
  refetchNotes: () => Promise<void>;
}

export const BlogContext = createContext<BlogContextType | undefined>(undefined);
