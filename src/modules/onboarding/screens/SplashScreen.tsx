import React, { useEffect, useRef } from "react";
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
import { AppText, NutriLogo, StatusBarMock, ArrowIcon } from "@/components/ui";
import {
  SPLASH_STICKER_BLUE,
  SPLASH_STICKER_ORANGE,
  SPLASH_STICKER_PINK,
  SPLASH_STICKER_PURPLE,
  SPLASH_STICKER_SPARKLE,
  SPLASH_STICKER_YELLOW,
} from "@/components/illustrations/SplashAndOnboardingSvgs";
import { AnimatedFloatingNode } from "../components/AnimatedFloatingNode";

export interface SplashScreenProps {
  onContinue?: () => void;
}

/**
 * 01_Splash Screen (Figma Node 60964:5329)
 * - Fundo escuro (#121212)
 * - Logo NutriAI centralizado no topo + frase "Comer [saudável] ficou fácil!"
 * - Colagem inferior com os 8 ícones/stickers oficiais do Figma animados individualmente
 */
export const SplashScreenView: React.FC<SplashScreenProps> = ({
  onContinue,
}) => {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const badgePulse = useRef(new Animated.Value(1)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const useNativeDriver = Platform.OS !== "web";
    Animated.spring(logoAnim, {
      toValue: 1,
      friction: 6,
      tension: 50,
      useNativeDriver,
    }).start();

    Animated.timing(ctaOpacity, {
      toValue: 1,
      duration: 700,
      delay: 900,
      useNativeDriver,
    }).start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(badgePulse, {
          toValue: 1.07,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver,
        }),
        Animated.timing(badgePulse, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver,
        }),
      ])
    );
    pulseLoop.start();

    return () => {
      pulseLoop.stop();
    };
  }, [logoAnim, badgePulse, ctaOpacity]);

  return (
    <View style={styles.screenContainer}>
      <StatusBarMock variant="white" />

      {/* Bloco Central: Logo + Frase com Pílula Animada */}
      <Animated.View
        style={[
          styles.heroSection,
          {
            opacity: logoAnim,
            transform: [
              {
                translateY: logoAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-24, 0],
                }),
              },
              {
                scale: logoAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1],
                }),
              },
            ],
          },
        ]}
      >
        <NutriLogo variant="on" width={162} height={54} />

        {/* Group 21: "Comer [saudável] \n ficou fácil!" */}
        <View style={styles.taglineContainer}>
          <View style={styles.taglineRow}>
            <AppText variant="title2" color={colors.grayscale[100]}>
              Comer{" "}
            </AppText>
            <Animated.View
              style={[
                styles.healthyPill,
                { transform: [{ scale: badgePulse }] },
              ]}
            >
              <AppText variant="title2" color={colors.grayscale[100]}>
                saudável
              </AppText>
            </Animated.View>
          </View>
          <AppText
            variant="title2"
            color={colors.grayscale[100]}
            align="center"
          >
            ficou fácil!
          </AppText>
        </View>

        {/* Botão sutil para avançar ao Onboarding na demonstração do portfólio */}
        <Animated.View style={{ opacity: ctaOpacity, marginTop: 28 }}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onContinue}
            style={styles.enterButton}
          >
            <AppText variant="subheadline" color={colors.grayscale[100]}>
              Explorar Onboarding
            </AppText>
            <View style={styles.enterArrowCircle}>
              <ArrowIcon
                direction="right"
                size={16}
                color={colors.grayscale[100]}
              />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Colagem Inferior de Ícones e Personagens Animados (Figma 60964:5329) */}
      <View style={styles.collageContainer} pointerEvents="box-none">
        {/* 1. Sticker Amarelo (Group 17 - 63026:5121) */}
        <AnimatedFloatingNode
          delay={100}
          floatRange={10}
          floatDuration={2100}
          baseRotateDeg={-8}
          rotateRangeDeg={5}
          style={[styles.stickerAbsolute, { right: 16, bottom: 182 }]}
          onPress={onContinue}
        >
          <SvgXml xml={SPLASH_STICKER_YELLOW} width={138} height={140} />
        </AnimatedFloatingNode>

        {/* 2. Sticker Azul (Group 11 - 63026:5102) */}
        <AnimatedFloatingNode
          delay={220}
          floatRange={8}
          floatDuration={2400}
          baseRotateDeg={-12}
          rotateRangeDeg={6}
          style={[styles.stickerAbsolute, { left: 8, bottom: 162 }]}
          onPress={onContinue}
        >
          <SvgXml xml={SPLASH_STICKER_BLUE} width={114} height={113} />
        </AnimatedFloatingNode>

        {/* 3. Card Quadrado Verde "Saudável" (Group 10 - 63026:5067) */}
        <AnimatedFloatingNode
          delay={320}
          floatRange={7}
          floatDuration={2600}
          baseRotateDeg={21}
          rotateRangeDeg={4}
          style={[styles.stickerAbsolute, { left: 168, bottom: 96 }]}
          onPress={onContinue}
        >
          <View style={styles.healthySquareCard}>
            <AppText variant="headline" color={colors.grayscale[400]}>
              Saudável
            </AppText>
          </View>
        </AnimatedFloatingNode>

        {/* 4. Estrela / Brilho Branco (Group 20 - 63026:5120) */}
        <AnimatedFloatingNode
          delay={400}
          floatRange={6}
          floatDuration={1700}
          baseRotateDeg={15}
          rotateRangeDeg={14}
          pulseScale={1.15}
          style={[styles.stickerAbsolute, { left: 10, bottom: 104 }]}
          onPress={onContinue}
        >
          <SvgXml xml={SPLASH_STICKER_SPARKLE} width={56} height={55} />
        </AnimatedFloatingNode>

        {/* 5. Pílula Verde Vertical "Hoje" (Frame 63026:5117) */}
        <AnimatedFloatingNode
          delay={480}
          floatRange={6}
          floatDuration={2300}
          baseRotateDeg={-84}
          rotateRangeDeg={5}
          style={[styles.stickerAbsolute, { left: 6, bottom: 28 }]}
          onPress={onContinue}
        >
          <View style={styles.todayPill}>
            <AppText variant="headline" color={colors.grayscale[400]}>
              Hoje
            </AppText>
          </View>
        </AnimatedFloatingNode>

        {/* 6. Sticker Laranja (Group 18 - 63026:5089) */}
        <AnimatedFloatingNode
          delay={550}
          floatRange={9}
          floatDuration={2250}
          baseRotateDeg={8}
          rotateRangeDeg={5}
          style={[styles.stickerAbsolute, { left: 64, bottom: 10 }]}
          onPress={onContinue}
        >
          <SvgXml xml={SPLASH_STICKER_ORANGE} width={114} height={175} />
        </AnimatedFloatingNode>

        {/* 7. Sticker Roxo (Group 9 - 63026:5047) */}
        <AnimatedFloatingNode
          delay={640}
          floatRange={11}
          floatDuration={2500}
          baseRotateDeg={14}
          rotateRangeDeg={6}
          style={[styles.stickerAbsolute, { right: -6, bottom: 14 }]}
          onPress={onContinue}
        >
          <SvgXml xml={SPLASH_STICKER_PURPLE} width={168} height={182} />
        </AnimatedFloatingNode>

        {/* 8. Sticker Rosa (Group 16 - 63026:5077) */}
        <AnimatedFloatingNode
          delay={740}
          floatRange={8}
          floatDuration={2000}
          baseRotateDeg={-12}
          rotateRangeDeg={6}
          style={[styles.stickerAbsolute, { left: 176, bottom: -4 }]}
          onPress={onContinue}
        >
          <SvgXml xml={SPLASH_STICKER_PINK} width={130} height={110} />
        </AnimatedFloatingNode>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 428,
    minHeight: 840,
    alignSelf: "center",
    backgroundColor: colors.grayscale[600],
    justifyContent: "space-between",
    overflow: "hidden",
  },
  heroSection: {
    alignItems: "center",
    marginTop: 88,
    paddingHorizontal: 24,
  },
  taglineContainer: {
    marginTop: 36,
    alignItems: "center",
    gap: 2,
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  healthyPill: {
    backgroundColor: colors.accent[400],
    borderRadius: 50,
    paddingHorizontal: 16,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  enterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.grayscale[500],
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    paddingLeft: 18,
    paddingRight: 8,
    paddingVertical: 8,
    borderRadius: radii.full,
  },
  enterArrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary[100],
    alignItems: "center",
    justifyContent: "center",
  },
  collageContainer: {
    width: "100%",
    height: 350,
    position: "relative",
  },
  stickerAbsolute: {
    position: "absolute",
  },
  healthySquareCard: {
    width: 106,
    height: 106,
    borderRadius: 12,
    backgroundColor: colors.accent[300],
    alignItems: "center",
    justifyContent: "center",
  },
  todayPill: {
    width: 98,
    height: 48,
    borderRadius: 30,
    backgroundColor: colors.accent[300],
    alignItems: "center",
    justifyContent: "center",
  },
});

