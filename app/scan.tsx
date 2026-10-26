import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme";
import { PortfolioNavBar } from "@/components/ui";
import { ScanFlowScreenView } from "@/modules/scan";

export default function ScanRoute() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root}>
      <PortfolioNavBar />
      <ScanFlowScreenView
        onBack={() => router.push("/home" as any)}
        onAddToDiet={() => router.push("/diets" as any)}
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

