import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

/** @type {import('postcss').Config} */
export default {
  plugins: [
    tailwind({
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
    }),
    autoprefixer,
  ],
}