import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { colors, radii } from "@/theme";
import {
  AppText,
  StatusBarMock,
  HomeIndicator,
  TopBar,
  ActionIcon,
  Button,
} from "@/components/ui";

export type ScanSubScreen = "31_scanning" | "32_scan_result";
export type ScanMode = "camera" | "barcode" | "gallery";

const DETECTED_FOODS = [
  {
    name: "Tiras de Frango Grelhado",
    calories: "280 kcal",
    protein: "Proteína: 42g",
    carbs: "Carbo: 4g",
    fat: "Gordura: 9g",
  },
  {
    name: "Pão Naan Artesanal",
    calories: "210 kcal",
    protein: "Proteína: 7g",
    carbs: "Carbo: 38g",
    fat: "Gordura: 4g",
  },
  {
    name: "Pimentões Salteados (Vermelho e Amarelo)",
    calories: "130 kcal",
    protein: "Proteína: 3g",
    carbs: "Carbo: 14g",
    fat: "Gordura: 7g",
  },
];

const SCAN_MACROS = [
  {
    name: "Carbos",
    current: "50%",
    max: "100%",
    progress: 0.5,
    bg: colors.accent[200], // #F5F378
  },
  {
    name: "Proteínas",
    current: "83%",
    max: "100%",
    progress: 0.83,
    bg: colors.accent[300], // #45C588
  },
  {
    name: "Calorias",
    current: "620 kcal",
    max: "100%",
    progress: 0.65,
    bg: colors.accent[100], // #DDC0FF
  },
  {
    name: "Gorduras",
    current: "38%",
    max: "100%",
    progress: 0.38,
    bg: colors.accent[400], // #FF6F43
  },
];

export interface ScanFlowScreenProps {
  onBack?: () => void;
  onAddToDiet?: () => void;
}

/**
 * Módulo 7 — 31_Scanning & 32_Scan Result (Figma Nodes 63000:2106 & 63001:2834)
 */
export const ScanFlowScreenView: React.FC<ScanFlowScreenProps> = ({
  onBack,
  onAddToDiet,
}) => {
  const [subScreen, setSubScreen] = useState<ScanSubScreen>("31_scanning");
  const [scanMode, setScanMode] = useState<ScanMode>("camera");
  const [favorited, setFavorited] = useState(false);

  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [laserAnim]);

  return (
    <View style={styles.screenContainer}>
      <StatusBarMock variant="white" />

      {/* Seletor rápido entre 31_Scanning e 32_Scan Result */}
      <View style={styles.subNavWrapper}>
        <View style={styles.subNavRow}>
          <TouchableOpacity
            onPress={() => setSubScreen("31_scanning")}
            style={[
              styles.subPill,
              subScreen === "31_scanning" && styles.subPillActive,
            ]}
          >
            <AppText
              variant="footnote"
              color={
                subScreen === "31_scanning"
                  ? colors.grayscale[600]
                  : colors.grayscale[200]
              }
            >
              31. Escaneando (Câmera IA)
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSubScreen("32_scan_result")}
            style={[
              styles.subPill,
              subScreen === "32_scan_result" && styles.subPillActive,
            ]}
          >
            <AppText
              variant="footnote"
              color={
                subScreen === "32_scan_result"
                  ? colors.grayscale[600]
                  : colors.grayscale[200]
              }
            >
              32. Resultado do Scan
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* TELA 31 — SCANNING (63000:2106) */}
      {subScreen === "31_scanning" && (
        <View style={styles.cameraScreen}>
          {/* Visor com imagem da refeição */}
          <View style={styles.viewfinderContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=80",
              }}
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

            {/* Moldura de Foco 341x340 com Cantoneiras Brancas */}
            <View style={styles.focusFrame}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=80",
                }}
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
                          outputRange: [20, 290],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          </View>

          {/* Painel Inferior #121212 com 3 Modos e Botão Disparador 56x56 */}
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

            {/* Botão Disparador (Shutter 56x56) */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSubScreen("32_scan_result")}
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
          {/* Imagem Superior do Prato (351px) + TopBar */}
          <View style={styles.resultHeroContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=80",
              }}
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

          {/* Conteúdo Nutricional (#121212) */}
          <View style={styles.resultBody}>
            {/* Grade 2x2 de Macros (184x100 cada) */}
            <View style={styles.nutrientGrid}>
              {SCAN_MACROS.map((item) => (
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
                          { width: `${item.progress * 100}%` },
                        ]}
                      />
                    </View>
                    <View style={styles.nutrientLabelsRow}>
                      <AppText variant="footnote" color={colors.grayscale[600]}>
                        {item.current}
                      </AppText>
                      <AppText variant="footnote" color={colors.grayscale[600]}>
                        {item.max}
                      </AppText>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Lista de Alimentos Identificados (Food Items 388x86) */}
            <View style={{ gap: 12 }}>
              {DETECTED_FOODS.map((food) => (
                <View key={food.name} style={styles.foodItemCard}>
                  <AppText variant="headline" color={colors.grayscale[100]}>
                    {food.name}
                  </AppText>

                  <View style={styles.foodNutritionRow}>
                    <AppText variant="footnote" color={colors.grayscale[200]}>
                      {food.calories}
                    </AppText>
                    <View style={styles.foodDivider} />
                    <AppText variant="footnote" color={colors.grayscale[200]}>
                      {food.protein}
                    </AppText>
                    <View style={styles.foodDivider} />
                    <AppText variant="footnote" color={colors.grayscale[200]}>
                      {food.carbs}
                    </AppText>
                    <View style={styles.foodDivider} />
                    <AppText variant="footnote" color={colors.grayscale[200]}>
                      {food.fat}
                    </AppText>
                  </View>
                </View>
              ))}
            </View>

            <Button
              title="Adicionar à Minha Dieta"
              variant="primary"
              size="large"
              onPress={onAddToDiet}
            />
          </View>
        </ScrollView>
      )}
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
  subNavWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  subNavRow: {
    flexDirection: "row",
    gap: 8,
  },
  subPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: colors.grayscale[500],
    borderWidth: 1,
    borderColor: colors.grayscale[400],
  },
  subPillActive: {
    backgroundColor: colors.accent[200],
    borderColor: colors.accent[200],
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
  focusFrame: {
    width: 310,
    height: 330,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    marginTop: 44,
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
    paddingTop: 18,
    paddingHorizontal: 20,
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
    height: 78,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  shutterOuter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.grayscale[100],
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.grayscale[100],
  },
  resultHeroContainer: {
    width: "100%",
    height: 310,
    position: "relative",
  },
  resultHeroImage: {
    width: "100%",
    height: "100%",
  },
  resultTopBarOverlay: {
    position: "absolute",
    top: 12,
    left: 20,
    right: 20,
  },
  resultBody: {
    marginTop: -24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.grayscale[600],
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 20,
  },
  nutrientGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },
  nutrientCard: {
    width: "48%",
    height: 100,
    borderRadius: 20,
    padding: 14,
    justifyContent: "space-between",
  },
  nutrientBarTrack: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(18,18,18,0.22)",
    overflow: "hidden",
  },
  nutrientBarFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors.grayscale[600],
  },
  nutrientLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  foodItemCard: {
    width: "100%",
    minHeight: 86,
    borderRadius: 20,
    backgroundColor: colors.grayscale[500],
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    paddingHorizontal: 18,
    paddingVertical: 14,
    justifyContent: "center",
    gap: 6,
  },
  foodNutritionRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  foodDivider: {
    width: 1,
    height: 14,
    backgroundColor: colors.grayscale[400],
  },
});

