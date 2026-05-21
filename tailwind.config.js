/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        rose: {
          50: '#fff7f7',
          100: '#ffe9ea',
          200: '#ffd1d4',
          300: '#ffa8ae',
          400: '#ff7682',
          500: '#f43f5e',
          600: '#d92846',
          700: '#b41f3a',
          800: '#8f1c33',
          900: '#761b2e',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
}
