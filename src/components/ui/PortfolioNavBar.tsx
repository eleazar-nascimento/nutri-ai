import React from "react";
import { ScrollView, TouchableOpacity, View, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { colors, radii } from "@/theme";
import { AppText } from "./Typography";

export interface PortfolioNavItem {
  label: string;
  route: string;
}

const NAV_ITEMS: PortfolioNavItem[] = [
  { label: "1. Splash", route: "/" },
  { label: "2. Onboarding", route: "/onboarding" },
  { label: "3. Login & Senha", route: "/login" },
  { label: "4. Cadastro", route: "/signup" },
  { label: "5. Home & Premium", route: "/home" },
  { label: "6. Análise", route: "/analysis" },
  { label: "7. Scan IA", route: "/scan" },
  { label: "8. Dietas", route: "/diets" },
  { label: "Style Guide", route: "/style-guide" },
];

export const PortfolioNavBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.barContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.route ||
            (item.route === "/home" && pathname === "/premium");
          return (
            <TouchableOpacity
              key={item.route}
              activeOpacity={0.8}
              onPress={() => router.push(item.route as any)}
              style={[styles.tabPill, isActive && styles.tabPillActive]}
            >
              <AppText
                variant="footnote"
                color={isActive ? colors.grayscale[100] : colors.grayscale[200]}
              >
                {item.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    width: "100%",
    maxWidth: 428,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
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
