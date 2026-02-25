/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
        },
        background: 'var(--color-background)',
        text1: 'var(--color-text1)',
        text2: 'var(--color-text2)',
        text3: 'var(--color-text3)',
      }
    },
  },
  plugins: [],
}

