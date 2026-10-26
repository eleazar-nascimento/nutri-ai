import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { BellOff, Sparkles } from "lucide-react-native";
import { colors, radii } from "@/theme";
import {
  AppText,
  StatusBarMock,
  HomeIndicator,
  TopBar,
  ActionIcon,
  DietCard,
  NotificationCard,
  BottomMenu,
  BottomMenuTab,
} from "@/components/ui";
import {
  CalorieGaugeCard,
  MacroProgressCard,
} from "../components/CalorieGaugeCard";

export type HomeSubScreen =
  | "23_home"
  | "24_notification_empty"
  | "25_notification_list";

const WEEK_DAYS = [
  { day: "Seg", date: "08" },
  { day: "Ter", date: "09" },
  { day: "Qua", date: "10" },
  { day: "Qui", date: "11" },
  { day: "Sex", date: "12" },
  { day: "Sáb", date: "13" },
  { day: "Dom", date: "14" },
];

const NOTIFICATIONS_PT = [
  "Hora do seu almoço – Não esqueça de registrar sua refeição.",
  "Você está indo muito bem! Tente adicionar alimentos ricos em fibras para bater a meta de hoje.",
  "Você atingiu 80% da sua meta diária de calorias — continue assim!",
  "Mantenha-se hidratado! Tente beber pelo menos 8 copos de água hoje.",
  "Considere um lanche leve para ajudar a manter seus níveis de energia.",
  "Revise seu progresso desta semana e comemore suas pequenas conquistas!",
  "Planeje seu jantar com antecedência — escolher opções saudáveis pode ser divertido!",
];

export interface HomeAndNotificationsScreenProps {
  onOpenPremium?: () => void;
  onNavigateTab?: (tab: BottomMenuTab) => void;
}

/**
 * Telas 23_Home, 24_Notification-Empty e 25_Notification (Figma Nodes 62993:4376, 62998:2366, 62998:2748)
 */
export const HomeAndNotificationsScreenView: React.FC<
  HomeAndNotificationsScreenProps
> = ({ onOpenPremium, onNavigateTab }) => {
  const [subScreen, setSubScreen] = useState<HomeSubScreen>("23_home");
  const [selectedDayIdx, setSelectedDayIdx] = useState(3); // Qui 11
  const [dietFav, setDietFav] = useState(false);

  return (
    <View style={styles.screenContainer}>
      <StatusBarMock variant="white" />

      {/* Seletor rápido de sub-telas do Módulo 5 (Home & Notificações + atalho Premium) */}
      <View style={styles.subNavWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subNavScroll}
        >
          {(
            [
              { key: "23_home", label: "23. Home" },
              { key: "24_notification_empty", label: "24. Notif. Vazio" },
              { key: "25_notification_list", label: "25. Notificações" },
            ] as const
          ).map((item) => {
            const active = subScreen === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => setSubScreen(item.key)}
                style={[styles.subPill, active && styles.subPillActive]}
              >
                <AppText
                  variant="footnote"
                  color={
                    active ? colors.grayscale[600] : colors.grayscale[200]
                  }
                >
                  {item.label}
                </AppText>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={onOpenPremium}
            style={[
              styles.subPill,
              {
                borderColor: colors.primary[100],
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              },
            ]}
          >
            <Sparkles size={12} color={colors.primary[100]} />
            <AppText variant="footnote" color={colors.primary[100]}>
              16-22. Fluxo Premium
            </AppText>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* TELA 23 — HOME (62993:4376) */}
      {subScreen === "23_home" && (
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.homeScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Usuário + Botões Premium e Notificação */}
            <View style={styles.homeHeaderRow}>
              <View style={styles.userGreetingRow}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
                  }}
                  style={styles.userAvatar}
                />
                <View>
                  <AppText variant="footnote" color={colors.grayscale[200]}>
                    Olá, Mariana
                  </AppText>
                  <AppText variant="headline" color={colors.grayscale[100]}>
                    Bom Dia
                  </AppText>
                </View>
              </View>

              <View style={styles.headerActionsRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onOpenPremium}
                  style={styles.headerIconBtn}
                >
                  <ActionIcon
                    name="premium"
                    size={20}
                    color={colors.accent[200]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSubScreen("25_notification_list")}
                  style={styles.headerIconBtn}
                >
                  <ActionIcon
                    name="notification"
                    size={20}
                    color={colors.grayscale[100]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Calendário Semanal Branco (388x110 - Figma Node 62993:4376) */}
            <View style={styles.weekCalendarCard}>
              {WEEK_DAYS.map((item, idx) => {
                const isSelected = idx === selectedDayIdx;
                return (
                  <TouchableOpacity
                    key={item.day}
                    activeOpacity={0.8}
                    onPress={() => setSelectedDayIdx(idx)}
                    style={[
                      styles.dayColumn,
                      isSelected && styles.dayColumnSelected,
                    ]}
                  >
                    <AppText
                      variant="body2"
                      color={
                        isSelected
                          ? colors.grayscale[600]
                          : idx > selectedDayIdx
                          ? colors.grayscale[300]
                          : colors.grayscale[600]
                      }
                    >
                      {item.day}
                    </AppText>

                    <View
                      style={[
                        styles.dateCircle,
                        isSelected && styles.dateCircleSelected,
                      ]}
                    >
                      <AppText
                        variant="caption2"
                        color={
                          isSelected
                            ? colors.grayscale[100]
                            : idx > selectedDayIdx
                            ? colors.grayscale[300]
                            : colors.grayscale[600]
                        }
                      >
                        {item.date}
                      </AppText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Seção: Conte Suas Calorias Diárias */}
            <View style={{ gap: 14 }}>
              <AppText variant="title2" color={colors.grayscale[100]}>
                Conte Suas Calorias Diárias
              </AppText>

              <CalorieGaugeCard caloriesLeft={1672} progressPercent={72} />

              <View style={styles.macrosRow}>
                <MacroProgressCard
                  type="carbs"
                  title="Carbos"
                  currentLabel="140g"
                  maxLabel="200g"
                  progress={0.7}
                  backgroundColor={colors.accent[200]} // #F5F378
                />
                <MacroProgressCard
                  type="protein"
                  title="Proteínas"
                  currentLabel="60g"
                  maxLabel="120g"
                  progress={0.5}
                  backgroundColor={colors.accent[300]} // #45C588
                />
              </View>
            </View>

            {/* Seção: Plano Alimentar */}
            <View style={{ gap: 14 }}>
              <AppText variant="title2" color={colors.grayscale[100]}>
                Plano Alimentar
              </AppText>

              <DietCard
                title="Vitalidade Vegana"
                calories="2.000 kcal"
                protein="Proteína: 125g"
                carbs="Carbo: 300g"
                fat="Gordura: 55g"
                imageUri="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80"
                favorited={dietFav}
                onFavoriteToggle={() => setDietFav((v) => !v)}
                onPress={() => onNavigateTab?.("diet")}
              />
            </View>
          </ScrollView>

          <View style={styles.floatingMenuWrapper}>
            <BottomMenu
              activeTab="home"
              onTabPress={(tab) => onNavigateTab?.(tab)}
            />
          </View>
        </View>
      )}

      {/* TELA 24 — NOTIFICAÇÕES VAZIO (62998:2366) */}
      {subScreen === "24_notification_empty" && (
        <View style={styles.notifScreenWrapper}>
          <View style={{ paddingHorizontal: 20 }}>
            <TopBar
              title="Notificações"
              onBackPress={() => setSubScreen("23_home")}
              rightAction="close"
              onRightPress={() => setSubScreen("23_home")}
            />
          </View>

          <View style={styles.emptyCenter}>
            <View style={styles.emptyIllustrationCircle}>
              <BellOff size={64} color={colors.accent[200]} />
            </View>
            <AppText
              variant="title2"
              color={colors.grayscale[100]}
              align="center"
            >
              Nenhuma notificação ainda.
            </AppText>
            <AppText
              variant="body2"
              color={colors.grayscale[200]}
              align="center"
              style={{ maxWidth: 240 }}
            >
              Seus hábitos saudáveis estão em dia — continue assim!
            </AppText>
          </View>

          <HomeIndicator variant="light" />
        </View>
      )}

      {/* TELA 25 — LISTA DE NOTIFICAÇÕES (62998:2748) */}
      {subScreen === "25_notification_list" && (
        <View style={styles.notifScreenWrapper}>
          <View style={{ paddingHorizontal: 20 }}>
            <TopBar
              title="Notificações"
              onBackPress={() => setSubScreen("23_home")}
              rightAction="close"
              onRightPress={() => setSubScreen("24_notification_empty")}
            />
          </View>

          <ScrollView
            contentContainerStyle={styles.notifListScroll}
            showsVerticalScrollIndicator={false}
          >
            {NOTIFICATIONS_PT.map((msg, i) => (
              <NotificationCard key={i} message={msg} />
            ))}
          </ScrollView>

          <HomeIndicator variant="light" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 428,
    alignSelf: "center",
    backgroundColor: colors.grayscale[600],
  },
  subNavWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  subNavScroll: {
    gap: 6,
    paddingVertical: 4,
  },
  subPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: colors.grayscale[500],
    borderWidth: 1,
    borderColor: colors.grayscale[400],
  },
  subPillActive: {
    backgroundColor: colors.accent[200],
    borderColor: colors.accent[200],
  },
  homeScroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
    gap: 22,
  },
  homeHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userGreetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  headerActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.grayscale[500],
    backgroundColor: colors.grayscale[500],
    alignItems: "center",
    justifyContent: "center",
  },
  weekCalendarCard: {
    width: "100%",
    height: 110,
    borderRadius: radii.xl,
    backgroundColor: colors.grayscale[100],
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dayColumn: {
    width: 44,
    height: 79,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  dayColumnSelected: {
    backgroundColor: colors.accent[100], // #DDC0FF
  },
  dateCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  dateCircleSelected: {
    backgroundColor: colors.grayscale[600],
  },
  macrosRow: {
    flexDirection: "row",
    gap: 16,
  },
  floatingMenuWrapper: {
    position: "absolute",
    bottom: 14,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  notifScreenWrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  emptyCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIllustrationCircle: {
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: colors.grayscale[500],
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  notifListScroll: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 32,
    gap: 12,
  },
});

