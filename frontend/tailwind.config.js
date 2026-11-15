/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-purple': '#4A1259',
        'deep-purple': '#2D0A3D',
        'gold': '#D4A017',
        'gold-light': '#F5C842',
        'cream': '#FFF8E7',
        'midnight-blue': '#0A0F2C',
        'accent-orange': '#E85D04',
        'mysore-maroon': '#800020',
        'heritage-green': '#1B5E20',
        'palace-yellow': '#FFC107',
      },
      fontFamily: {
        'display': ['Playfair Display', 'Georgia', 'serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'kannada': ['Noto Sans Kannada', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(135deg, #2D0A3D 0%, #4A1259 50%, #0A0F2C 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4A017 0%, #F5C842 50%, #D4A017 100%)',
        'palace-gradient': 'linear-gradient(180deg, #0A0F2C 0%, #2D0A3D 40%, #4A1259 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212, 160, 23, 0.4)',
        'purple-glow': '0 0 30px rgba(74, 18, 89, 0.6)',
        'royal': '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(212, 160, 23, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(212, 160, 23, 0.8)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
