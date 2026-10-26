/**
 * Tipografia Oficial — Nutri AI Food Calorie Tracker App
 * Fonte: Space Grotesk (Figma Node 880:991)
 */
export const fontFamilies = {
  regular: "SpaceGrotesk_400Regular",
  medium: "SpaceGrotesk_500Medium",
  semiBold: "SpaceGrotesk_600SemiBold",
  bold: "SpaceGrotesk_700Bold",
} as const;

export type TypographyVariant =
  | "largeTitle"
  | "title1"
  | "title2"
  | "title3"
  | "headline"
  | "subheadline"
  | "body"
  | "body2"
  | "callout"
  | "caption1"
  | "caption2"
  | "footnote";

export interface TypographyStyle {
  fontFamily: string;
  fontWeight: "400" | "500" | "600" | "700";
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  labelPt: string;
  weightLabel: string;
}

export const typography: Record<TypographyVariant, TypographyStyle> = {
  largeTitle: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: "600",
    fontSize: 34,
    lineHeight: 51,
    letterSpacing: 0,
    labelPt: "Título Grande (Large Title)",
    weightLabel: "Bold / SemiBold",
  },
  title1: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: "600",
    fontSize: 28,
    lineHeight: 42,
    letterSpacing: 0,
    labelPt: "Título 1 (Title 1)",
    weightLabel: "Bold / SemiBold",
  },
  title2: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: "600",
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: 0,
    labelPt: "Título 2 (Title 2)",
    weightLabel: "Bold / SemiBold",
  },
  title3: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: 0,
    labelPt: "Título 3 (Title 3)",
    weightLabel: "Bold / SemiBold",
  },
  headline: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 27,
    letterSpacing: 0,
    labelPt: "Cabeçalho (Headline)",
    weightLabel: "Semi Bold",
  },
  subheadline: {
    fontFamily: fontFamilies.medium,
    fontWeight: "500",
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
    labelPt: "Subcabeçalho (Subheadline)",
    weightLabel: "Medium",
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontWeight: "400",
    fontSize: 17,
    lineHeight: 25,
    letterSpacing: 0,
    labelPt: "Corpo 1 (Body)",
    weightLabel: "Regular",
  },
  body2: {
    fontFamily: fontFamilies.regular,
    fontWeight: "400",
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
    labelPt: "Corpo 2 (Body 2)",
    weightLabel: "Regular",
  },
  callout: {
    fontFamily: fontFamilies.medium,
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    labelPt: "Destaque (Callout)",
    weightLabel: "Medium",
  },
  caption1: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 27,
    letterSpacing: 0,
    labelPt: "Legenda 1 (Caption 1)",
    weightLabel: "Semi Bold",
  },
  caption2: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: "600",
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
    labelPt: "Legenda 2 (Caption 2)",
    weightLabel: "Semi Bold",
  },
  footnote: {
    fontFamily: fontFamilies.regular,
    fontWeight: "400",
    fontSize: 13,
    lineHeight: 19,
    letterSpacing: 0,
    labelPt: "Nota de Rodapé (Footnote)",
    weightLabel: "Regular",
  },
};

