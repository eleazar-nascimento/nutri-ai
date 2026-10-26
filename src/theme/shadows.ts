/**
 * Sombras, Raios de Borda e Espaçamentos — Nutri AI
 * Extraídos do Figma Style Guide (EFFECT 100 / 200 e Grid)
 */
export const shadows = {
  100: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  200: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 2,
  },
} as const;

export const radii = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 30,
  full: 100,
} as const;

export const layout = {
  screenWidth: 428,
  contentWidth: 388,
  horizontalPadding: 20,
} as const;

