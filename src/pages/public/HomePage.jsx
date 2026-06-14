import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { getProperties } from '../../api/properties.api'

export default function HomePage() {
  const location = useLocation()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filtros
  const [filters, setFilters] = useState({
    type: 'TODOS',
    operation: 'TODOS',
    bedrooms: 'TODOS',
    zone: ''
  })

  // Datos del Formulario Vender (WhatsApp)
  const [sellForm, setSellForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'APARTAMENTO',
    zone: '',
    message: ''
  })

  // Cargar propiedades destacadas
  useEffect(() => {
    fetchFeaturedProperties()
  }, [])

  // Manejar el scroll automático si viene de otra página
  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [location])

  const fetchFeaturedProperties = async () => {
    setLoading(true)
    setError('')
    try {
      // Cargamos todas las disponibles inicialmente, luego filtramos
      const data = await getProperties()
      setProperties(data.slice(0, 6)) // Mostrar solo los primeros 6 como destacados
    } catch (err) {
      console.error(err)
      setError('No se pudieron cargar las propiedades destacadas.')
    } finally {
      setLoading(false)
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    // Redirigir a la página de propiedades con los filtros en el state
    // Para que PropertiesPage cargue aplicando este filtro
  }

  const handleSellFormChange = (e) => {
    const { name, value } = e.target
    setSellForm(prev => ({ ...prev, [name]: value }))
  }

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault()
    // Construir mensaje detallado para enviar por WhatsApp
    const messageText = `¡Hola CR7 Inmobiliaria! 👋\nMe gustaría consignar mi propiedad para la venta/arriendo. Aquí están los detalles:\n\n` +
      `👤 *Nombre:* ${sellForm.name}\n` +
      `📧 *Email:* ${sellForm.email}\n` +
      `📞 *Teléfono:* ${sellForm.phone}\n` +
      `🏠 *Tipo de Inmueble:* ${sellForm.type}\n` +
      `📍 *Zona/Ubicación:* ${sellForm.zone}\n` +
      `📝 *Detalles Adicionales:* ${sellForm.message}`

    const encodedText = encodeURIComponent(messageText)
    // Usamos el número de WhatsApp oficial configurado
    const whatsappUrl = `https://wa.me/573001234567?text=${encodedText}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center bg-primary text-white overflow-hidden">
        {/* Decoraciones de Fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#006c47,transparent_60%)] opacity-30"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary rounded-full filter blur-[120px] opacity-20"></div>

        <div className="max-w-container-max mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 py-12">
          {/* Texto Principal */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/20 border border-secondary/30 rounded-full text-secondary-fixed text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-ping"></span>
              Propiedades Exclusivas en Santa Marta
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1]">
              Tu hogar soñado frente al <span className="text-secondary-fixed">Mar Caribe</span>
            </h1>
            <p className="text-on-primary-container text-base sm:text-lg max-w-xl leading-relaxed">
              Encuentra los apartamentos, casas y locales más exclusivos en Santa Marta, El Rodadero y Pozos Colorados con seguridad garantizada y gestión profesional.
            </p>

            {/* Buscador Integrado en Hero */}
            <div className="bg-glass border border-white/10 p-4 rounded-2xl shadow-2xl max-w-2xl text-on-surface">
              <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-1">Tipo</label>
                  <select 
                    name="type" 
                    value={filters.type} 
                    onChange={handleFilterChange}
                    className="w-full bg-background border border-outline-variant/60 rounded-lg text-xs py-2 px-2 outline-none focus:border-secondary"
                  >
                    <option value="TODOS">Todos los Tipos</option>
                    <option value="APARTAMENTO">Apartamento</option>
                    <option value="CASA">Casa</option>
                    <option value="APARTAESTUDIO">Apartaestudio</option>
                    <option value="LOCAL">Local Comercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-1">Operación</label>
                  <select 
                    name="operation" 
                    value={filters.operation} 
                    onChange={handleFilterChange}
                    className="w-full bg-background border border-outline-variant/60 rounded-lg text-xs py-2 px-2 outline-none focus:border-secondary"
                  >
                    <option value="TODOS">Venta o Arriendo</option>
                    <option value="VENTA">En Venta</option>
                    <option value="ARRIENDO">En Arriendo</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Link 
                    to="/propiedades" 
                    state={{ filters }}
                    className="w-full py-2 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <span className="material-symbols-outlined text-sm">search</span>
                    Buscar Propiedades
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Imagen / Ilustración Destacada en Hero */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative p-3 bg-white/5 border border-white/10 rounded-3xl shadow-soft-coastal overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80" 
                alt="Penthouse Santa Marta" 
                className="w-full h-[450px] object-cover rounded-2xl"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-glass/95 backdrop-blur-md p-4 rounded-xl border border-white/20 text-on-surface">
                <p className="text-xs font-bold text-secondary uppercase">Destacado</p>
                <h3 className="font-display font-bold text-sm text-primary">Penthouse Pozos Colorados</h3>
                <p className="text-xs text-on-surface-variant">Vista de 360 grados al océano</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROPIEDADES DESTACADAS */}
      <section className="max-w-container-max mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">Catálogo Seleccionado</span>
            <h2 className="font-display font-extrabold text-3xl text-primary mt-1">Inmuebles Destacados</h2>
          </div>
          <Link 
            to="/propiedades" 
            className="inline-flex items-center gap-1.5 text-secondary hover:text-secondary/80 font-bold text-sm transition-all"
          >
            Ver todas las propiedades
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Loader o Error */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-secondary rounded-full animate-spin"></div>
            <p className="text-xs text-on-surface-variant font-medium mt-4">Cargando propiedades exclusivas...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-red-600 font-medium text-sm">
            {error}
          </div>
        ) : properties.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-outline-variant/60 rounded-2xl bg-surface/40 p-8">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">house</span>
            <p className="text-sm font-semibold text-primary">No hay inmuebles disponibles en este momento</p>
            <p className="text-xs text-on-surface-variant mt-1">Pronto agregaremos nuevas opciones exclusivas para ti.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <div 
                key={prop.id}
                className="bg-white border border-outline-variant/30 rounded-2xl overflow-hidden shadow-soft-coastal hover:shadow-xl transition-all group"
              >
                {/* Imagen del Inmueble */}
                <div className="relative h-60 bg-slate-100 overflow-hidden">
                  <img 
                    src={prop.images && prop.images[0] ? prop.images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80'} 
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-primary text-white rounded-full uppercase tracking-wider">
                      {prop.operation}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-secondary text-white rounded-full uppercase tracking-wider">
                      {prop.type}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-primary text-white px-3 py-1.5 rounded-lg font-bold text-sm">
                    $ {parseFloat(prop.price).toLocaleString('es-CO')} COP
                  </div>
                </div>

                {/* Detalles del Inmueble */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs text-secondary font-bold inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {prop.zone}
                    </span>
                    <h3 className="font-display font-bold text-lg text-primary line-clamp-1 group-hover:text-secondary transition-colors">
                      {prop.title}
                    </h3>
                  </div>

                  {/* Características Rápidas */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-outline-variant/20 text-xs text-on-surface-variant font-medium text-center">
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-base text-primary mb-0.5">bed</span>
                      <span>{prop.bedrooms} Hab</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-base text-primary mb-0.5">bathtub</span>
                      <span>{prop.bathrooms} Baños</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-base text-primary mb-0.5">square_foot</span>
                      <span>{prop.area} m²</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-on-surface-variant font-medium">
                      Por: <span className="font-semibold text-primary">{prop.profiles?.name || 'Agente CR7'}</span>
                    </span>
                    <Link 
                      to={`/propiedad/${prop.id}`}
                      className="text-xs font-bold text-secondary hover:underline flex items-center gap-0.5"
                    >
                      Ver Detalles
                      <span className="material-symbols-outlined text-xs">arrow_forward_ios</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. SECCIÓN VENDER INMUEBLE (WhatsApp Form) */}
      <section id="vender" className="bg-primary text-white py-20 relative overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#006c47,transparent_60%)] opacity-30"></div>
        <div className="max-w-container-max mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-secondary-fixed uppercase tracking-widest">Consigna tu Inmueble</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">
              ¿Quieres vender o arrendar tu propiedad?
            </h2>
            <p className="text-on-primary-container text-sm leading-relaxed">
              Completa el formulario con la información básica de tu propiedad y nos pondremos en contacto contigo de forma inmediata a través de WhatsApp para iniciar el proceso de promoción.
            </p>
            <div className="space-y-4 pt-4 text-sm text-on-primary-container">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary-fixed">check_circle</span>
                <span>Promoción en nuestras plataformas exclusivas.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary-fixed">check_circle</span>
                <span>Fotografía profesional y visitas virtuales.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary-fixed">check_circle</span>
                <span>Asesoría legal y contractual completa.</span>
              </div>
            </div>
          </div>

          {/* Formulario que abre WhatsApp */}
          <div className="lg:col-span-7">
            <div className="bg-white text-on-surface p-8 rounded-3xl border border-white/10 shadow-2xl">
              <form onSubmit={handleWhatsAppSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-primary uppercase mb-2">Nombre Completo</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={sellForm.name}
                    onChange={handleSellFormChange}
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-background border border-outline-variant/60 rounded-xl text-sm py-3 px-4 outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase mb-2">Correo Electrónico</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={sellForm.email}
                    onChange={handleSellFormChange}
                    placeholder="correo@ejemplo.com"
                    className="w-full bg-background border border-outline-variant/60 rounded-xl text-sm py-3 px-4 outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase mb-2">Número de Teléfono</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={sellForm.phone}
                    onChange={handleSellFormChange}
                    placeholder="Ej. +57 300 123 4567"
                    className="w-full bg-background border border-outline-variant/60 rounded-xl text-sm py-3 px-4 outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase mb-2">Tipo de Propiedad</label>
                  <select 
                    name="type"
                    value={sellForm.type}
                    onChange={handleSellFormChange}
                    className="w-full bg-background border border-outline-variant/60 rounded-xl text-sm py-3 px-4 outline-none focus:border-secondary"
                  >
                    <option value="APARTAMENTO">Apartamento</option>
                    <option value="CASA">Casa</option>
                    <option value="APARTAESTUDIO">Apartaestudio</option>
                    <option value="LOCAL">Local Comercial</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-primary uppercase mb-2">Ubicación / Zona del Inmueble</label>
                  <input 
                    type="text" 
                    name="zone"
                    required
                    value={sellForm.zone}
                    onChange={handleSellFormChange}
                    placeholder="Ej. Pozos Colorados, Santa Marta"
                    className="w-full bg-background border border-outline-variant/60 rounded-xl text-sm py-3 px-4 outline-none focus:border-secondary"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-primary uppercase mb-2">Mensaje o Detalles Adicionales</label>
                  <textarea 
                    name="message"
                    rows="3"
                    value={sellForm.message}
                    onChange={handleSellFormChange}
                    placeholder="Escribe características de tu inmueble (habitaciones, estado, precio sugerido, etc.)"
                    className="w-full bg-background border border-outline-variant/60 rounded-xl text-sm py-3 px-4 outline-none focus:border-secondary resize-none"
                  ></textarea>
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button 
                    type="submit"
                    className="w-full py-4 bg-secondary hover:bg-secondary/95 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2.5 text-sm"
                  >
                    {/* Quitamos el botón verde "ofertar mi inmueble" y pusimos este por WhatsApp */}
                    <span className="material-symbols-outlined text-lg">chat</span>
                    <span>Enviar información a WhatsApp</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CONTACT DIRECT */}
      <section id="contacto" className="max-w-container-max mx-auto px-6 scroll-mt-20">
        <div className="bg-glass border border-outline-variant/30 rounded-3xl p-8 md:p-12 shadow-soft-coastal grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">¿Tienes dudas?</span>
            <h2 className="font-display font-extrabold text-3xl text-primary">Contáctanos Hoy Mismo</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Nuestro equipo de expertos está listo para guiarte en todo el proceso de compra, venta o alquiler de inmuebles en Santa Marta. Ofrecemos asesoramiento personalizado sin compromisos.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 text-primary">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">phone_in_talk</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium">Llámanos o escríbenos</p>
                  <p className="text-sm font-bold">+57 (300) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-primary">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">mail</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium">Correo electrónico</p>
                  <p className="text-sm font-bold">contacto@cr7inmobiliaria.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 flex flex-col justify-center bg-primary/5 p-6 rounded-2xl border border-primary/10 text-center">
            <span className="material-symbols-outlined text-5xl text-secondary mb-4">support_agent</span>
            <h3 className="font-display font-bold text-lg text-primary mb-2">Atención al Cliente por WhatsApp</h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto mb-6">
              ¿Quieres agendar una cita para visitar alguno de nuestros inmuebles? Escríbenos directamente y un asesor te atenderá al instante.
            </p>
            <a 
              href="https://wa.me/573001234567?text=Hola%20CR7%20Inmobiliaria,%20necesito%20asesoría%20sobre%20sus%20propiedades."
              target="_blank"
              rel="noreferrer"
              className="py-3 px-6 bg-secondary hover:bg-secondary/95 text-white font-bold rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2 max-w-xs mx-auto text-sm"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              Chatea con nosotros
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
