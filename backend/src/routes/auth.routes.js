import { Router } from 'express';
import { register, login, refresh, logout, me } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * Rutas de Autenticación Pública
 */

// Registro de nuevos usuarios (se valida la entrada dentro del controlador)
router.post('/register', register);

// Inicio de sesión
router.post('/login', login);

// Renovación del Access Token (silenciosa) leyendo el Refresh Token desde la cookie HTTPOnly
router.post('/refresh', refresh);

/**
 * Rutas Protegidas (Requieren autenticación mediante Access Token en cabecera Bearer)
 */

// Cierre de sesión (borra el token de la base de datos y la cookie del navegador)
router.post('/logout', authenticate, logout);

// Obtener datos del perfil del usuario actualmente autenticado
router.get('/me', authenticate, me);

export default router;
