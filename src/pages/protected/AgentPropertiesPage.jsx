import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAgentProperties, createProperty, deleteProperty, uploadPropertyImage } from '../../api/properties.api'
import { supabase } from '../../api/supabase'

export default function AgentPropertiesPage() {
  const { user } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [activeTab, setActiveTab] = useState('create') // 'create' o 'list'

  // Formulario
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    price_formatted: '',
    operation: 'Venta',
    type: 'Apartamentos',
    subtype: 'Apartamento',
    description: '',
    rooms: 3,
    baths: 2,
    garages: 1,
    area: 115,
    stratum: 6,
    floor: 12,
    year: 2023,
    private_area: 108,
    furnished: false,
    pets: true,
    exclusive: false,
    images: []
  })

  const [uploading, setUploading] = useState(false)

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  useEffect(() => {
    if (user?.id) {
      loadProperties()
    }
  }, [user])

  const loadProperties = async () => {
    setLoading(true)
    try {
      const list = await getAgentProperties(user.id)
      setProperties(list)
    } catch (err) {
      console.error(err)
      triggerToast('Error al obtener tus propiedades.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target
    const name = id.replace('prop-', '').replace('-', '_')
    const val = type === 'checkbox' ? checked : value
    setFormData(prev => ({ ...prev, [name]: val }))
  }

  const handleFileChange = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
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
      triggerToast('Imágenes subidas con éxito.')
    } catch (err) {
      console.error(err)
      triggerToast('Error al subir imágenes.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleFormReset = () => {
    setFormData({
      title: '',
      location: '',
      price: '',
      price_formatted: '',
      operation: 'Venta',
      type: 'Apartamentos',
      subtype: 'Apartamento',
      description: '',
      rooms: 3,
      baths: 2,
      garages: 1,
      area: 115,
      stratum: 6,
      floor: 12,
      year: 2023,
      private_area: 108,
      furnished: false,
      pets: true,
      exclusive: false,
      images: []
    })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    const dataToInsert = {
      ...formData,
      price: parseFloat(formData.price),
      rooms: parseInt(formData.rooms, 10),
      baths: parseInt(formData.baths, 10),
      garages: parseInt(formData.garages, 10),
      area: parseFloat(formData.area),
      stratum: parseInt(formData.stratum, 10),
      floor: parseInt(formData.floor, 10),
      year: parseInt(formData.year, 10),
      private_area: parseFloat(formData.private_area),
      agent_id: user.id, // ID del agente asignado automáticamente
      is_active: true
    }

    if (dataToInsert.images.length === 0) {
      dataToInsert.images = ["/images/interior_apartment.png"]
    }

    try {
      await createProperty(dataToInsert)
      triggerToast('¡Inmueble publicado con éxito en tu catálogo!')
      handleFormReset()
      loadProperties()
      setActiveTab('list')
    } catch (err) {
      console.error(err)
      triggerToast(`Error al guardar: ${err.message}`)
    }
  }

  const handleDelete = async (propId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.')) return
    try {
      await deleteProperty(propId)
      triggerToast('Propiedad eliminada correctamente.')
      loadProperties()
    } catch (err) {
      console.error(err)
      triggerToast(`Fallo al eliminar: ${err.message}`)
    }
  }

  return (
    <div className="max-w-6xl w-full mx-auto p-6 flex flex-col justify-center text-left">
      
      {/* Agent Welcome Header */}
      <section className="space-y-8 py-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant pb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">Mis Propiedades Consignadas</h1>
            <p className="text-sm text-on-surface-variant">Publica y administra tus inmuebles en catálogo.</p>
          </div>
          <div className="bg-primary/5 border border-primary/10 rounded-xl px-4 py-2 text-xs font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-sm">badge</span>
            Panel de Agente Autorizado
          </div>
        </div>

        {/* Tab Selectors */}
        <div className="flex gap-4 border-b border-outline-variant select-none">
          <button 
            onClick={() => setActiveTab('create')}
            className={`pb-3 font-semibold text-sm transition-all outline-none ${activeTab === 'create' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-primary'}`}
          >
            Crear Nueva Propiedad
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`pb-3 font-semibold text-sm transition-all outline-none ${activeTab === 'list' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-primary'}`}
          >
            Ver Mis Propiedades ({properties.length})
          </button>
        </div>

        {/* Tab Content 1: CREATE FORM */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft-coastal border border-outline-variant/60">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Columna Izquierda */}
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-primary border-b pb-2">Información Principal</h3>
                    
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">Título de la propiedad</label>
                      <input 
                        id="prop-title" 
                        type="text" 
                        required 
                        placeholder="Ej: Apartamento Vista al Mar - Bello Horizonte" 
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary outline-none border"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">Ubicación / Dirección</label>
                      <input 
                        id="prop-location" 
                        type="text" 
                        required 
                        placeholder="Ej: Bello Horizonte, Santa Marta" 
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary outline-none border"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1">Precio (COP)</label>
                        <input 
                          id="prop-price" 
                          type="number" 
                          required 
                          placeholder="Ej: 850000000" 
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary outline-none border"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1">Precio Formateado</label>
                        <input 
                          id="prop-price-formatted" 
                          type="text" 
                          required 
                          placeholder="Ej: $850.000.000 COP" 
                          value={formData.price_formatted}
                          onChange={handleInputChange}
                          className="w-full border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary outline-none border"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1">Tipo Negocio</label>
                        <select 
                          id="prop-operation"
                          value={formData.operation}
                          onChange={handleInputChange}
                          className="w-full border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary outline-none border"
                        >
                          <option value="Venta">Venta</option>
                          <option value="Arriendo">Arriendo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1">Categoría Macro</label>
                        <select 
                          id="prop-type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="w-full border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary outline-none border"
                        >
                          <option value="Apartaestudios">Apartaestudios</option>
                          <option value="Apartamentos">Apartamentos</option>
                          <option value="Casas">Casas</option>
                          <option value="Locales">Locales</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1">Subtipo Inmueble</label>
                        <select 
                          id="prop-subtype"
                          value={formData.subtype}
                          onChange={handleInputChange}
                          className="w-full border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary outline-none border"
                        >
                          <option value="Apartaestudio">Apartaestudio</option>
                          <option value="Apartamento">Apartamento</option>
                          <option value="Cabaña">Cabaña</option>
                          <option value="Campos, Chacras y Quintas">Campos, Chacras y Quintas</option>
                          <option value="Casa">Casa</option>
                          <option value="Casa de Playa">Casa de Playa</option>
                          <option value="Dúplex">Dúplex</option>
                          <option value="Hostal">Hostal</option>
                          <option value="Lote / Terreno">Lote / Terreno</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">Descripción Completa</label>
                      <textarea 
                        id="prop-description" 
                        required 
                        rows="4" 
                        placeholder="Describe los detalles de la propiedad, vistas, acabados..." 
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary resize-none outline-none border"
                      ></textarea>
                    </div>
                  </div>

                  {/* Columna Derecha */}
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-primary border-b pb-2">Características y Detalles</h3>
                    
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1">Habitaciones</label>
                        <input 
                          id="prop-rooms" 
                          type="number" 
                          required 
                          value={formData.rooms}
                          onChange={handleInputChange}
                          className="w-full border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary border outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1">Baños</label>
                        <input 
                          id="prop-baths" 
                          type="number" 
                          required 
                          value={formData.baths}
                          onChange={handleInputChange}
                          className="w-full border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary border outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1">Garajes</label>
                        <input 
                          id="prop-garages" 
                          type="number" 
                          required 
                          value={formData.garages}
                          onChange={handleInputChange}
                          className="w-full border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary border outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1">Área m²</label>
                        <input 
                          id="prop-area" 
                          type="number" 
                          required 
                          value={formData.area}
                          onChange={handleInputChange}
                          className="w-full border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary border outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1">Estrato</label>
                        <input 
                          id="prop-stratum" 
                          type="number" 
                          required 
                          value={formData.stratum}
                          onChange={handleInputChange}
                          className="w-full border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary border outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1">Piso</label>
                        <input 
                          id="prop-floor" 
                          type="number" 
                          required 
                          value={formData.floor}
                          onChange={handleInputChange}
                          className="w-full border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary border outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1">Año</label>
                        <input 
                          id="prop-year" 
                          type="number" 
                          required 
                          value={formData.year}
                          onChange={handleInputChange}
                          className="w-full border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary border outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1">Área Privada</label>
                        <input 
                          id="prop-private-area" 
                          type="number" 
                          required 
                          value={formData.private_area}
                          onChange={handleInputChange}
                          className="w-full border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary border outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          id="prop-furnished" 
                          type="checkbox" 
                          checked={formData.furnished}
                          onChange={handleInputChange}
                          className="rounded text-secondary focus:ring-secondary border-outline-variant w-5 h-5 border"
                        />
                        <span className="text-xs font-semibold text-primary">Amoblado</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          id="prop-pets" 
                          type="checkbox" 
                          checked={formData.pets}
                          onChange={handleInputChange}
                          className="rounded text-secondary focus:ring-secondary border-outline-variant w-5 h-5 border"
                        />
                        <span className="text-xs font-semibold text-primary">Admite Mascotas</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          id="prop-exclusive" 
                          type="checkbox" 
                          checked={formData.exclusive}
                          onChange={handleInputChange}
                          className="rounded text-secondary focus:ring-secondary border-outline-variant w-5 h-5 border"
                        />
                        <span className="text-xs font-semibold text-primary">Exclusivo (Badge)</span>
                      </label>
                    </div>

                    <h3 className="font-display font-bold text-primary border-b pb-2 pt-4">Imágenes de la Propiedad</h3>
                    <div className="border-2 border-dashed border-outline-variant rounded-2xl p-6 text-center hover:bg-surface-container-low transition-colors cursor-pointer relative">
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                      <span className="material-symbols-outlined text-4xl text-primary mb-2">upload_file</span>
                      <p className="text-sm font-semibold text-primary">
                        {uploading ? 'Subiendo imágenes...' : 'Arrastra las fotos aquí o haz clic para subir'}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1">Soporta PNG, JPG y JPEG.</p>
                    </div>

                    {/* Previsualización de fotos */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 py-2">
                        {formData.images.map((imgUrl, idx) => (
                          <div key={idx} className="relative group rounded-lg overflow-hidden border shadow-sm h-16">
                            <img className="w-full h-full object-cover" src={imgUrl} alt="Preview"/>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                            >
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                <div className="border-t pt-6 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={handleFormReset}
                    className="border border-outline-variant text-on-surface-variant px-6 py-3 rounded-xl font-bold text-sm hover:bg-surface-container-low transition-colors"
                  >
                    Limpiar
                  </button>
                  <button 
                    type="submit" 
                    disabled={uploading}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:opacity-95 transition-all shadow-md flex items-center gap-2 border border-primary disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[20px]">save</span>
                    Guardar Propiedad
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* Tab Content 2: LIST VIEW */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl overflow-hidden shadow-soft-coastal border border-outline-variant/60">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface-container-low text-primary border-b border-outline-variant font-bold uppercase tracking-wider text-left">
                      <th className="p-4">Imagen</th>
                      <th className="p-4">Título</th>
                      <th className="p-4">Ubicación</th>
                      <th className="p-4">Precio</th>
                      <th className="p-4">Tipo</th>
                      <th className="p-4">Operación</th>
                      <th className="p-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 font-medium text-primary">
                    {properties.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-on-surface-variant">
                          No tienes propiedades activas registradas en Supabase.
                        </td>
                      </tr>
                    ) : (
                      properties.map((p) => {
                        const imgSrc = (p.images && p.images.length > 0) ? p.images[0] : '/images/interior_apartment.png'
                        const formattedPrice = p.price_formatted || p.priceFormatted || `$ ${parseFloat(p.price).toLocaleString('es-CO')} COP`

                        return (
                          <tr key={p.id} className="hover:bg-surface-container-lowest transition-colors border-b border-outline-variant/10">
                            <td className="p-4">
                              <img 
                                className="w-16 h-12 object-cover rounded-lg border shadow-sm bg-slate-100" 
                                src={imgSrc} 
                                alt={p.title} 
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=100&q=80' }}
                              />
                            </td>
                            <td className="p-4 font-bold text-primary max-w-[200px] truncate">{p.title}</td>
                            <td className="p-4 text-on-surface-variant">{p.location}</td>
                            <td className="p-4 font-semibold text-secondary">{formattedPrice}</td>
                            <td className="p-4">
                              <span className="bg-surface-container px-2.5 py-1 rounded-full border text-[9px] font-bold">
                                {p.subtype || p.type}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full text-[9px] font-bold">
                                {p.operation}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <button 
                                onClick={() => handleDelete(p.id)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition-all shadow-sm border border-red-200"
                              >
                                <span className="material-symbols-outlined text-[18px] block">delete</span>
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </section>

      {/* Toast Notification Container */}
      {showToast && (
        <div id="toast-container" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          <div className="flex items-center gap-3 bg-surface/90 backdrop-blur-md text-primary px-6 py-4 rounded-xl shadow-soft-coastal border border-outline-variant max-w-sm pointer-events-auto transform transition-all duration-300">
            <span className="material-symbols-outlined text-secondary font-bold">info</span>
            <span className="font-body-sm font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  )
}
