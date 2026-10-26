import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { colors, typography, TypographyVariant } from "@/theme";

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = "body",
  color = colors.grayscale[100],
  align = "left",
  style,
  children,
  ...rest
}) => {
  const variantStyle = typography[variant];

  return (
    <Text
      style={[
        {
          fontFamily: variantStyle.fontFamily,
          fontWeight: variantStyle.fontWeight,
          fontSize: variantStyle.fontSize,
          lineHeight: variantStyle.lineHeight,
          letterSpacing: variantStyle.letterSpacing,
          color,
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

