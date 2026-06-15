import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState, useEffect } from 'react'
import { getAllPropertiesAdmin } from '../../api/properties.api'
import { supabase } from '../../api/supabase'

export default function AdminDashboardPage() {
  const { user, settings, updateSetting } = useAuth()
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    totalAgents: 0,
    totalClients: 0
  })
  const [loading, setLoading] = useState(true)

  // Estados para Configuración de Contacto
  const [contactForm, setContactForm] = useState({ phone: '', email: '' })
  const [updatingContact, setUpdatingContact] = useState(false)
  const [contactSuccess, setContactSuccess] = useState('')
  const [contactError, setContactError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    if (settings) {
      setContactForm({
        phone: settings.phone || '',
        email: settings.email || ''
      })
    }
  }, [settings])

  const fetchStats = async () => {
    setLoading(true)
    try {
      // Obtener propiedades
      const properties = await getAllPropertiesAdmin()
      const activeProps = properties.filter(p => p.is_active).length

      // Obtener conteo de perfiles
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('role')

      if (error) throw error

      const agents = profiles.filter(p => p.role === 'AGENT').length
      const clients = profiles.filter(p => p.role === 'CLIENT').length

      setStats({
        totalProperties: properties.length,
        activeProperties: activeProps,
        totalAgents: agents,
        totalClients: clients
      })
    } catch (err) {
      console.error('Error al cargar estadísticas del administrador:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleContactUpdate = async (e) => {
    e.preventDefault()
    setUpdatingContact(true)
    setContactSuccess('')
    setContactError('')
    try {
      await updateSetting('phone', contactForm.phone.trim())
      await updateSetting('email', contactForm.email.trim())
      setContactSuccess('Configuración de contacto guardada con éxito.')
    } catch (err) {
      console.error(err)
      setContactError('Fallo al guardar la configuración de contacto.')
    } finally {
      setUpdatingContact(false)
    }
  }

  return (
    <div className="max-w-container-max mx-auto px-6 py-12 space-y-10 min-h-screen">
      
      {/* Bienvenida */}
      <div className="border-b border-outline-variant/20 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">Panel de Control</span>
          <h1 className="font-display font-extrabold text-3xl text-primary mt-1">
            Bienvenido, {user.name}
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Aquí tienes un resumen general del estado de la inmobiliaria hoy.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 rounded-xl px-4 py-2 text-xs font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-sm">verified_user</span>
          Acceso Administrador Autorizado
        </div>
      </div>

      {/* Cartas de Estadísticas */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-28 bg-slate-100 rounded-2xl border border-outline-variant/20"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-soft-coastal flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">real_estate_agent</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Propiedades</p>
              <p className="text-2xl font-extrabold text-primary">{stats.totalProperties}</p>
            </div>
          </div>

          <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-soft-coastal flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-2xl">home</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Propiedades Activas</p>
              <p className="text-2xl font-extrabold text-secondary">{stats.activeProperties}</p>
            </div>
          </div>

          <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-soft-coastal flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined text-2xl">badge</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Agentes Activos</p>
              <p className="text-2xl font-extrabold text-blue-600">{stats.totalAgents}</p>
            </div>
          </div>

          <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-soft-coastal flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <span className="material-symbols-outlined text-2xl">group</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Clientes Registrados</p>
              <p className="text-2xl font-extrabold text-orange-600">{stats.totalClients}</p>
            </div>
          </div>
        </div>
      )}

      {/* Menú de Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* Gestión de Propiedades */}
        <div className="bg-glass border border-outline-variant/30 p-8 rounded-3xl shadow-soft-coastal flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h3 className="font-display font-extrabold text-lg text-primary">Gestión de Portafolio</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Publica nuevos inmuebles, sube imágenes al bucket de almacenamiento público, edita especificaciones técnicas, precios, y elimina inmuebles del catálogo.
            </p>
          </div>
          <Link 
            to="/admin/propiedades"
            className="w-full py-3 bg-primary hover:bg-primary-container text-white font-bold rounded-xl text-center text-xs transition-all shadow-md inline-flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">home_work</span>
            Administrar Propiedades
          </Link>
        </div>

        {/* Configuración de Contacto */}
        <div className="bg-glass border border-outline-variant/30 p-8 rounded-3xl shadow-soft-coastal flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h3 className="font-display font-extrabold text-lg text-primary">Configuración de Contacto</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Actualiza el número de WhatsApp y el correo electrónico de contacto mostrados en toda la página web.
            </p>
          </div>
          
          <form onSubmit={handleContactUpdate} className="space-y-4 text-left w-full">
            <div>
              <label className="block text-primary font-label-md text-[10px] font-bold mb-1">WhatsApp (con código de país, ej: 573002510313)</label>
              <input 
                type="text" 
                required
                value={contactForm.phone}
                onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full border border-outline-variant/60 rounded-lg px-3 py-2 text-xs focus:ring-primary focus:border-primary outline-none bg-white font-medium"
              />
            </div>
            <div>
              <label className="block text-primary font-label-md text-[10px] font-bold mb-1">Correo Electrónico de Contacto</label>
              <input 
                type="email" 
                required
                value={contactForm.email}
                onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full border border-outline-variant/60 rounded-lg px-3 py-2 text-xs focus:ring-primary focus:border-primary outline-none bg-white font-medium"
              />
            </div>

            {contactError && (
              <p className="text-[10px] text-red-600 font-bold">{contactError}</p>
            )}
            {contactSuccess && (
              <p className="text-[10px] text-green-600 font-bold">{contactSuccess}</p>
            )}

            <button 
              type="submit"
              disabled={updatingContact}
              className="w-full py-3 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl text-center text-xs transition-all shadow-md inline-flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              {updatingContact ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}
