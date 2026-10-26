import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme";
import { PortfolioNavBar } from "@/components/ui";
import { LoginFlowScreenView } from "@/modules/auth-login";

export default function LoginRoute() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root}>
      <PortfolioNavBar />
      <LoginFlowScreenView
        onNavigateToSignUp={() => router.push("/signup" as any)}
        onLoginSuccess={() => router.push("/home" as any)}
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
