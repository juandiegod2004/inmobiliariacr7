import { z } from 'zod';

// Expresión regular para validar contraseña fuerte:
// - Mínimo 8 caracteres
// - Al menos una letra mayúscula
// - Al menos un número
// - Al menos un carácter especial
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

/**
 * Esquema de validación para el registro de usuarios.
 * Usa Zod para verificar que todos los datos obligatorios estén presentes
 * y que cumplan con las restricciones de seguridad necesarias.
 */
export const registerSchema = z.object({
  name: z.string({
    required_error: 'El nombre es requerido'
  }).min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre es demasiado largo'),
  
  email: z.string({
    required_error: 'El correo electrónico es requerido'
  }).email('Formato de correo electrónico inválido'),
  
  password: z.string({
    required_error: 'La contraseña es requerida'
  }).min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      passwordRegex,
      'La contraseña debe contener al menos una letra mayúscula, un número y un carácter especial'
    ),
  
  confirmPassword: z.string({
    required_error: 'Debe confirmar su contraseña'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'] // Muestra el error en el campo confirmPassword
});

/**
 * Esquema de validación para el inicio de sesión.
 */
export const loginSchema = z.object({
  email: z.string({
    required_error: 'El correo electrónico es requerido'
  }).email('Formato de correo electrónico inválido'),
  
  password: z.string({
    required_error: 'La contraseña es requerida'
  }).min(1, 'La contraseña no puede estar vacía')
});
