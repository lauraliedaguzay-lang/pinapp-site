/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        ivoire: { DEFAULT: '#F7F1EA', deep: '#EDE3D6' },
        blush: { DEFAULT: '#E8C5C0', deep: '#D9A9A2' },
        mauve: { DEFAULT: '#B8A2C8', deep: '#8E78A0' },
        'or-rose': { DEFAULT: '#D4A574', deep: '#B0884F' },
        encre: { DEFAULT: '#1A1614', soft: '#4A413A' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['Jost', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
