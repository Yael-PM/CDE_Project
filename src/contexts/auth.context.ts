import { createContext } from 'react';
import type { UserData } from '../types/auth.types';

export interface AuthContextType {
    user: UserData | null;
    setUser: (user: UserData | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);