import { useAuth as useContextAuth } from '../context/AuthContext'

/**
 * Custom hook wrapper para acceder de forma ágil a los datos y utilidades de sesión.
 * Re-exporta useAuth desde AuthContext.
 */
export const useAuth = () => {
  return useContextAuth()
}
