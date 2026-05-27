/** @type {import('tailwindcss').Config} */
export default {
  // 1. Precise content tracking for faster builds
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 2. Custom Color Palette (Optimized for Dark Mode UI)
      colors: {
        brand: {
          light: '#6366f1', // Indigo-500
          DEFAULT: '#4f46e5', // Indigo-600
          dark: '#3730a3', // Indigo-800
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          800: '#1e293b',
          900: '#0f172a', // Deep navy for backgrounds
        }
      },
      // 3. Custom Animations for Audio Processing
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'subtle-float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      },
      // 4. Custom Backdrop Blurs for "Glassmorphism"
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
