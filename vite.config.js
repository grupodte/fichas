import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // explícito
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
