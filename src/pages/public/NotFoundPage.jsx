import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-12 text-center space-y-6">
      <div className="inline-flex items-center justify-center p-6 bg-primary/10 rounded-3xl text-primary mb-2">
        <span className="material-symbols-outlined text-6xl">
          error_outline
        </span>
      </div>
      <h1 className="font-display font-extrabold text-4xl text-primary tracking-tight">
        Página No Encontrada
      </h1>
      <p className="text-on-surface-variant text-sm max-w-sm mx-auto leading-relaxed">
        Lo sentimos, la ruta que buscas no existe o ha sido movida. Puedes volver al catálogo principal.
      </p>
      <div className="pt-4">
        <Link 
          to="/"
          className="px-6 py-3.5 bg-primary hover:bg-primary-container text-white font-bold rounded-xl transition-all shadow-md text-sm inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">home</span>
          Volver al Inicio
        </Link>
      </div>
    </div>
  )
}
