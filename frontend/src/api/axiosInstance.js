import axios from 'axios';

// Guardar el Access Token estrictamente en memoria (variable privada de JS)
// para mitigar vulnerabilidades XSS que comprometan tokens en localStorage/sessionStorage.
let accessTokenInMemory = null;

// Funciones expuestas para que el AuthContext gestione el token en memoria
export const setAccessTokenInMemory = (token) => {
  accessTokenInMemory = token;
};

export const getAccessTokenInMemory = () => {
  return accessTokenInMemory;
};

// Crear instancia de Axios
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true, // Envía cookies HttpOnly (como el Refresh Token) de forma automática en todas las peticiones
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Interceptor de Solicitud (Request Interceptor)
 * Adjunta dinámicamente el Access Token en memoria en la cabecera Authorization
 * para todas las peticiones salientes.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessTokenInMemory();
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Respuesta (Response Interceptor)
 * Intercepta respuestas con error 401 y código TOKEN_EXPIRED para realizar
 * un refresco de token transparente (Silent Refresh) y reintentar la petición original.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Verificar si el error es 401 (No Autorizado) debido a token expirado
    // y asegurar que no estemos intentando reintentar el propio endpoint de refresh en bucle
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data &&
      error.response.data.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Evita bucles infinitos marcando la petición como reintentada
      
      try {
        // 1. Invocar endpoint /refresh para obtener un nuevo Access Token
        // Nota: El navegador enviará la cookie HttpOnly 'refreshToken' de forma automática gracias a withCredentials: true
        const refreshResponse = await axios.post(
          `${axiosInstance.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        const newAccessToken = refreshResponse.data.data.accessToken;
        
        // 2. Guardar el nuevo token de acceso en memoria
        setAccessTokenInMemory(newAccessToken);
        
        // 3. Actualizar la cabecera de la petición original con el nuevo token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        // 4. Reintentar la petición original
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Si el refresco también falla (el refresh token expiró o se invalidó),
        // limpiamos el estado del token y redirigimos al login.
        setAccessTokenInMemory(null);
        
        // Emitir un evento global para que el AuthContext reaccione y limpie su estado
        window.dispatchEvent(new Event('auth-logout'));
        
        // Opcional: Redirección forzada
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
