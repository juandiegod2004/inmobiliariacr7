import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../api/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)        // { id, email, name, role }
  const [isLoading, setIsLoading] = useState(true)

  // Función para obtener el perfil con el rol desde public.profiles
  const fetchProfile = async (supabaseUser) => {
    if (!supabaseUser) return null
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, role, is_active')
        .eq('id', supabaseUser.id)
        .single()
      if (error || !data || !data.is_active) return null
      return { id: data.id, email: supabaseUser.email, name: data.name, role: data.role }
    } catch (err) {
      console.error("Error al obtener perfil de usuario:", err)
      return null
    }
  }

  useEffect(() => {
    // Verificar sesión activa al montar
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user)
        setUser(profile)
      }
      setIsLoading(false)
    })

    // Escuchar cambios de sesión en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchProfile(session.user)
          setUser(profile)
        }
        if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        if (event === 'TOKEN_REFRESHED') {
          // Supabase renueva el token automáticamente, no hacer nada
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const profile = await fetchProfile(data.user)
    if (!profile) throw new Error('Usuario inactivo o sin perfil')
    return profile  // retornar para que LoginPage redirija según el rol
  }

  const register = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role: 'CLIENT' } }
    })
    if (error) throw error
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
