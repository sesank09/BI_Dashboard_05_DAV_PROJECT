/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#d9e2f0',
          500: '#1e4b85',
          800: '#123A6D', // Primary Navy
          900: '#0b2344',
        },
        royal: {
          500: '#3b82f6',
          600: '#2563EB', // Royal Blue
        },
        tealCustom: {
          600: '#0D9488', // Teal
        },
        slateCustom: {
          50: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
