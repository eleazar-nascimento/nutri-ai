import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { colors, radii } from "@/theme";
import { AppText, MacroIcon } from "@/components/ui";

export interface CalorieGaugeCardProps {
  caloriesLeft?: number;
  progressPercent?: number; // 0 to 100
}

/**
 * Card Semicircular de Calorias Diárias (Figma Node 62993:4376 - Card 388x229 #DDC0FF)
 */
export const CalorieGaugeCard: React.FC<CalorieGaugeCardProps> = ({
  caloriesLeft = 1672,
  progressPercent = 72,
}) => {
  const radius = 74;
  const strokeWidth = 14;
  const centerX = 95;
  const centerY = 92;
  const circumference = Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, progressPercent));
  const strokeDashoffset = circumference * (1 - clamped / 100);

  return (
    <View style={styles.calorieCard}>
      <View style={styles.headerRow}>
        <AppText variant="title3" color={colors.grayscale[600]}>
          Calorias
        </AppText>
        <View style={styles.flameBadge}>
          <MacroIcon type="calories" size={20} color={colors.grayscale[100]} />
        </View>
      </View>

      <View style={styles.gaugeWrapper}>
        <View style={styles.svgContainer}>
          <Svg width={190} height={112} viewBox="0 0 190 112">
            {/* Trilha de fundo */}
            <Path
              d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${
                centerX + radius
              } ${centerY}`}
              stroke="rgba(18, 18, 18, 0.16)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
            />
            {/* Arco preenchido (#121212) */}
            <Path
              d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${
                centerX + radius
              } ${centerY}`}
              stroke={colors.grayscale[600]}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              fill="none"
            />
            {/* Círculo central decorativo */}
            <Circle
              cx={centerX}
              cy={centerY - 12}
              r={48}
              fill="rgba(255,255,255,0.35)"
            />
          </Svg>

          <View style={styles.centerTextOverlay}>
            <AppText variant="title1" color={colors.grayscale[600]}>
              {caloriesLeft}
            </AppText>
            <AppText variant="body2" color={colors.grayscale[600]}>
              Restantes
            </AppText>
          </View>
        </View>

        <View style={styles.scaleLabelsRow}>
          <AppText variant="footnote" color={colors.grayscale[600]}>
            0
          </AppText>
          <AppText variant="footnote" color={colors.grayscale[600]}>
            100%
          </AppText>
        </View>
      </View>
    </View>
  );
};

export interface MacroProgressCardProps {
  type: "carbs" | "protein";
  title: string;
  currentLabel: string;
  maxLabel: string;
  progress: number; // 0 to 1
  backgroundColor: string;
}

/**
 * Cards de Carboidratos (#F5F378) e Proteínas (#45C588) 184x173px na Home (Figma Node 62993:4376)
 */
export const MacroProgressCard: React.FC<MacroProgressCardProps> = ({
  type,
  title,
  currentLabel,
  maxLabel,
  progress,
  backgroundColor,
}) => {
  return (
    <View style={[styles.macroCard, { backgroundColor }]}>
      <View style={styles.macroTopRow}>
        <AppText variant="title3" color={colors.grayscale[600]}>
          {title}
        </AppText>
        <View style={styles.macroIconCircle}>
          <MacroIcon type={type} size={22} color={colors.grayscale[100]} />
        </View>
      </View>

      <View style={styles.macroProgressSection}>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(100, Math.max(5, progress * 100))}%` },
            ]}
          />
        </View>
        <View style={styles.macroValuesRow}>
          <AppText variant="footnote" color={colors.grayscale[600]}>
            {currentLabel}
          </AppText>
          <AppText variant="footnote" color={colors.grayscale[600]}>
            {maxLabel}
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calorieCard: {
    width: "100%",
    height: 229,
    borderRadius: radii.xl,
    backgroundColor: colors.accent[100], // #DDC0FF
    paddingHorizontal: 20,
    paddingVertical: 18,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flameBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.grayscale[600],
    alignItems: "center",
    justifyContent: "center",
  },
  gaugeWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  svgContainer: {
    width: 190,
    height: 112,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  centerTextOverlay: {
    position: "absolute",
    bottom: 10,
    alignItems: "center",
  },
  scaleLabelsRow: {
    width: 176,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  macroCard: {
    flex: 1,
    height: 173,
    borderRadius: radii.xl,
    padding: 16,
    justifyContent: "space-between",
  },
  macroTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  macroIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.grayscale[600],
    alignItems: "center",
    justifyContent: "center",
  },
  macroProgressSection: {
    gap: 8,
  },
  progressBarTrack: {
    width: "100%",
    height: 6,
    borderRadius: 4,
    backgroundColor: "rgba(18, 18, 18, 0.22)",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: colors.grayscale[600],
  },
  macroValuesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
