/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FDF5F3",
          100: "#FBEAE7",
          200: "#F6D5CF",
          300: "#F1BFB7",
          400: "#ECAA9F",
          500: "#E07A5F",
          600: "#B3624C",
          700: "#864939",
          800: "#593126",
          900: "#2C1813"
        },
        secondary: {
          50: "#F0F4F8",
          100: "#E1E9F1",
          200: "#C3D3E3",
          300: "#A5BDD5",
          400: "#87A7C7",
          500: "#3D5A80",
          600: "#314866",
          700: "#25364D",
          800: "#192433",
          900: "#0C121A"
        },
        accent: {
          50: "#FEF9F0",
          100: "#FDF3E1",
          200: "#FBE7C3",
          300: "#F9DBA5",
          400: "#F7CF87",
          500: "#F4A261",
          600: "#C3824E",
          700: "#92613A",
          800: "#624127",
          900: "#312013"
        },
        success: "#81B29A",
        warning: "#F2CC8F",
        error: "#EE6C4D",
        info: "#98C1D9",
        background: "#FAF9F7",
        surface: "#FFFFFF"
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}