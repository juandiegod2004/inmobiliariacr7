import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware global para el manejo y formateo seguro de errores.
 * Previene la fuga de información sensible (como trazas de pila / stack traces)
 * en el entorno de producción, garantizando al mismo tiempo que en desarrollo
 * el programador tenga acceso completo al origen del error.
 */
export const errorHandler = (err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Registrar el error internamente en la consola
  console.error('Error capturado por middleware:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });

  // Determinar código de estado HTTP (default a 500 Interno)
  const statusCode = err.statusCode || 500;
  
  // Formatear respuesta JSON segura
  const response = {
    status: 'error',
    statusCode,
    message: err.message || 'Ha ocurrido un error interno en el servidor.'
  };

  // Adjuntar el stack trace únicamente si estamos en desarrollo
  if (isDevelopment) {
    response.stack = err.stack;
  }

  // Devolver respuesta
  res.status(statusCode).json(response);
};
