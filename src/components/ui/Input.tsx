import React, { useState } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors, fontFamilies, radii } from "@/theme";
import { AppText } from "./Typography";
import { EyeIcon, ArrowIcon, ActionIcon } from "./Icons";

export type InputVisualState =
  | "default"
  | "active"
  | "field"
  | "error"
  | "disabled";

export interface FormInputProps extends TextInputProps {
  label?: string;
  state?: InputVisualState;
  errorMessage?: string;
  isPassword?: boolean;
  isPhone?: boolean;
  countryCode?: string;
  rightIcon?: React.ReactNode;
}

/**
 * Master Input / Form Input (Figma Node 10:3738 & 10:3708)
 * - Altura da caixa: 50px, radius: 12px, fundo: #121212
 * - Bordas por estado:
 *   Default/Field/Disabled: #2F2F2F
 *   Active (Focado): #FFFFFF
 *   Error: #C93838 + mensagem de erro embaixo
 */
export const FormInput: React.FC<FormInputProps> = ({
  label = "Primeiro nome",
  state,
  errorMessage = "Mensagem de erro",
  isPassword = false,
  isPhone = false,
  countryCode = "+55",
  rightIcon,
  value,
  placeholder = "Digite aqui...",
  editable = true,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(!isPassword);

  const resolvedState: InputVisualState =
    state ??
    (!editable
      ? "disabled"
      : focused
      ? "active"
      : value && value.length > 0
      ? "field"
      : "default");

  const borderColorMap: Record<InputVisualState, string> = {
    default: colors.grayscale[400],
    active: colors.grayscale[100],
    field: colors.grayscale[400],
    error: colors.message.red,
    disabled: colors.grayscale[400],
  };

  const textColorMap: Record<InputVisualState, string> = {
    default: colors.grayscale[100],
    active: colors.grayscale[100],
    field: colors.grayscale[100],
    error: colors.grayscale[100],
    disabled: colors.grayscale[300],
  };

  return (
    <View style={{ width: "100%", gap: 6 }}>
      {label ? (
        <AppText variant="body" color={colors.grayscale[100]}>
          {label}
        </AppText>
      ) : null}

      <View
        style={{
          height: 50,
          borderRadius: radii.md,
          backgroundColor: colors.grayscale[600],
          borderWidth: 1,
          borderColor: borderColorMap[resolvedState],
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        {isPhone && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              paddingRight: 8,
              borderRightWidth: 1,
              borderRightColor: colors.grayscale[400],
            }}
          >
            <AppText variant="body2" color={colors.grayscale[100]}>
              {countryCode}
            </AppText>
            <ArrowIcon direction="down" size={14} color={colors.grayscale[200]} />
          </TouchableOpacity>
        )}

        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={
            resolvedState === "disabled"
              ? colors.grayscale[300]
              : colors.grayscale[200]
          }
          editable={resolvedState !== "disabled"}
          secureTextEntry={isPassword && !passwordVisible}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={{
            flex: 1,
            fontFamily: fontFamilies.regular,
            fontSize: 17,
            color: textColorMap[resolvedState],
            paddingVertical: 0,
          }}
          {...rest}
        />

        {isPassword ? (
          <TouchableOpacity
            onPress={() => setPasswordVisible((v) => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <EyeIcon
              visible={passwordVisible}
              size={20}
              color={colors.grayscale[200]}
            />
          </TouchableOpacity>
        ) : (
          rightIcon
        )}
      </View>

      {resolvedState === "error" && errorMessage ? (
        <AppText variant="footnote" color={colors.message.red}>
          {errorMessage}
        </AppText>
      ) : null}
    </View>
  );
};

/**
 * Search Input Oficial (Figma Node 886:14585)
 * Variantes: Small (358x50) e Full (388x50 / 100%)
 */
export const SearchInput: React.FC<{
  sizeVariant?: "small" | "full";
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
}> = ({
  sizeVariant = "full",
  value,
  onChangeText,
  placeholder = "Buscar alimento ou dieta...",
  onFilterPress,
}) => {
  return (
    <View
      style={{
        height: 50,
        width: sizeVariant === "small" ? 358 : "100%",
        maxWidth: "100%",
        borderRadius: radii.md,
        backgroundColor: colors.grayscale[600],
        borderWidth: 1,
        borderColor: colors.grayscale[400],
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
        <ActionIcon name="search" size={20} color={colors.grayscale[200]} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.grayscale[200]}
          style={{
            flex: 1,
            fontFamily: fontFamilies.regular,
            fontSize: 17,
            color: colors.grayscale[100],
            paddingVertical: 0,
          }}
        />
      </View>
      <TouchableOpacity onPress={onFilterPress} activeOpacity={0.75}>
        <ActionIcon name="filter" size={20} color={colors.grayscale[100]} />
      </TouchableOpacity>
    </View>
  );
};

/**
 * Master Input / Drop Down (Figma Node 62989:882 & 10:3686)
 * Estados: Default, Selected, Disabled
 */
export const DropdownField: React.FC<{
  label?: string;
  value?: string;
  placeholder?: string;
  options?: string[];
  state?: "default" | "selected" | "disabled";
  onSelect?: (option: string) => void;
}> = ({
  label = "Selecionar opção",
  value,
  placeholder = "Selecione...",
  options = ["Dieta Cetogênica", "Low Carb", "Mediterrânea", "Hiperproteica"],
  state = "default",
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const isDisabled = state === "disabled";
  const hasValue = state === "selected" || Boolean(value);

  return (
    <View style={{ width: "100%", gap: 6 }}>
      {label ? (
        <AppText variant="body" color={colors.grayscale[100]}>
          {label}
        </AppText>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.8}
        disabled={isDisabled}
        onPress={() => setOpen((o) => !o)}
        style={{
          height: 50,
          borderRadius: radii.md,
          backgroundColor: colors.grayscale[600],
          borderWidth: 1,
          borderColor: colors.grayscale[400],
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <AppText
          variant="body"
          color={
            isDisabled
              ? colors.grayscale[300]
              : hasValue
              ? colors.grayscale[100]
              : colors.grayscale[200]
          }
        >
          {value || placeholder}
        </AppText>
        <ArrowIcon
          direction={open ? "up" : "down"}
          size={20}
          color={isDisabled ? colors.grayscale[300] : colors.grayscale[100]}
        />
      </TouchableOpacity>

      {open && !isDisabled && (
        <View
          style={{
            borderRadius: radii.md,
            backgroundColor: colors.grayscale[500],
            borderWidth: 1,
            borderColor: colors.grayscale[400],
            overflow: "hidden",
          }}
        >
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => {
                onSelect?.(opt);
                setOpen(false);
              }}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.grayscale[400],
              }}
            >
              <AppText
                variant="body2"
                color={
                  value === opt ? colors.primary[100] : colors.grayscale[100]
                }
              >
                {opt}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

/**
 * Master Text Area (Figma Node 62989:918 & 1413:29571)
 * Altura da área: 105px, radius: 12px
 */
export const TextAreaField: React.FC<{
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (t: string) => void;
  state?: InputVisualState;
  hintText?: string;
}> = ({
  label = "Observações da refeição",
  placeholder = "Descreva os ingredientes ou observações...",
  value,
  onChangeText,
  state,
  hintText = "Texto de ajuda ou erro",
}) => {
  const [focused, setFocused] = useState(false);

  const resolvedState: InputVisualState =
    state ??
    (focused
      ? "active"
      : value && value.length > 0
      ? "field"
      : "default");

  const borderColorMap: Record<InputVisualState, string> = {
    default: colors.grayscale[400],
    active: colors.grayscale[100],
    field: colors.grayscale[400],
    error: colors.message.red,
    disabled: colors.grayscale[400],
  };

  return (
    <View style={{ width: "100%", gap: 6 }}>
      {label ? (
        <AppText variant="body" color={colors.grayscale[100]}>
          {label}
        </AppText>
      ) : null}

      <View
        style={{
          height: 105,
          borderRadius: radii.md,
          backgroundColor: colors.grayscale[600],
          borderWidth: 1,
          borderColor: borderColorMap[resolvedState],
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <TextInput
          multiline
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={
            resolvedState === "disabled"
              ? colors.grayscale[300]
              : colors.grayscale[200]
          }
          editable={resolvedState !== "disabled"}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            fontFamily: fontFamilies.regular,
            fontSize: 16,
            color:
              resolvedState === "disabled"
                ? colors.grayscale[300]
                : colors.grayscale[100],
            textAlignVertical: "top",
          }}
        />
      </View>

      {resolvedState === "error" && hintText ? (
        <AppText variant="footnote" color={colors.message.red}>
          {hintText}
        </AppText>
      ) : null}
    </View>
  );
};

