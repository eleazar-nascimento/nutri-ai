/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#FF5A16",
          DEFAULT: "#FF5A16",
        },
        message: {
          100: "#04B155",
          200: "#C93838",
          green: "#04B155",
          red: "#C93838",
        },
        grayscale: {
          100: "#FFFFFF",
          200: "#C3C3C3",
          300: "#474747",
          400: "#2F2F2F",
          500: "#232220",
          600: "#121212",
          700: "#101211",
          800: "#030401",
        },
        accent: {
          100: "#DDC0FF", // Roxo pastel (Carboidratos / Destaque)
          200: "#F5F378", // Amarelo pastel (Gorduras / Destaque)
          300: "#45C588", // Verde menta (Proteínas / Meta)
          400: "#FF6F43", // Coral (Calorias)
        },
      },
      fontFamily: {
        sans: ["SpaceGrotesk_400Regular", "sans-serif"],
        regular: ["SpaceGrotesk_400Regular", "sans-serif"],
        medium: ["SpaceGrotesk_500Medium", "sans-serif"],
        semibold: ["SpaceGrotesk_600SemiBold", "sans-serif"],
        bold: ["SpaceGrotesk_700Bold", "sans-serif"],
      },
      fontSize: {
        "large-title": ["34px", { lineHeight: "51px", fontWeight: "600" }],
        "title-1": ["28px", { lineHeight: "42px", fontWeight: "600" }],
        "title-2": ["24px", { lineHeight: "36px", fontWeight: "600" }],
        "title-3": ["20px", { lineHeight: "30px", fontWeight: "600" }],
        headline: ["18px", { lineHeight: "27px", fontWeight: "600" }],
        subheadline: ["15px", { lineHeight: "22px", fontWeight: "500" }],
        body: ["17px", { lineHeight: "25px", fontWeight: "400" }],
        "body-2": ["15px", { lineHeight: "22px", fontWeight: "400" }],
        callout: ["16px", { lineHeight: "24px", fontWeight: "500" }],
        "caption-1": ["18px", { lineHeight: "27px", fontWeight: "600" }],
        "caption-2": ["15px", { lineHeight: "22px", fontWeight: "600" }],
        footnote: ["13px", { lineHeight: "19px", fontWeight: "400" }],
      },
      borderRadius: {
        xs: "6px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        pill: "30px",
        full: "100px",
      },
    },
  },
  plugins: [],
};

