import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllPropertiesAdmin, createProperty, updateProperty, deleteProperty, uploadPropertyImage } from '../../api/properties.api'
import { supabase } from '../../api/supabase'

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState([])
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Control de Formulario / Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  // Datos del Formulario
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
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const props = await getAllPropertiesAdmin()
      setProperties(props)

      // Cargar agentes y admins para asignarlos
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id, name, role')
        .in('role', ['AGENT', 'ADMIN'])

      if (userError) throw userError
      setAgents(users)

      // Setear primer agente por defecto en el formulario
      if (users.length > 0) {
        setFormData(prev => ({ ...prev, agent_id: users[0].id }))
      }
    } catch (err) {
      console.error(err)
      setError('Error al cargar la información de propiedades/agentes.')
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
      setSuccess('Imágenes subidas con éxito.')
    } catch (err) {
      console.error(err)
      setError('Fallo al subir imágenes al servidor de Supabase Storage.')
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
      agent_id: agents[0]?.id || '',
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
      agent_id: prop.agent_id || '',
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
        setSuccess('Propiedad actualizada exitosamente.')
      } else {
        await createProperty(formattedData)
        setSuccess('Propiedad creada exitosamente.')
      }
      setIsModalOpen(false)
      loadData()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error al guardar la propiedad.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar permanentemente esta propiedad? Esta acción no se puede deshacer.')) return
    setError('')
    setSuccess('')
    try {
      await deleteProperty(id)
      setSuccess('Propiedad eliminada correctamente.')
      loadData()
    } catch (err) {
      console.error(err)
      setError('Fallo al eliminar propiedad. Solo el rol ADMIN puede eliminar.')
    }
  }

  return (
    <div className="max-w-container-max mx-auto px-6 py-12 space-y-8 min-h-screen">
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/20 pb-6">
        <div>
          <Link 
            to="/admin" 
            className="inline-flex items-center gap-1 text-xs text-outline hover:text-primary font-bold mb-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Volver al Panel
          </Link>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-primary">
            Gestión de Inmuebles
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Administra todo el portafolio de CR7 Inmobiliaria.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="py-3 px-5 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Nuevo Inmueble
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

      {/* Listado de Propiedades */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-secondary rounded-full animate-spin"></div>
          <p className="text-xs text-on-surface-variant font-bold mt-4">Cargando portafolio administrativo...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-outline-variant/60 rounded-3xl bg-surface/40 p-8 flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-outline mb-2">house</span>
          <p className="font-bold text-primary">No hay inmuebles en el sistema</p>
          <p className="text-xs text-on-surface-variant mt-1">Haz clic en "Nuevo Inmueble" para comenzar.</p>
        </div>
      ) : (
        <div className="bg-white border border-outline-variant/30 rounded-3xl overflow-hidden shadow-soft-coastal">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-primary text-white uppercase tracking-wider font-bold">
                  <th className="p-4 rounded-tl-3xl">Imagen</th>
                  <th className="p-4">Título</th>
                  <th className="p-4">Zona</th>
                  <th className="p-4">Precio</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Operación</th>
                  <th className="p-4">Asesor</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 rounded-tr-3xl text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-medium text-primary">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-background/40 transition-colors">
                    <td className="p-4">
                      <img 
                        src={prop.images && prop.images[0] ? prop.images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=100&q=80'} 
                        alt="" 
                        className="w-14 h-10 object-cover rounded-lg border border-outline-variant/30 bg-slate-100"
                      />
                    </td>
                    <td className="p-4 font-bold">{prop.title}</td>
                    <td className="p-4">{prop.zone}</td>
                    <td className="p-4">$ {parseFloat(prop.price).toLocaleString('es-CO')}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full font-bold uppercase text-[9px]">
                        {prop.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 bg-secondary/15 text-secondary rounded-full font-bold uppercase text-[9px]">
                        {prop.operation}
                      </span>
                    </td>
                    <td className="p-4 text-on-surface-variant">{prop.profiles?.name || 'No asignado'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] ${
                        prop.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {prop.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(prop)}
                          className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <span className="material-symbols-outlined text-sm block">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(prop.id)}
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <span className="material-symbols-outlined text-sm block">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL DE AGREGAR / EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative my-8">
            {/* Cerrar */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-outline hover:text-primary"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <h2 className="font-display font-extrabold text-xl md:text-2xl text-primary mb-6">
              {isEditing ? 'Editar Inmueble' : 'Añadir Nuevo Inmueble'}
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
                    placeholder="Ej. Apartamento Exclusivo con vista al mar"
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
                    placeholder="Escribe los detalles específicos del inmueble"
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
                    placeholder="Ej. 450000000"
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
                    placeholder="Ej. El Rodadero"
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
                    placeholder="Ej. 3"
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
                    placeholder="Ej. 95"
                    className="w-full bg-background border border-outline-variant/60 rounded-xl text-xs py-3 px-4 outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-2">Asignar Asesor / Agente</label>
                  <select
                    name="agent_id"
                    value={formData.agent_id}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-outline-variant/60 rounded-xl text-xs py-3 px-4 outline-none focus:border-secondary"
                  >
                    {agents.map(ag => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name} ({ag.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subida de Imágenes */}
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-primary uppercase">Cargar Imágenes a Supabase Storage</label>
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

                {/* Vista previa de imágenes cargadas */}
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

              {/* Checkbox Activo */}
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
                  Inmueble visible públicamente (Activo)
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
                  {isEditing ? 'Guardar Cambios' : 'Añadir Propiedad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
