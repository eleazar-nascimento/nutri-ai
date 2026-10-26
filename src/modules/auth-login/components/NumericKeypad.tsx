import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Delete } from "lucide-react-native";
import { colors } from "@/theme";
import { AppText, HomeIndicator } from "@/components/ui";

export interface NumericKeypadProps {
  onKeyPress: (digit: string) => void;
  onBackspace: () => void;
}

const KEYS = [
  { digit: "1", letters: " " },
  { digit: "2", letters: "ABC" },
  { digit: "3", letters: "DEF" },
  { digit: "4", letters: "GHI" },
  { digit: "5", letters: "JKL" },
  { digit: "6", letters: "MNO" },
  { digit: "7", letters: "PQRS" },
  { digit: "8", letters: "TUV" },
  { digit: "9", letters: "WXYZ" },
];

/**
 * Teclado Numérico Oficial (Figma Node 62993:2475)
 * Usado nas telas 09_Verification e 15_Verification
 */
export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  onKeyPress,
  onBackspace,
}) => {
  return (
    <View style={styles.keyboardContainer}>
      <View style={styles.grid}>
        {KEYS.map((k) => (
          <TouchableOpacity
            key={k.digit}
            activeOpacity={0.75}
            onPress={() => onKeyPress(k.digit)}
            style={styles.keyButton}
          >
            <AppText
              variant="title3"
              color={colors.grayscale[100]}
              align="center"
              style={{ lineHeight: 24 }}
            >
              {k.digit}
            </AppText>
            <AppText
              variant="footnote"
              color={colors.grayscale[200]}
              align="center"
              style={{ fontSize: 10, lineHeight: 12 }}
            >
              {k.letters}
            </AppText>
          </TouchableOpacity>
        ))}

        {/* Espaço vazio à esquerda do 0 */}
        <View style={styles.emptyKey} />

        {/* Tecla 0 */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => onKeyPress("0")}
          style={styles.keyButton}
        >
          <AppText variant="title3" color={colors.grayscale[100]} align="center">
            0
          </AppText>
        </TouchableOpacity>

        {/* Tecla Apagar */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onBackspace}
          style={styles.deleteKey}
        >
          <Delete size={24} color={colors.grayscale[100]} />
        </TouchableOpacity>
      </View>

      <HomeIndicator variant="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    width: "100%",
    backgroundColor: "#171717",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.grayscale[400],
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    rowGap: 8,
    paddingBottom: 12,
  },
  keyButton: {
    width: "31.8%",
    height: 47,
    borderRadius: 6,
    backgroundColor: "#434343",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyKey: {
    width: "31.8%",
    height: 47,
  },
  deleteKey: {
    width: "31.8%",
    height: 47,
    alignItems: "center",
    justifyContent: "center",
  },
});

