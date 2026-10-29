import React from "react";
import { useRouter } from "expo-router";
import { Screen } from "@/components/layout";
import { LoginFlowScreenView } from "@/modules/auth-login";

export default function LoginRoute() {
  const router = useRouter();

  return (
    <Screen keyboardAvoiding>
      <LoginFlowScreenView
        onNavigateToSignUp={() => router.push("/signup" as any)}
        onLoginSuccess={() => router.replace("/home" as any)}
      />
    </Screen>
  );
}
