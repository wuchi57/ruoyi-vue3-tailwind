/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        bs01: '0 1px 4px rgba(0, 21, 41, .08)',
        bs02: '2px 0 6px rgba(0,21,41,.35)',
      }
    },
  },
  plugins: [],
}

