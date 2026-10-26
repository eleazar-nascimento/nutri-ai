import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme";
import { PortfolioNavBar } from "@/components/ui";
import { OnboardingScreenView } from "@/modules/onboarding";

export default function OnboardingRoute() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root}>
      <PortfolioNavBar />
      <OnboardingScreenView
        onBackToSplash={() => router.push("/")}
        onFinish={() => router.push("/login" as any)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.grayscale[600],
  },
});
