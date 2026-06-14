import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Obtener secretos de las variables de entorno
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Genera un Access Token firmado con el secreto de acceso.
 * Duración típica: 15 minutos.
 * @param {Object} payload - Debe contener userId, email y role.
 * @returns {string} Token JWT firmado.
 */
export const generateAccessToken = (payload) => {
  // Aseguramos que solo se incluyan datos necesarios y no sensibles
  const tokenPayload = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role
  };
  
  return jwt.sign(tokenPayload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES
  });
};

/**
 * Genera un Refresh Token firmado con el secreto de refresco.
 * Duración típica: 7 días.
 * Incluye únicamente el userId para minimizar exposición de datos en caso de robo del token.
 * @param {Object} payload - Debe contener únicamente el userId.
 * @returns {string} Token JWT firmado.
 */
export const generateRefreshToken = (payload) => {
  const tokenPayload = {
    userId: payload.userId
  };
  
  return jwt.sign(tokenPayload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES
  });
};

/**
 * Verifica un Access Token JWT.
 * Lanza un error si está vencido, alterado o es inválido.
 * @param {string} token - Token de acceso a verificar.
 * @returns {Object} Payload decodificado.
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (error) {
    throw error;
  }
};

/**
 * Verifica un Refresh Token JWT.
 * Lanza un error si está vencido o es inválido.
 * @param {string} token - Token de refresco a verificar.
 * @returns {Object} Payload decodificado.
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    throw error;
  }
};
