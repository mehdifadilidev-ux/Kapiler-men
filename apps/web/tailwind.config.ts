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
    },
  },
  plugins: [],
};

export default config;
