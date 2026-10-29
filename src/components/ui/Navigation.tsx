import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Wifi, BatteryFull, Signal } from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText } from "./Typography";
import { CircleIconButton } from "./Button";
import { BottomMenuIcon, BottomMenuTab } from "./Icons";
import { useDeviceChrome } from "./DeviceChrome";

/**
 * Status Bar do Style Guide (Figma Node 885:5068)
 * Variantes: white (texto branco para fundo dark) e black (texto preto para fundo claro)
 * Mobile-first: só é exibida dentro da moldura de celular na Web (em aparelhos
 * reais o sistema operacional já desenha a barra de status). Use `force` no Style Guide.
 */
export const StatusBarMock: React.FC<{
  variant?: "white" | "black";
  time?: string;
  force?: boolean;
}> = ({ variant = "white", time, force = false }) => {
  const framed = useDeviceChrome();
  if (!framed && !force) return null;

  const now = new Date();
  const displayTime =
    time ?? `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
  const iconColor =
    variant === "white" ? colors.grayscale[100] : colors.grayscale[800];

  return (
    <View
      style={{
        height: 47,
        width: "100%",
        paddingHorizontal: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <AppText variant="callout" color={iconColor}>
        {displayTime}
      </AppText>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Signal size={15} color={iconColor} />
        <Wifi size={15} color={iconColor} />
        <BatteryFull size={18} color={iconColor} />
      </View>
    </View>
  );
};

/**
 * Home Indicator iOS (Figma Node 885:5091)
 * Exibido apenas na moldura de celular da Web (ou com `force`).
 */
export const HomeIndicator: React.FC<{
  variant?: "light" | "dark";
  force?: boolean;
}> = ({ variant = "light", force = false }) => {
  const framed = useDeviceChrome();
  if (!framed && !force) return null;

  return (
    <View
      style={{
        height: 34,
        width: "100%",
        backgroundColor:
          variant === "light" ? colors.grayscale[600] : colors.grayscale[100],
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 8,
      }}
    >
      <View
        style={{
          width: 134,
          height: 5,
          borderRadius: radii.full,
          backgroundColor:
            variant === "light" ? colors.grayscale[100] : colors.grayscale[800],
        }}
      />
    </View>
  );
};

/**
 * Top Bar Oficial (Figma Node 62998:2670)
 * Possui Botão Voltar (40x40 #232220), Título (Title 2) e botão opcional à direita (Fechar / Mais / Notificação)
 */
export const TopBar: React.FC<{
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: "close" | "more" | "favorite" | "none";
  favorited?: boolean;
  onRightPress?: () => void;
  includeStatusBar?: boolean;
}> = ({
  title,
  showBack = true,
  onBackPress,
  rightAction = "close",
  favorited = false,
  onRightPress,
  includeStatusBar = false,
}) => {
  return (
    <View style={{ width: "100%", gap: 12 }}>
      {includeStatusBar && <StatusBarMock variant="white" />}
      <View
        style={{
          width: "100%",
          height: 44,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          {showBack && <CircleIconButton type="back" onPress={onBackPress} />}
          <AppText variant="title2" color={colors.grayscale[100]}>
            {title}
          </AppText>
        </View>

        {rightAction !== "none" ? (
          <CircleIconButton
            type={rightAction}
            favorited={favorited}
            onPress={onRightPress}
          />
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>
    </View>
  );
};

/**
 * Master Tab — Abas Segmentadas em Pílula (Figma Nodes 62999:3406 Tab/3 e 63001:3538 Tab/2)
 * - Fundo branco (#FFFFFF), altura 49px, radius 30px
 * - Aba selecionada: fundo #FF5A16, texto #FFFFFF
 * - Aba inativa: fundo transparente, texto #121212
 */
export const SegmentedTabs: React.FC<{
  tabs: string[];
  activeIndex: number;
  onChange: (index: number) => void;
}> = ({ tabs, activeIndex, onChange }) => {
  return (
    <View
      style={{
        height: 49,
        width: "100%",
        borderRadius: radii.pill,
        backgroundColor: colors.grayscale[100],
        padding: 6,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {tabs.map((tab, index) => {
        const isActive = index === activeIndex;
        return (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.85}
            onPress={() => onChange(index)}
            style={{
              flex: 1,
              height: 37,
              borderRadius: radii.pill,
              backgroundColor: isActive ? colors.primary[100] : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppText
              variant="subheadline"
              color={isActive ? colors.grayscale[100] : colors.grayscale[600]}
              align="center"
            >
              {tab}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

/**
 * Master Bottom Menu — Menu Inferior Flutuante (Figma Node 62998:2315)
 * - Pílula 314x66px, fundo #2F2F2F, radius 100px
 * - 5 botões circulares de 54x54px:
 *   Ativo: #FF5A16 com ícone preenchido
 *   Inativo: #474747 com ícone outline/twotone
 * - Abas: Início (home), Análise (analysis), Scan IA (scan), Dietas (diet), Ajustes (settings)
 */
export const BottomMenu: React.FC<{
  activeTab: BottomMenuTab;
  onTabPress: (tab: BottomMenuTab) => void;
}> = ({ activeTab, onTabPress }) => {
  const items: { key: BottomMenuTab; labelPt: string }[] = [
    { key: "home", labelPt: "Início" },
    { key: "analysis", labelPt: "Análise" },
    { key: "scan", labelPt: "Scan IA" },
    { key: "diet", labelPt: "Dietas" },
    { key: "settings", labelPt: "Ajustes" },
  ];

  return (
    <View
      style={{
        width: 314,
        height: 66,
        borderRadius: radii.full,
        backgroundColor: colors.grayscale[400],
        paddingHorizontal: 6,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        alignSelf: "center",
      }}
    >
      {items.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            activeOpacity={0.85}
            accessibilityLabel={item.labelPt}
            onPress={() => onTabPress(item.key)}
            style={{
              width: 54,
              height: 54,
              borderRadius: 27,
              backgroundColor: isActive
                ? colors.primary[100]
                : colors.grayscale[300],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BottomMenuIcon
              tab={item.key}
              filled={isActive}
              size={24}
              color={colors.grayscale[100]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

