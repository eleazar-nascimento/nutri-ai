/**
 * Paleta de Cores Oficial — Nutri AI Food Calorie Tracker App
 * Extraída diretamente do Figma Style Guide (Node 105:224)
 */
export const colors = {
  primary: {
    100: "#FF5A16",
    DEFAULT: "#FF5A16",
  },
  message: {
    100: "#04B155", // Message/Green
    200: "#C93838", // Message/Red
    green: "#04B155",
    red: "#C93838",
  },
  grayscale: {
    100: "#FFFFFF", // Branco / Texto Principal
    200: "#C3C3C3", // Texto Secundário / Placeholder
    300: "#474747", // Inativo / Borda Secundária / Disabled
    400: "#2F2F2F", // Bordas de Cards / Fundo de Botões Secundários Dark
    500: "#232220", // Superfície de Cards / Containers
    600: "#121212", // Fundo Principal do App (Dark Background)
    700: "#101211", // Fundo Escuro Alternativo
    800: "#030401", // Preto Absoluto de Contraste
  },
  accent: {
    100: "#DDC0FF", // Lilás / Roxo Pastel
    200: "#F5F378", // Amarelo Pastel
    300: "#45C588", // Verde Menta
    400: "#FF6F43", // Laranja Coral
  },
  system: {
    separatorLight: "rgba(60, 60, 67, 0.36)",
    separatorDark: "rgba(84, 84, 88, 0.65)",
    labelSecondaryLight: "rgba(60, 60, 67, 0.60)",
    labelSecondaryDark: "rgba(235, 235, 245, 0.60)",
    blueLight: "#007AFF",
    blueDark: "#0A84FF",
    surfaceLight: "#F4F4F4",
    shareSheetBg: "#252B39",
  },
} as const;

export type ColorPalette = typeof colors;

