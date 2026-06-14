import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Componente que protege rutas requiriendo inicio de sesión y validando roles autorizados.
 * Muestra una pantalla de carga mientras Supabase valida la sesión activa.
 */
export default function PrivateRoute({ allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  // Esperar a que Supabase verifique la sesión antes de redirigir
  if (isLoading) {
    return (
      <div class="fixed inset-0 flex flex-col items-center justify-center bg-background">
        <div class="w-12 h-12 border-4 border-primary/20 border-t-secondary rounded-full animate-spin"></div>
        <p class="text-primary font-semibold mt-4">Verificando sesión...</p>
      </div>
    )
  }

  // No autenticado: redirigir a login guardando la ruta de origen en el estado de ubicación
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Autenticado pero sin el rol requerido: redirigir al inicio público
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
