import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme";
import { PortfolioNavBar, BottomMenuTab } from "@/components/ui";
import { HomeAndNotificationsScreenView } from "@/modules/home-premium";

export default function HomeRoute() {
  const router = useRouter();

  const handleTabPress = (tab: BottomMenuTab) => {
    if (tab === "home") router.push("/home" as any);
    if (tab === "analysis") router.push("/analysis" as any);
    if (tab === "scan") router.push("/scan" as any);
    if (tab === "diet") router.push("/diets" as any);
    if (tab === "settings") router.push("/settings" as any);
  };

  return (
    <SafeAreaView style={styles.root}>
      <PortfolioNavBar />
      <HomeAndNotificationsScreenView
        onOpenPremium={() => router.push("/premium" as any)}
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

