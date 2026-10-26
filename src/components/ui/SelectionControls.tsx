import React from "react";
import { TouchableOpacity, View } from "react-native";
import { colors, radii } from "@/theme";
import { AppText } from "./Typography";
import { ActionIcon } from "./Icons";

/**
 * Toggle Switch Oficial (Figma Nodes 61:2336 Normal 51x31 e 61:2343 Small 40x22)
 * - Ativo: #FF5A16
 * - Inativo: #474747
 * - Knob: #FFFFFF
 */
export const Toggle: React.FC<{
  value: boolean;
  onValueChange?: (val: boolean) => void;
  size?: "normal" | "small";
}> = ({ value, onValueChange, size = "normal" }) => {
  const isSmall = size === "small";
  const width = isSmall ? 40 : 51;
  const height = isSmall ? 22 : 31;
  const knobSize = isSmall ? 18 : 27;
  const padding = 2;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onValueChange?.(!value)}
      style={{
        width,
        height,
        borderRadius: height / 2,
        backgroundColor: value ? colors.primary[100] : colors.grayscale[300],
        padding,
        justifyContent: "center",
        alignItems: value ? "flex-end" : "flex-start",
      }}
    >
      <View
        style={{
          width: knobSize,
          height: knobSize,
          borderRadius: knobSize / 2,
          backgroundColor: colors.grayscale[100],
        }}
      />
    </TouchableOpacity>
  );
};

/**
 * Checkbox com ou sem Label (Figma Nodes 1115:3960, 942:5891 e 885:4694)
 * - Tamanho: 20x20 (radius 6px) ou 16x16 (radius 4px)
 */
export const Checkbox: React.FC<{
  checked: boolean;
  onChange?: (val: boolean) => void;
  label?: string;
  size?: "md" | "sm";
}> = ({ checked, onChange, label, size = "md" }) => {
  const boxSize = size === "sm" ? 16 : 20;
  const radius = size === "sm" ? 4 : radii.xs;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onChange?.(!checked)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      <View
        style={{
          width: boxSize,
          height: boxSize,
          borderRadius: radius,
          backgroundColor: checked ? colors.primary[100] : "transparent",
          borderWidth: checked ? 0 : 1.5,
          borderColor:
            size === "sm" ? colors.grayscale[100] : colors.grayscale[300],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checked && (
          <ActionIcon
            name="check"
            size={size === "sm" ? 11 : 14}
            color={colors.grayscale[100]}
          />
        )}
      </View>

      {label ? (
        <AppText variant="body2" color={colors.grayscale[100]}>
          {label}
        </AppText>
      ) : null}
    </TouchableOpacity>
  );
};

/**
 * Radio Button com ou sem Label (Figma Nodes 1115:3915 e 1836:34756)
 * - 20x20px circular, borda inativa #474747, ativa #FF5A16 com círculo interno 12x12 #FF5A16
 */
export const RadioButton: React.FC<{
  selected: boolean;
  onSelect?: () => void;
  label?: string;
}> = ({ selected, onSelect, label }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onSelect}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 1.5,
          borderColor: selected ? colors.primary[100] : colors.grayscale[300],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && (
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: colors.primary[100],
            }}
          />
        )}
      </View>

      {label ? (
        <AppText variant="body2" color={colors.grayscale[100]}>
          {label}
        </AppText>
      ) : null}
    </TouchableOpacity>
  );
};

/**
 * Filter Pill / Chip (Figma Node 246:16716)
 * - Active: #FF5A16, texto #FFFFFF, radius 40px
 * - Default: #F4F4F4, texto #121212, radius 40px
 */
export const FilterChip: React.FC<{
  label: string;
  active?: boolean;
  onPress?: () => void;
}> = ({ label, active = false, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        height: 44,
        paddingHorizontal: 24,
        borderRadius: 40,
        backgroundColor: active
          ? colors.primary[100]
          : colors.system.surfaceLight,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AppText
        variant="body2"
        color={active ? colors.grayscale[100] : colors.grayscale[600]}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
};

