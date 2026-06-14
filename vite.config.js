import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite para compilar y servir la aplicación React
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: 'localhost'
  }
})
