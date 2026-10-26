import React, { useState } from "react";
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

export interface AnalysisScreenProps {
  onBack?: () => void;
  onNavigateTab?: (tab: BottomMenuTab) => void;
}

const PERIOD_DATA = [
  {
    // Diário
    orangePath:
      "M 8 82 C 42 54, 72 30, 110 48 C 148 66, 182 18, 222 36 C 254 50, 272 24, 286 30",
    blackPath:
      "M 8 66 C 48 76, 82 58, 120 64 C 158 70, 194 46, 234 56 C 260 62, 274 50, 286 52",
    underText: "5 dias dentro da meta",
    overText: "2 dias acima em mais de 200 kcal",
    fats: "53%",
    carbs: "28%",
    protein: "19%",
    note: "Seu consumo de proteína está consistentemente baixo.",
  },
  {
    // Semanal
    orangePath:
      "M 8 70 C 46 38, 86 44, 122 28 C 160 14, 198 46, 236 26 C 262 18, 276 28, 286 20",
    blackPath:
      "M 8 58 C 46 62, 86 50, 122 54 C 160 58, 198 44, 236 48 C 262 50, 276 46, 286 44",
    underText: "6 dias dentro da meta",
    overText: "1 dia acima em mais de 150 kcal",
    fats: "38%",
    carbs: "34%",
    protein: "28%",
    note: "Ótimo progresso semanal! Sua proteína subiu 9%.",
  },
  {
    // Mensal
    orangePath:
      "M 8 88 C 44 68, 84 52, 124 42 C 162 32, 200 28, 238 22 C 264 18, 276 16, 286 14",
    blackPath:
      "M 8 64 C 44 60, 84 56, 124 52 C 162 50, 200 48, 238 46 C 264 44, 276 44, 286 42",
    underText: "24 dias dentro da meta",
    overText: "6 dias acima em mais de 200 kcal",
    fats: "32%",
    carbs: "38%",
    protein: "30%",
    note: "Equilíbrio consistente de macronutrientes neste mês.",
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
  const [periodIndex, setPeriodIndex] = useState(0);
  const currentData = PERIOD_DATA[periodIndex];

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

        {/* Banner Verde (#45C588 - 388x128) */}
        <View style={styles.greenBanner}>
          <AppText variant="title3" color={colors.grayscale[100]}>
            Sua Análise Nutricional
          </AppText>
          <AppText variant="body2" color={colors.grayscale[100]}>
            Acompanhe tendências. Identifique padrões. Supere suas metas.
          </AppText>
        </View>

        {/* Abas Diário / Semanal / Mensal (Tab/3 388x49) */}
        <SegmentedTabs
          tabs={["Diário", "Semanal", "Mensal"]}
          activeIndex={periodIndex}
          onChange={setPeriodIndex}
        />

        {/* Card Lilás (#DDC0FF - 388x273): Tendência de Calorias */}
        <View style={styles.calorieTrendsCard}>
          <AppText variant="title3" color={colors.grayscale[600]}>
            Tendência de Calorias
          </AppText>

          <View style={styles.chartRow}>
            {/* Eixo Y (400, 300, 200, 100) */}
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

                {/* Linha Meta Preta (Vector 9) */}
                <Path
                  d={currentData.blackPath}
                  fill="none"
                  stroke={colors.grayscale[600]}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />

                {/* Linha Calorias Coral (Vector 8 - #FF6F43) */}
                <Path
                  d={currentData.orangePath}
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
                {currentData.underText}
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
                {currentData.overText}
              </AppText>
            </View>
          </View>
        </View>

        {/* Card Amarelo (#F5F378 - 388x198): Distribuição de Macros */}
        <View style={styles.macroDistributionCard}>
          <View style={{ gap: 2 }}>
            <AppText variant="title3" color={colors.grayscale[600]}>
              Distribuição de Macros
            </AppText>
            <AppText variant="body2" color={colors.grayscale[600]}>
              {currentData.note}
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
                {currentData.fats}
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
                {currentData.carbs}
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
                {currentData.protein}
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
    maxWidth: 428,
    alignSelf: "center",
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
    minHeight: 128,
    borderRadius: radii.xl,
    backgroundColor: colors.accent[300], // #45C588
    padding: 20,
    justifyContent: "center",
    gap: 6,
  },
  calorieTrendsCard: {
    width: "100%",
    borderRadius: radii.xl,
    backgroundColor: colors.accent[100], // #DDC0FF
    padding: 20,
    gap: 14,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  yAxisColumn: {
    height: 104,
    justifyContent: "space-between",
    paddingVertical: 4,
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
  },
  macroDistributionCard: {
    width: "100%",
    borderRadius: radii.xl,
    backgroundColor: colors.accent[200], // #F5F378
    padding: 20,
    gap: 14,
  },
  macroBoxesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  macroMiniBox: {
    flex: 1,
    height: 88,
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
