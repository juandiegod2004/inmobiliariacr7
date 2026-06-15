import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

export default function Layout({ children }) {
  const { user, isAuthenticated, logout, settings } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('')
      return
    }

    const sections = ['vender', 'featured', 'about', 'contact']

    const handleScroll = () => {
      if (window.scrollY < 150) {
        setActiveSection('inicio')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0
    }

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      sections.forEach(id => {
        const el = document.getElementById(id)
        if (el) observer.unobserve(el)
      })
    }
  }, [location.pathname])

  const handleLogoDoubleClick = () => {
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
    <div className="min-h-screen flex flex-col bg-background text-on-surface font-body-md selection:bg-secondary-container selection:text-on-secondary-container">
      {/* 1. Sticky Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-md shadow-primary/5 border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-margin-mobile py-3 max-w-container-max mx-auto">
          {/* Logo */}
          <Link 
            to="/" 
            onDoubleClick={handleLogoDoubleClick}
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
            className="flex items-center hover:opacity-95 transition-opacity select-none"
            title="Doble clic para administrador"
          >
            <img 
              id="nav-logo-img" 
              alt="CR7 Inmobiliaria Logo" 
              className="h-10" 
              src="/images/logo.png"
              onError={(e) => { e.target.src = '/logo_inmobiliaria.png' }}
            />
          </Link>

          {/* Menú Desktop */}
          <div className="hidden md:flex gap-6 items-center">
            <Link 
              to="/" 
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className={`${
                activeSection === 'inicio' && location.pathname === '/'
                  ? 'text-secondary font-semibold border-b-2 border-secondary'
                  : 'text-on-surface-variant hover:text-primary transition-colors'
              } font-label-md text-label-md py-1`}
            >
              Inicio
            </Link>
            <a 
              href="#featured" 
              onClick={(e) => handleScrollToSection(e, 'featured')}
              className={`${
                activeSection === 'featured' && location.pathname === '/'
                  ? 'text-secondary font-semibold border-b-2 border-secondary'
                  : 'text-on-surface-variant hover:text-primary transition-colors'
              } font-label-md text-label-md py-1`}
            >
              Arrendar
            </a>
            <a 
              href="#vender" 
              onClick={(e) => handleScrollToSection(e, 'vender')}
              className={`${
                activeSection === 'vender' && location.pathname === '/'
                  ? 'text-secondary font-semibold border-b-2 border-secondary'
                  : 'text-on-surface-variant hover:text-primary transition-colors'
              } font-label-md text-label-md py-1`}
            >
              Vender
            </a>
            <a 
              href="#about" 
              onClick={(e) => handleScrollToSection(e, 'about')}
              className={`${
                activeSection === 'about' && location.pathname === '/'
                  ? 'text-secondary font-semibold border-b-2 border-secondary'
                  : 'text-on-surface-variant hover:text-primary transition-colors'
              } font-label-md text-label-md py-1`}
            >
              Nosotros
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleScrollToSection(e, 'contact')}
              className={`${
                activeSection === 'contact' && location.pathname === '/'
                  ? 'text-secondary font-semibold border-b-2 border-secondary'
                  : 'text-on-surface-variant hover:text-primary transition-colors'
              } font-label-md text-label-md py-1`}
            >
              Contacto
            </a>

            {/* Acceso/Sesión si está logueado */}
            {isAuthenticated && (
              <div className="flex items-center gap-3 border-l border-outline-variant pl-4">
                <span className="text-[10px] px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full font-bold uppercase">
                  {user.role}
                </span>
                {user.role !== 'CLIENT' && (
                  <Link 
                    to={user.role === 'ADMIN' ? '/admin' : '/agente/propiedades'}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Panel
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-xs text-red-600 font-bold hover:underline"
                >
                  Salir
                </button>
              </div>
            )}
          </div>

          {/* Hablar con Asesor / Botón Hamburguesa */}
          <div className="flex items-center gap-3">
            <a 
              href={`https://wa.me/${settings?.phone || '573002510313'}`} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 bg-secondary text-on-secondary px-4 py-2 rounded-full font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all shadow-sm"
              id="header-whatsapp-btn"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span className="hidden sm:inline">Hablar con un asesor</span>
            </a>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 text-primary focus:outline-none"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Menú Móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-surface border-t border-outline-variant/30 px-margin-mobile py-4 flex flex-col gap-4 animate-fade-in shadow-lg">
            <Link 
              to="/" 
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
                setMobileMenuOpen(false);
              }}
              className={`font-semibold text-sm ${
                activeSection === 'inicio' && location.pathname === '/'
                  ? 'text-secondary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Inicio
            </Link>
            <a 
              href="#featured" 
              onClick={(e) => handleScrollToSection(e, 'featured')}
              className={`font-semibold text-sm ${
                activeSection === 'featured' && location.pathname === '/'
                  ? 'text-secondary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Arrendar
            </a>
            <a 
              href="#vender" 
              onClick={(e) => handleScrollToSection(e, 'vender')}
              className={`font-semibold text-sm ${
                activeSection === 'vender' && location.pathname === '/'
                  ? 'text-secondary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Vender
            </a>
            <a 
              href="#about" 
              onClick={(e) => handleScrollToSection(e, 'about')}
              className={`font-semibold text-sm ${
                activeSection === 'about' && location.pathname === '/'
                  ? 'text-secondary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Nosotros
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleScrollToSection(e, 'contact')}
              className={`font-semibold text-sm ${
                activeSection === 'contact' && location.pathname === '/'
                  ? 'text-secondary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Contacto
            </a>

            {isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-4 border-t border-outline-variant/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full font-bold">
                    {user.role}
                  </span>
                  <span className="text-on-surface-variant font-medium">
                    {user.name}
                  </span>
                </div>
                {user.role !== 'CLIENT' && (
                  <Link 
                    to={user.role === 'ADMIN' ? '/admin' : '/agente/propiedades'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center font-bold text-white bg-primary py-2 rounded-lg text-sm shadow-md"
                  >
                    Panel de Control
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="w-full text-center font-bold text-red-600 bg-red-50 py-2 rounded-lg text-sm border border-red-200"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-outline-variant/10 text-right">
                <span 
                  onClick={handleLogoDoubleClick}
                  className="cursor-pointer text-primary/10 hover:text-primary/30 py-1 px-2 text-xs"
                >
                  Acceso
                </span>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-on-primary pt-16 pb-8 border-t border-white/10">
        <div className="px-margin-mobile max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
            <div className="flex-1">
              <img 
                id="footer-logo-img" 
                alt="CR7 Inmobiliaria" 
                className="h-12 mb-6 brightness-0 invert" 
                src="/images/logo.png"
                onError={(e) => { e.target.src = '/logo_inmobiliaria.png' }}
              />
              <p className="text-on-primary/70 font-body-sm max-w-xs">
                Tu aliado experto en el mercado inmobiliario de Santa Marta. Transparencia, compromiso y resultados garantizados.
              </p>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-headline-sm mb-6 text-white font-bold">Enlaces</h4>
                <ul className="space-y-3 font-body-sm text-on-primary/80">
                  <li>
                    <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
                  </li>
                  <li>
                    <a href="#featured" onClick={(e) => handleScrollToSection(e, 'featured')} className="hover:text-white transition-colors">Propiedades</a>
                  </li>
                  <li>
                    <a href="#vender" onClick={(e) => handleScrollToSection(e, 'vender')} className="hover:text-white transition-colors">Vender</a>
                  </li>
                  <li>
                    <a href="#about" onClick={(e) => handleScrollToSection(e, 'about')} className="hover:text-white transition-colors">Nosotros</a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-headline-sm mb-6 text-white font-bold">Legal</h4>
                <ul className="space-y-3 font-body-sm text-on-primary/80">
                  <li><a class="hover:text-white transition-colors" href="#">Privacidad</a></li>
                  <li><a class="hover:text-white transition-colors" href="#">Términos</a></li>
                  <li><a class="hover:text-white transition-colors" href="#">Cookies</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col items-center text-center gap-4">
            <p 
              onDoubleClick={handleLogoDoubleClick}
              className="font-body-sm text-on-primary/60 cursor-pointer select-none"
            >
              © 2026 CR7 Inmobiliaria Santa Marta. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
