import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: '/absensi/', // gunakan ini sesuai nama repository GitHub
  plugins: [react()],
})
