import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme";
import { PortfolioNavBar, BottomMenuTab } from "@/components/ui";
import { DietsFlowScreenView } from "@/modules/diets";

export default function DietsRoute() {
  const router = useRouter();

  const handleTabPress = (tab: BottomMenuTab) => {
    if (tab === "home") router.push("/home" as any);
    if (tab === "analysis") router.push("/analysis" as any);
    if (tab === "scan") router.push("/scan" as any);
    if (tab === "diet") router.push("/diets" as any);
    if (tab === "settings") router.push("/style-guide" as any);
  };

  return (
    <SafeAreaView style={styles.root}>
      <PortfolioNavBar />
      <DietsFlowScreenView
        onBack={() => router.push("/home" as any)}
        onNavigateTab={handleTabPress}
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

