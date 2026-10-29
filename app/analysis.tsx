import React from "react";
import { useRouter } from "expo-router";
import { BottomMenuTab } from "@/components/ui";
import { Screen } from "@/components/layout";
import { AnalysisScreenView } from "@/modules/analysis";

export default function AnalysisRoute() {
  const router = useRouter();

  const handleTabPress = (tab: BottomMenuTab) => {
    if (tab === "home") router.push("/home" as any);
    if (tab === "analysis") router.push("/analysis" as any);
    if (tab === "scan") router.push("/scan" as any);
    if (tab === "diet") router.push("/diets" as any);
    if (tab === "settings") router.push("/settings" as any);
  };

  return (
    <Screen>
      <AnalysisScreenView
        onBack={() => router.push("/home" as any)}
        onNavigateTab={handleTabPress}
      />
    </Screen>
  );
}
