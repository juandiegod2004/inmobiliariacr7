import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Layout from '../components/Layout'
import PrivateRoute from './PrivateRoute'
import PublicOnlyRoute from './PublicOnlyRoute'

// Páginas Públicas cargadas bajo demanda (lazy loading)
const HomePage = lazy(() => import('../pages/public/HomePage'))
const PropertiesPage = lazy(() => import('../pages/public/PropertiesPage'))
const PropertyDetailPage = lazy(() => import('../pages/public/PropertyDetailPage'))
const PrivacyPolicyPage = lazy(() => import('../pages/public/PrivacyPolicyPage'))
const LoginPage = lazy(() => import('../pages/public/LoginPage'))
const NotFoundPage = lazy(() => import('../pages/public/NotFoundPage'))

// Páginas Protegidas cargadas bajo demanda (lazy loading)
const AdminDashboardPage = lazy(() => import('../pages/protected/AdminDashboardPage'))
const AdminPropertiesPage = lazy(() => import('../pages/protected/AdminPropertiesPage'))
const AgentPropertiesPage = lazy(() => import('../pages/protected/AgentPropertiesPage'))

// Componente para restaurar scroll al navegar
function ScrollToTop() {
  const { pathname, state } = useLocation()
  useEffect(() => {
    if (!state?.scrollTo) {
      window.scrollTo(0, 0)
    }
  }, [pathname, state])
  return null
}

// Cargador de página moderno
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-surface">
      <div className="w-12 h-12 border-4 border-primary/15 border-t-secondary rounded-full animate-spin"></div>
      <p className="mt-4 font-label-md text-label-md text-on-surface-variant font-medium tracking-wide">
        Cargando...
      </p>
    </div>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Rutas Públicas (Envueltas en el Layout general) */}
          <Route element={<Layout><HomePage /></Layout>} path="/" />
          <Route element={<Layout><PropertiesPage /></Layout>} path="/propiedades" />
          <Route element={<Layout><PropertyDetailPage /></Layout>} path="/propiedad/:id" />
          <Route element={<Layout><PrivacyPolicyPage /></Layout>} path="/privacidad" />

          {/* Rutas solo para No Autenticados (Login) */}
          <Route element={<PublicOnlyRoute />}>
            <Route element={<Layout><LoginPage /></Layout>} path="/login" />
          </Route>

          {/* Rutas Protegidas para Agentes (y Administradores) */}
          <Route element={<PrivateRoute allowedRoles={['AGENT', 'ADMIN']} />}>
            <Route element={<Layout><AgentPropertiesPage /></Layout>} path="/agente/propiedades" />
          </Route>

          {/* Rutas Protegidas solo para Administradores */}
          <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
            <Route element={<Layout><AdminDashboardPage /></Layout>} path="/admin" />
            <Route element={<Layout><AdminPropertiesPage /></Layout>} path="/admin/propiedades" />
          </Route>

          {/* Ruta 404 */}
          <Route element={<Layout><NotFoundPage /></Layout>} path="*" />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
