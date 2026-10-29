import "../global.css";
import React, { useEffect } from "react";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "@/theme";
import { AppStoreProvider, useAppStore } from "@/store";
import { DeviceFrame } from "@/components/ui";
import { TestUserPanel } from "@/components/layout";

SplashScreen.preventAutoHideAsync().catch(() => {});

const PROTECTED_ROUTES = new Set([
  "/home",
  "/premium",
  "/analysis",
  "/scan",
  "/diets",
  "/settings",
]);

const AUTH_PUBLIC_ROUTES = new Set(["/", "/onboarding", "/login", "/signup"]);

const NavigationGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { hydrated, isAuthenticated, onboardingSeen, demoMode } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated || demoMode) return;

    if (isAuthenticated && AUTH_PUBLIC_ROUTES.has(pathname)) {
      router.replace("/home" as any);
      return;
    }

    if (!isAuthenticated && PROTECTED_ROUTES.has(pathname)) {
      router.replace((onboardingSeen ? "/login" : "/") as any);
    }
  }, [hydrated, demoMode, isAuthenticated, onboardingSeen, pathname, router]);

  if (!hydrated) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.grayscale[600],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary[100]} />
      </View>
    );
  }

  return <>{children}</>;
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.grayscale[600],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary[100]} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppStoreProvider>
        <StatusBar style="light" />
        <DeviceFrame sidePanel={<TestUserPanel />}>
          <NavigationGuard>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.grayscale[600] },
              }}
            />
          </NavigationGuard>
        </DeviceFrame>
      </AppStoreProvider>
    </SafeAreaProvider>
  );
}
