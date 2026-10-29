import React from "react";
import { useRouter } from "expo-router";
import { Screen } from "@/components/layout";
import { SplashScreenView } from "@/modules/onboarding";

export default function IndexRoute() {
  const router = useRouter();

  return (
    <Screen>
      <SplashScreenView onContinue={() => router.push("/onboarding" as any)} />
    </Screen>
  );
}
