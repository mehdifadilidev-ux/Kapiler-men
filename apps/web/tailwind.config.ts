import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        black: '#000000',
        gray: { DEFAULT: '#878787' },
        bois: {
          DEFAULT: '#BB7348',
          light: 'rgba(187, 115, 72, 0.15)',
        },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        bodoni: ['Bodoni Moda', 'serif'],
      },
      animation: {
        scroll: 'scroll 30s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
