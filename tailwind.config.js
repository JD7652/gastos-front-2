// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default { // ✅ Usa 'export default'
    // Verifica que estas rutas apunten a donde usas las clases de Tailwind
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};