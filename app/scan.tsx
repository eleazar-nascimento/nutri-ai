import React from "react";
import { useRouter } from "expo-router";
import { Screen } from "@/components/layout";
import { ScanFlowScreenView } from "@/modules/scan";

export default function ScanRoute() {
  const router = useRouter();

  return (
    <Screen>
      <ScanFlowScreenView
        onBack={() => router.push("/home" as any)}
        onAddToDiet={() => router.push("/home" as any)}
        onOpenPremium={() => router.push("/premium" as any)}
      />
    </Screen>
  );
}
