import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    
    tailwindcss()
  ],
  define: {
    global: 'globalThis', // <--- THIS IS CRUCIAL
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
  server: {
    host: '0.0.0.0',  // <- allows access from other devices
    port: 5173        // <- default Vite port
  }
})
