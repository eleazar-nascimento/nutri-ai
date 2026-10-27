import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";

export interface AnimatedFloatingNodeProps {
  children: React.ReactNode;
  delay?: number;
  floatRange?: number;
  floatDuration?: number;
  rotateRangeDeg?: number;
  baseRotateDeg?: number;
  pulseScale?: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

/**
 * Wrapper reutilizável para animar ícones, stickers e ilustrações no Splash e Onboarding:
 * 1. Entrada com efeito Spring (escala 0 -> 1 e translateY 40 -> 0) com delay escalonado
 * 2. Flutuação contínua suave (translateY senoidal)
 * 3. Balanço angular contínuo (rotação suave em torno de baseRotateDeg)
 * 4. Interação ao toque (efeito elástico de bounce ao clicar no ícone)
 */
export const AnimatedFloatingNode: React.FC<AnimatedFloatingNodeProps> = ({
  children,
  delay = 0,
  floatRange = 8,
  floatDuration = 2200,
  rotateRangeDeg = 4,
  baseRotateDeg = 0,
  pulseScale = 1.04,
  style,
  onPress,
}) => {
  const entrance = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const tapScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const useNativeDriver = Platform.OS !== "web";
    entrance.setValue(0);

    const entranceSpring = Animated.sequence([
      Animated.delay(delay),
      Animated.spring(entrance, {
        toValue: 1,
        friction: 6,
        tension: 55,
        useNativeDriver,
      }),
    ]);

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: floatDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: floatDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver,
        }),
      ])
    );

    const rotateLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: floatDuration * 1.15,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: floatDuration * 1.15,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver,
        }),
      ])
    );

    entranceSpring.start();
    floatLoop.start();
    rotateLoop.start();

    return () => {
      entranceSpring.stop();
      floatLoop.stop();
      rotateLoop.stop();
    };
  }, [delay, floatDuration, entrance, floatAnim, rotateAnim]);

  const handlePress = () => {
    const useNativeDriver = Platform.OS !== "web";
    Animated.sequence([
      Animated.spring(tapScale, {
        toValue: 1.18,
        friction: 4,
        tension: 140,
        useNativeDriver,
      }),
      Animated.spring(tapScale, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver,
      }),
    ]).start();
    onPress?.();
  };

  const translateY = Animated.add(
    entrance.interpolate({
      inputRange: [0, 1],
      outputRange: [45, 0],
    }),
    floatAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-floatRange, floatRange],
    })
  );

  const scale = Animated.multiply(
    entrance.interpolate({
      inputRange: [0, 0.7, 1],
      outputRange: [0.2, pulseScale, 1],
    }),
    tapScale
  );

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      `${baseRotateDeg - rotateRangeDeg}deg`,
      `${baseRotateDeg + rotateRangeDeg}deg`,
    ],
  });

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: entrance,
          transform: [{ translateY }, { scale }, { rotate }],
        },
      ]}
    >
      <Pressable onPress={handlePress}>{children}</Pressable>
    </Animated.View>
  );
};

