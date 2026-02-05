/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#C17817',
          50: '#FDF6EC',
          100: '#FAECD5',
          200: '#F3D4A3',
          300: '#EBB96E',
          400: '#D9952F',
          500: '#C17817',
          600: '#A66413',
          700: '#7E4C0F',
          800: '#56350B',
          900: '#2F1D06',
        },
        charcoal: '#1c1c1c',
      },
    },
  },
  plugins: [],
}
