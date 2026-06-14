import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

// Registrar manejador de excepciones no controladas antes de iniciar el servidor
process.on('uncaughtException', (err) => {
  console.error('EXCEPCIÓN NO CONTROLADA (Uncaught Exception). Apagando servidor...', {
    name: err.name,
    message: err.message,
    stack: err.stack
  });
  // Apagar inmediatamente para evitar que la aplicación quede en un estado corrupto/inestable
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log(`Servidor de Autenticación de CR7 Inmobiliaria corriendo en el puerto ${PORT}`);
  console.log(`Entorno activo: ${process.env.NODE_ENV || 'development'}`);
});

// Registrar manejador de promesas rechazadas no manejadas
process.on('unhandledRejection', (err) => {
  console.error('RECHAZO DE PROMESA NO MANEJADO (Unhandled Rejection). Cerrando ordenadamente...', {
    name: err?.name,
    message: err?.message,
    stack: err?.stack
  });
  // Cerrar el servidor HTTP primero de forma ordenada antes de finalizar el proceso
  server.close(() => {
    process.exit(1);
  });
});
