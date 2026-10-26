import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme";
import { PortfolioNavBar } from "@/components/ui";
import { SignUpFlowScreenView } from "@/modules/auth-signup";

export default function SignUpRoute() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root}>
      <PortfolioNavBar />
      <SignUpFlowScreenView
        onNavigateToLogin={() => router.push("/login" as any)}
        onSignUpSuccess={() => router.push("/home" as any)}
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
