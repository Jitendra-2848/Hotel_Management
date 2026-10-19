/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: "#F9F7F7",
          peach: "#F7D6D0",
          rose: "#E2B4BD",
          charcoal: "#4A4A4A",
          white: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
