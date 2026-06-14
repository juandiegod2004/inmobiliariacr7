import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPropertyById } from '../../api/properties.api'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    fetchPropertyDetail()
  }, [id])

  const fetchPropertyDetail = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getPropertyById(id)
      setProperty(data)
    } catch (err) {
      console.error(err)
      setError('No se pudo encontrar la propiedad especificada o ha sido eliminada.')
    } finally {
      // Retraso artificial mínimo de 600ms para asegurar que el spinner sea visible
      // y prevenir parpadeos/cambio brusco de interfaz como solicitó el usuario.
      setTimeout(() => {
        setLoading(false)
      }, 600)
    }
  }

  const handleWhatsAppContact = () => {
    if (!property) return
    const text = `¡Hola CR7 Inmobiliaria! 👋\nEstoy muy interesado(a) en obtener más información sobre el siguiente inmueble:\n\n` +
      `🏠 *Inmueble:* ${property.title}\n` +
      `📍 *Zona:* ${property.zone}\n` +
      `💰 *Precio:* $ ${parseFloat(property.price).toLocaleString('es-CO')} COP\n` +
      `📝 *Operación:* En ${property.operation}\n` +
      `🔗 *Referencia:* ${property.id}`
      
    const encodedText = encodeURIComponent(text)
    window.open(`https://wa.me/573001234567?text=${encodedText}`, '_blank')
  }

  // Spinner e interfaz de transición solicitados por el usuario
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background animate-pulse">
        {/* Spinner animado premium con branding */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-secondary rounded-full animate-spin"></div>
          <img 
            src="/logo_inmobiliaria.png" 
            alt="Loading..." 
            className="absolute h-8 w-8 object-contain rounded-md"
          />
        </div>
        <p className="text-primary font-display font-bold text-sm mt-6 tracking-wide animate-bounce">
          Cargando detalles de propiedad...
        </p>
        <p className="text-xs text-on-surface-variant mt-1">Buscando en el portafolio exclusivo</p>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="max-w-container-max mx-auto px-6 py-20 text-center space-y-6 min-h-[60vh]">
        <div className="inline-flex items-center justify-center p-4 bg-red-50 text-red-600 rounded-full">
          <span className="material-symbols-outlined text-4xl">home_work</span>
        </div>
        <h2 className="font-display font-extrabold text-2xl text-primary">Inmueble no disponible</h2>
        <p className="text-sm text-on-surface-variant max-w-md mx-auto">
          {error || 'La propiedad seleccionada no existe en nuestra base de datos activa.'}
        </p>
        <div className="pt-4">
          <Link 
            to="/propiedades"
            className="px-6 py-3 bg-primary hover:bg-primary-container text-white font-bold rounded-xl transition-all shadow-md text-sm inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Volver al Catálogo
          </Link>
        </div>
      </div>
    )
  }

  const imageUrls = property.images && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80']

  return (
    <div className="max-w-container-max mx-auto px-6 py-12 space-y-12 animate-fade-in">
      
      {/* Botón Volver */}
      <div>
        <Link 
          to="/propiedades" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-outline hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back_ios</span>
          Volver al listado de propiedades
        </Link>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Galería de Imágenes (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Imagen Principal Activa */}
          <div className="relative h-[450px] bg-slate-100 rounded-3xl overflow-hidden shadow-soft-coastal border border-outline-variant/20">
            <img 
              src={imageUrls[activeImage]} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="text-xs font-bold px-3.5 py-1.5 bg-primary text-white rounded-full uppercase tracking-wider shadow-md">
                En {property.operation}
              </span>
              <span className="text-xs font-bold px-3.5 py-1.5 bg-secondary text-white rounded-full uppercase tracking-wider shadow-md">
                {property.type}
              </span>
            </div>
          </div>

          {/* Carrusel de Miniaturas */}
          {imageUrls.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    index === activeImage ? 'border-secondary scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ficha Técnica y Contacto (Col 5) */}
        <div className="lg:col-span-5 space-y-8 bg-glass border border-outline-variant/30 p-8 rounded-3xl shadow-soft-coastal h-fit">
          
          <div className="space-y-3">
            <span className="text-xs text-secondary font-bold inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {property.zone}
            </span>
            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-primary leading-tight">
              {property.title}
            </h1>
            <div className="text-2xl font-extrabold text-secondary pt-2">
              $ {parseFloat(property.price).toLocaleString('es-CO')} COP
            </div>
          </div>

          {/* Ficha Técnica Rápida */}
          <div className="grid grid-cols-3 gap-4 py-6 border-y border-outline-variant/20 text-center">
            <div className="space-y-1">
              <span className="material-symbols-outlined text-2xl text-primary block">bed</span>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase">Habitaciones</span>
              <p className="text-sm font-extrabold text-primary">{property.bedrooms}</p>
            </div>
            <div className="space-y-1">
              <span className="material-symbols-outlined text-2xl text-primary block">bathtub</span>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase">Baños</span>
              <p className="text-sm font-extrabold text-primary">{property.bathrooms}</p>
            </div>
            <div className="space-y-1">
              <span className="material-symbols-outlined text-2xl text-primary block">square_foot</span>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase">Área</span>
              <p className="text-sm font-extrabold text-primary">{property.area} m²</p>
            </div>
          </div>

          {/* Botón WhatsApp */}
          <button
            onClick={handleWhatsAppContact}
            className="w-full py-4 bg-secondary hover:bg-secondary/95 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 text-sm"
          >
            <span className="material-symbols-outlined text-lg">chat</span>
            <span>Solicitar información por WhatsApp</span>
          </button>

          {/* Datos del Asesor */}
          <div className="pt-4 flex items-center gap-4 border-t border-outline-variant/10">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">account_circle</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Asesor Asignado</p>
              <p className="text-sm font-bold text-primary">{property.profiles?.name || 'CR7 Asesor'}</p>
              <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">
                Verificado
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Descripción Detallada */}
      <div className="bg-white border border-outline-variant/20 p-8 rounded-3xl space-y-4">
        <h3 className="font-display font-bold text-lg text-primary">Descripción del Inmueble</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
          {property.description || 'No hay descripción disponible para esta propiedad.'}
        </p>
      </div>

    </div>
  )
}
