import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Tu hook actualizado

const ProtectedRoute = () => {
  // Consumimos las propiedades exactas que retorna tu hook
  const { isAuthenticated, loading, user } = useAuth();

  // 1. Mientras fetchMe() en el AuthProvider esté validando con el backend, frenamos el renderizado
  if (loading) {
    return <div>Cargando verificación de sesión...</div>; // O tu spinner/layout de carga
  }

  // 2. Si terminó de cargar y 'user' quedó en null, isAuthenticated será false. ¡Al login!
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 3. Si está autenticado, renderiza las rutas hijas con seguridad
  return <Outlet />;
};

export default ProtectedRoute;
