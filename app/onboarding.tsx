import React from "react";
import { useRouter } from "expo-router";
import { Screen } from "@/components/layout";
import { OnboardingScreenView } from "@/modules/onboarding";
import { useAppStore } from "@/store";

export default function OnboardingRoute() {
  const router = useRouter();
  const { markOnboardingSeen } = useAppStore();

  return (
    <Screen>
      <OnboardingScreenView
        onBackToSplash={() => router.push("/" as any)}
        onFinish={() => {
          markOnboardingSeen();
          router.push("/login" as any);
        }}
      />
    </Screen>
  );
}
