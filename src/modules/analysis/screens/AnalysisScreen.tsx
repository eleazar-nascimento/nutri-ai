import React, { useMemo, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import Svg, { Path, Line, Circle } from "react-native-svg";
import { colors, radii } from "@/theme";
import {
  AppText,
  StatusBarMock,
  TopBar,
  SegmentedTabs,
  BottomMenu,
  BottomMenuTab,
} from "@/components/ui";
import { useAccount, todayKey, totalsForDay, macroEnergySplit } from "@/store";

export interface AnalysisScreenProps {
  onBack?: () => void;
  onNavigateTab?: (tab: BottomMenuTab) => void;
}

const PERIOD_PATHS = [
  {
    // Diário
    orangePath:
      "M 8 82 C 42 54, 72 30, 110 48 C 148 66, 182 18, 222 36 C 254 50, 272 24, 286 30",
    blackPath:
      "M 8 66 C 48 76, 82 58, 120 64 C 158 70, 194 46, 234 56 C 260 62, 274 50, 286 52",
    underText: "5 dias dentro da meta",
    overText: "2 dias acima em mais de 200 kcal",
  },
  {
    // Semanal
    orangePath:
      "M 8 70 C 46 38, 86 44, 122 28 C 160 14, 198 46, 236 26 C 262 18, 276 28, 286 20",
    blackPath:
      "M 8 58 C 46 62, 86 50, 122 54 C 160 58, 198 44, 236 48 C 262 50, 276 46, 286 44",
    underText: "6 dias dentro da meta",
    overText: "1 dia acima em mais de 150 kcal",
  },
  {
    // Mensal
    orangePath:
      "M 8 88 C 44 68, 84 52, 124 42 C 162 32, 200 28, 238 22 C 264 18, 276 16, 286 14",
    blackPath:
      "M 8 64 C 44 60, 84 56, 124 52 C 162 50, 200 48, 238 46 C 264 44, 276 44, 286 42",
    underText: "24 dias dentro da meta",
    overText: "6 dias acima em mais de 200 kcal",
  },
];

const DAYS_PT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const Y_LABELS = ["400", "300", "200", "100"];

/**
 * Módulo 6 — 26_Analysis (Figma Node 62999:2951)
 */
export const AnalysisScreenView: React.FC<AnalysisScreenProps> = ({
  onBack,
  onNavigateTab,
}) => {
  const account = useAccount();
  const [periodIndex, setPeriodIndex] = useState(0);

  const currentPathData = PERIOD_PATHS[periodIndex];

  // Agregação de macros a partir das refeições na store
  const macroStats = useMemo(() => {
    const today = todayKey();
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCalories = 0;

    if (periodIndex === 0) {
      // Diário: hoje
      const totals = totalsForDay(account.meals, today);
      totalCarbs = totals.carbs;
      totalProtein = totals.protein;
      totalFat = totals.fat;
      totalCalories = totals.calories;
    } else {
      // Semanal ou Mensal: soma todas as refeições disponíveis no histórico
      account.meals.forEach((m) => {
        totalCarbs += m.carbs;
        totalProtein += m.protein;
        totalFat += m.fat;
        totalCalories += m.calories;
      });
    }

    if (totalCalories === 0) {
      // Fallback para metas se nenhum dado estiver disponível
      totalCarbs = account.goals.carbsGrams;
      totalProtein = account.goals.proteinGrams;
      totalFat = account.goals.fatGrams;
    }

    const split = macroEnergySplit(totalCarbs, totalProtein, totalFat);
    return {
      fats: `${Math.round(split.fatPercent)}%`,
      carbs: `${Math.round(split.carbsPercent)}%`,
      protein: `${Math.round(split.proteinPercent)}%`,
      note:
        split.proteinPercent >= 25
          ? "Excelente equilíbrio protéico para retenção de massa magra!"
          : "Considere aumentar o consumo de proteínas para bater sua meta diária.",
    };
  }, [account.meals, account.goals, periodIndex]);

  return (
    <View style={styles.screenContainer}>
      <StatusBarMock variant="white" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TopBar
          title="Análise"
          onBackPress={onBack}
          rightAction="close"
          onRightPress={onBack}
        />

        {/* Banner Verde (#45C588) */}
        <View style={styles.greenBanner}>
          <AppText variant="title3" color={colors.grayscale[100]}>
            Sua Análise Nutricional
          </AppText>
          <AppText variant="body2" color={colors.grayscale[100]}>
            Acompanhe tendências. Identifique padrões. Supere suas metas.
          </AppText>
        </View>

        {/* Abas Diário / Semanal / Mensal */}
        <SegmentedTabs
          tabs={["Diário", "Semanal", "Mensal"]}
          activeIndex={periodIndex}
          onChange={setPeriodIndex}
        />

        {/* Card Lilás (#DDC0FF): Tendência de Calorias */}
        <View style={styles.calorieTrendsCard}>
          <AppText variant="title3" color={colors.grayscale[600]}>
            Tendência de Calorias
          </AppText>

          <View style={styles.chartRow}>
            {/* Eixo Y */}
            <View style={styles.yAxisColumn}>
              {Y_LABELS.map((lbl) => (
                <AppText
                  key={lbl}
                  variant="footnote"
                  color={colors.grayscale[600]}
                >
                  {lbl}
                </AppText>
              ))}
            </View>

            {/* Área do Gráfico + Eixo X */}
            <View style={styles.graphBody}>
              <Svg width={293} height={106} viewBox="0 0 293 106">
                {[12, 38, 64, 90].map((y) => (
                  <Line
                    key={y}
                    x1={0}
                    y1={y}
                    x2={293}
                    y2={y}
                    stroke="rgba(18,18,18,0.22)"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Linha Meta Preta */}
                <Path
                  d={currentPathData.blackPath}
                  fill="none"
                  stroke={colors.grayscale[600]}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />

                {/* Linha Calorias Coral */}
                <Path
                  d={currentPathData.orangePath}
                  fill="none"
                  stroke={colors.accent[400]}
                  strokeWidth={3}
                  strokeLinecap="round"
                />

                <Circle
                  cx={182}
                  cy={24}
                  r={5}
                  fill={colors.accent[400]}
                  stroke={colors.grayscale[100]}
                  strokeWidth={2}
                />
              </Svg>

              <View style={styles.xAxisRow}>
                {DAYS_PT.map((day) => (
                  <AppText
                    key={day}
                    variant="footnote"
                    color={colors.grayscale[600]}
                  >
                    {day}
                  </AppText>
                ))}
              </View>
            </View>
          </View>

          {/* Legenda Inferior */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: colors.accent[400] },
                ]}
              />
              <AppText variant="footnote" color={colors.grayscale[600]}>
                {currentPathData.underText}
              </AppText>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: colors.grayscale[600] },
                ]}
              />
              <AppText
                variant="footnote"
                color={colors.grayscale[600]}
                style={{ maxWidth: 150 }}
              >
                {currentPathData.overText}
              </AppText>
            </View>
          </View>
        </View>

        {/* Card Amarelo (#F5F378): Distribuição de Macros */}
        <View style={styles.macroDistributionCard}>
          <View style={{ gap: 2 }}>
            <AppText variant="title3" color={colors.grayscale[600]}>
              Distribuição de Macros
            </AppText>
            <AppText variant="body2" color={colors.grayscale[600]}>
              {macroStats.note}
            </AppText>
          </View>

          <View style={styles.macroBoxesRow}>
            {/* Gorduras (#DDC0FF) */}
            <View
              style={[
                styles.macroMiniBox,
                { backgroundColor: colors.accent[100] },
              ]}
            >
              <AppText variant="body2" color={colors.grayscale[600]}>
                Gorduras
              </AppText>
              <AppText variant="title2" color={colors.grayscale[600]}>
                {macroStats.fats}
              </AppText>
            </View>

            {/* Carbos (#45C588) */}
            <View
              style={[
                styles.macroMiniBox,
                { backgroundColor: colors.accent[300] },
              ]}
            >
              <AppText variant="body2" color={colors.grayscale[600]}>
                Carbos
              </AppText>
              <AppText variant="title2" color={colors.grayscale[600]}>
                {macroStats.carbs}
              </AppText>
            </View>

            {/* Proteínas (#FF6F43) */}
            <View
              style={[
                styles.macroMiniBox,
                { backgroundColor: colors.accent[400] },
              ]}
            >
              <AppText variant="body2" color={colors.grayscale[600]}>
                Proteínas
              </AppText>
              <AppText variant="title2" color={colors.grayscale[600]}>
                {macroStats.protein}
              </AppText>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.floatingMenuWrapper}>
        <BottomMenu
          activeTab="analysis"
          onTabPress={(tab) => onNavigateTab?.(tab)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.grayscale[600],
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
    gap: 18,
  },
  greenBanner: {
    width: "100%",
    backgroundColor: colors.accent[300],
    borderRadius: radii.xl,
    padding: 20,
    gap: 6,
  },
  calorieTrendsCard: {
    width: "100%",
    backgroundColor: colors.accent[100],
    borderRadius: radii.xl,
    padding: 18,
    gap: 14,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  yAxisColumn: {
    justifyContent: "space-between",
    height: 106,
    paddingVertical: 2,
  },
  graphBody: {
    flex: 1,
    gap: 6,
  },
  xAxisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "rgba(18,18,18,0.15)",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroDistributionCard: {
    width: "100%",
    backgroundColor: colors.accent[200],
    borderRadius: radii.xl,
    padding: 18,
    gap: 16,
  },
  macroBoxesRow: {
    flexDirection: "row",
    gap: 10,
  },
  macroMiniBox: {
    flex: 1,
    height: 90,
    borderRadius: radii.lg,
    padding: 12,
    justifyContent: "space-between",
  },
  floatingMenuWrapper: {
    position: "absolute",
    bottom: 14,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
