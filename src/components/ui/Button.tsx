import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  StyleSheet,
} from "react-native";
import { colors, radii } from "@/theme";
import { AppText } from "./Typography";
import { GoogleIcon, AppleIcon, ArrowIcon, ActionIcon } from "./Icons";

export type ButtonVariant = "primary" | "secondary" | "outline";
export type ButtonSize = "large" | "medium" | "small";

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Botão Oficial do Figma Style Guide (Node 62987:861)
 * - Tamanhos: Large (50px, radius 12), Medium (44px, radius 12), Small (34px, radius 8)
 * - Tipos: Primary (#FF5A16), Secondary (#FFFFFF), Outline (borda #FF5A16)
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "large",
  fullWidth = true,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...rest
}) => {
  const heightMap: Record<ButtonSize, number> = {
    large: 50,
    medium: 44,
    small: 34,
  };

  const radiusMap: Record<ButtonSize, number> = {
    large: radii.md,
    medium: radii.md,
    small: radii.sm,
  };

  const bgMap: Record<ButtonVariant, string> = {
    primary: colors.primary[100],
    secondary: colors.grayscale[100],
    outline: "transparent",
  };

  const textColorMap: Record<ButtonVariant, string> = {
    primary: colors.grayscale[100],
    secondary: colors.grayscale[600],
    outline: colors.primary[100],
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      style={[
        {
          height: heightMap[size],
          borderRadius: radiusMap[size],
          backgroundColor: bgMap[variant],
          borderWidth: variant === "outline" ? 1 : 0,
          borderColor:
            variant === "outline" ? colors.primary[100] : "transparent",
          width: fullWidth ? "100%" : undefined,
          paddingHorizontal: size === "small" ? 16 : 24,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      {...rest}
    >
      {leftIcon}
      <AppText
        variant={size === "small" ? "caption2" : "headline"}
        color={textColorMap[variant]}
        align="center"
      >
        {title}
      </AppText>
      {rightIcon}
    </TouchableOpacity>
  );
};

export interface SocialButtonProps extends TouchableOpacityProps {
  provider: "google" | "apple";
  label?: string;
}

/**
 * Botão de Login Social (Figma Node 62993:1292)
 * Traduzido para Português: "Continuar com o Google" / "Continuar com a Apple"
 */
export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  label,
  style,
  ...rest
}) => {
  const defaultLabel =
    provider === "google"
      ? "Continuar com o Google"
      : "Continuar com a Apple";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        {
          height: 50,
          width: "100%",
          borderRadius: radii.md,
          backgroundColor: colors.grayscale[400],
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          paddingHorizontal: 16,
        },
        style,
      ]}
      {...rest}
    >
      {provider === "google" ? <GoogleIcon size={24} /> : <AppleIcon size={24} />}
      <AppText variant="subheadline" color={colors.grayscale[100]}>
        {label ?? defaultLabel}
      </AppText>
    </TouchableOpacity>
  );
};

/**
 * Botão Circular de Voltar / Fechar (Figma Node 62993:716)
 * 40x40px, fundo #232220
 */
export const CircleIconButton: React.FC<{
  type?: "back" | "close" | "favorite" | "more";
  favorited?: boolean;
  lightBg?: boolean;
  onPress?: () => void;
}> = ({ type = "back", favorited = false, lightBg = false, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: lightBg
          ? colors.grayscale[100]
          : colors.grayscale[500],
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {type === "back" && (
        <ArrowIcon
          direction="left"
          size={20}
          color={lightBg ? colors.grayscale[600] : colors.grayscale[100]}
        />
      )}
      {type === "close" && (
        <ActionIcon
          name="close"
          size={18}
          color={lightBg ? colors.grayscale[600] : colors.grayscale[100]}
        />
      )}
      {type === "favorite" && (
        <ActionIcon
          name={favorited ? "heart-fill" : "favorite"}
          size={20}
          color={
            favorited
              ? colors.primary[100]
              : lightBg
              ? colors.grayscale[600]
              : colors.grayscale[100]
          }
        />
      )}
      {type === "more" && (
        <ActionIcon
          name="more"
          size={20}
          color={lightBg ? colors.grayscale[600] : colors.grayscale[100]}
        />
      )}
    </TouchableOpacity>
  );
};

/**
 * Box With Icon (Figma Nodes 885:5217 & 885:4760)
 * 36x36px, radius 8px
 */
export const IconBoxButton: React.FC<{
  active?: boolean;
  icon?: "plus" | "back";
  variant?: "dark" | "white";
  onPress?: () => void;
}> = ({ active = false, icon = "plus", variant = "dark", onPress }) => {
  const bg = active
    ? colors.primary[100]
    : variant === "white"
    ? colors.grayscale[100]
    : colors.grayscale[700];

  const iconColor = active
    ? colors.grayscale[100]
    : variant === "white"
    ? colors.grayscale[600]
    : colors.grayscale[100];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        width: 36,
        height: 36,
        borderRadius: radii.sm,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon === "plus" ? (
        <ActionIcon name="plus" size={20} color={iconColor} />
      ) : (
        <ArrowIcon direction="left" size={20} color={iconColor} />
      )}
    </TouchableOpacity>
  );
};

/**
 * Botão "Ver tudo" (Figma Node 6425:14494)
 */
export const ViewAllButton: React.FC<{
  label?: string;
  size?: "text" | "cta";
  onPress?: () => void;
}> = ({ label = "Ver tudo", size = "text", onPress }) => (
  <TouchableOpacity
    activeOpacity={0.75}
    onPress={onPress}
    style={{
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: radii.pill,
    }}
  >
    <AppText
      variant={size === "text" ? "body" : "footnote"}
      color={colors.grayscale[200]}
    >
      {label}
    </AppText>
  </TouchableOpacity>
);

