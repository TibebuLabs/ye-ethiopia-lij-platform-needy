/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#2E8B57',
          light: '#3CB371',
          dark: '#1e6b40',
        },
      },
      keyframes: {
        slideIn: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '20%': { transform: 'rotate(-15deg)' },
          '40%': { transform: 'rotate(15deg)' },
          '60%': { transform: 'rotate(-10deg)' },
          '80%': { transform: 'rotate(10deg)' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.2s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
        wiggle: 'wiggle 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
}
