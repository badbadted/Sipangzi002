/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Fredoka', 'Microsoft JhengHei', 'sans-serif'],
      },
      colors: {
        primary: '#059669', // Emerald 600 (Godzilla Skin)
        primaryLight: '#34D399', // Emerald 400
        secondary: '#8B5CF6', // Violet 500 (Atomic Breath)
        accent: '#F472B6', // Pink 400 (Cute Cheeks)
        background: '#ECFDF5', // Green 50
        card: '#FFFFFF',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
