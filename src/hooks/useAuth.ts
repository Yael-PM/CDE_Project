// Este es un hook que orquestará la lógica de autenticación en la aplicación.
// Se encargara de manejar el estado del usuario, iniciar y cerrar sesión, entre otros.

import { useContext } from 'react';
import { AuthContext } from '../contexts/auth.context';
import * as authService from '../services/auth.service';
import type { UserData, LoginPayload } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes';

export function useAuth() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, setUser, loading, setLoading } = context;

  // LOGIN
  const login = async ({ email, password }: LoginPayload) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      setUser(res.user); // backend devuelve { user }
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  // GET ME (rehidratar sesión)
  const fetchMe = async () => {
    setLoading(true);
    try {
      const me: UserData = await authService.getMe();
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      navigate(ROUTES.LOGIN, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  // 1. Función para solicitar el correo
  const requestPasswordReset = async (email: string) => {
    setLoading(true);
    try {
      const response = await authService.forgotPasswordService(email);
      return response;
    } finally {
      setLoading(false);
    }
  };

  // 2. Función para guardar la nueva contraseña
  const resetPassword = async (token: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.resetPasswordService(token, password);
      return response;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    fetchMe,
    requestPasswordReset,
    resetPassword
  };
}