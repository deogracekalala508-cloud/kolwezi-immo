import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Bleu nuit : la profondeur des galeries minieres de Kolwezi
        nuit: {
          DEFAULT: '#0A2342',
          700: '#13355C',
          600: '#1C4776',
          50: '#EDF2F8',
        },
        // Cuivre et or : le metal qui fait vivre la region
        cuivre: {
          DEFAULT: '#B87333',
          600: '#9A5F29',
        },
        or: {
          DEFAULT: '#D4A017',
          300: '#EFC75E',
        },
        sable: '#F7F4EE',
        ardoise: '#1B2430',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        lisible: '68ch',
      },
      boxShadow: {
        carte: '0 1px 2px rgba(10,35,66,.08), 0 8px 24px -12px rgba(10,35,66,.25)',
      },
    },
  },
  plugins: [],
};

export default config;
