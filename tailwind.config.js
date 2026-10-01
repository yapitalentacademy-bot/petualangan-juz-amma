/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        desert: {
          50: '#fdfbf7',
          100: '#f9f5ec',
          200: '#f3e9d2',
          300: '#e9d6ae',
          400: '#dcbe85',
          500: '#cfa661',
          600: '#b88a4c',
          700: '#996e3e',
          800: '#7d5836',
          900: '#67482f',
          dark: '#3d2b1f',
        },
        oasis: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        gold: {
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        }
      },
      fontFamily: {
        arabic: ['"Scheherazade New"', '"Amiri"', 'serif'],
        sans: ['"Nunito"', '"Fredoka"', 'system-ui', 'sans-serif'],
        display: ['"Lilita One"', '"Fredoka"', '"Nunito"', 'sans-serif'],
        game: ['"Lilita One"', '"Fredoka"', 'sans-serif'],
      },
      boxShadow: {
        'touch': '0 8px 0 0 rgba(0, 0, 0, 0.45)',
        'touch-active': '0 2px 0 0 rgba(0, 0, 0, 0.45)',
        'btn-gold': '0 8px 0 0 #78350f, 0 14px 20px rgba(0, 0, 0, 0.4)',
        'btn-emerald': '0 8px 0 0 #064e3b, 0 14px 20px rgba(0, 0, 0, 0.4)',
        'btn-sky': '0 8px 0 0 #0c4a6e, 0 14px 20px rgba(0, 0, 0, 0.4)',
        'card-glow': '0 12px 32px -4px rgba(16, 185, 129, 0.35)',
        'gold-glow': '0 12px 32px -4px rgba(245, 158, 11, 0.45)',
      }
    },
  },
  plugins: [],
}
