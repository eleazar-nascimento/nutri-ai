import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Animated,
  Easing,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { colors, radii } from "@/theme";
import {
  AppText,
  StatusBarMock,
  ArrowIcon,
  MacroIcon,
  MacroType,
  BottomMenuIcon,
} from "@/components/ui";
import {
  ONBOARDING_BOTTOM_ARCH,
  ONBOARDING_ILLUSTRATION_1,
  ONBOARDING_ILLUSTRATION_2,
  ONBOARDING_ILLUSTRATION_3,
  SPLASH_STICKER_SPARKLE,
} from "@/components/illustrations/SplashAndOnboardingSvgs";
import { AnimatedFloatingNode } from "../components/AnimatedFloatingNode";

export interface OnboardingSlide {
  id: string;
  figmaNode: string;
  backgroundColor: string;
  title: string;
  subtitle: string;
  illustrationXml: string;
  illustrationWidth: number;
  illustrationHeight: number;
  isLast?: boolean;
  floatingBadges: {
    id: string;
    macro?: MacroType;
    isAiSparkle?: boolean;
    label: string;
    badgeBg: string;
    iconColor: string;
    position: { top?: number; bottom?: number; left?: number; right?: number };
    rotateDeg: number;
    delay: number;
  }[];
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "onboard-1",
    figmaNode: "62991:757",
    backgroundColor: colors.accent[100], // #DDC0FF
    title: "Seu Companheiro Inteligente de Nutrição",
    subtitle:
      "Registre suas refeições, monitore nutrientes e alcance suas metas de saúde com o apoio da IA.",
    illustrationXml: ONBOARDING_ILLUSTRATION_1,
    illustrationWidth: 304,
    illustrationHeight: 364,
    floatingBadges: [
      {
        id: "b1-ai",
        isAiSparkle: true,
        label: "Nutri IA",
        badgeBg: colors.grayscale[600],
        iconColor: colors.primary[100],
        position: { top: 8, left: 16 },
        rotateDeg: -8,
        delay: 150,
      },
      {
        id: "b1-cal",
        macro: "calories",
        label: "420 kcal",
        badgeBg: colors.grayscale[100],
        iconColor: colors.primary[100],
        position: { top: 24, right: 14 },
        rotateDeg: 9,
        delay: 280,
      },
      {
        id: "b1-prot",
        macro: "protein",
        label: "32g Prot",
        badgeBg: colors.grayscale[600],
        iconColor: colors.accent[300],
        position: { bottom: 18, left: 14 },
        rotateDeg: 6,
        delay: 400,
      },
    ],
  },
  {
    id: "onboard-2",
    figmaNode: "63016:5891",
    backgroundColor: colors.accent[300], // #45C588
    title: "Monitore Tudo o Que Importa",
    subtitle:
      "Registre calorias, macros, água e atividades —\ntudo em um só lugar.",
    illustrationXml: ONBOARDING_ILLUSTRATION_2,
    illustrationWidth: 260,
    illustrationHeight: 364,
    floatingBadges: [
      {
        id: "b2-carb",
        macro: "carbs",
        label: "Carbos",
        badgeBg: colors.grayscale[600],
        iconColor: colors.accent[100],
        position: { top: 14, left: 16 },
        rotateDeg: -10,
        delay: 150,
      },
      {
        id: "b2-fat",
        macro: "fat",
        label: "Queima",
        badgeBg: colors.grayscale[100],
        iconColor: colors.primary[100],
        position: { top: 32, right: 16 },
        rotateDeg: 8,
        delay: 280,
      },
      {
        id: "b2-cal",
        macro: "calories",
        label: "1.800 kcal",
        badgeBg: colors.grayscale[600],
        iconColor: colors.accent[200],
        position: { bottom: 20, right: 14 },
        rotateDeg: -6,
        delay: 410,
      },
    ],
  },
  {
    id: "onboard-3",
    figmaNode: "63016:6023",
    backgroundColor: colors.accent[400], // #FF6F43
    title: "Sua Jornada de Saúde\nComeça Aqui",
    subtitle:
      "Ajudamos você a escolher alimentos mais saudáveis e aproveitar refeições saborosas e nutritivas para o seu bem-estar.",
    illustrationXml: ONBOARDING_ILLUSTRATION_3,
    illustrationWidth: 266,
    illustrationHeight: 364,
    isLast: true,
    floatingBadges: [
      {
        id: "b3-prot",
        macro: "protein",
        label: "Meta 100%",
        badgeBg: colors.grayscale[600],
        iconColor: colors.accent[300],
        position: { top: 12, left: 18 },
        rotateDeg: -7,
        delay: 150,
      },
      {
        id: "b3-ai",
        isAiSparkle: true,
        label: "Scan IA",
        badgeBg: colors.grayscale[100],
        iconColor: colors.grayscale[600],
        position: { top: 28, right: 16 },
        rotateDeg: 10,
        delay: 280,
      },
      {
        id: "b3-carb",
        macro: "carbs",
        label: "Nutritivo",
        badgeBg: colors.grayscale[600],
        iconColor: colors.accent[200],
        position: { bottom: 18, left: 16 },
        rotateDeg: 7,
        delay: 400,
      },
    ],
  },
];

export interface OnboardingScreenProps {
  initialStep?: number;
  onFinish?: () => void;
  onBackToSplash?: () => void;
}

/**
 * Telas 02, 03 e 04 — Onboarding Screens 1, 2 e 3 (Figma Nodes 62991:757, 63016:5891, 63016:6023)
 */
export const OnboardingScreenView: React.FC<OnboardingScreenProps> = ({
  initialStep = 0,
  onFinish,
  onBackToSplash,
}) => {
  const [stepIndex, setStepIndex] = useState(initialStep);
  const slide = ONBOARDING_SLIDES[stepIndex];

  const contentAnim = useRef(new Animated.Value(0)).current;
  const arrowNudge = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const useNativeDriver = Platform.OS !== "web";
    contentAnim.setValue(0);
    Animated.spring(contentAnim, {
      toValue: 1,
      friction: 7,
      tension: 55,
      useNativeDriver,
    }).start();
  }, [stepIndex, contentAnim]);

  useEffect(() => {
    const useNativeDriver = Platform.OS !== "web";
    const arrowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowNudge, {
          toValue: 6,
          duration: 650,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver,
        }),
        Animated.timing(arrowNudge, {
          toValue: 0,
          duration: 650,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver,
        }),
      ])
    );
    arrowLoop.start();
    return () => arrowLoop.stop();
  }, [arrowNudge]);

  const handleNext = () => {
    const useNativeDriver = Platform.OS !== "web";
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.9,
        friction: 5,
        tension: 160,
        useNativeDriver,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 4,
        tension: 120,
        useNativeDriver,
      }),
    ]).start();

    if (stepIndex < ONBOARDING_SLIDES.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      onFinish?.();
    }
  };

  return (
    <View
      style={[
        styles.screenContainer,
        { backgroundColor: slide.backgroundColor },
      ]}
    >
      {/* Status Bar Dark (#030401) exatamente como no Figma */}
      <StatusBarMock variant="black" />

      {/* Barra de Progresso & Botão Pular */}
      <View style={styles.topControlsRow}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            if (stepIndex > 0) {
              setStepIndex((s) => s - 1);
            } else {
              onBackToSplash?.();
            }
          }}
          style={styles.stepBackPill}
        >
          <ArrowIcon
            direction="left"
            size={18}
            color={colors.grayscale[600]}
          />
        </TouchableOpacity>

        <View style={styles.dotsRow}>
          {ONBOARDING_SLIDES.map((s, idx) => {
            const active = idx === stepIndex;
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => setStepIndex(idx)}
                style={[
                  styles.dotIndicator,
                  {
                    width: active ? 28 : 8,
                    backgroundColor: active
                      ? colors.grayscale[600]
                      : "rgba(18,18,18,0.28)",
                  },
                ]}
              />
            );
          })}
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onFinish}
          style={styles.skipPill}
        >
          <AppText variant="caption2" color={colors.grayscale[600]}>
            Pular
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Área da Ilustração Oficial + Ícones Flutuantes Animados */}
      <View style={styles.illustrationStage} key={slide.id}>
        {/* Estrela decorativa animada à esquerda */}
        <AnimatedFloatingNode
          delay={120}
          floatRange={7}
          floatDuration={1800}
          baseRotateDeg={-15}
          rotateRangeDeg={16}
          style={{ position: "absolute", top: 68, left: 26, zIndex: 2 }}
        >
          <SvgXml xml={SPLASH_STICKER_SPARKLE} width={34} height={34} />
        </AnimatedFloatingNode>

        {/* Ilustração Principal do Personagem (Figma 63016:5424 / 5606 / 3737) */}
        <AnimatedFloatingNode
          delay={50}
          floatRange={9}
          floatDuration={2400}
          baseRotateDeg={0}
          rotateRangeDeg={2}
          pulseScale={1.03}
        >
          <SvgXml
            xml={slide.illustrationXml}
            width={slide.illustrationWidth}
            height={slide.illustrationHeight}
          />
        </AnimatedFloatingNode>

        {/* Badges de Ícones Flutuantes Animados ao redor da Ilustração */}
        {slide.floatingBadges.map((badge) => {
          const isDarkBg = badge.badgeBg === colors.grayscale[600];
          return (
            <AnimatedFloatingNode
              key={badge.id}
              delay={badge.delay}
              floatRange={8}
              floatDuration={2000 + badge.delay}
              baseRotateDeg={badge.rotateDeg}
              rotateRangeDeg={5}
              style={[styles.floatingBadgeWrapper, badge.position]}
            >
              <View
                style={[
                  styles.floatingBadge,
                  { backgroundColor: badge.badgeBg },
                ]}
              >
                <View
                  style={[
                    styles.floatingBadgeIconCircle,
                    {
                      backgroundColor: isDarkBg
                        ? colors.grayscale[400]
                        : colors.system.surfaceLight,
                    },
                  ]}
                >
                  {badge.macro ? (
                    <MacroIcon
                      type={badge.macro}
                      size={16}
                      color={badge.iconColor}
                    />
                  ) : (
                    <BottomMenuIcon
                      tab="scan"
                      filled
                      size={16}
                      color={badge.iconColor}
                    />
                  )}
                </View>
                <AppText
                  variant="footnote"
                  color={
                    isDarkBg ? colors.grayscale[100] : colors.grayscale[600]
                  }
                  style={{ fontWeight: "600" }}
                >
                  {badge.label}
                </AppText>
              </View>
            </AnimatedFloatingNode>
          );
        })}
      </View>

      {/* Bloco de Título e Subtítulo em Português (Figma pos=(20, 566), width 388) */}
      <Animated.View
        style={[
          styles.textBlock,
          {
            opacity: contentAnim,
            transform: [
              {
                translateY: contentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 0],
                }),
              },
            ],
          },
        ]}
      >
        <AppText
          variant="title1"
          color={colors.grayscale[600]}
          align="center"
        >
          {slide.title}
        </AppText>

        <AppText
          variant="body2"
          color={colors.grayscale[500]}
          align="center"
          style={styles.subtitleText}
        >
          {slide.subtitle}
        </AppText>
      </Animated.View>

      {/* Arco Branco Inferior (Ellipse 13 - 63015:4514) + Botão Circular Preto (Ellipse 14 - 100x100) */}
      <View style={styles.bottomArchContainer}>
        <View style={styles.archSvgWrapper}>
          <SvgXml xml={ONBOARDING_BOTTOM_ARCH} width={212} height={240} />
        </View>

        <Animated.View
          style={[
            styles.circleButtonPosition,
            { transform: [{ scale: buttonScale }] },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNext}
            style={styles.blackCircleButton}
          >
            {slide.isLast ? (
              <AppText
                variant="headline"
                color={colors.grayscale[100]}
                align="center"
                style={{ lineHeight: 22 }}
              >
                {"Começar\nAgora"}
              </AppText>
            ) : (
              <View style={styles.nextButtonContent}>
                <AppText
                  variant="headline"
                  color={colors.grayscale[100]}
                  align="center"
                >
                  Próximo
                </AppText>
                <Animated.View
                  style={{ transform: [{ translateX: arrowNudge }] }}
                >
                  <ArrowIcon
                    direction="right"
                    size={22}
                    color={colors.grayscale[100]}
                  />
                </Animated.View>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  topControlsRow: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepBackPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dotIndicator: {
    height: 8,
    borderRadius: 4,
  },
  skipPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  illustrationStage: {
    width: "100%",
    height: 380,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginTop: 8,
  },
  floatingBadgeWrapper: {
    position: "absolute",
    zIndex: 5,
  },
  floatingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 6,
    paddingRight: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 5,
  },
  floatingBadgeIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 12,
    minHeight: 146,
  },
  subtitleText: {
    maxWidth: 360,
  },
  bottomArchContainer: {
    width: "100%",
    height: 170,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  archSvgWrapper: {
    position: "absolute",
    bottom: -48,
    alignItems: "center",
    justifyContent: "center",
  },
  circleButtonPosition: {
    marginBottom: 26,
    zIndex: 10,
  },
  blackCircleButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.grayscale[600],
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  nextButtonContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
});

