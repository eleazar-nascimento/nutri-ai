import React from "react";
import { useRouter } from "expo-router";
import { Screen } from "@/components/layout";
import { PremiumFlowScreenView } from "@/modules/home-premium";

export default function PremiumRoute() {
  const router = useRouter();

  return (
    <Screen>
      <PremiumFlowScreenView onClose={() => router.push("/home" as any)} />
    </Screen>
  );
}
