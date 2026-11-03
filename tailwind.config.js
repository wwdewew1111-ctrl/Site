const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        card: token('card'),
        elevated: token('elevated'),
        text: token('text'),
        muted: token('muted'),
        border: token('border'),
        accent: token('accent'),
        primary: {
          50: '#fff1f1',
          100: '#ffe0e0',
          200: '#ffc1c1',
          300: '#ff8f8f',
          400: '#ff5555',
          500: '#ff1e1e',
          600: '#e01010',
          700: '#b80d0d',
          800: '#8f0b0b',
          900: '#660808',
          950: '#3d0404',
        },
        secondary: {
          50: '#f5f7fa',
          100: '#eaeef3',
          200: '#d3dbe5',
          300: '#aab6c5',
          400: '#7d8ca1',
          500: '#5b6b82',
          600: '#475469',
          700: '#364052',
          800: '#262d3a',
          900: '#161b25',
          950: '#0d1017',
        },
        success: {
          50: '#ecfdf3',
          500: '#22c55e',
          700: '#15803d',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          700: '#b45309',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          700: '#b91c1c',
          900: '#7f1d1d',
        },
        ink: {
          50: '#f4f4f6',
          100: '#e4e4e7',
          300: '#a1a1aa',
          500: '#71717a',
          700: '#3f3f46',
          800: '#27272a',
          900: '#141414',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        display: ['"Russo One"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(24px) scale(0.98)' },
          to: { opacity: '1', transform: 'none' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        'fade-in': 'fade-in 0.2s ease-out both',
        'slide-up': 'slide-up 0.28s ease-out both',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
