import type { LoginResponse, UserData } from '../types/auth.types';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${VITE_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include'
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Login failed');
  }

  return res.json();
}

export async function logout(): Promise<void> {
  const res = await fetch(`${VITE_API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Logout failed');
  }
}

export async function getMe(): Promise<UserData> {
  const res = await fetch(`${VITE_API_URL}/auth/me`, {
    method: 'GET',
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error('Not authenticated');
  }

  // El backend devuelve { authenticated: boolean, user: UserData | null }
  const data = await res.json(); 

  // Si no hay usuario en el objeto, lanzamos el error para que el AuthProvider lo capture
  if (!data.user) {
      throw new Error('No user session active');
  }

  // Retornamos SOLAMENTE el objeto user
  return data.user; 
}

export const forgotPasswordService = async (email: string) => {
    const response = await fetch(`${VITE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Ocurrió un error al procesar la solicitud');
    }

    return data;
};

export const resetPasswordService = async (token: string, password: string) => {
    const response = await fetch(`${VITE_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al restablecer la contraseña');
    }

    return data;
};