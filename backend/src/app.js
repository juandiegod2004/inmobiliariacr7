import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRouter from './routes/auth.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

/**
 * 1. CONFIGURACIÓN DE MIDDLEWARES GLOBALES DE SEGURIDAD HTTP
 */

// Helmet establece cabeceras HTTP de seguridad para mitigar ataques como Clickjacking, XSS, etc.
app.use(helmet());

// CORS restringe el acceso de origen únicamente a la dirección autorizada en .env, permitiendo credenciales (cookies)
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true, // Requerido para permitir que el cliente envíe y reciba cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Limitar el tamaño del cuerpo de la petición (JSON payload) para evitar ataques DoS por desbordamiento
app.use(express.json({ limit: '10kb' }));

// Parsear cabeceras Cookie para poder extraer tokens de refresco HttpOnly
app.use(cookieParser());

// Sanitizar entradas contra ataques de inyección de consultas (limpia llaves que inicien con $ o contengan puntos)
app.use(mongoSanitize());

// Sanitizar entradas contra ataques XSS limpiando código HTML malicioso insertado en strings
app.use(xss());

/**
 * 2. LIMITACIÓN DE TASA (RATE LIMITING)
 */

// Limitor global: Máximo 100 peticiones por IP cada 15 minutos
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 peticiones por IP
  standardHeaders: true, // Devuelve información sobre la tasa límite en las cabeceras RateLimit-*
  legacyHeaders: false, // Desactiva cabeceras antiguas X-RateLimit-*
  message: {
    status: 'fail',
    message: 'Demasiadas solicitudes desde esta dirección IP, por favor intente más tarde.'
  }
});
app.use('/api', globalLimiter);

// Limitor estricto para inicio de sesión y registro: Máximo 10 peticiones cada 15 minutos
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Límite de 10 intentos
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Demasiados intentos, espera 15 minutos.'
  }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

/**
 * 3. REGISTRO DE RUTAS
 */
app.use('/api/auth', authRouter);

// Manejador para endpoints no encontrados (404)
app.use('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Ruta no encontrada: ${req.originalUrl}`
  });
});

/**
 * 4. MANEJADOR GLOBAL DE ERRORES (Debe estar al final)
 */
app.use(errorHandler);

export default app;
