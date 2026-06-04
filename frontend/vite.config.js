import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
   proxy: {
  '/api': 'https://quiz-app-production-be4e.up.railway.app'
}
  }
})
