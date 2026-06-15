import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPropertyById, getProperties, scheduleVisit } from '../../api/properties.api'
import { useAuth } from '../../context/AuthContext'
import emailjs from '@emailjs/browser'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const { settings } = useAuth()
  const [property, setProperty] = useState(null)
  const [similarProperties, setSimilarProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Galería Lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Descripción colapsable (móvil)
  const [isDescExpanded, setIsDescExpanded] = useState(false)

  // Formularios
  const [requestForm, setRequestForm] = useState({ name: '' })
  const [requestLoading, setRequestLoading] = useState(false)

  const [visitForm, setVisitForm] = useState({
    name: '',
    phone: '',
    date: '',
    message: ''
  })
  const [visitLoading, setVisitLoading] = useState(false)

  // Notificaciones Toast
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    fetchPropertyData()
  }, [id])

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  const fetchPropertyData = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getPropertyById(id)
      setProperty(data)

      // Cargar propiedades similares (primeras 3 excluyendo la actual)
      const allProps = await getProperties()
      const similar = allProps
        .filter(p => p.id !== data.id)
        .slice(0, 3)
      setSimilarProperties(similar)
    } catch (err) {
      console.error(err)
      setError('El inmueble con el ID solicitado no existe o no se pudo cargar desde Supabase.')
    } finally {
      // Pequeño retardo para suavizar la transición y que se aprecie la animación de carga
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  const handleRequestSubmit = (e) => {
    e.preventDefault()
    if (!requestForm.name.trim()) return

    setRequestLoading(true)
    setTimeout(() => {
      setRequestForm({ name: '' })
      setRequestLoading(false)
      triggerToast('¡Solicitud de información recibida!')
    }, 1200)
  }

  const handleVisitSubmit = async (e) => {
    e.preventDefault()
    if (!visitForm.name.trim() || !visitForm.phone.trim() || !visitForm.date) return

    setVisitLoading(true)
    try {
      // 1. Guardar la visita en la base de datos Supabase
      await scheduleVisit({
        property_id: property.id,
        name: visitForm.name,
        phone: visitForm.phone,
        visit_date: visitForm.date,
        message: visitForm.message
      })

      // 2. Enviar correo de notificación por EmailJS si las credenciales están configuradas
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      const contactEmail = settings?.email || 'cr7inmobiliaria@gmail.com'

      if (serviceId && templateId && publicKey) {
        try {
          await emailjs.send(
            serviceId,
            templateId,
            {
              to_email: contactEmail,
              client_name: visitForm.name,
              client_phone: visitForm.phone,
              visit_date: visitForm.date,
              message: visitForm.message || 'Sin mensaje adicional',
              property_title: property.title,
              property_ref: property.id,
              property_location: property.location,
              property_price: formattedPrice
            },
            publicKey
          )
        } catch (emailErr) {
          console.error('Error al enviar correo con EmailJS:', emailErr)
        }
      } else {
        console.warn(
          'EmailJS no configurado. Para activar notificaciones por correo, añade VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID y VITE_EMAILJS_PUBLIC_KEY en tu .env'
        )
      }

      setVisitForm({
        name: '',
        phone: '',
        date: '',
        message: ''
      })
      triggerToast('¡Visita agendada con éxito!')
    } catch (err) {
      console.error(err)
      triggerToast('Error al agendar la visita. Inténtalo de nuevo.')
    } finally {
      setVisitLoading(false)
    }
  }

  const handleWhatsAppContact = () => {
    if (!property) return
    const text = `¡Hola! Me interesa obtener más información sobre el inmueble "${property.title}" en ${property.location} (Ref: #${property.id}).`
    const encoded = encodeURIComponent(text)
    window.open(`https://wa.me/${settings?.phone || '573002510313'}?text=${encoded}`, '_blank')
  }

  const handleCallNow = () => {
    window.location.href = `tel:+${settings?.phone || '573002510313'}`
  }

  if (loading) {
    return (
      <div id="loading-spinner" className="fixed inset-0 z-50 bg-[#f7f9ff] flex flex-col items-center justify-center transition-opacity duration-300">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#002046]/20 border-t-[#006c47] rounded-full animate-spin"></div>
          <p className="text-primary font-headline-sm mt-4 font-semibold">Cargando...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center space-y-6 min-h-[60vh]">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant">error</span>
        <h1 className="font-display text-3xl font-bold text-primary">Propiedad no encontrada</h1>
        <p className="text-on-surface-variant">{error || 'El inmueble solicitado no está disponible.'}</p>
        <Link
          to="/"
          className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all"
        >
          Volver al inicio
        </Link>
      </div>
    )
  }

  const images = property.images && property.images.length > 0 ? property.images : ['/images/interior_apartment.png']
  const formattedPrice = property.price_formatted || property.priceFormatted || `$ ${parseFloat(property.price).toLocaleString('es-CO')} COP`

  // Separar descripción para el Leer Más
  const fullDesc = property.description || ''
  const splitIndex = fullDesc.indexOf('. ', Math.floor(fullDesc.length / 2))
  const firstPartDesc = splitIndex !== -1 ? fullDesc.substring(0, splitIndex + 1) : fullDesc
  const secondPartDesc = splitIndex !== -1 ? fullDesc.substring(splitIndex + 2) : ''

  return (
    <div className="w-full max-w-container-max mx-auto pb-48 selection:bg-secondary-container selection:text-on-secondary-container text-left px-margin-mobile md:px-margin-desktop">

      {/* 1. Breadcrumbs */}
      <nav className="py-4 flex items-center text-label-md font-label-md text-on-surface-variant gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
        <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="hover:text-primary transition-colors">{property.type} en {property.operation}</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-primary font-bold">{property.title}</span>
      </nav>

      {/* 2. Gallery Component */}
      <section className="relative mb-12">
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-2 md:gap-4 md:rounded-xl md:overflow-hidden">
          <div className="min-w-full md:min-w-0 snap-center relative aspect-[4/3] md:aspect-video group overflow-hidden bg-slate-100 border">
            <img
              id="gallery-main-img"
              alt="Imágen Principal"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src={images[0]}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80' }}
            />
            <div id="gallery-operation-badge" className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded font-label-md text-label-md uppercase tracking-wider">
              {property.operation}
            </div>
            {property.status && property.status !== 'Disponible' && (
              <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 rounded font-label-md text-label-md uppercase tracking-wider font-bold shadow-md">
                {property.status}
              </div>
            )}
          </div>

          <div className="min-w-full md:min-w-0 snap-center relative aspect-[4/3] md:aspect-video group overflow-hidden bg-slate-100 border">
            <img
              id="gallery-sub-img"
              alt="Imágen Secundaria"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src={images[1] || images[0] || '/images/exterior_house.png'}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' }}
            />
            <button
              onClick={() => {
                setCurrentImageIndex(0)
                setIsLightboxOpen(true)
              }}
              className="absolute bottom-4 right-4 bg-surface/90 backdrop-blur-md text-primary font-label-md text-label-md px-4 py-2 rounded-lg flex items-center gap-2 shadow-soft-coastal hover:bg-primary hover:text-white transition-all border border-outline-variant/30"
            >
              <span className="material-symbols-outlined">photo_library</span>
              Ver todas las fotos
            </button>
          </div>
        </div>
      </section>

      {/* Grid Principal */}
      <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-gutter">

        <div className="space-y-12">

          {/* 3. Header Info */}
          <section className="pt-6">
            <div className="flex flex-col gap-2">
              <h1 id="property-title" className="font-display text-display-lg-mobile text-primary tracking-tight leading-tight">
                {property.title}
              </h1>
              <div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                <span id="property-location">{property.location}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <span id="property-price" className="font-display text-display-lg-mobile text-primary md:text-3xl">
                {formattedPrice}
              </span>
              <div className="flex flex-wrap gap-2">
                <span id="property-type-badge" className="bg-surface-container-low text-on-surface-variant px-3 py-1.5 rounded-lg border border-outline-variant font-label-md text-label-md flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">apartment</span> {property.subtype || property.type}
                </span>
                {property.exclusive && (
                  <span id="property-exclusive-badge" className="bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-lg font-label-md text-label-md flex items-center gap-1.5 border">
                    <span className="material-symbols-outlined text-[16px]">verified</span> Exclusivo
                  </span>
                )}
              </div>
            </div>

            {/* Especificaciones Rápidas */}
            <div className="mt-8 grid grid-cols-4 gap-2 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-soft-coastal text-center">
              <div className="flex flex-col items-center justify-center border-r border-outline-variant py-2">
                <span className="material-symbols-outlined text-primary mb-1">bed</span>
                <span id="spec-rooms" className="font-label-md text-label-md text-on-surface-variant">{property.rooms || 0} Hab</span>
              </div>
              <div className="flex flex-col items-center justify-center border-r border-outline-variant py-2">
                <span className="material-symbols-outlined text-primary mb-1">bathtub</span>
                <span id="spec-baths" className="font-label-md text-label-md text-on-surface-variant">{property.baths || 0} Baños</span>
              </div>
              <div className="flex flex-col items-center justify-center border-r border-outline-variant py-2">
                <span className="material-symbols-outlined text-primary mb-1">garage</span>
                <span id="spec-garages" className="font-label-md text-label-md text-on-surface-variant">{property.garages || 0} Garaje</span>
              </div>
              <div className="flex flex-col items-center justify-center py-2">
                <span className="material-symbols-outlined text-primary mb-1">square_foot</span>
                <span id="spec-area" className="font-label-md text-label-md text-on-surface-variant">{property.area || 0} m²</span>
              </div>
            </div>
          </section>

          {/* 4. Description */}
          <section>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-4 border-b border-outline-variant pb-2">
              Descripción del inmueble
            </h2>
            <div className="text-on-surface-variant font-body-md space-y-4 leading-relaxed">
              <p id="desc-paragraph-1">{firstPartDesc}</p>

              {secondPartDesc && (
                <p id="desc-extra-paragraph" className={`${isDescExpanded ? 'block' : 'hidden md:block'} transition-all duration-300`}>
                  {secondPartDesc}
                </p>
              )}

              {secondPartDesc && (
                <button
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  id="desc-toggle-btn"
                  className="text-secondary font-bold hover:underline transition-all flex items-center gap-1 md:hidden"
                >
                  <span>{isDescExpanded ? 'Leer menos' : 'Leer más'}</span>
                  <span className="material-symbols-outlined text-[18px]">
                    {isDescExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                  </span>
                </button>
              )}
            </div>
          </section>

          {/* 5. Technical Features */}
          <section>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-6 border-b border-outline-variant pb-2">
              Características Técnicas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">layers</span>
                </div>
                <div>
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase text-xs">Estrato</p>
                  <p id="tech-stratum" className="font-headline-sm text-headline-sm text-primary font-bold">{property.stratum || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">stairs</span>
                </div>
                <div>
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase text-xs">Piso</p>
                  <p id="tech-floor" className="font-headline-sm text-headline-sm text-primary font-bold">{property.floor || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">event</span>
                </div>
                <div>
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase text-xs">Año</p>
                  <p id="tech-year" className="font-headline-sm text-headline-sm text-primary font-bold">{property.year || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">aspect_ratio</span>
                </div>
                <div>
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase text-xs">Área privada</p>
                  <p id="tech-private-area" className="font-headline-sm text-headline-sm text-primary font-bold">{property.private_area || property.privateArea || property.area} m²</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">chair</span>
                </div>
                <div>
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase text-xs">Amoblado</p>
                  <p id="tech-furnished" className="font-headline-sm text-headline-sm text-primary font-bold">{property.furnished ? 'Sí' : 'No'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">pets</span>
                </div>
                <div>
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase text-xs">Mascotas</p>
                  <p id="tech-pets" className="font-headline-sm text-headline-sm text-primary font-bold">{property.pets ? 'Sí' : 'No'}</p>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* 8. Agent Contact Sidebar (Sticky on Desktop) */}
        <aside className="block text-left mt-12 lg:mt-0">
          <div className="sticky top-24 space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-soft-coastal bg-white">

              <div className="flex items-center gap-4 mb-6">
                <img
                  className="w-16 h-16 rounded-full object-contain border-2 border-secondary bg-white p-1"
                  src="/logo_inmobiliaria.png"
                  onError={(e) => { e.target.src = '/images/logo.png' }}
                  alt="CR7 Inmobiliaria"
                />
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                    {property.profiles?.name === 'Administrador' ? 'Agente Inmobiliario' : (property.profiles?.name || 'Agente Inmobiliario')}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant">Asesor CR7 Inmobiliaria</p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all scale-100 active:scale-95 shadow-md text-sm"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                  Consultar por WhatsApp
                </button>
                <button
                  onClick={handleCallNow}
                  className="w-full border-2 border-primary text-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container/10 transition-all text-sm"
                >
                  <span className="material-symbols-outlined">call</span>
                  Llamar ahora
                </button>
              </div>

              <div className="mt-8 text-left">
                <h4 className="font-label-md text-label-md text-primary uppercase mb-4 tracking-widest text-xs font-bold">
                  Agendar Visita
                </h4>
                <form onSubmit={handleVisitSubmit} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Nombre completo"
                    value={visitForm.name}
                    onChange={(e) => setVisitForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 text-body-sm focus:ring-primary focus:border-primary outline-none"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Teléfono"
                    value={visitForm.phone}
                    onChange={(e) => setVisitForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 text-body-sm focus:ring-primary focus:border-primary outline-none"
                  />
                  <input
                    type="date"
                    required
                    value={visitForm.date}
                    onChange={(e) => setVisitForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 text-body-sm focus:ring-primary focus:border-primary outline-none text-on-surface-variant font-medium"
                  />
                  <textarea
                    placeholder="Mensaje"
                    rows="3"
                    required
                    value={visitForm.message}
                    onChange={(e) => setVisitForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 text-body-sm focus:ring-primary focus:border-primary resize-none outline-none"
                  ></textarea>

                  <button
                    type="submit"
                    disabled={visitLoading}
                    className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    {visitLoading ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></div>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <span>Enviar mensaje</span>
                    )}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </aside>

      </div>

      {/* 7. Related Properties */}
      <section className="mt-16 text-left">
        <h2 className="font-headline-md text-headline-md text-primary mb-8 font-bold">
          Propiedades similares
        </h2>

        {similarProperties.length === 0 ? (
          <p className="text-on-surface-variant text-sm">No hay propiedades similares disponibles actualmente.</p>
        ) : (
          <div id="similar-properties-grid" className="flex overflow-x-auto gap-gutter pb-8 no-scrollbar -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
            {similarProperties.map((s) => {
              const simImgSrc = (s.images && s.images.length > 0) ? s.images[0] : '/images/interior_apartment.png'
              const simPrice = s.price_formatted || s.priceFormatted || `$ ${parseFloat(s.price).toLocaleString('es-CO')} COP`

              return (
                <Link
                  key={s.id}
                  to={`/propiedad/${s.id}`}
                  className="min-w-[280px] md:min-w-0 md:flex-1 bg-surface-container-lowest rounded-2xl overflow-hidden shadow-soft-coastal border border-outline-variant group cursor-pointer block hover:shadow-lg transition-all"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      src={simImgSrc}
                      alt={s.title}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80' }}
                    />
                    <div className="absolute top-3 left-3 bg-primary text-white text-label-md px-2 py-0.5 rounded font-bold shadow-md">
                      {simPrice}
                    </div>
                    {s.exclusive && (
                      <div className="absolute top-3 right-3 bg-secondary text-white text-label-md px-2 py-0.5 rounded font-bold shadow-md">
                        EXCLUSIVO
                      </div>
                    )}
                    {s.status && s.status !== 'Disponible' && (
                      <div className="absolute bottom-3 left-3 bg-red-600 text-white text-[9px] px-2 py-0.5 rounded font-bold shadow-md">
                        {s.status.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="p-4 text-left">
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-1 truncate font-bold">
                      {s.title}
                    </h3>
                    <p className="text-body-sm text-on-surface-variant flex items-center gap-1 mb-3">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      {s.location}
                    </p>
                    <div className="flex items-center gap-3 text-on-surface-variant font-label-md text-xs">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">bed</span> {s.rooms || 0} Hab</span>
                      <span className="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">bathtub</span> {s.baths || 0} Baños</span>
                      <span className="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">square_foot</span> {s.area || 0} m²</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* 2. Lightbox Image Gallery Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md w-full h-full select-none cursor-pointer"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full flex flex-col gap-4 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Botón cerrar */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-14 right-2 md:-right-14 md:top-0 text-white hover:text-[#006c47] bg-black/50 hover:bg-white w-12 h-12 rounded-full flex items-center justify-center transition-all z-50 border border-white/20 shadow-lg"
              aria-label="Cerrar galería"
            >
              <span className="material-symbols-outlined text-2xl font-bold">close</span>
            </button>

            {/* Imagen Principal Lightbox */}
            <div className="relative flex items-center justify-center bg-black/40 rounded-xl overflow-hidden aspect-video">
              <img
                src={images[currentImageIndex]}
                alt=""
                className="max-h-[70vh] max-w-full object-contain"
              />

              {images.length > 1 && (
                <>
                  {/* Botón previo */}
                  <button
                    onClick={() => {
                      setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)
                    }}
                    className="absolute left-4 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition-colors"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>

                  {/* Botón siguiente */}
                  <button
                    onClick={() => {
                      setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)
                    }}
                    className="absolute right-4 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition-colors"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </>
              )}
            </div>

            {/* Miniaturas */}
            {images.length > 1 && (
              <div className="flex gap-2 justify-center overflow-x-auto pb-2 no-scrollbar">
                {images.map((imgSrc, i) => (
                  <img
                    key={i}
                    src={imgSrc}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-20 h-16 object-cover rounded-lg border-2 cursor-pointer transition-all ${i === currentImageIndex ? 'border-secondary' : 'border-transparent opacity-60'}`}
                    alt=""
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      {showToast && (
        <div id="toast-container" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          <div className="flex items-center gap-3 bg-surface/90 backdrop-blur-md text-primary px-6 py-4 rounded-xl shadow-soft-coastal border border-outline-variant max-w-sm pointer-events-auto transform transition-all duration-300">
            <span className="material-symbols-outlined text-secondary font-bold">check_circle</span>
            <span className="font-body-sm font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  )
}
