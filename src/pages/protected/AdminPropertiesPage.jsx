import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAllPropertiesAdmin, createProperty, updateProperty, deleteProperty, uploadPropertyImage } from '../../api/properties.api'
import { supabase } from '../../api/supabase'

const DEMO_PROPERTIES = [
  {
    title: "Apartamento Vista al Mar",
    location: "Bello Horizonte, Santa Marta",
    price: 850000000,
    price_formatted: "$850.000.000 COP",
    type: "Apartamentos",
    subtype: "Apartamento",
    operation: "Venta",
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
    description: "Descubre el epítome del lujo costero en este espectacular apartamento ubicado en la prestigiosa zona de Bello Horizonte. Con una vista panorámica inigualable del Mar Caribe, esta propiedad ha sido diseñada para maximizar la entrada de luz natural y la brisa marina. Cuenta con acabados de alta gama, pisos de mármol, y una cocina integral moderna tipo americano. El balcón terraza es el lugar perfecto para contemplar los atardeceres más hermosos de Santa Marta.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
    ],
    exclusive: true
  },
  {
    title: "Casa Oasis Tropical",
    location: "Mamatoco, Santa Marta",
    price: 1200000000,
    price_formatted: "$1.200.000.000 COP",
    type: "Casas",
    subtype: "Casa",
    operation: "Venta",
    rooms: 4,
    baths: 3,
    garages: 2,
    area: 240,
    stratum: 4,
    floor: 1,
    year: 2021,
    private_area: 220,
    furnished: false,
    pets: true,
    description: "Hermosa y amplia casa familiar ubicada en Mamatoco. Con amplias zonas verdes, piscina privada, y un diseño moderno de concepto abierto. Cuenta con excelente iluminación natural, habitaciones espaciosas con aire acondicionado, cocina de chef y un patio amplio perfecto para reuniones familiares. Ubicada en una zona residencial tranquila y segura, cerca de centros comerciales y colegios.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"
    ],
    exclusive: false
  },
  {
    title: "Penthouse El Rodadero",
    location: "El Rodadero, Santa Marta",
    price: 4500000,
    price_formatted: "$4.500.000 COP / mes",
    type: "Apartamentos",
    subtype: "Dúplex",
    operation: "Arriendo",
    rooms: 2,
    baths: 2,
    garages: 1,
    area: 95,
    stratum: 6,
    floor: 15,
    year: 2022,
    private_area: 90,
    furnished: true,
    pets: false,
    description: "Espectacular penthouse tipo dúplex en el corazón de El Rodadero. Amoblado con un estilo contemporáneo y minimalista. Disfruta de una terraza privada con jacuzzi e impresionantes vistas a la bahía de Santa Marta. Vigilancia 24/7, acceso a áreas sociales con piscina infinita y gimnasio. Ideal para estancias largas o ejecutivos que buscan comodidad y exclusividad.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
    ],
    exclusive: true
  },
  {
    title: "Apartaestudio Moderno Rodadero",
    location: "El Rodadero, Santa Marta",
    price: 1800000,
    price_formatted: "$1.800.000 COP / mes",
    type: "Apartaestudios",
    subtype: "Apartaestudio",
    operation: "Arriendo",
    rooms: 1,
    baths: 1,
    garages: 1,
    area: 45,
    stratum: 5,
    floor: 5,
    year: 2023,
    private_area: 42,
    furnished: true,
    pets: true,
    description: "Luminoso apartaestudio ideal para solteros o parejas. Totalmente amoblado y equipado con cocina integral, aire acondicionado, y balcón. El edificio cuenta con excelentes amenities: gimnasio, lavandería comunitaria, piscina y terraza panorámica. A solo tres cuadras de la playa de El Rodadero.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
    ],
    exclusive: false
  },
  {
    title: "Local Comercial Centro Histórico",
    location: "Centro Histórico, Santa Marta",
    price: 6000000,
    price_formatted: "$6.000.000 COP / mes",
    type: "Locales",
    subtype: "Hostal",
    operation: "Arriendo",
    rooms: 0,
    baths: 2,
    garages: 0,
    area: 120,
    stratum: 4,
    floor: 1,
    year: 2018,
    private_area: 115,
    furnished: false,
    pets: false,
    description: "Excelente local comercial u hostal boutique ubicado en una calle de alto tráfico peatonal en el histórico Centro de Santa Marta. Espacio abierto adaptable para restaurante, tienda o cafetería. Cuenta con dos baños adaptados, depósito y acabados de estilo colonial. Gran oportunidad para impulsar tu negocio en la zona turística más activa.",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
    ],
    exclusive: true
  },
  {
    title: "Cabaña Rústica Taganga",
    location: "Taganga, Santa Marta",
    price: 450000000,
    price_formatted: "$450.000.000 COP",
    type: "Casas",
    subtype: "Cabaña",
    operation: "Venta",
    rooms: 2,
    baths: 2,
    garages: 1,
    area: 110,
    stratum: 2,
    floor: 1,
    year: 2015,
    private_area: 100,
    furnished: true,
    pets: true,
    description: "Encantadora cabaña rústica con vista a la hermosa bahía de Taganga. Construcción ecológica que combina madera y piedra local. Ambiente pacífico, terraza con hamacas, rodeado de naturaleza. Ideal como casa de descanso, retiro vacacional o inversión para rentas turísticas de corta estancia.",
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80"
    ],
    exclusive: false
  },
  {
    title: "Casa de Playa Pozos Colorados",
    location: "Pozos Colorados, Santa Marta",
    price: 2400000000,
    price_formatted: "$2.400.000.000 COP",
    type: "Casas",
    subtype: "Casa de Playa",
    operation: "Venta",
    rooms: 5,
    baths: 5,
    garages: 3,
    area: 350,
    stratum: 6,
    floor: 1,
    year: 2020,
    private_area: 320,
    furnished: true,
    pets: true,
    description: "Lujosa casa de playa con acceso directo al mar en la exclusiva zona de Pozos Colorados. Cuenta con piscina privada frente a la playa, amplias terrazas, acabados de mármol importado, sistema de automatización y climatización central. La propiedad perfecta para disfrutar del Caribe con privacidad y el más alto nivel de confort.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    exclusive: true
  },
  {
    title: "Lote Lomas de Bello Horizonte",
    location: "Bello Horizonte, Santa Marta",
    price: 380000000,
    price_formatted: "$380.000.000 COP",
    type: "Locales",
    subtype: "Lote / Terreno",
    operation: "Venta",
    rooms: 0,
    baths: 0,
    garages: 0,
    area: 500,
    stratum: 5,
    floor: 1,
    year: 2024,
    private_area: 500,
    furnished: false,
    pets: true,
    description: "Excelente lote de terreno urbano listo para construir en la zona alta de Bello Horizonte. Vista despejada a la montaña y cercanía a las playas de los hoteles de cadena. Cuenta con acometida de servicios públicos instalados y documentación al día. Ideal para proyecto de vivienda unifamiliar o bifamiliar.",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
    ],
    exclusive: false
  }
]

export default function AdminPropertiesPage() {
  const { user } = useAuth()
  const [properties, setProperties] = useState([])
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [activeTab, setActiveTab] = useState('create') // 'create' o 'list'
  const [editingId, setEditingId] = useState(null)

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
    agent_id: '',
    images: [],
    status: 'Disponible'
  })

  const [uploading, setUploading] = useState(false)

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const list = await getAllPropertiesAdmin()
      setProperties(list)

      // Cargar agentes
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id, name, role')
        .in('role', ['AGENT', 'ADMIN'])
      
      if (userError) throw userError
      setAgents(users)

      // Inicializar agente actual por defecto
      if (users.length > 0) {
        setFormData(prev => ({ ...prev, agent_id: user?.id || users[0].id }))
      }
    } catch (err) {
      console.error(err)
      triggerToast('Error al cargar la información.')
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
    setEditingId(null)
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
      agent_id: user?.id || agents[0]?.id || '',
      images: [],
      status: 'Disponible'
    })
  }

  const handleEditClick = (p) => {
    setEditingId(p.id)
    setFormData({
      title: p.title || '',
      location: p.location || '',
      price: p.price || '',
      price_formatted: p.price_formatted || '',
      operation: p.operation || 'Venta',
      type: p.type || 'Apartamentos',
      subtype: p.subtype || 'Apartamento',
      description: p.description || '',
      rooms: p.rooms || 0,
      baths: p.baths || 0,
      garages: p.garages || 0,
      area: p.area || 0,
      stratum: p.stratum || 0,
      floor: p.floor || 0,
      year: p.year || 0,
      private_area: p.private_area || 0,
      furnished: p.furnished || false,
      pets: p.pets || false,
      exclusive: p.exclusive || false,
      agent_id: p.agent_id || user?.id || '',
      images: p.images || [],
      status: p.status || 'Disponible'
    })
    setActiveTab('create')
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
      is_active: true
    }

    if (dataToInsert.images.length === 0) {
      dataToInsert.images = ["/images/interior_apartment.png"]
    }

    try {
      if (editingId) {
        await updateProperty(editingId, dataToInsert)
        triggerToast('¡Inmueble actualizado con éxito!')
      } else {
        await createProperty(dataToInsert)
        triggerToast('¡Inmueble publicado con éxito!')
      }
      handleFormReset()
      loadData()
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
      loadData()
    } catch (err) {
      console.error(err)
      triggerToast(`Fallo al eliminar: ${err.message}`)
    }
  }

  // Siembra rápida de propiedades
  const handleSeedData = async () => {
    if (!window.confirm('Esto agregará las 8 propiedades predefinidas de prueba directamente a tu base de datos de Supabase asignadas a tu cuenta. ¿Deseas continuar?')) return
    triggerToast('Sembrando datos en Supabase...')
    
    try {
      const formatted = DEMO_PROPERTIES.map(p => ({
        ...p,
        agent_id: user?.id
      }))

      const { error } = await supabase
        .from('properties')
        .insert(formatted)

      if (error) throw error

      triggerToast('¡Base de datos Supabase sembrada con 8 propiedades!')
      loadData()
      setActiveTab('list')
    } catch (err) {
      console.error(err)
      triggerToast(`Error al sembrar datos: ${err.message}`)
    }
  }

  return (
    <div className="max-w-6xl w-full mx-auto p-6 flex flex-col justify-center text-left">
      
      {/* 2. DASHBOARD VIEW */}
      <section className="space-y-8 py-6">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant pb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">Gestión de Inmuebles</h1>
            <p className="text-sm text-on-surface-variant">Añade, edita o elimina propiedades de tu portafolio de Santa Marta.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleSeedData}
              className="bg-secondary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center gap-2 border border-secondary"
            >
              <span className="material-symbols-outlined text-[20px]">database</span>
              Sembrar 8 propiedades demo
            </button>
          </div>
        </div>

        {/* Tab Selectors */}
        <div className="flex gap-4 border-b border-outline-variant select-none">
          <button 
            onClick={() => setActiveTab('create')}
            className={`pb-3 font-semibold text-sm transition-all outline-none ${activeTab === 'create' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-primary'}`}
          >
            {editingId ? 'Editar Propiedad' : 'Crear Nueva Propiedad'}
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`pb-3 font-semibold text-sm transition-all outline-none ${activeTab === 'list' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-primary'}`}
          >
            Ver Propiedades Activas ({properties.length})
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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1">Tipo Negocio</label>
                        <select 
                          id="prop-operation"
                          value={formData.operation}
                          onChange={handleInputChange}
                          className="w-full border border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary outline-none"
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
                          className="w-full border border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary outline-none"
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
                          className="w-full border border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary outline-none"
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
                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1">Estado Inmueble</label>
                        <select 
                          id="prop-status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full border border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary outline-none"
                        >
                          <option value="Disponible">Disponible</option>
                          <option value="Vendido">Vendido</option>
                          <option value="Arrendado">Arrendado</option>
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

                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">Asignar Agente / Asesor</label>
                      <select 
                        id="prop-agent-id"
                        value={formData.agent_id}
                        onChange={handleInputChange}
                        className="w-full border-outline-variant rounded-xl text-sm p-3 focus:ring-primary focus:border-primary outline-none border"
                      >
                        {agents.map(ag => (
                          <option key={ag.id} value={ag.id}>{ag.name} ({ag.role})</option>
                        ))}
                      </select>
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
                    {editingId ? 'Actualizar Propiedad' : 'Guardar Propiedad'}
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
                          No hay propiedades activas en tu base de datos Supabase. ¡Usa el formulario para añadir una o haz clic en Sembrar!
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
                            <td className="p-4 text-center flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleEditClick(p)}
                                className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-xl transition-all shadow-sm border border-blue-200"
                                title="Editar propiedad"
                              >
                                <span className="material-symbols-outlined text-[18px] block">edit</span>
                              </button>
                              <button 
                                onClick={() => handleDelete(p.id)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition-all shadow-sm border border-red-200"
                                title="Eliminar propiedad"
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
