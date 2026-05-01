/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        'noir-profond': '#0A0805',
        'noir-velours': '#15110D',
        'or-pur': '#D4A574',
        'or-liquide': '#F4C977',
        'or-sombre': '#8B6F47',
        'or-pale': '#F4E4C1',
        'ivoire-chaud': '#F0E5D0',
        'ivoire-soft': '#C8B89E',
        'encre-doux': '#2A2218',
        bordeaux: '#4A1F1F',
        'blush-or': '#C49A8A',
        /* Alias héritage */
        ivoire: { DEFAULT: '#F0E5D0', deep: '#15110D' },
        blush: { DEFAULT: '#C49A8A', deep: '#9a7568' },
        mauve: { DEFAULT: '#6B5A72', deep: '#4a3d52' },
        'or-rose': { DEFAULT: '#D4A574', deep: '#8B6F47' },
        encre: { DEFAULT: '#F0E5D0', soft: '#C8B89E' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['Jost', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
