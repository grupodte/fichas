/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        minecraft: ['"Minecraft"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


