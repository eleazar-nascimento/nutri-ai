import React from "react";
import { useRouter } from "expo-router";
import { Screen } from "@/components/layout";
import { SignUpFlowScreenView } from "@/modules/auth-signup";

export default function SignUpRoute() {
  const router = useRouter();

  return (
    <Screen keyboardAvoiding>
      <SignUpFlowScreenView
        onNavigateToLogin={() => router.push("/login" as any)}
        onSignUpSuccess={() => router.replace("/home" as any)}
      />
    </Screen>
  );
}
