import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAgentProperties, createProperty, updateProperty, deleteProperty, uploadPropertyImage } from '../../api/properties.api'

export default function AgentPropertiesPage() {
  const { user } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Control de Formulario / Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // Datos del Formulario (con agent_id fijado automáticamente en el ID del agente logueado)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'APARTAMENTO',
    operation: 'VENTA',
    zone: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    is_active: true,
    agent_id: '',
    images: []
  })

  // Carga de imágenes locales
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    if (user?.id) {
      loadProperties()
    }
  }, [user])

  const loadProperties = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAgentProperties(user.id)
      setProperties(data)
    } catch (err) {
      console.error(err)
      setError('Error al obtener tus propiedades consignadas.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setFormData(prev => ({ ...prev, [name]: val }))
  }

  const handleImageUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImage(true)
    setError('')
    try {
      const urls = []
      for (let i = 0; i < files.length; i++) {
        const url = await uploadPropertyImage(files[i])
        urls.push(url)
      }
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls]
      }))
      setSuccess('Imágenes subidas correctamente.')
    } catch (err) {
      console.error(err)
      setError('Error al subir imágenes al bucket publico en Supabase.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }))
  }

  const handleOpenAddModal = () => {
    setIsEditing(false)
    setEditingId(null)
    setFormData({
      title: '',
      description: '',
      price: '',
      type: 'APARTAMENTO',
      operation: 'VENTA',
      zone: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      is_active: true,
      agent_id: user.id, // ID del asesor asignado automáticamente
      images: []
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (prop) => {
    setIsEditing(true)
    setEditingId(prop.id)
    setFormData({
      title: prop.title,
      description: prop.description || '',
      price: prop.price,
      type: prop.type,
      operation: prop.operation,
      zone: prop.zone || '',
      bedrooms: prop.bedrooms || '',
      bathrooms: prop.bathrooms || '',
      area: prop.area || '',
      is_active: prop.is_active,
      agent_id: user.id,
      images: prop.images || []
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const formattedData = {
      ...formData,
      price: parseFloat(formData.price),
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms, 10) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms, 10) : null,
      area: formData.area ? parseFloat(formData.area) : null
    }

    try {
      if (isEditing) {
        await updateProperty(editingId, formattedData)
        setSuccess('Inmueble actualizado exitosamente.')
      } else {
        await createProperty(formattedData)
        setSuccess('Inmueble publicado exitosamente.')
      }
      setIsModalOpen(false)
      loadProperties()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error al guardar el inmueble.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Deseas eliminar permanentemente esta propiedad de tu catálogo?')) return
    setError('')
    setSuccess('')
    try {
      await deleteProperty(id)
      setSuccess('Propiedad eliminada correctamente.')
      loadProperties()
    } catch (err) {
      console.error(err)
      setError('Fallo al eliminar. Solo los administradores pueden eliminar inmuebles físicamente.')
    }
  }

  return (
    <div className="max-w-container-max mx-auto px-6 py-12 space-y-8 min-h-screen">
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/20 pb-6">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">Panel de Agente</span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-primary mt-1">
            Mis Propiedades Consignadas
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Administra tus inmuebles asignados y promueve publicaciones en Santa Marta.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="py-3 px-5 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Consignar Inmueble
        </button>
      </div>

      {/* Alertas */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl text-green-700 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{success}</span>
        </div>
      )}

      {/* Listado */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-secondary rounded-full animate-spin"></div>
          <p className="text-xs text-on-surface-variant font-bold mt-4">Actualizando tu listado...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-outline-variant/60 rounded-3xl bg-surface/40 p-8 flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-outline mb-2">house</span>
          <p className="font-bold text-primary">Aún no tienes propiedades en catálogo</p>
          <p className="text-xs text-on-surface-variant mt-1">Comienza haciendo clic en "Consignar Inmueble".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop) => (
            <div 
              key={prop.id} 
              className="bg-white border border-outline-variant/30 rounded-2xl overflow-hidden shadow-soft-coastal flex flex-col justify-between h-full group"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img 
                  src={prop.images && prop.images[0] ? prop.images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80'} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-primary text-white rounded-full uppercase">
                    {prop.operation}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    prop.is_active ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {prop.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-grow space-y-4">
                <div>
                  <span className="text-xs text-secondary font-bold inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">location_on</span>
                    {prop.zone}
                  </span>
                  <h3 className="font-display font-bold text-sm sm:text-base text-primary line-clamp-1">
                    {prop.title}
                  </h3>
                  <div className="text-sm font-bold text-secondary mt-1">
                    $ {parseFloat(prop.price).toLocaleString('es-CO')}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 py-2 border-y border-outline-variant/15 text-[10px] text-on-surface-variant text-center font-bold">
                  <div>{prop.bedrooms || 0} Hab</div>
                  <div>{prop.bathrooms || 0} Baños</div>
                  <div>{prop.area || 0} m²</div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex gap-2">
                <button
                  onClick={() => handleOpenEditModal(prop)}
                  className="flex-1 py-2 border border-outline-variant hover:bg-background text-primary text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">edit</span>
                  Editar
                </button>
                {/* Nota: solo el admin puede borrar físicamente según RLS o podemos intentar borrar si es de su autoría */}
                {user.role === 'ADMIN' && (
                  <button
                    onClick={() => handleDelete(prop.id)}
                    className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL MÓVIL/DESKTOP AGREGAR O EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative my-8">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-outline hover:text-primary"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <h2 className="font-display font-extrabold text-xl md:text-2xl text-primary mb-6">
              {isEditing ? 'Editar tu Inmueble' : 'Consignar Nuevo Inmueble'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-primary uppercase mb-2">Título de la Propiedad</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ej. Casa en Condominio Cerrado"
                    className="w-full bg-background border border-outline-variant/60 rounded-xl text-xs py-3 px-4 outline-none focus:border-secondary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-primary uppercase mb-2">Descripción</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detalles sobre el estado del inmueble"
                    className="w-full bg-background border border-outline-variant/60 rounded-xl text-xs py-3 px-4 outline-none focus:border-secondary resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-2">Precio (COP)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Ej. 350000000"
                    className="w-full bg-background border border-outline-variant/60 rounded-xl text-xs py-3 px-4 outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-2">Ubicación / Zona</label>
                  <input
                    type="text"
                    name="zone"
                    required
                    value={formData.zone}
                    onChange={handleInputChange}
                    placeholder="Ej. Pozos Colorados"
                    className="w-full bg-background border border-outline-variant/60 rounded-xl text-xs py-3 px-4 outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-2">Tipo</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-outline-variant/60 rounded-xl text-xs py-3 px-4 outline-none focus:border-secondary"
                  >
                    <option value="APARTAMENTO">Apartamento</option>
                    <option value="CASA">Casa</option>
                    <option value="APARTAESTUDIO">Apartaestudio</option>
                    <option value="LOCAL">Local Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-2">Operación</label>
                  <select
                    name="operation"
                    value={formData.operation}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-outline-variant/60 rounded-xl text-xs py-3 px-4 outline-none focus:border-secondary"
                  >
                    <option value="VENTA">Venta</option>
                    <option value="ARRIENDO">Arriendo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-2">Habitaciones</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    placeholder="Ej. 2"
                    className="w-full bg-background border border-outline-variant/60 rounded-xl text-xs py-3 px-4 outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-2">Baños</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    placeholder="Ej. 2"
                    className="w-full bg-background border border-outline-variant/60 rounded-xl text-xs py-3 px-4 outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-2">Área (m²)</label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="Ej. 80"
                    className="w-full bg-background border border-outline-variant/60 rounded-xl text-xs py-3 px-4 outline-none focus:border-secondary"
                  />
                </div>
              </div>

              {/* Subida de Imágenes */}
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-primary uppercase">Cargar Imágenes de la Propiedad</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="block w-full text-xs text-on-surface-variant file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/5 file:text-primary hover:file:bg-primary/10 file:cursor-pointer"
                  />
                  {uploadingImage && (
                    <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  )}
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 pt-2">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative w-full h-16 rounded-xl border border-outline-variant/40 overflow-hidden group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="rounded border-outline-variant text-secondary focus:ring-secondary"
                />
                <label htmlFor="is_active" className="text-xs font-bold text-primary select-none cursor-pointer">
                  Inmueble activo (públicamente visible)
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-outline-variant text-primary hover:bg-background font-bold rounded-xl text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="flex-1 py-3 bg-secondary hover:bg-secondary/95 text-white font-bold rounded-xl text-xs transition-colors shadow-md disabled:opacity-50"
                >
                  {isEditing ? 'Guardar Cambios' : 'Consignar Propiedad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
