import React from "react";
import { useRouter } from "expo-router";
import { BottomMenuTab } from "@/components/ui";
import { Screen } from "@/components/layout";
import { DietsFlowScreenView } from "@/modules/diets";

export default function DietsRoute() {
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
      <DietsFlowScreenView
        onBack={() => router.push("/home" as any)}
        onNavigateTab={handleTabPress}
        onOpenPremium={() => router.push("/premium" as any)}
      />
    </Screen>
  );
}
