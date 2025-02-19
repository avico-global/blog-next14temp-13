/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        theme:"#F9F9F9",
        primary:"#FF7183"
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        lineGrow: 'lineGrow 0.5s ease-out forwards',
      },
      gridTemplateColumns: {
        home: "1fr 0.3fr",
        home1: "0.8fr 0.4fr",
        article: "1fr 0.4fr",
        contact: "1fr 0.5fr",
        about: "1fr 0.5fr",
        widget: "0.5fr 1fr",
        widget1: "0.5fr 1fr",
        nav: "1fr 310px 1fr",
        banner: "1fr 0.6fr",
        bblog: "120px 1fr",
        mdbblog: "90px 1fr",
        blogPage: "1fr 350px",
        mdblogPage: "1fr 250px",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        lineGrow: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
