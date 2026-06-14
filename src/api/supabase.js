import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Inicializar cliente Supabase para el frontend utilizando la anon key pública
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true, // Renueva automáticamente el token antes de expirar
    persistSession: true,   // Guarda la sesión en localStorage cifrada/segura
    detectSessionInUrl: true // Detecta el token devuelto por email confirmation
  }
})
