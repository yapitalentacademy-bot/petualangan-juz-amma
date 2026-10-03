/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gading': '#F8F4EA',
        'gading-kartu': '#FFFDF6',
        'marmer-urat': '#E9E1D0',
        'ornamen': '#D9CBB0',
        'zamrud-tua': '#0E4D34',
        'zamrud': '#1B6B47',
        'zamrud-garis': '#3A9D6A',
        'emas-terang': '#F3D88A',
        'emas': '#C9A04A',
        'emas-tua': '#9C7A2E',
        'teks': '#2B2A26',
        'gunung-pasir': '#CDBFA6',
        // Backward compatibility mappings if needed
        'pasir-terang': '#F8F4EA',
        'pasir': '#E9E1D0',
        'malam': '#2B2A26',
        'terakota': '#C0603A',
        'biru-laut': '#1B6B47',
      },
      backgroundImage: {
        'gradien-emas': 'linear-gradient(135deg, #F3D88A 0%, #C9A04A 55%, #9C7A2E 100%)',
        'gradien-zamrud': 'linear-gradient(135deg, #1B6B47 0%, #0E4D34 100%)',
      },
      fontFamily: {
        ayat: ['"Scheherazade New"', '"Amiri Quran"', '"Amiri"', 'serif'],
        arab: ['"Amiri"', '"Reem Kufi"', 'serif'],
        judul: ['"Marcellus"', 'Georgia', 'serif'],
        display: ['"Marcellus"', 'serif'],
        teks: ['"Montserrat"', 'system-ui', 'sans-serif'],
        sans: ['"Montserrat"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'touch': '0 6px 0 0 #0E4D34',
        'touch-active': '0 2px 0 0 #0E4D34',
        'btn-zamrud': '0 6px 0 0 #083020, 0 10px 18px rgba(14, 77, 52, 0.35)',
        'btn-emas': '0 6px 0 0 #7A5F23, 0 10px 18px rgba(201, 160, 74, 0.35)',
        'card-glow': '0 8px 24px -4px rgba(14, 77, 52, 0.25)',
        'emas-glow': '0 0 20px rgba(201, 160, 74, 0.45)',
        'emas-soft': '0 4px 20px -2px rgba(201, 160, 74, 0.25)',
      },
      borderRadius: {
        'kartu': '28px',
        'kapsul': '999px',
        'mihrab': '40px 40px 24px 24px',
      }
    },
  },
  plugins: [],
}
