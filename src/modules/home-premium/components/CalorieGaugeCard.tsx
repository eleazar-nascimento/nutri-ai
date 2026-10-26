import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { colors, radii } from "@/theme";
import { AppText, MacroIcon } from "@/components/ui";

/**
 * Hook utilitário para animar números e progresso suavemente (compatível com Web + SVG + Native)
 */
function useAnimatedNumber(target: number, duration = 650): number {
  const [displayValue, setDisplayValue] = useState(target);
  const previousRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = previousRef.current;
    const delta = target - startValue;
    if (delta === 0) {
      setDisplayValue(target);
      return;
    }

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Cubic ease-out: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - t, 3);
      const current = startValue + delta * eased;
      setDisplayValue(current);

      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        previousRef.current = target;
        setDisplayValue(target);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      previousRef.current = target;
    };
  }, [target, duration]);

  return displayValue;
}

export interface CalorieGaugeCardProps {
  caloriesLeft?: number;
  caloriesGoal?: number;
  progressPercent?: number; // 0 to 100
  dateLabel?: string;
}

/**
 * Card Semicircular de Calorias Diárias (Figma Node 62993:4376 - Card 388x229 #DDC0FF)
 * Com animação fluida no contador numérico e no arco SVG de progresso
 */
export const CalorieGaugeCard: React.FC<CalorieGaugeCardProps> = ({
  caloriesLeft = 1672,
  caloriesGoal = 2200,
  progressPercent = 72,
  dateLabel,
}) => {
  const radius = 74;
  const strokeWidth = 14;
  const centerX = 95;
  const centerY = 92;
  const circumference = Math.PI * radius;

  const animatedCalories = useAnimatedNumber(caloriesLeft, 700);
  const animatedProgress = useAnimatedNumber(
    Math.max(0, Math.min(100, progressPercent)),
    700
  );

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.08,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 240,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [caloriesLeft, progressPercent, pulseAnim]);

  const strokeDashoffset = circumference * (1 - animatedProgress / 100);

  return (
    <View style={styles.calorieCard}>
      <View style={styles.headerRow}>
        <View style={{ gap: 2 }}>
          <AppText variant="title3" color={colors.grayscale[600]}>
            Calorias
          </AppText>
          {dateLabel ? (
            <AppText variant="footnote" color={colors.grayscale[400]}>
              {dateLabel} • Meta {caloriesGoal} kcal
            </AppText>
          ) : null}
        </View>
        <Animated.View
          style={[styles.flameBadge, { transform: [{ scale: pulseAnim }] }]}
        >
          <MacroIcon type="calories" size={20} color={colors.grayscale[100]} />
        </Animated.View>
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
            {/* Arco preenchido animado (#121212) */}
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
              {Math.round(animatedCalories)}
            </AppText>
            <AppText variant="body2" color={colors.grayscale[600]}>
              Restantes
            </AppText>
          </View>
        </View>

        <View style={styles.scaleLabelsRow}>
          <AppText variant="footnote" color={colors.grayscale[600]}>
            0%
          </AppText>
          <AppText variant="footnote" color={colors.grayscale[600]}>
            {Math.round(animatedProgress)}% concluído
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
  currentValue?: number;
  maxValue?: number;
  unit?: string;
  currentLabel?: string;
  maxLabel?: string;
  progress: number; // 0 to 1
  backgroundColor: string;
}

/**
 * Cards de Carboidratos (#F5F378) e Proteínas (#45C588) 184x173px na Home (Figma Node 62993:4376)
 * Com contador numérico animado e barra de progresso animada
 */
export const MacroProgressCard: React.FC<MacroProgressCardProps> = ({
  type,
  title,
  currentValue,
  maxValue,
  unit = "g",
  currentLabel,
  maxLabel,
  progress,
  backgroundColor,
}) => {
  const parsedCurrent =
    currentValue ?? (currentLabel ? parseInt(currentLabel, 10) || 0 : 0);
  const parsedMax =
    maxValue ?? (maxLabel ? parseInt(maxLabel, 10) || 100 : 100);

  const animatedGrams = useAnimatedNumber(parsedCurrent, 650);
  const animatedRatio = useAnimatedNumber(
    Math.min(1, Math.max(0.05, progress)),
    650
  );

  return (
    <View style={[styles.macroCard, { backgroundColor }]}>
      <View style={styles.macroTopRow}>
        <View style={{ gap: 2 }}>
          <AppText variant="title3" color={colors.grayscale[600]}>
            {title}
          </AppText>
          <AppText variant="headline" color={colors.grayscale[600]}>
            {Math.round(animatedGrams)}
            {unit}
          </AppText>
        </View>
        <View style={styles.macroIconCircle}>
          <MacroIcon type={type} size={22} color={colors.grayscale[100]} />
        </View>
      </View>

      <View style={styles.macroProgressSection}>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(100, Math.max(5, animatedRatio * 100))}%` },
            ]}
          />
        </View>
        <View style={styles.macroValuesRow}>
          <AppText variant="footnote" color={colors.grayscale[600]}>
            {Math.round(animatedGrams)}
            {unit}
          </AppText>
          <AppText variant="footnote" color={colors.grayscale[600]}>
            {maxLabel ?? `${parsedMax}${unit}`}
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
    width: 190,
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
    height: 8,
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
