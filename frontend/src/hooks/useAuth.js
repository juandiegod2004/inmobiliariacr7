import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom Hook para consumir el contexto de autenticación de forma sencilla
 * en cualquier componente de React.
 * @returns {Object} { user, accessToken, isLoading, isAuthenticated, login, logout, checkAuth }
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Validar que el hook sea utilizado dentro de un componente envuelto por AuthProvider
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  
  return context;
};
