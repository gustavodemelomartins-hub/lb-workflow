import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// App interno em rede local — host:true expõe na 192.168.0.X para demonstrar em qualquer PC.
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
})
