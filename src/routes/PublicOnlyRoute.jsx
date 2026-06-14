import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_REDIRECTS = {
  ADMIN: '/admin',
  AGENT: '/agente/propiedades',
  CLIENT: '/'
}

/**
 * Componente que restringe el acceso a rutas públicas (como el login) 
 * cuando ya se posee una sesión iniciada de usuario.
 * Redirecciona según el rol para evitar accesos repetidos al login.
 */
export default function PublicOnlyRoute() {
  const { isAuthenticated, isLoading, user } = useAuth()

  // Esperar a que se cargue la sesión
  if (isLoading) {
    return (
      <div class="fixed inset-0 flex flex-col items-center justify-center bg-background">
        <div class="w-12 h-12 border-4 border-primary/20 border-t-secondary rounded-full animate-spin"></div>
        <p class="text-primary font-semibold mt-4">Cargando...</p>
      </div>
    )
  }

  // Si ya está autenticado, redirigir a su panel según el rol
  if (isAuthenticated) {
    return <Navigate to={ROLE_REDIRECTS[user.role] ?? '/'} replace />
  }

  return <Outlet />
}
