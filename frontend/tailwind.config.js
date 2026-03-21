/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5e81ac',
        'primary-dark': '#4c6a91',
        sidebar: '#2e3440',
        'sidebar-border': '#4c566a',
      }
    },
  },
  plugins: [],
}
