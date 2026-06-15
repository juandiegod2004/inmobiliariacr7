import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { getProperties } from '../../api/properties.api'

export default function PropertiesPage() {
  const location = useLocation()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Cargar filtros iniciales si vienen de la página de inicio
  const [filters, setFilters] = useState(() => {
    if (location.state?.filters) {
      return location.state.filters
    }
    return {
      type: 'TODOS',
      operation: 'TODOS',
      rooms: 'TODOS',
      zone: ''
    }
  })

  useEffect(() => {
    fetchProperties()
  }, [filters]) // Recargar cada vez que cambien los filtros

  useEffect(() => {
    if (location.state?.filters) {
      setFilters(location.state.filters)
    }
  }, [location.state])

  const fetchProperties = async () => {
    setLoading(true)
    setError('')
    try {
      // Mapear filtros al formato de la API
      const apiFilters = {
        type: filters.type,
        operation: filters.operation,
        rooms: filters.rooms,
        zone: filters.zone
      }
      const data = await getProperties(apiFilters)
      setProperties(data)
    } catch (err) {
      console.error(err)
      setError('Error al obtener la lista de propiedades.')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      type: 'TODOS',
      operation: 'TODOS',
      rooms: 'TODOS',
      zone: ''
    })
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 space-y-10 min-h-screen text-left">
      
      {/* Cabecera */}
      <div className="border-b border-outline-variant/20 pb-6">
        <span className="text-xs font-bold text-secondary uppercase tracking-widest">Portafolio Disponible</span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-primary mt-1">Explora Propiedades</h1>
        <p className="text-sm text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
          Usa los filtros avanzados para encontrar la propiedad que mejor se adapte a tus necesidades en las mejores zonas de Santa Marta.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Panel de Filtros (Lateral en desktop, arriba en móvil) */}
        <div className="lg:col-span-1 bg-glass border border-outline-variant/30 p-6 rounded-2xl shadow-soft-coastal h-fit space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-primary uppercase">Filtros</h3>
            <button 
              onClick={handleClearFilters}
              className="text-xs text-secondary hover:underline font-bold"
            >
              Limpiar todos
            </button>
          </div>

          <div className="space-y-4">
            {/* Filtro de Tipo */}
            <div>
              <label className="block text-xs font-bold text-primary uppercase mb-2">Tipo de Inmueble</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full bg-background border border-outline-variant/60 rounded-xl text-xs py-3 px-3 outline-none focus:border-secondary transition-all"
              >
                <option value="TODOS">Todos los Tipos</option>
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

            {/* Filtro de Operación */}
            <div>
              <label className="block text-xs font-bold text-primary uppercase mb-2">Operación</label>
              <select
                name="operation"
                value={filters.operation}
                onChange={handleFilterChange}
                className="w-full bg-background border border-outline-variant/60 rounded-xl text-xs py-3 px-3 outline-none focus:border-secondary transition-all"
              >
                <option value="TODOS">Todas las operaciones</option>
                <option value="Venta">Comprar</option>
                <option value="Arriendo">Arrendar</option>
              </select>
            </div>

            {/* Filtro de Habitaciones */}
            <div>
              <label className="block text-xs font-bold text-primary uppercase mb-2">Habitaciones</label>
              <select
                name="rooms"
                value={filters.rooms}
                onChange={handleFilterChange}
                className="w-full bg-background border border-outline-variant/60 rounded-xl text-xs py-3 px-3 outline-none focus:border-secondary transition-all"
              >
                <option value="TODOS">Cualquier cantidad</option>
                <option value="1">1 Habitación</option>
                <option value="2">2 Habitaciones</option>
                <option value="3">3 Habitaciones</option>
                <option value="4">4+ Habitaciones</option>
              </select>
            </div>

            {/* Filtro de Zona */}
            <div>
              <label className="block text-xs font-bold text-primary uppercase mb-2">Zona / Ubicación</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base">
                  search
                </span>
                <input
                  type="text"
                  name="zone"
                  value={filters.zone}
                  onChange={handleFilterChange}
                  placeholder="Ej. Rodadero"
                  className="w-full pl-9 pr-3 py-2.5 bg-background border border-outline-variant/60 rounded-xl text-xs outline-none focus:border-secondary transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Listado de Propiedades */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-secondary rounded-full animate-spin"></div>
              <p className="text-xs text-on-surface-variant font-semibold mt-4">Actualizando portafolio...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600 bg-red-50 rounded-2xl border border-red-200 text-sm font-semibold">
              {error}
            </div>
          ) : properties.length === 0 ? (
            <div className="py-24 text-center bg-surface border border-dashed border-outline-variant/60 rounded-2xl p-8 flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-outline mb-3">search_off</span>
              <h3 className="font-display font-bold text-primary text-lg">No encontramos coincidencias</h3>
              <p className="text-xs text-on-surface-variant mt-2 max-w-sm">
                Intenta ajustar o limpiar los filtros de búsqueda para explorar más opciones en Santa Marta.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {properties.map((prop) => {
                const imgSrc = (prop.images && prop.images.length > 0) ? prop.images[0] : '/images/interior_apartment.png'
                const formattedPrice = prop.price_formatted || prop.priceFormatted || `$ ${parseFloat(prop.price).toLocaleString('es-CO')} COP`

                return (
                  <Link 
                    key={prop.id}
                    to={`/propiedad/${prop.id}`}
                    className="bg-white border border-outline-variant/30 rounded-2xl overflow-hidden shadow-soft-coastal hover:shadow-xl transition-all group flex flex-col h-full text-left cursor-pointer"
                  >
                    <div className="relative h-56 bg-slate-100 overflow-hidden">
                      <img 
                        src={imgSrc} 
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80' }}
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-primary text-white rounded-full uppercase tracking-wider">
                          {prop.operation}
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-secondary text-white rounded-full uppercase tracking-wider">
                          {prop.subtype || prop.type}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-primary text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-md">
                        {formattedPrice}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                      <div className="space-y-2">
                        <span className="text-xs text-secondary font-bold inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          {prop.location}
                        </span>
                        <h3 className="font-display font-bold text-md sm:text-lg text-primary line-clamp-1 group-hover:text-secondary transition-colors">
                          {prop.title}
                        </h3>
                        <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                          {prop.description || 'Sin descripción detallada.'}
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-3 gap-2 py-3 border-y border-outline-variant/20 text-xs text-on-surface-variant font-medium text-center">
                          <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined text-base text-primary mb-0.5">bed</span>
                            <span>{prop.rooms || 0} Hab</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined text-base text-primary mb-0.5">bathtub</span>
                            <span>{prop.baths || 0} Baños</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined text-base text-primary mb-0.5">square_foot</span>
                            <span>{prop.area || 0} m²</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs text-on-surface-variant font-medium">
                            Agente: <span className="font-semibold text-primary">{prop.profiles?.name || 'CR7 Agente'}</span>
                          </span>
                          <div className="text-xs font-bold text-secondary group-hover:underline flex items-center gap-0.5">
                            Ver Detalles
                            <span className="material-symbols-outlined text-xs">arrow_forward_ios</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  )
}
