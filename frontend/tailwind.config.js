/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#a6825f',
        'primary-dark': '#8b6b4a',
        sidebar: '#565656',
        'sidebar-border': '#666666',
      }
    },
  },
  plugins: [],
}
