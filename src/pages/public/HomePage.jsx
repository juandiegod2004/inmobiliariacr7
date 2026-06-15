import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getProperties } from '../../api/properties.api'
import { useAuth } from '../../context/AuthContext'

export default function HomePage() {
  const { settings } = useAuth()
  const location = useLocation()
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filtros del buscador Hero
  const [searchForm, setSearchForm] = useState({
    businessType: 'todos',
    propertyType: 'todos',
    zone: ''
  })

  // Filtros rápidos del catálogo ("Todos", "Venta", "Arriendo")
  const [currentFilter, setCurrentFilter] = useState('Todos')
  const [showLimit, setShowLimit] = useState(3)

  // Formulario de Valoración
  const [valuationForm, setValuationForm] = useState({
    name: '',
    phone: '',
    type: 'Apartamento',
    zone: ''
  })

  // Carga de propiedades al montar
  useEffect(() => {
    fetchActiveProperties()
  }, [])

  // Desplazamiento suave de secciones si viene redirigido
  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 150)
      }
    }
  }, [location])

  // Animación Scroll Reveal usando IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
        }
      })
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    })

    const elements = document.querySelectorAll('.reveal')
    elements.forEach(el => observer.observe(el))

    return () => {
      elements.forEach(el => observer.unobserve(el))
    }
  }, [filteredProperties, loading])

  const fetchActiveProperties = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getProperties()
      setProperties(data)
      setFilteredProperties(data)
    } catch (err) {
      console.error(err)
      setError('Error al obtener propiedades. Por favor ejecuta el SQL en tu consola de Supabase.')
    } finally {
      setLoading(false)
    }
  }

  // Filtros rápidos de pestaña ("Todos", "Venta", "Arriendo")
  const handleFilterClick = (filterName) => {
    setCurrentFilter(filterName)
    setShowLimit(3) // Resetear límite a 3 al cambiar de pestaña

    if (filterName === 'Todos') {
      setFilteredProperties(properties)
    } else {
      setFilteredProperties(properties.filter(p => p.operation === filterName))
    }
  }

  // Búsqueda desde el Hero
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    let filtered = properties

    if (searchForm.businessType !== 'todos') {
      filtered = filtered.filter(p => p.operation === searchForm.businessType)
    }

    if (searchForm.propertyType !== 'todos') {
      filtered = filtered.filter(p => p.subtype === searchForm.propertyType)
    }

    if (searchForm.zone.trim() !== '') {
      const searchWord = searchForm.zone.toLowerCase().trim()
      filtered = filtered.filter(p => p.location && p.location.toLowerCase().includes(searchWord))
    }

    setFilteredProperties(filtered)

    // Hacer scroll de forma fluida a la sección de propiedades destacadas
    const featuredSection = document.getElementById('featured')
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Envío del formulario de valoración gratuita por WhatsApp
  const handleValuationSubmit = (e) => {
    e.preventDefault()
    if (!valuationForm.name || !valuationForm.phone) {
      alert('Por favor, ingresa al menos tu nombre y número de teléfono.')
      return
    }

    const message = `Hola CR7 Inmobiliaria, me gustaría solicitar una valoración gratuita de mi inmueble. Aquí están mis detalles:\n\n` +
                    `• Nombre: ${valuationForm.name}\n` +
                    `• Teléfono: ${valuationForm.phone}\n` +
                    `• Tipo de Inmueble: ${valuationForm.type}\n` +
                    `• Zona/Barrio: ${valuationForm.zone || 'No especificada'}`

    const encoded = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${settings?.phone || '573002510313'}?text=${encoded}`
    window.open(whatsappUrl, '_blank')
  }

  const propertiesToRender = filteredProperties.slice(0, showLimit)

  return (
    <div className="space-y-0 selection:bg-secondary-container selection:text-on-secondary-container">
      
      {/* 2. Hero Section */}
      <section className="relative pt-24 pb-12 px-margin-mobile">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/40 z-10"></div>
          <img 
            id="hero-bg-img" 
            alt="Vista de Santa Marta" 
            className="w-full h-full object-cover" 
            src="/images/hero.png" 
            fetchpriority="high"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80' }}
          />
        </div>
        
        <div className="relative z-20 flex flex-col items-center text-center max-w-2xl mx-auto py-12">
          <h1 className="text-white font-display-lg-mobile text-display-lg-mobile mb-4 drop-shadow-lg">
            Encuentra tu propiedad ideal en Santa Marta
          </h1>
          <p className="text-white/90 font-body-lg text-body-lg mb-8 drop-shadow-md">
            Venta, arriendo y asesoría inmobiliaria con más de 183 propiedades disponibles.
          </p>

          {/* Floating Search Card */}
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md reveal">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 gap-4 text-left">
              <div>
                <label className="block text-primary font-label-md text-label-md mb-1 ml-1">Tipo de negocio</label>
                <select 
                  value={searchForm.businessType}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, businessType: e.target.value }))}
                  className="w-full border-outline-variant/60 rounded-lg font-body-md text-on-surface-variant focus:ring-primary focus:border-primary bg-white font-medium"
                >
                  <option value="todos">Todos</option>
                  <option value="Venta">Comprar</option>
                  <option value="Arriendo">Arrendar</option>
                </select>
              </div>
              
              <div>
                <label className="block text-primary font-label-md text-label-md mb-1 ml-1">Tipo de inmueble</label>
                <select 
                  value={searchForm.propertyType}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, propertyType: e.target.value }))}
                  className="w-full border-outline-variant/60 rounded-lg font-body-md text-on-surface-variant focus:ring-primary focus:border-primary bg-white font-medium"
                >
                  <option value="todos">Todos los tipos</option>
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
                <label className="block text-primary font-label-md text-label-md mb-1 ml-1">Zona/Barrio</label>
                <input 
                  type="text"
                  placeholder="Ej: El Rodadero"
                  value={searchForm.zone}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, zone: e.target.value }))}
                  className="w-full border-outline-variant/60 rounded-lg font-body-md text-on-surface-variant focus:ring-primary focus:border-primary bg-white font-medium"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-secondary text-on-secondary font-headline-sm text-headline-sm py-3 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">search</span>
                Buscar
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 3. Trust Stats Banner */}
      <section className="bg-primary py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-margin-mobile max-w-container-max mx-auto text-center">
          <div className="flex flex-col items-center gap-2 reveal">
            <span className="material-symbols-outlined text-secondary-fixed text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>apartment</span>
            <span className="text-white font-headline-sm text-headline-sm">183+</span>
            <span className="text-white/70 font-body-sm text-body-sm">propiedades activas</span>
          </div>
          <div className="flex flex-col items-center gap-2 reveal">
            <span className="material-symbols-outlined text-secondary-fixed text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="text-white font-headline-sm text-headline-sm">10+ años</span>
            <span className="text-white/70 font-body-sm text-body-sm">experiencia</span>
          </div>
          <div className="flex flex-col items-center gap-2 reveal">
            <span className="material-symbols-outlined text-secondary-fixed text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
            <span className="text-white font-headline-sm text-headline-sm">Personalizado</span>
            <span className="text-white/70 font-body-sm text-body-sm">atención directa</span>
          </div>
          <div className="flex flex-col items-center gap-2 reveal">
            <span className="material-symbols-outlined text-secondary-fixed text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
            <span className="text-white font-headline-sm text-headline-sm">Gratuita</span>
            <span className="text-white/70 font-body-sm text-body-sm">asesoría experta</span>
          </div>
        </div>
      </section>

      {/* 4. Featured Properties */}
      <section className="py-16 bg-surface" id="featured">
        <div className="px-margin-mobile max-w-container-max mx-auto">
          
          <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="text-primary font-display-lg-mobile text-display-lg-mobile mb-4">Propiedades Destacadas</h2>
            <div className="flex bg-surface-container rounded-full p-1 w-full max-w-xs overflow-hidden border">
              <button 
                onClick={() => handleFilterClick('Todos')}
                className={`flex-1 py-2 px-4 rounded-full font-label-md text-label-md transition-colors ${currentFilter === 'Todos' ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                Todos
              </button>
              <button 
                onClick={() => handleFilterClick('Venta')}
                className={`flex-1 py-2 px-4 rounded-full font-label-md text-label-md transition-colors ${currentFilter === 'Venta' ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                En Venta
              </button>
              <button 
                onClick={() => handleFilterClick('Arriendo')}
                className={`flex-1 py-2 px-4 rounded-full font-label-md text-label-md transition-colors ${currentFilter === 'Arriendo' ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                En Arriendo
              </button>
            </div>
          </div>

          {/* Loader o Grilla de Propiedades */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-secondary rounded-full animate-spin"></div>
              <p className="text-xs text-on-surface-variant font-semibold mt-4">Cargando portafolio de inmuebles...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center font-bold text-sm border">
              {error}
            </div>
          ) : propertiesToRender.length === 0 ? (
            <div className="col-span-full py-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 text-outline">search_off</span>
              <p className="font-semibold">No se encontraron propiedades que coincidan con los criterios.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter mb-10">
              {propertiesToRender.map((p) => {
                const imgSrc = (p.images && p.images.length > 0) ? p.images[0] : '/images/interior_apartment.png'
                const formattedPrice = p.price_formatted || p.priceFormatted || `$ ${parseFloat(p.price).toLocaleString('es-CO')} COP`

                return (
                  <Link 
                    key={p.id}
                    to={`/propiedad/${p.id}`}
                    className="block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-outline-variant/30 group reveal"
                  >
                    <div className="relative h-64 overflow-hidden bg-slate-100">
                      <img 
                        alt={p.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        src={imgSrc} 
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80' }}
                      />
                      <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-label-md font-label-md">
                        {p.operation}
                      </div>
                      {p.exclusive && (
                        <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-label-md font-label-md">
                          Exclusivo
                        </div>
                      )}
                      {p.status && p.status !== 'Disponible' && (
                        <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md z-10">
                          {p.status}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-primary font-headline-sm text-headline-sm mb-1 line-clamp-1 group-hover:text-secondary transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-on-surface-variant text-body-sm flex items-center gap-1 mb-4">
                        <span className="material-symbols-outlined text-[18px]">location_on</span> 
                        {p.location}
                      </p>
                      <p className="text-secondary font-headline-md text-headline-md mb-4">
                        {formattedPrice}
                      </p>
                      <div className="flex justify-between border-t border-outline-variant pt-4 text-on-surface-variant font-body-sm">
                        <span className="flex items-center gap-1"><span class="material-symbols-outlined text-[18px]">bed</span> {p.rooms || 0} Hab</span>
                        <span className="flex items-center gap-1"><span class="material-symbols-outlined text-[18px]">bathtub</span> {p.baths || 0} {p.baths === 1 ? 'Baño' : 'Baños'}</span>
                        <span className="flex items-center gap-1"><span class="material-symbols-outlined text-[18px]">square_foot</span> {p.area || 0} m²</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Botón Ver todas */}
          {!loading && (
            <div className="text-center">
              <Link 
                to="/propiedades"
                className="inline-block bg-primary text-on-primary px-8 py-3 rounded-full font-headline-sm text-headline-sm hover:opacity-90 transition-all shadow-lg text-white"
              >
                Ver todas las propiedades
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 5. Sell/Rent Section */}
      <section id="vender" className="py-16 px-margin-mobile max-w-container-max mx-auto scroll-mt-20 reveal">
        <div className="bg-primary-container rounded-3xl overflow-hidden shadow-2xl text-on-primary flex flex-col lg:flex-row">
          <div className="p-8 lg:p-16 flex-1 flex flex-col justify-center">
            <h2 className="font-display-lg-mobile text-display-lg-mobile mb-6 text-white">¿Quieres vender o arrendar tu propiedad?</h2>
            <p className="font-body-lg text-body-lg mb-8 text-on-primary-container leading-relaxed">
              Ponemos tu inmueble frente a miles de compradores calificados. Nuestra estrategia de marketing digital y conocimiento local garantizan el mejor precio en el menor tiempo.
            </p>
          </div>
          
          <div className="bg-white p-8 lg:p-12 text-on-surface flex-1">
            <h3 className="text-primary font-headline-md text-headline-md mb-6">Solicita una valoración gratuita</h3>
            
            <form onSubmit={handleValuationSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-primary font-label-md text-label-md mb-1">Nombre completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Tu nombre" 
                  value={valuationForm.name}
                  onChange={(e) => setValuationForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-3 py-2 border outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-primary font-label-md text-label-md mb-1">Teléfono</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+57" 
                    value={valuationForm.phone}
                    onChange={(e) => setValuationForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-3 py-2 border outline-none"
                  />
                </div>
                <div>
                  <label className="block text-primary font-label-md text-label-md mb-1">Tipo de inmueble</label>
                  <select 
                    value={valuationForm.type}
                    onChange={(e) => setValuationForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border-outline-variant rounded-lg font-body-md text-on-surface-variant focus:ring-primary focus:border-primary px-3 py-2 border outline-none"
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
                <label className="block text-primary font-label-md text-label-md mb-1">Zona del inmueble</label>
                <input 
                  type="text" 
                  placeholder="Sector o barrio" 
                  value={valuationForm.zone}
                  onChange={(e) => setValuationForm(prev => ({ ...prev, zone: e.target.value }))}
                  className="w-full border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-3 py-2 border outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-xl font-headline-sm text-headline-sm hover:opacity-95 transition-all text-center"
              >
                Enviar información WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 6. Benefits Grid */}
      <section className="py-16 bg-surface-container-low" id="about">
        <div className="px-margin-mobile max-w-container-max mx-auto scroll-mt-20">
          
          {/* Sección Nosotros */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 pb-16 border-b border-outline-variant/60">
            <div className="text-left">
              <span className="text-secondary font-bold text-label-md text-label-md uppercase tracking-wider block mb-2">Sobre Nosotros</span>
              <h2 className="text-primary font-display-lg-mobile text-display-lg-mobile md:text-headline-md mb-6">CR7 Inmobiliaria</h2>
              <div className="text-on-surface-variant font-body-md space-y-4 leading-relaxed">
                <p>En CR7 Inmobiliaria trabajamos con pasión y compromiso para ayudarte a cumplir el sueño de tener vivienda propia en Santa Marta y sus alrededores. Con más de 150 propiedades vendidas, nos especializamos en la venta, arriendo y administración de inmuebles, acompañando a nuestros clientes en cada paso del proceso: desde la búsqueda, el financiamiento y la firma, hasta la entrega de llaves.</p>
                <p>Nuestra fortaleza está en el asesoramiento transparente, el respaldo legal y financiero, y un equipo dispuesto a brindar soluciones efectivas. Además, ofrecemos oportunidades de inversión en proyectos VIS, casas multifamiliares y propiedades de alto valor en sectores estratégicos de la ciudad.</p>
                <p className="font-semibold text-primary">En CR7 Inmobiliaria creemos que cada inmueble es una oportunidad de crecimiento y estabilidad para tu familia. Por eso, nuestro propósito es entregarte un servicio confiable, cercano y de calidad.</p>
              </div>
            </div>
            
            <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/50 group">
              <img 
                src="/images/hero.png" 
                alt="Nosotros CR7 Inmobiliaria" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-left text-white">
                <p className="text-5xl font-black text-secondary-fixed mb-1">150+</p>
                <p className="text-lg font-bold tracking-wide uppercase opacity-90">Propiedades Vendidas</p>
              </div>
            </div>
          </div>

          <h2 className="text-primary font-display-lg-mobile text-display-lg-mobile mb-12 text-center">¿Por qué elegir CR7 Inmobiliaria?</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter text-center">
            <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center reveal">
              <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mb-6 text-secondary">
                <span className="material-symbols-outlined text-3xl">location_city</span>
              </div>
              <h3 className="text-primary font-headline-sm text-headline-sm mb-3">Experiencia local</h3>
              <p className="text-on-surface-variant font-body-sm text-body-sm">Conocemos cada rincón de Santa Marta, ofreciéndote las mejores oportunidades de inversión.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center reveal">
              <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mb-6 text-secondary">
                <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
              </div>
              <h3 className="text-primary font-headline-sm text-headline-sm mb-3">Portafolio amplio</h3>
              <p className="text-on-surface-variant font-body-sm text-body-sm">Más de 180 propiedades verificadas que se ajustan a todos los presupuestos y estilos.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center reveal">
              <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mb-6 text-secondary">
                <span className="material-symbols-outlined text-3xl">diversity_3</span>
              </div>
              <h3 className="text-primary font-headline-sm text-headline-sm mb-3">Acompañamiento</h3>
              <p className="text-on-surface-variant font-body-sm text-body-sm">Te guiamos en todo el proceso legal y comercial, desde la búsqueda hasta la firma.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center reveal">
              <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mb-6 text-secondary">
                <span className="material-symbols-outlined text-3xl">speed</span>
              </div>
              <h3 className="text-primary font-headline-sm text-headline-sm mb-3">Respuesta rápida</h3>
              <p className="text-on-surface-variant font-body-sm text-body-sm">Atención inmediata a tus dudas para que no pierdas la oportunidad de tu vida.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="py-16 px-margin-mobile max-w-container-max mx-auto overflow-hidden">
        <h2 className="text-primary font-display-lg-mobile text-display-lg-mobile mb-12 text-center">Nuestros Clientes Dicen</h2>
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
          
          {/* Testimonial 1 */}
          <div className="min-w-[300px] bg-white p-8 rounded-2xl shadow-lg snap-center text-left border reveal">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-primary font-bold">JD</div>
              <div>
                <h4 className="font-headline-sm text-headline-sm text-primary">Juan Delgado</h4>
                <div className="flex text-yellow-500">
                  {[1,2,3,4,5].map(star => (
                    <span key={star} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-on-surface-variant font-body-md italic">"Excelente servicio. Me ayudaron a encontrar el apartamento de mis sueños frente al mar en tiempo récord."</p>
          </div>

          {/* Testimonial 2 */}
          <div className="min-w-[300px] bg-white p-8 rounded-2xl shadow-lg snap-center text-left border reveal">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-primary font-bold">MC</div>
              <div>
                <h4 className="font-headline-sm text-headline-sm text-primary">Maria Castro</h4>
                <div className="flex text-yellow-500">
                  {[1,2,3,4,5].map(star => (
                    <span key={star} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-on-surface-variant font-body-md italic">"Vendí mi casa en Mamatoco en menos de un mes. Muy profesionales y transparentes en todo el proceso."</p>
          </div>

          {/* Testimonial 3 */}
          <div className="min-w-[300px] bg-white p-8 rounded-2xl shadow-lg snap-center text-left border reveal">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-primary font-bold">RL</div>
              <div>
                <h4 className="font-headline-sm text-headline-sm text-primary">Roberto Luna</h4>
                <div className="flex text-yellow-500">
                  {[1,2,3,4,5].map(star => (
                    <span key={star} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-on-surface-variant font-body-md italic">"La mejor inmobiliaria de la costa. La asesoría legal fue impecable, me sentí seguro en todo momento."</p>
          </div>
        </div>
      </section>

      {/* 8. Zones Grid */}
      <section className="py-16 bg-white">
        <div className="px-margin-mobile max-w-container-max mx-auto">
          <h2 className="text-primary font-display-lg-mobile text-display-lg-mobile mb-12 text-center">Explora las Mejores Zonas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            
            <Link
              to="/propiedades"
              state={{
                filters: {
                  type: 'TODOS',
                  operation: 'TODOS',
                  rooms: 'TODOS',
                  zone: 'El Rodadero'
                }
              }}
              className="relative h-48 rounded-xl overflow-hidden group reveal block cursor-pointer"
            >
              <img 
                alt="El Rodadero" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-4">
                <span className="text-white font-headline-sm text-headline-sm">El Rodadero</span>
              </div>
            </Link>

            <Link
              to="/propiedades"
              state={{
                filters: {
                  type: 'TODOS',
                  operation: 'TODOS',
                  rooms: 'TODOS',
                  zone: 'Bello Horizonte'
                }
              }}
              className="relative h-48 rounded-xl overflow-hidden group reveal block cursor-pointer"
            >
              <img 
                alt="Bello Horizonte" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-4">
                <span className="text-white font-headline-sm text-headline-sm">Bello Horizonte</span>
              </div>
            </Link>

            <Link
              to="/propiedades"
              state={{
                filters: {
                  type: 'TODOS',
                  operation: 'TODOS',
                  rooms: 'TODOS',
                  zone: 'Centro Histórico'
                }
              }}
              className="relative h-48 rounded-xl overflow-hidden group reveal block cursor-pointer"
            >
              <img 
                alt="Centro Histórico" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                src="https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?auto=format&fit=crop&w=400&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-4">
                <span className="text-white font-headline-sm text-headline-sm">Centro Histórico</span>
              </div>
            </Link>

            <Link
              to="/propiedades"
              state={{
                filters: {
                  type: 'TODOS',
                  operation: 'TODOS',
                  rooms: 'TODOS',
                  zone: 'Mamatoco'
                }
              }}
              className="relative h-48 rounded-xl overflow-hidden group reveal block cursor-pointer"
            >
              <img 
                alt="Mamatoco" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-4">
                <span className="text-white font-headline-sm text-headline-sm">Mamatoco</span>
              </div>
            </Link>

            <Link
              to="/propiedades"
              state={{
                filters: {
                  type: 'TODOS',
                  operation: 'TODOS',
                  rooms: 'TODOS',
                  zone: 'P. de Bolívar'
                }
              }}
              className="relative h-48 rounded-xl overflow-hidden group reveal block cursor-pointer"
            >
              <img 
                alt="Parques de Bolívar" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-4">
                <span className="text-white font-headline-sm text-headline-sm">P. de Bolívar</span>
              </div>
            </Link>

            <Link
              to="/propiedades"
              state={{
                filters: {
                  type: 'TODOS',
                  operation: 'TODOS',
                  rooms: 'TODOS',
                  zone: 'Gaira'
                }
              }}
              className="relative h-48 rounded-xl overflow-hidden group reveal block cursor-pointer"
            >
              <img 
                alt="Gaira" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-4">
                <span className="text-white font-headline-sm text-headline-sm">Gaira</span>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* 9. Contact & Location */}
      <section className="py-16 px-margin-mobile bg-surface" id="contact">
        <div className="max-w-container-max mx-auto scroll-mt-20">
          <div className="flex flex-col lg:flex-row gap-12 text-left">
            
            <div className="flex-1 reveal">
              <h2 className="text-primary font-display-lg-mobile text-display-lg-mobile mb-8">Contáctanos</h2>
              <div className="space-y-6">
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <p className="text-on-surface-variant font-body-sm">Teléfono / WhatsApp</p>
                    <p className="text-primary font-headline-sm font-semibold">+{settings?.phone || '573002510313'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <p className="text-on-surface-variant font-body-sm">Correo electrónico</p>
                    <p className="text-primary font-headline-sm font-semibold">{settings?.email || 'cr7inmobiliaria@gmail.com'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <p className="text-on-surface-variant font-body-sm">Oficina principal</p>
                    <p className="text-primary font-headline-sm font-semibold">Santa Marta, Colombia</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <a 
                    href="https://www.instagram.com/cr7inmobiliaria1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary-container text-primary rounded-full flex items-center justify-center hover:bg-secondary hover:text-white transition-all shadow-sm"
                    aria-label="Instagram"
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  </a>
                  <div>
                    <p className="text-on-surface-variant font-body-sm">Instagram</p>
                    <a 
                      href="https://www.instagram.com/cr7inmobiliaria1/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-headline-sm font-semibold hover:text-secondary hover:underline transition-all"
                    >
                      @cr7inmobiliaria1
                    </a>
                  </div>
                </div>

              </div>
            </div>

            <div className="flex-1 h-[400px] rounded-3xl overflow-hidden shadow-xl border reveal">
              <iframe 
                title="Santa Marta Location"
                allowFullScreen="" 
                frameBorder="0" 
                height="100%" 
                src="https://maps.google.com/maps?q=Santa%20Marta,%20Colombia&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                style={{ border: 0 }} 
                width="100%"
                loading="lazy"
              ></iframe>
            </div>

          </div>
        </div>
      </section>

      {/* 10. Floating WhatsApp Button */}
      <a 
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl animate-bounce hover:scale-110 transition-transform" 
        id="floating-whatsapp-btn" 
        href={`https://wa.me/${settings?.phone || '573002510313'}`}
        target="_blank" 
        rel="noreferrer"
      >
        <svg fill="currentColor" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.319 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.735-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"></path>
        </svg>
      </a>

    </div>
  )
}
