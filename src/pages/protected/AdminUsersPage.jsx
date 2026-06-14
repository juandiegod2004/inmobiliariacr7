import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../api/supabase'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setUsers(data)
    } catch (err) {
      console.error(err)
      setError('Error al obtener la lista de usuarios. Verifica que el RLS esté configurado.')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    setError('')
    setSuccess('')
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (updateError) throw updateError

      setSuccess('Rol de usuario actualizado con éxito.')
      // Actualizar el estado local
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    } catch (err) {
      console.error(err)
      setError('Fallo al actualizar el rol del usuario.')
    }
  }

  const handleStatusToggle = async (userId, currentStatus) => {
    setError('')
    setSuccess('')
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId)

      if (updateError) throw updateError

      setSuccess('Estado del usuario actualizado con éxito.')
      // Actualizar el estado local
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !currentStatus } : u))
    } catch (err) {
      console.error(err)
      setError('Fallo al actualizar el estado del usuario.')
    }
  }

  return (
    <div className="max-w-container-max mx-auto px-6 py-12 space-y-8 min-h-screen">
      
      {/* Cabecera */}
      <div className="border-b border-outline-variant/20 pb-6">
        <Link 
          to="/admin" 
          className="inline-flex items-center gap-1 text-xs text-outline hover:text-primary font-bold mb-2"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver al Panel
        </Link>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-primary">
          Gestión de Usuarios
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Visualiza los perfiles registrados y promueve roles de Agente o Administrador.
        </p>
      </div>

      {/* Alertas */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl text-green-700 text-sm flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{success}</span>
        </div>
      )}

      {/* Tabla de Usuarios */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-secondary rounded-full animate-spin"></div>
          <p className="text-xs text-on-surface-variant font-bold mt-4">Obteniendo lista de perfiles...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-outline-variant/60 rounded-3xl bg-surface/40 p-8">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">group</span>
          <p className="font-bold text-primary">No se encontraron perfiles</p>
          <p className="text-xs text-on-surface-variant mt-1">Los perfiles se crean automáticamente cuando se registra un usuario.</p>
        </div>
      ) : (
        <div className="bg-white border border-outline-variant/30 rounded-3xl overflow-hidden shadow-soft-coastal">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-primary text-white uppercase tracking-wider font-bold">
                  <th className="p-4 rounded-tl-3xl">Nombre</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Rol</th>
                  <th className="p-4">Creado</th>
                  <th className="p-4">Estado de Cuenta</th>
                  <th className="p-4 rounded-tr-3xl text-center">Acción de Suspensión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-medium text-primary">
                {users.map((item) => (
                  <tr key={item.id} className="hover:bg-background/40 transition-colors">
                    <td className="p-4 font-bold">{item.name}</td>
                    <td className="p-4 text-on-surface-variant">{item.email || 'N/A'}</td>
                    <td className="p-4">
                      <select
                        value={item.role}
                        onChange={(e) => handleRoleChange(item.id, e.target.value)}
                        className="bg-background border border-outline-variant/60 rounded-lg text-xs py-1 px-2 outline-none focus:border-secondary font-bold"
                      >
                        <option value="CLIENT">CLIENT (Cliente)</option>
                        <option value="AGENT">AGENT (Agente)</option>
                        <option value="ADMIN">ADMIN (Administrador)</option>
                      </select>
                    </td>
                    <td className="p-4 text-on-surface-variant">
                      {new Date(item.created_at).toLocaleDateString('es-CO')}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] ${
                        item.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {item.is_active ? 'Activa' : 'Suspendida'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleStatusToggle(item.id, item.is_active)}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors border ${
                          item.is_active
                            ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600'
                            : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-600 hover:text-white hover:border-green-600'
                        }`}
                      >
                        {item.is_active ? 'Suspender' : 'Reactivar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
