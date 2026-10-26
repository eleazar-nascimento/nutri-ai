import React from "react";
import { SafeAreaView, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors, radii } from "@/theme";
import { AppText } from "@/components/ui";
import { SplashScreenView } from "@/modules/onboarding";

export default function IndexRoute() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root}>
      {/* Barra superior rápida para navegação de Portfólio */}
      <View style={styles.portfolioBar}>
        <View style={styles.portfolioTabs}>
          <TouchableOpacity
            style={[styles.tabPill, styles.tabPillActive]}
            onPress={() => router.push("/")}
          >
            <AppText variant="footnote" color={colors.grayscale[100]}>
              01. Splash
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabPill}
            onPress={() => router.push("/onboarding")}
          >
            <AppText variant="footnote" color={colors.grayscale[200]}>
              02-04. Onboarding
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabPill}
            onPress={() => router.push("/style-guide")}
          >
            <AppText variant="footnote" color={colors.grayscale[200]}>
              Style Guide
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <SplashScreenView onContinue={() => router.push("/onboarding")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.grayscale[600],
  },
  portfolioBar: {
    width: "100%",
    maxWidth: 428,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: "center",
  },
  portfolioTabs: {
    flexDirection: "row",
    backgroundColor: colors.grayscale[500],
    borderRadius: radii.full,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    gap: 4,
  },
  tabPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
  },
  tabPillActive: {
    backgroundColor: colors.primary[100],
  },
});
