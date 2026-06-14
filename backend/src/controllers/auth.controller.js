import bcrypt from 'bcrypt';
import prisma from '../config/db.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../utils/jwt.utils.js';

// Rondas de encriptación para bcrypt
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 12;

// Nombre de la cookie de refresco
const REFRESH_COOKIE_NAME = 'refreshToken';

// Opciones de seguridad para la cookie del Refresh Token
const COOKIE_OPTIONS = {
  httpOnly: true, // No accesible desde JavaScript en el navegador (previene ataques XSS)
  secure: process.env.NODE_ENV === 'production', // Solo se transmite a través de HTTPS en producción
  sameSite: 'Strict', // Previene ataques CSRF al asegurar que la cookie solo se envíe en solicitudes del mismo origen
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días en milisegundos
};

/**
 * Registra un nuevo usuario en el sistema.
 */
export const register = async (req, res, next) => {
  try {
    // 1. Validar el cuerpo de la petición con Zod
    const validatedData = registerSchema.parse(req.body);

    // 2. Verificar que el correo electrónico no esté registrado previamente
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      // 409 Conflict: Usamos mensaje específico en registro
      return res.status(409).json({
        status: 'fail',
        message: 'El correo electrónico ya está registrado.'
      });
    }

    // 3. Hashear contraseña usando bcrypt
    const hashedPassword = await bcrypt.hash(validatedData.password, BCRYPT_ROUNDS);

    // 4. Crear el usuario en la base de datos
    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: 'CLIENT' // Rol por defecto
      }
    });

    // 5. Retornar respuesta (excluyendo password y token de refresco)
    const { password, refreshToken, ...userResponse } = newUser;

    return res.status(201).json({
      status: 'success',
      message: 'Usuario registrado exitosamente.',
      data: { user: userResponse }
    });
  } catch (error) {
    // Si es un error de validación de Zod, formateamos la respuesta con detalles
    if (error.name === 'ZodError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Errores de validación de entrada.',
        errors: error.flatten().fieldErrors
      });
    }
    next(error);
  }
};

/**
 * Inicia sesión y genera los tokens de acceso y refresco.
 */
export const login = async (req, res, next) => {
  try {
    // 1. Validar cuerpo de la petición con Zod
    const validatedData = loginSchema.parse(req.body);

    // 2. Buscar el usuario por email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    // Mensaje de error genérico para no revelar si el correo existe
    const invalidCredentialsResponse = () => {
      return res.status(401).json({
        status: 'fail',
        message: 'Credenciales inválidas'
      });
    };

    if (!user) {
      return invalidCredentialsResponse();
    }

    // 3. Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(403).json({
        status: 'fail',
        message: 'Tu cuenta ha sido desactivada. Comunícate con el soporte.'
      });
    }

    // 4. Comparar contraseñas
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      return invalidCredentialsResponse();
    }

    // 5. Generar Access Token y Refresh Token
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({ userId: user.id });

    // 6. Hashear el Refresh Token antes de guardarlo en la base de datos (medida de seguridad avanzada)
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken }
    });

    // 7. Enviar Refresh Token en una cookie HttpOnly y segura
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, COOKIE_OPTIONS);

    // 8. Retornar Access Token e información básica del usuario en el body
    const { password: _, refreshToken: __, ...safeUser } = user;
    
    return res.status(200).json({
      status: 'success',
      message: 'Inicio de sesión exitoso.',
      data: {
        accessToken,
        user: safeUser
      }
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Datos de inicio de sesión inválidos.',
        errors: error.flatten().fieldErrors
      });
    }
    next(error);
  }
};

/**
 * Renueva el Access Token a partir de un Refresh Token válido recibido en una cookie.
 * Implementa rotación opcional del Refresh Token para mayor seguridad.
 */
export const refresh = async (req, res, next) => {
  try {
    // 1. Obtener Refresh Token de la cookie
    const token = req.cookies[REFRESH_COOKIE_NAME];
    
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'No autorizado. Token de refresco ausente.'
      });
    }

    // 2. Verificar firma y expiración del Refresh Token
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (jwtError) {
      // Si el token es inválido o expiró, limpiamos la cookie local
      res.clearCookie(REFRESH_COOKIE_NAME, COOKIE_OPTIONS);
      return res.status(401).json({
        status: 'fail',
        message: 'Token de refresco inválido o expirado.'
      });
    }

    // 3. Buscar usuario en base de datos
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    const clearAndUnauthorized = async () => {
      res.clearCookie(REFRESH_COOKIE_NAME, COOKIE_OPTIONS);
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { refreshToken: null }
        });
      }
      return res.status(401).json({
        status: 'fail',
        message: 'Sesión no autorizada o expirada.'
      });
    };

    if (!user || !user.refreshToken || !user.isActive) {
      return clearAndUnauthorized();
    }

    // 4. Comparar el token recibido con el hash guardado en base de datos
    const isTokenValid = await bcrypt.compare(token, user.refreshToken);
    if (!isTokenValid) {
      // Alerta de seguridad: Posible robo de Refresh Token. Invalidamos todas las sesiones
      return clearAndUnauthorized();
    }

    // 5. Rotar Refresh Token (generar uno nuevo para invalidar el anterior)
    const newRefreshToken = generateRefreshToken({ userId: user.id });
    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);

    // 6. Generar nuevo Access Token
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // 7. Guardar el nuevo Refresh Token hasheado en la base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedNewRefreshToken }
    });

    // 8. Establecer la nueva cookie con el Refresh Token rotado
    res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, COOKIE_OPTIONS);

    // 9. Enviar el nuevo Access Token en el body
    return res.status(200).json({
      status: 'success',
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cierra la sesión activa invalidando el token de refresco y limpiando la cookie.
 */
export const logout = async (req, res, next) => {
  try {
    // req.user contiene el usuario autenticado (inyectado por el middleware 'authenticate')
    const userId = req.user.id;

    // 1. Eliminar token de refresco de la base de datos
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }
    });

    // 2. Limpiar cookie del cliente
    res.clearCookie(REFRESH_COOKIE_NAME, COOKIE_OPTIONS);

    return res.status(200).json({
      status: 'success',
      message: 'Sesión cerrada exitosamente.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retorna los datos del usuario actualmente autenticado.
 */
export const me = async (req, res, next) => {
  try {
    // req.user ya fue previamente depurado y validado por el middleware authenticate
    return res.status(200).json({
      status: 'success',
      data: { user: req.user }
    });
  } catch (error) {
    next(error);
  }
};
