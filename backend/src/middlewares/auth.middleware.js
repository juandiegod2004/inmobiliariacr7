import { verifyAccessToken } from '../utils/jwt.utils.js';
import prisma from '../config/db.js';

/**
 * Middleware para autenticar peticiones mediante JSON Web Token (Access Token).
 * Extrae el token del header Authorization, lo verifica y añade el usuario activo
 * a la petición (req.user) para que los controladores subsiguientes puedan usarlo.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // 1. Verificar presencia de la cabecera Authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'fail',
        message: 'No autorizado. Cabecera Authorization faltante o inválida.'
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verificar y decodificar el token de acceso
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (jwtError) {
      // Diferenciar específicamente el error de expiración para que el frontend pueda renovar automáticamente
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'fail',
          code: 'TOKEN_EXPIRED',
          message: 'Token expirado'
        });
      }
      return res.status(401).json({
        status: 'fail',
        message: 'Token inválido'
      });
    }

    // 3. Buscar el usuario en la base de datos para verificar que exista y esté activo
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'El usuario asociado a este token ya no existe.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        status: 'fail',
        message: 'El usuario ha sido desactivado por el administrador.'
      });
    }

    // 4. Adjuntar datos del usuario (excluyendo password y refresh token) al objeto request
    const { password, refreshToken, ...safeUser } = user;
    req.user = safeUser;
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware de autorización basado en roles (Role-Based Access Control - RBAC).
 * Permite el acceso únicamente a los roles que coincidan con la lista proporcionada.
 * Debe colocarse siempre después del middleware 'authenticate'.
 * @param {...string} roles - Roles permitidos para acceder a la ruta (ej. 'ADMIN', 'AGENT').
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'No autenticado. Middleware authenticate es requerido previo a la autorización.'
      });
    }

    // Verificar si el rol del usuario autenticado se encuentra en la lista de roles autorizados
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Acceso denegado. No tienes permisos suficientes.'
      });
    }

    next();
  };
};
