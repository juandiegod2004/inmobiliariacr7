import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from '../components/Layout'
import PrivateRoute from './PrivateRoute'
import PublicOnlyRoute from './PublicOnlyRoute'

// Páginas Públicas
import HomePage from '../pages/public/HomePage'
import PropertiesPage from '../pages/public/PropertiesPage'
import PropertyDetailPage from '../pages/public/PropertyDetailPage'
import LoginPage from '../pages/public/LoginPage'
import NotFoundPage from '../pages/public/NotFoundPage'

// Páginas Protegidas
import AdminDashboardPage from '../pages/protected/AdminDashboardPage'
import AdminPropertiesPage from '../pages/protected/AdminPropertiesPage'
import AgentPropertiesPage from '../pages/protected/AgentPropertiesPage'

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

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Rutas Públicas (Envueltas en el Layout general) */}
        <Route element={<Layout><HomePage /></Layout>} path="/" />
        <Route element={<Layout><PropertiesPage /></Layout>} path="/propiedades" />
        <Route element={<Layout><PropertyDetailPage /></Layout>} path="/propiedad/:id" />

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
    </BrowserRouter>
  )
}
