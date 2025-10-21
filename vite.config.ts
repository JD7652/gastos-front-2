// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite'; // 🚨 Importa el plugin de Vite

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 🚨 Agrega el plugin de Vite de Tailwind
  ],
  // Nota: No necesitas una sección 'css: { postcss: { plugins: [...] } }' aquí.
});