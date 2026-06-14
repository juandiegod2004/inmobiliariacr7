import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Layout({ children }) {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogoDoubleClick = () => {
    // Área secreta para iniciar sesión de administrador/agente
    navigate('/login')
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault()
    // Si no estamos en la página de inicio, navegar allí primero
    if (window.location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } })
      return
    }

    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-glass border-b border-outline-variant/20 shadow-soft-coastal">
        <div className="max-w-container-max mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo y Marca */}
          <div 
            onClick={handleLogoDoubleClick}
            className="flex items-center gap-3 cursor-pointer select-none group"
            title="Doble clic para acceso administrativo"
          >
            <img 
              src="/logo_inmobiliaria.png" 
              alt="CR7 Logo" 
              className="h-10 w-10 object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-display font-extrabold text-xl tracking-tight text-primary">
              CR7 <span className="text-secondary">INMOBILIARIA</span>
            </span>
          </div>

          {/* Menú Desktop */}
          <nav className="hidden md:flex items-center gap-8 font-semibold text-sm">
            <Link to="/" className="text-primary/80 hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link to="/propiedades" className="text-primary/80 hover:text-primary transition-colors">
              Propiedades
            </Link>
            <a 
              href="#vender" 
              onClick={(e) => handleScrollToSection(e, 'vender')}
              className="text-primary/80 hover:text-primary transition-colors"
            >
              Vender
            </a>
            <a 
              href="#contacto" 
              onClick={(e) => handleScrollToSection(e, 'contacto')}
              className="text-primary/80 hover:text-primary transition-colors"
            >
              Contacto
            </a>
          </nav>

          {/* Acceso/Sesión */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-xs px-3 py-1 bg-secondary/15 text-secondary border border-secondary/30 rounded-full font-bold uppercase tracking-wider">
                  {user.role === 'ADMIN' ? 'Administrador' : user.role === 'AGENT' ? 'Agente' : 'Cliente'}
                </span>
                
                {user.role !== 'CLIENT' && (
                  <Link 
                    to={user.role === 'ADMIN' ? '/admin' : '/agente/propiedades'}
                    className="text-xs font-bold text-white bg-primary hover:bg-primary-container px-4 py-2 rounded-lg transition-all shadow-md"
                  >
                    Panel de Control
                  </Link>
                )}

                <button 
                  onClick={handleLogout}
                  className="text-xs font-semibold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 px-3 py-2 rounded-lg transition-all"
                >
                  Salir
                </button>
              </div>
            ) : (
              <span className="text-xs text-primary/40 font-medium select-none">
                Santa Marta, Colombia
              </span>
            )}
          </div>

          {/* Hamburguesa Móvil */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-primary focus:outline-none"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Menú Móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-surface border-t border-outline-variant/20 px-6 py-4 flex flex-col gap-4 animate-fade-in">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-semibold text-primary/80 hover:text-primary"
            >
              Inicio
            </Link>
            <Link 
              to="/propiedades" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-semibold text-primary/80 hover:text-primary"
            >
              Propiedades
            </Link>
            <a 
              href="#vender" 
              onClick={(e) => handleScrollToSection(e, 'vender')}
              className="font-semibold text-primary/80 hover:text-primary"
            >
              Vender
            </a>
            <a 
              href="#contacto" 
              onClick={(e) => handleScrollToSection(e, 'contacto')}
              className="font-semibold text-primary/80 hover:text-primary"
            >
              Contacto
            </a>

            {isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-4 border-t border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-0.5 bg-secondary/15 text-secondary rounded-full font-bold">
                    {user.role}
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    {user.name}
                  </span>
                </div>
                {user.role !== 'CLIENT' && (
                  <Link 
                    to={user.role === 'ADMIN' ? '/admin' : '/agente/propiedades'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center font-bold text-white bg-primary py-2.5 rounded-lg text-sm"
                  >
                    Panel de Control
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="w-full text-center font-bold text-red-600 bg-red-50 py-2.5 rounded-lg text-sm"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-outline-variant/20 flex justify-between items-center text-xs text-on-surface-variant">
                <span>CR7 Inmobiliaria</span>
                <span 
                  onClick={handleLogoDoubleClick}
                  className="cursor-pointer text-primary/10 hover:text-primary/30 py-1 px-2"
                >
                  Acceso
                </span>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white pt-12 pb-8 border-t border-primary-container">
        <div className="max-w-container-max mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4 select-none">
              <img 
                src="/logo_inmobiliaria.png" 
                alt="CR7 Logo" 
                className="h-9 w-9 object-contain bg-white rounded-lg p-0.5"
              />
              <span className="font-display font-extrabold text-lg tracking-tight text-white">
                CR7 <span className="text-secondary-fixed">INMOBILIARIA</span>
              </span>
            </div>
            <p className="text-sm text-on-primary-container leading-relaxed">
              Las mejores propiedades en la costa caribeña colombiana. Exclusividad, transparencia y el mejor servicio.
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold text-md text-white mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm text-on-primary-container">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
              </li>
              <li>
                <Link to="/propiedades" className="hover:text-white transition-colors">Portafolio de Inmuebles</Link>
              </li>
              <li>
                <a href="#vender" onClick={(e) => handleScrollToSection(e, 'vender')} className="hover:text-white transition-colors">Consignar Propiedad</a>
              </li>
              <li>
                <a href="#contacto" onClick={(e) => handleScrollToSection(e, 'contacto')} className="hover:text-white transition-colors">Contacto directo</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-md text-white mb-4">Ubicación & Contacto</h4>
            <p className="text-sm text-on-primary-container mb-2">
              <span className="font-semibold">Dirección:</span> Santa Marta, Colombia
            </p>
            <p className="text-sm text-on-primary-container mb-2">
              <span className="font-semibold">WhatsApp:</span> +57 (300) 123-4567
            </p>
            <p className="text-sm text-on-primary-container">
              <span className="font-semibold">Email:</span> contacto@cr7inmobiliaria.com
            </p>
          </div>
        </div>

        <div className="max-w-container-max mx-auto px-6 mt-12 pt-6 border-t border-primary-container/40 flex flex-col md:flex-row items-center justify-between text-xs text-on-primary-container">
          <p>
            &copy; {new Date().getFullYear()} CR7 INMOBILIARIA. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span 
              onClick={handleLogoDoubleClick}
              className="cursor-pointer hover:text-white opacity-20 hover:opacity-100 transition-opacity"
            >
              Acceso Privado
            </span>
            <span>Desarrollado con ❤️ para Santa Marta</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
