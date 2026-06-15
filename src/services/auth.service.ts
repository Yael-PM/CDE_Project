import type { LoginResponse, UserData } from '../types/auth.types';

const API_URL = import.meta.env.API_URL || 'http://localhost:4000/api';

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
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
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Logout failed');
  }
}

export async function getMe(): Promise<UserData> {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error('Not authenticated');
  }

  return res.json();
}