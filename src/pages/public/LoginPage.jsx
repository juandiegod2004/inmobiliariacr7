import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Ruta a la que se redirigirá (por defecto según el rol si no viene de una privada)
  const from = location.state?.from?.pathname

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const profile = await login(email, password)
      
      // Redirigir al panel correspondiente o a la ruta original
      if (from) {
        navigate(from, { replace: true })
      } else {
        if (profile.role === 'ADMIN') {
          navigate('/admin')
        } else if (profile.role === 'AGENT') {
          navigate('/agente/propiedades')
        } else {
          navigate('/')
        }
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="w-full max-w-md bg-glass border border-outline-variant/30 rounded-2xl shadow-soft-coastal p-8 md:p-10 transition-all hover:shadow-xl">
        
        {/* Cabecera */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
            <span className="material-symbols-outlined text-3xl text-primary font-bold">
              admin_panel_settings
            </span>
          </div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-primary">
            Acceso Privado
          </h2>
          <p className="text-sm text-on-surface-variant mt-2 font-medium">
            Ingresa tus credenciales para gestionar el portafolio
          </p>
        </div>

        {/* Alerta de Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-sm flex items-start gap-3">
            <span className="material-symbols-outlined text-lg mt-0.5">error</span>
            <div>
              <span className="font-bold">Error de acceso:</span> {error}
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-outline-variant/60 rounded-xl text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">
              Contraseña
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                lock
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-outline-variant/60 rounded-xl text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary hover:bg-primary-container text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <span>Ingresar</span>
                <span className="material-symbols-outlined text-lg">login</span>
              </>
            )}
          </button>
        </form>

        {/* Nota informativa */}
        <div className="mt-8 pt-6 border-t border-outline-variant/20 text-center">
          <p className="text-xs text-on-surface-variant">
            Esta sección es exclusiva para Administradores y Agentes autorizados de CR7 Inmobiliaria.
          </p>
        </div>

      </div>
    </div>
  )
}
