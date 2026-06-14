import React, { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance, { setAccessTokenInMemory, getAccessTokenInMemory } from '../api/axiosInstance';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Derivar estado de autenticación según la presencia del Access Token en memoria
  const isAuthenticated = !!user && !!getAccessTokenInMemory();

  /**
   * Cierra sesión limpiando los estados locales y llamando al endpoint de logout.
   */
  const logout = useCallback(async () => {
    try {
      // Intentar notificar al backend de forma segura
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.warn('Advertencia: No se pudo invalidar la sesión en el backend:', error);
    } finally {
      // Limpiar memoria y estados locales incondicionalmente
      setAccessTokenInMemory(null);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  /**
   * Intenta refrescar el token silenciosamente al montar la aplicación
   * para restaurar la sesión del usuario si existe una cookie de refresco válida.
   */
  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      // Llamar al endpoint /refresh
      // Si la cookie es válida, el backend retornará un nuevo Access Token
      const response = await axiosInstance.post('/auth/refresh');
      const token = response.data.data.accessToken;
      
      setAccessTokenInMemory(token);
      
      // Obtener datos del perfil del usuario autenticado
      const meResponse = await axiosInstance.get('/auth/me');
      setUser(meResponse.data.data.user);
    } catch (error) {
      // Falla silenciosa si no hay sesión iniciada (normal al primer ingreso)
      setAccessTokenInMemory(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Inicia sesión del usuario con correo y contraseña.
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { accessToken, user: userData } = response.data.data;
      
      // Guardar el token en memoria privada
      setAccessTokenInMemory(accessToken);
      setUser(userData);
      
      return response.data;
    } catch (error) {
      // Limpiar datos ante cualquier error de login
      setAccessTokenInMemory(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  // Ejecutar verificación de autenticación silenciosa al montar el componente
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Escuchar el evento 'auth-logout' disparado por el interceptor de Axios ante fallos de refresco
  useEffect(() => {
    const handleAuthLogout = () => {
      setUser(null);
      setAccessTokenInMemory(null);
    };

    window.addEventListener('auth-logout', handleAuthLogout);
    return () => {
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, []);

  // Valor provisto por el contexto
  const contextValue = {
    user,
    accessToken: getAccessTokenInMemory(),
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
