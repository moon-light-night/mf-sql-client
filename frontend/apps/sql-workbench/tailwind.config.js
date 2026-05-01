/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,ts,tsx}',
    '../../packages/frontend-ui/src/**/*.{vue,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
