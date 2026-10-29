import React, { createContext, useContext } from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { colors } from "@/theme";
import { AppText } from "./Typography";

/**
 * Indica se a interface está sendo exibida dentro da moldura de celular
 * (Web em telas largas). Nesse caso exibimos a Status Bar e o Home Indicator
 * simulados do Figma; em dispositivos reais eles são ocultados, pois o próprio
 * sistema operacional já desenha esses elementos.
 */
const DeviceChromeContext = createContext(false);

export const useDeviceChrome = () => useContext(DeviceChromeContext);

/** Largura mínima da janela para exibir a moldura de celular na Web */
const FRAME_BREAKPOINT = 700;
const FRAME_WIDTH = 430;
const FRAME_MAX_HEIGHT = 932;

export const DeviceFrame: React.FC<{
  children: React.ReactNode;
  sidePanel?: React.ReactNode;
}> = ({ children, sidePanel }) => {
  const { width, height } = useWindowDimensions();
  const framed = Platform.OS === "web" && width >= FRAME_BREAKPOINT;

  if (!framed) {
    return (
      <DeviceChromeContext.Provider value={false}>
        <View style={styles.fluid}>{children}</View>
      </DeviceChromeContext.Provider>
    );
  }

  const frameHeight = Math.min(FRAME_MAX_HEIGHT, height - 48);
  const showSide = Boolean(sidePanel) && width >= 1100;

  return (
    <DeviceChromeContext.Provider value={true}>
      <View style={styles.desktopBackdrop}>
        {showSide && <View style={styles.sidePanel}>{sidePanel}</View>}
        <View style={{ alignItems: "center", gap: 10 }}>
          <View style={[styles.phone, { height: frameHeight }]}>{children}</View>
          {!showSide && sidePanel ? (
            <View style={{ maxWidth: FRAME_WIDTH }}>{sidePanel}</View>
          ) : (
            <AppText variant="footnote" color={colors.grayscale[300]}>
              Visualização mobile-first • 430 × {Math.round(frameHeight)}
            </AppText>
          )}
        </View>
      </View>
    </DeviceChromeContext.Provider>
  );
};

const styles = StyleSheet.create({
  fluid: {
    flex: 1,
    backgroundColor: colors.grayscale[600],
  },
  desktopBackdrop: {
    flex: 1,
    backgroundColor: colors.grayscale[800],
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 48,
    padding: 24,
  },
  phone: {
    width: FRAME_WIDTH,
    borderRadius: 48,
    borderWidth: 10,
    borderColor: "#1C1C1C",
    overflow: "hidden",
    backgroundColor: colors.grayscale[600],
  },
  sidePanel: {
    width: 320,
  },
});

