import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palette enrichie : plus de nuances pour créer de la profondeur
        nuit: {
          DEFAULT: '#0A2342',
          900: '#071729',
          800: '#0A2342',
          700: '#13355C',
          600: '#1C4776',
          500: '#2A5A8A',
          400: '#4A7AAF',
          300: '#7A9BC4',
          200: '#AEC3DA',
          100: '#D5E0EC',
          50: '#EDF2F8',
        },
        // Cuivre chaud : rappel du minerai, plus chaud et saturé
        cuivre: {
          DEFAULT: '#B87333',
          700: '#9A5F29',
          600: '#B87333',
          500: '#D4956A',
          400: '#E8B995',
          300: '#F0D4BC',
          200: '#F7E8DA',
          100: '#FAF3EF',
        },
        // Or : mise en avant, action, confiance
        or: {
          DEFAULT: '#D4A017',
          500: '#D4A017',
          400: '#EFC75E',
          300: '#F5D78E',
          200: '#FAEEB5',
          100: '#FBF5D9',
        },
        // Sable chaud : fond naturel, plus chaud que le blanc froid
        sable: {
          DEFAULT: '#F7F4EE',
          50: '#FBF8F5',
          100: '#F5F0E8',
          200: '#EBE2D4',
          300: '#D9CBB8',
          400: '#C4AFA5',
          500: '#A89482',
        },
        ardoise: {
          DEFAULT: '#1B2430',
          900: '#141B22',
          800: '#1B2430',
          700: '#2A3544',
          600: '#3D4A5C',
          500: '#5A6878',
          400: '#7A8798',
          300: '#9AA5B5',
          200: '#C0CAD4',
          100: '#E5E9ED',
          50: '#F4F5F6',
        },
        // Rouge doux : erreurs, alertes, danger - moins agressif
        rouge: {
          DEFAULT: '#C53030',
          600: '#C53030',
          500: '#D94545',
          400: '#F56B6B',
          300: '#FAA5A5',
          200: '#FDCAAA',
          100: '#FEE9D9',
          50: '#FDF2F2',
        },
        // Vert sophistiqué : succès, confirmation
        vert: {
          DEFAULT: '#2F855A',
          600: '#2F855A',
          500: '#3DA56E',
          400: '#68C9A0',
          300: '#A7E4C9',
          200: '#D5F0E0',
          100: '#EAF7EE',
          50: '#F5F9F6',
        },
        // Gris utilisé pour les états neutres
        menin: {
          DEFAULT: '#8B8580',
          500: '#8B8580',
          400: '#A6A09A',
          300: '#C5C0BA',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      maxWidth: {
        lisible: '68ch',
        large: '80ch',
        etendu: '96ch',
      },
      boxShadow: {
        carte: '0 1px 2px rgba(10,35,66,.08), 0 8px 24px -12px rgba(10,35,66,.25)',
        carteEleve: '0 4px 12px rgba(10,35,66,.1), 0 16px 40px -16px rgba(10,35,66,.35)',
        discret: '0 1px 3px rgba(10,35,66,.06), 0 1px 2px rgba(10,35,66,.04)',
        porte: '0 1px 3px rgba(10,35,66,.15), 0 4px 12px rgba(10,35,66,.1)',
      },
      // Typographie améliorée
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '68ch',
            color: '#1B2430',
            a: { color: '#B87333', '&:hover': { color: '#9A5F29' } },
            h1: { color: '#0A2342', fontWeight: '600', lineHeight: '1.15', letterSpacing: '-0.02em' },
            h2: { color: '#0A2342', fontWeight: '600', lineHeight: '1.2', letterSpacing: '-0.01em' },
            h3: { color: '#1B2430', fontWeight: '600', lineHeight: '1.25' },
            code: { backgroundColor: '#F7F4EE', color: '#1B2430', padding: '0.15em 0.4em', borderRadius: '0.25rem' },
            '::selection': { backgroundColor: '#D4A017', color: '#0A2342' },
          },
        },
      },
      // Espacements plus travaillés
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
      // Animations subtiles et naturelles
      animation: {
        'entree': 'entree 0.4s ease-out forwards',
        'flottant': 'flottant 6s ease-in-out infinite',
        'pulse-doux': 'pulse-doux 2s ease-in-out infinite',
      },
      keyframes: {
        entree: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flottant: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-doux': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
};

export default config;