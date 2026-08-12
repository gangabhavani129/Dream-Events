import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDF8F3',
          100: '#FAF0E6',
          200: '#F3DEC7',
          300: '#E7C39A',
          400: '#D69E66',
          500: '#C27B38',
          600: '#A95E26',
          700: '#8A451E',
          800: '#6E361B',
          900: '#5A2D19',
          950: '#34160B',
        },
        gold: {
          50: '#FFFDF5',
          100: '#FFF9E6',
          200: '#FEF0BF',
          300: '#FDE38A',
          400: '#FCD34D',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        rosewood: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
          950: '#4C0519',
        },
        marigold: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        emeraldGreen: {
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(180, 83, 9, 0.15)',
        'luxury-hover': '0 20px 40px -15px rgba(180, 83, 9, 0.25)',
        'gold-glow': '0 0 25px rgba(245, 158, 11, 0.25)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)',
        'royal-gradient': 'linear-gradient(135deg, #881337 0%, #9F1239 40%, #B45309 100%)',
        'ivory-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #FAF6F0 100%)',
      }
    },
  },
  plugins: [],
};

export default config;
