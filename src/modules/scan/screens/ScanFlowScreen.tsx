import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Platform,
  StyleSheet,
} from "react-native";
import { Sparkles } from "lucide-react-native";
import { colors, radii } from "@/theme";
import {
  AppText,
  StatusBarMock,
  HomeIndicator,
  TopBar,
  ActionIcon,
  Button,
  MessageModalCard,
} from "@/components/ui";
import { DemoStepPills } from "@/components/layout";
import {
  useAppStore,
  useAccount,
  SCAN_DISHES,
  todayKey,
  FREE_SCANS_PER_DAY,
  ratio,
} from "@/store";

export type ScanSubScreen = "31_scanning" | "32_scan_result";
export type ScanMode = "camera" | "barcode" | "gallery";

const SCAN_PILLS: { key: ScanSubScreen; label: string }[] = [
  { key: "31_scanning", label: "31. Câmera IA" },
  { key: "32_scan_result", label: "32. Resultado do Scan" },
];

export interface ScanFlowScreenProps {
  onBack?: () => void;
  onAddToDiet?: () => void;
  onOpenPremium?: () => void;
}

/**
 * Módulo 7 — 31_Scanning & 32_Scan Result
 */
export const ScanFlowScreenView: React.FC<ScanFlowScreenProps> = ({
  onBack,
  onAddToDiet,
  onOpenPremium,
}) => {
  const { demoMode, addMeal } = useAppStore();
  const account = useAccount();

  const [subScreen, setSubScreen] = useState<ScanSubScreen>("31_scanning");
  const [scanMode, setScanMode] = useState<ScanMode>("camera");
  const [dishIndex, setDishIndex] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const laserAnim = useRef(new Animated.Value(0)).current;

  const currentDish = SCAN_DISHES[dishIndex % SCAN_DISHES.length];
  const isPremium = account.subscription.plan !== "none";

  // Conta quantos scans já foram feitos hoje
  const todayScansCount = account.meals.filter(
    (m) => m.dateKey === todayKey() && m.source === "scan"
  ).length;

  useEffect(() => {
    const useNativeDriver = Platform.OS !== "web";
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [laserAnim]);

  const handleShutterPress = () => {
    if (!isPremium && todayScansCount >= FREE_SCANS_PER_DAY && !demoMode) {
      setShowLimitModal(true);
      return;
    }
    setSubScreen("32_scan_result");
  };

  const handleCycleDish = () => {
    setDishIndex((idx) => (idx + 1) % SCAN_DISHES.length);
  };

  const handleAddDishToTracker = () => {
    addMeal({
      dateKey: todayKey(),
      name: currentDish.name,
      source: "scan",
      calories: currentDish.calories,
      carbs: currentDish.carbs,
      protein: currentDish.protein,
      fat: currentDish.fat,
      imageUri: currentDish.imageUri,
    });
    onAddToDiet?.();
  };

  const scanMacros = [
    {
      name: "Carbos",
      current: `${currentDish.carbs}g`,
      max: `${account.goals.carbsGrams}g`,
      progress: ratio(currentDish.carbs, account.goals.carbsGrams),
      bg: colors.accent[200],
    },
    {
      name: "Proteínas",
      current: `${currentDish.protein}g`,
      max: `${account.goals.proteinGrams}g`,
      progress: ratio(currentDish.protein, account.goals.proteinGrams),
      bg: colors.accent[300],
    },
    {
      name: "Calorias",
      current: `${currentDish.calories} kcal`,
      max: `${account.goals.caloriesGoal} kcal`,
      progress: ratio(currentDish.calories, account.goals.caloriesGoal),
      bg: colors.accent[100],
    },
    {
      name: "Gorduras",
      current: `${currentDish.fat}g`,
      max: `${account.goals.fatGrams}g`,
      progress: ratio(currentDish.fat, account.goals.fatGrams),
      bg: colors.accent[400],
    },
  ];

  return (
    <View style={styles.screenContainer}>
      <StatusBarMock variant="white" />

      {/* Pílulas de etapas (visíveis apenas no Modo Demo) */}
      <DemoStepPills
        steps={SCAN_PILLS}
        active={subScreen}
        onChange={(k: ScanSubScreen) => setSubScreen(k)}
      />

      {/* TELA 31 — SCANNING (63000:2106) */}
      {subScreen === "31_scanning" && (
        <View style={styles.cameraScreen}>
          {/* Visor com imagem da refeição */}
          <View style={styles.viewfinderContainer}>
            <Image
              source={{ uri: currentDish.imageUri }}
              style={styles.cameraBgImage}
              resizeMode="cover"
            />
            <View style={styles.darkOverlay} />

            {/* TopBar sobre o visor */}
            <View style={styles.topBarOverlay}>
              <TopBar
                title="Câmera IA"
                onBackPress={onBack}
                rightAction="close"
                onRightPress={onBack}
              />
            </View>

            {/* Banner de prato detectável & troca rápida */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleCycleDish}
              style={styles.dishCyclePill}
            >
              <Sparkles size={14} color={colors.accent[200]} />
              <AppText variant="caption2" color={colors.grayscale[100]}>
                Foco: {currentDish.name} (Tocar p/ alternar)
              </AppText>
            </TouchableOpacity>

            {/* Moldura de Foco 310x330 */}
            <View style={styles.focusFrame}>
              <Image
                source={{ uri: currentDish.imageUri }}
                style={styles.focusedInnerImage}
                resizeMode="cover"
              />

              {/* 4 Cantos Brancos */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              {/* Linha de Scan Animada */}
              <Animated.View
                style={[
                  styles.laserLine,
                  {
                    transform: [
                      {
                        translateY: laserAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 270],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          </View>

          {/* Painel Inferior com 3 Modos e Botão Disparador */}
          <View style={styles.cameraBottomPanel}>
            <View style={styles.modesRow}>
              {(
                [
                  {
                    key: "camera",
                    label: "Câmera IA",
                    icon: "camera" as const,
                  },
                  {
                    key: "barcode",
                    label: "Código IA",
                    icon: "scan" as const,
                  },
                  {
                    key: "gallery",
                    label: "Galeria",
                    icon: "gallery" as const,
                  },
                ] as const
              ).map((m) => {
                const isActive = scanMode === m.key;
                return (
                  <TouchableOpacity
                    key={m.key}
                    activeOpacity={0.85}
                    onPress={() => setScanMode(m.key)}
                    style={[
                      styles.modeCard,
                      {
                        backgroundColor: isActive
                          ? colors.grayscale[100]
                          : "rgba(255,255,255,0.40)",
                      },
                    ]}
                  >
                    <ActionIcon
                      name={m.icon}
                      size={24}
                      color={colors.grayscale[600]}
                    />
                    <AppText variant="caption2" color={colors.grayscale[600]}>
                      {m.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Botão Disparador */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleShutterPress}
              style={styles.shutterOuter}
            >
              <View style={styles.shutterInner} />
            </TouchableOpacity>

            <HomeIndicator variant="light" />
          </View>
        </View>
      )}

      {/* TELA 32 — SCAN RESULT (63001:2834) */}
      {subScreen === "32_scan_result" && (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Imagem Superior do Prato + TopBar */}
          <View style={styles.resultHeroContainer}>
            <Image
              source={{ uri: currentDish.imageUri }}
              style={styles.resultHeroImage}
              resizeMode="cover"
            />
            <View style={styles.resultTopBarOverlay}>
              <TopBar
                title="Scan"
                onBackPress={() => setSubScreen("31_scanning")}
                rightAction="favorite"
                favorited={favorited}
                onRightPress={() => setFavorited((v) => !v)}
              />
            </View>
          </View>

          {/* Conteúdo Nutricional */}
          <View style={styles.resultBody}>
            <View style={{ gap: 4 }}>
              <AppText variant="title2" color={colors.grayscale[100]}>
                {currentDish.name}
              </AppText>
              <AppText variant="body2" color={colors.grayscale[200]}>
                Prato reconhecido com 98% de precisão pelo modelo NutriAI.
              </AppText>
            </View>

            {/* Grade 2x2 de Macros */}
            <View style={styles.nutrientGrid}>
              {scanMacros.map((item) => (
                <View
                  key={item.name}
                  style={[styles.nutrientCard, { backgroundColor: item.bg }]}
                >
                  <AppText variant="title3" color={colors.grayscale[600]}>
                    {item.name}
                  </AppText>

                  <View style={{ gap: 6 }}>
                    <View style={styles.nutrientBarTrack}>
                      <View
                        style={[
                          styles.nutrientBarFill,
                          { width: `${Math.min(100, item.progress * 100)}%` },
                        ]}
                      />
                    </View>
                    <View style={styles.nutrientLabelsRow}>
                      <AppText variant="footnote" color={colors.grayscale[600]}>
                        {item.current}
                      </AppText>
                      <AppText variant="footnote" color={colors.grayscale[600]}>
                        Meta: {item.max}
                      </AppText>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Lista de Ingredientes Identificados */}
            <View style={{ gap: 12 }}>
              <AppText variant="headline" color={colors.grayscale[100]}>
                Ingredientes Detectados
              </AppText>
              {currentDish.items.map((food) => (
                <View key={food.name} style={styles.foodItemCard}>
                  <AppText variant="headline" color={colors.grayscale[100]}>
                    {food.name}
                  </AppText>

                  <View style={styles.foodNutritionRow}>
                    <AppText variant="footnote" color={colors.grayscale[200]}>
                      {food.calories} kcal
                    </AppText>
                    <View style={styles.foodDivider} />
                    <AppText variant="footnote" color={colors.grayscale[200]}>
                      P: {food.protein}g
                    </AppText>
                    <View style={styles.foodDivider} />
                    <AppText variant="footnote" color={colors.grayscale[200]}>
                      C: {food.carbs}g
                    </AppText>
                    <View style={styles.foodDivider} />
                    <AppText variant="footnote" color={colors.grayscale[200]}>
                      G: {food.fat}g
                    </AppText>
                  </View>
                </View>
              ))}
            </View>

            <Button
              title="Registrar no Diário de Hoje"
              variant="primary"
              size="large"
              onPress={handleAddDishToTracker}
            />
          </View>
        </ScrollView>
      )}

      {/* Modal de Limite de Scans Gratuitos */}
      {showLimitModal && (
        <View style={styles.modalBackdrop}>
          <View style={{ width: "100%", paddingHorizontal: 20 }}>
            <MessageModalCard
              mode="dualAction"
              title="Limite Gratuito Atingido"
              subtitle={`Você atingiu os ${FREE_SCANS_PER_DAY} scans gratuitos diários. Faça upgrade para o Premium para escanear sem limites!`}
              primaryLabel="Ver Planos Premium"
              secondaryLabel="Fechar"
              onPrimaryPress={() => {
                setShowLimitModal(false);
                onOpenPremium?.();
              }}
              onSecondaryPress={() => setShowLimitModal(false)}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.grayscale[600],
  },
  cameraScreen: {
    flex: 1,
    justifyContent: "space-between",
  },
  viewfinderContainer: {
    flex: 1,
    minHeight: 460,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cameraBgImage: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  topBarOverlay: {
    position: "absolute",
    top: 10,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  dishCyclePill: {
    position: "absolute",
    top: 68,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(18,18,18,0.75)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    zIndex: 10,
  },
  focusFrame: {
    width: 300,
    height: 310,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    marginTop: 48,
  },
  focusedInnerImage: {
    width: "100%",
    height: "100%",
  },
  corner: {
    position: "absolute",
    width: 38,
    height: 38,
    borderColor: colors.grayscale[100],
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 20,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 20,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 20,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 20,
  },
  laserLine: {
    position: "absolute",
    left: 16,
    right: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary[100],
  },
  cameraBottomPanel: {
    backgroundColor: colors.grayscale[600],
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: "center",
    gap: 18,
  },
  modesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  modeCard: {
    flex: 1,
    height: 60,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  shutterOuter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 4,
    borderColor: colors.grayscale[100],
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary[100],
  },
  resultHeroContainer: {
    width: "100%",
    height: 340,
    position: "relative",
  },
  resultHeroImage: {
    width: "100%",
    height: "100%",
  },
  resultTopBarOverlay: {
    position: "absolute",
    top: 10,
    left: 20,
    right: 20,
  },
  resultBody: {
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 20,
  },
  nutrientGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  nutrientCard: {
    width: "48%",
    height: 100,
    borderRadius: radii.xl,
    padding: 14,
    justifyContent: "space-between",
  },
  nutrientBarTrack: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(18,18,18,0.20)",
    overflow: "hidden",
  },
  nutrientBarFill: {
    height: "100%",
    backgroundColor: colors.grayscale[600],
    borderRadius: 3,
  },
  nutrientLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  foodItemCard: {
    backgroundColor: colors.grayscale[500],
    borderRadius: radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    gap: 6,
  },
  foodNutritionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  foodDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.grayscale[400],
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
});
