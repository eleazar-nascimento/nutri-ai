import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme";
import { PortfolioNavBar } from "@/components/ui";
import { SplashScreenView } from "@/modules/onboarding";

export default function IndexRoute() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root}>
      <PortfolioNavBar />
      <SplashScreenView onContinue={() => router.push("/onboarding")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.grayscale[600],
  },
});
