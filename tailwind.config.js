/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          900: '#0b1325',
          850: '#0f172a',
          800: '#15213b',
          700: '#1b2a4a',
        },
        brand: {
          gold: '#c9933b',
          'gold-light': '#dfab54',
          'gold-dark': '#a67324',
          accent: '#c8923a',
          dark: '#16223b',
        }
      }
    },
  },
  plugins: [],
}
