import React, { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import {
  BellOff,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react-native";
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
import { DemoStepPills } from "@/components/layout";
import {
  CalorieGaugeCard,
  MacroProgressCard,
} from "../components/CalorieGaugeCard";
import {
  useAppStore,
  useAccount,
  todayKey,
  totalsForDay,
  ratio,
  DIET_CATALOG,
} from "@/store";

export type HomeSubScreen =
  | "23_home"
  | "24_notification_empty"
  | "25_notification_list";

const SUB_SCREEN_PILLS: { key: HomeSubScreen; label: string }[] = [
  { key: "23_home", label: "23. Home" },
  { key: "24_notification_empty", label: "24. Notif. Vazio" },
  { key: "25_notification_list", label: "25. Notificações" },
];

const WEEKDAY_SHORT_PT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const MONTHS_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function getMondayBasedWeekday(year: number, month: number, day: number): number {
  const jsDay = new Date(year, month, day).getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export interface HomeAndNotificationsScreenProps {
  onOpenPremium?: () => void;
  onNavigateTab?: (tab: BottomMenuTab) => void;
}

/**
 * Telas 23_Home, 24_Notification-Empty e 25_Notification
 */
export const HomeAndNotificationsScreenView: React.FC<
  HomeAndNotificationsScreenProps
> = ({ onOpenPremium, onNavigateTab }) => {
  const {
    demoMode,
    addMeal,
    removeMeal,
    toggleFavoriteDiet,
    clearNotifications,
  } = useAppStore();
  const account = useAccount();

  const [subScreen, setSubScreen] = useState<HomeSubScreen>("23_home");

  // Data inicial: data de hoje (ou dia 11 de outubro no modo demo/fallback)
  const initialDate = useMemo(() => {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
    };
  }, []);

  const [currentYear, setCurrentYear] = useState(initialDate.year);
  const [currentMonth, setCurrentMonth] = useState(initialDate.month);
  const [selectedDay, setSelectedDay] = useState(initialDate.day);
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);

  const selectedDateKey = useMemo(() => {
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(selectedDay).padStart(2, "0");
    return `${currentYear}-${m}-${d}`;
  }, [currentYear, currentMonth, selectedDay]);

  const todayDateKey = todayKey();
  const isTodaySelected = selectedDateKey === todayDateKey;

  // Dias da semana contendo a data selecionada
  const weekDaysStrip = useMemo(() => {
    const weekdayIndex = getMondayBasedWeekday(
      currentYear,
      currentMonth,
      selectedDay
    );
    const mondayDate = new Date(
      currentYear,
      currentMonth,
      selectedDay - weekdayIndex
    );

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(
        mondayDate.getFullYear(),
        mondayDate.getMonth(),
        mondayDate.getDate() + i
      );
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dayStr = String(d.getDate()).padStart(2, "0");
      const key = `${d.getFullYear()}-${m}-${dayStr}`;

      return {
        label: WEEKDAY_SHORT_PT[i],
        year: d.getFullYear(),
        month: d.getMonth(),
        day: d.getDate(),
        dateStr: dayStr,
        dateKey: key,
      };
    });
  }, [currentYear, currentMonth, selectedDay]);

  // Refeições do dia selecionado
  const dayMeals = useMemo(() => {
    return account.meals.filter((m) => m.dateKey === selectedDateKey);
  }, [account.meals, selectedDateKey]);

  // Totais do dia selecionado calculados a partir da store
  const activeNutrition = useMemo(() => {
    const totals = totalsForDay(account.meals, selectedDateKey);
    const goals = account.goals;

    const caloriesLeft = Math.max(0, goals.caloriesGoal - totals.calories);
    const progressPercent = Math.min(
      100,
      Math.round(ratio(totals.calories, goals.caloriesGoal) * 100)
    );

    return {
      caloriesConsumed: totals.calories,
      caloriesGoal: goals.caloriesGoal,
      caloriesLeft,
      progressPercent,
      carbsGrams: totals.carbs,
      carbsGoal: goals.carbsGrams,
      carbsProgress: ratio(totals.carbs, goals.carbsGrams),
      proteinGrams: totals.protein,
      proteinGoal: goals.proteinGrams,
      proteinProgress: ratio(totals.protein, goals.proteinGrams),
      fatGrams: totals.fat,
      fatGoal: goals.fatGrams,
    };
  }, [account.meals, account.goals, selectedDateKey]);

  const handleSelectFullDate = (year: number, month: number, day: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
    setSelectedDay(day);
  };

  const handleShiftWeek = (direction: -1 | 1) => {
    const target = new Date(
      currentYear,
      currentMonth,
      selectedDay + direction * 7
    );
    setCurrentYear(target.getFullYear());
    setCurrentMonth(target.getMonth());
    setSelectedDay(target.getDate());
  };

  const handleShiftMonth = (direction: -1 | 1) => {
    const target = new Date(currentYear, currentMonth + direction, 1);
    const maxDays = getDaysInMonth(target.getFullYear(), target.getMonth());
    setCurrentYear(target.getFullYear());
    setCurrentMonth(target.getMonth());
    setSelectedDay(Math.min(selectedDay, maxDays));
  };

  const handleLogQuickMeal = (
    type: "snack" | "meal",
    calories: number,
    carbs: number,
    protein: number,
    fat: number
  ) => {
    addMeal({
      dateKey: selectedDateKey,
      name: type === "snack" ? "Lanche Rápido" : "Refeição Completa",
      source: "quick",
      calories,
      carbs,
      protein,
      fat,
    });
  };

  const monthCalendarGrid = useMemo(() => {
    const daysCount = getDaysInMonth(currentYear, currentMonth);
    const firstWeekday = getMondayBasedWeekday(currentYear, currentMonth, 1);
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysCount; d++) {
      cells.push(d);
    }
    return cells;
  }, [currentYear, currentMonth]);

  const formattedSelectedDate = `${String(selectedDay).padStart(
    2,
    "0"
  )} de ${MONTHS_PT[currentMonth]}`;

  // Dieta em destaque para o dia
  const featuredDiet = DIET_CATALOG[0];
  const isDietFavorited = account.favoriteDietIds.includes(featuredDiet.id);
  const isPremiumUser = account.subscription.plan !== "none";

  const handleOpenNotifications = () => {
    if (account.notifications.length === 0) {
      setSubScreen("24_notification_empty");
    } else {
      setSubScreen("25_notification_list");
    }
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBarMock variant="white" />

      {/* Pílulas de sub-telas (visíveis apenas no Modo Demo) */}
      <DemoStepPills
        steps={SUB_SCREEN_PILLS}
        active={subScreen}
        onChange={(k: HomeSubScreen) => setSubScreen(k)}
      />

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
                  source={{ uri: account.profile.avatarUri }}
                  style={styles.userAvatar}
                />
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <AppText variant="footnote" color={colors.grayscale[200]}>
                      Olá, {account.profile.name.split(" ")[0]}
                    </AppText>
                    {isPremiumUser ? (
                      <View style={styles.premiumBadge}>
                        <Sparkles size={10} color={colors.grayscale[600]} />
                        <AppText
                          variant="caption2"
                          color={colors.grayscale[600]}
                          style={{ fontSize: 10, fontWeight: "700" }}
                        >
                          PRO
                        </AppText>
                      </View>
                    ) : null}
                  </View>
                  <AppText variant="headline" color={colors.grayscale[100]}>
                    Bom Dia
                  </AppText>
                </View>
              </View>

              <View style={styles.headerActionsRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onOpenPremium}
                  style={[
                    styles.headerIconBtn,
                    isPremiumUser && {
                      borderColor: colors.accent[200],
                      backgroundColor: "rgba(245, 243, 120, 0.15)",
                    },
                  ]}
                >
                  <ActionIcon
                    name="premium"
                    size={20}
                    color={
                      isPremiumUser ? colors.accent[200] : colors.grayscale[200]
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleOpenNotifications}
                  style={styles.headerIconBtn}
                >
                  <ActionIcon
                    name="notification"
                    size={20}
                    color={
                      account.notifications.length > 0
                        ? colors.primary[100]
                        : colors.grayscale[100]
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Bloco do Calendário Funcional */}
            <View style={{ gap: 10 }}>
              <View style={styles.calendarToolbar}>
                <View style={styles.calendarNavLeft}>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => handleShiftWeek(-1)}
                    style={styles.weekArrowBtn}
                  >
                    <ChevronLeft size={18} color={colors.grayscale[100]} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowMonthCalendar((v) => !v)}
                    style={styles.monthLabelBtn}
                  >
                    <CalendarIcon size={15} color={colors.primary[100]} />
                    <AppText variant="headline" color={colors.grayscale[100]}>
                      {MONTHS_PT[currentMonth]} {currentYear}
                    </AppText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => handleShiftWeek(1)}
                    style={styles.weekArrowBtn}
                  >
                    <ChevronRight size={18} color={colors.grayscale[100]} />
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: "row", gap: 6 }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      handleSelectFullDate(
                        initialDate.year,
                        initialDate.month,
                        initialDate.day
                      )
                    }
                    style={[
                      styles.todayChip,
                      isTodaySelected && {
                        borderColor: colors.primary[100],
                        backgroundColor: "rgba(255, 111, 67, 0.15)",
                      },
                    ]}
                  >
                    <AppText
                      variant="caption2"
                      color={
                        isTodaySelected
                          ? colors.primary[100]
                          : colors.grayscale[100]
                      }
                    >
                      Hoje
                    </AppText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowMonthCalendar((v) => !v)}
                    style={[
                      styles.todayChip,
                      showMonthCalendar && {
                        backgroundColor: colors.primary[100],
                        borderColor: colors.primary[100],
                      },
                    ]}
                  >
                    <AppText variant="caption2" color={colors.grayscale[100]}>
                      {showMonthCalendar ? "Fechar" : "Mês"}
                    </AppText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Calendário Semanal Branco */}
              <View style={styles.weekCalendarCard}>
                {weekDaysStrip.map((item) => {
                  const isSelected =
                    item.year === currentYear &&
                    item.month === currentMonth &&
                    item.day === selectedDay;

                  const dayTotals = totalsForDay(account.meals, item.dateKey);
                  const hasMeals = dayTotals.calories > 0;

                  return (
                    <TouchableOpacity
                      key={`${item.year}-${item.month}-${item.day}`}
                      activeOpacity={0.8}
                      onPress={() =>
                        handleSelectFullDate(item.year, item.month, item.day)
                      }
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
                            : item.month !== currentMonth
                            ? colors.grayscale[300]
                            : colors.grayscale[600]
                        }
                      >
                        {item.label}
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
                              : item.month !== currentMonth
                              ? colors.grayscale[300]
                              : colors.grayscale[600]
                          }
                        >
                          {item.dateStr}
                        </AppText>
                      </View>

                      {/* Indicador de registro de refeição na data */}
                      <View
                        style={[
                          styles.dayDot,
                          {
                            backgroundColor: isSelected
                              ? colors.primary[100]
                              : hasMeals
                              ? colors.accent[300]
                              : colors.grayscale[300],
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Calendário Mensal Completo Expansível */}
              {showMonthCalendar && (
                <View style={styles.monthCalendarModalCard}>
                  <View style={styles.monthModalHeader}>
                    <TouchableOpacity
                      onPress={() => handleShiftMonth(-1)}
                      style={styles.weekArrowBtn}
                    >
                      <ChevronLeft size={18} color={colors.grayscale[100]} />
                    </TouchableOpacity>
                    <AppText variant="headline" color={colors.grayscale[100]}>
                      {MONTHS_PT[currentMonth]} de {currentYear}
                    </AppText>
                    <TouchableOpacity
                      onPress={() => handleShiftMonth(1)}
                      style={styles.weekArrowBtn}
                    >
                      <ChevronRight size={18} color={colors.grayscale[100]} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.monthWeekdaysHeader}>
                    {WEEKDAY_SHORT_PT.map((wd) => (
                      <View key={wd} style={styles.monthGridCell}>
                        <AppText
                          variant="caption2"
                          color={colors.grayscale[200]}
                        >
                          {wd}
                        </AppText>
                      </View>
                    ))}
                  </View>

                  <View style={styles.monthDaysGrid}>
                    {monthCalendarGrid.map((d, idx) => {
                      if (d === null) {
                        return (
                          <View key={`empty-${idx}`} style={styles.monthGridCell} />
                        );
                      }
                      const active = d === selectedDay;
                      return (
                        <TouchableOpacity
                          key={`day-${d}`}
                          activeOpacity={0.8}
                          onPress={() => {
                            setSelectedDay(d);
                            setShowMonthCalendar(false);
                          }}
                          style={[
                            styles.monthGridCell,
                            active && styles.monthGridCellActive,
                          ]}
                        >
                          <AppText
                            variant="body2"
                            color={
                              active
                                ? colors.grayscale[100]
                                : colors.grayscale[200]
                            }
                          >
                            {d}
                          </AppText>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>

            {/* Seção: Conte Suas Calorias Diárias */}
            <View style={{ gap: 14 }}>
              <View style={styles.sectionTitleRow}>
                <AppText variant="title2" color={colors.grayscale[100]}>
                  Conte Suas Calorias Diárias
                </AppText>
              </View>

              <CalorieGaugeCard
                caloriesLeft={activeNutrition.caloriesLeft}
                caloriesGoal={activeNutrition.caloriesGoal}
                progressPercent={activeNutrition.progressPercent}
                dateLabel={formattedSelectedDate}
              />

              <View style={styles.macrosRow}>
                <MacroProgressCard
                  type="carbs"
                  title="Carbos"
                  currentValue={activeNutrition.carbsGrams}
                  maxValue={activeNutrition.carbsGoal}
                  maxLabel={`${activeNutrition.carbsGoal}g`}
                  progress={activeNutrition.carbsProgress}
                  backgroundColor={colors.accent[200]}
                />
                <MacroProgressCard
                  type="protein"
                  title="Proteínas"
                  currentValue={activeNutrition.proteinGrams}
                  maxValue={activeNutrition.proteinGoal}
                  maxLabel={`${activeNutrition.proteinGoal}g`}
                  progress={activeNutrition.proteinProgress}
                  backgroundColor={colors.accent[300]}
                />
              </View>

              {/* Botões de Ação Rápida */}
              <View style={styles.quickInteractiveRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleLogQuickMeal("snack", 180, 22, 14, 4)}
                  style={styles.quickActionPill}
                >
                  <Plus size={14} color={colors.accent[200]} />
                  <AppText variant="caption2" color={colors.grayscale[100]}>
                    + Lanche (180 kcal)
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleLogQuickMeal("meal", 380, 38, 28, 10)}
                  style={styles.quickActionPill}
                >
                  <Plus size={14} color={colors.accent[300]} />
                  <AppText variant="caption2" color={colors.grayscale[100]}>
                    + Refeição (380 kcal)
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => onNavigateTab?.("scan")}
                  style={[
                    styles.quickActionPill,
                    { borderColor: colors.primary[100] },
                  ]}
                >
                  <Sparkles size={14} color={colors.primary[100]} />
                  <AppText variant="caption2" color={colors.primary[100]}>
                    Scan IA
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Seção: Refeições Registradas Hoje */}
            <View style={{ gap: 12 }}>
              <View style={styles.sectionTitleRow}>
                <AppText variant="title2" color={colors.grayscale[100]}>
                  Refeições de {formattedSelectedDate}
                </AppText>
                <AppText variant="footnote" color={colors.grayscale[200]}>
                  {dayMeals.length} registrada{dayMeals.length === 1 ? "" : "s"}
                </AppText>
              </View>

              {dayMeals.length === 0 ? (
                <View style={styles.emptyMealsCard}>
                  <AppText variant="body2" color={colors.grayscale[200]}>
                    Nenhuma refeição registrada nesta data. Use os botões acima ou
                    o Scan IA para registrar!
                  </AppText>
                </View>
              ) : (
                <View style={{ gap: 10 }}>
                  {dayMeals.map((meal) => (
                    <View key={meal.id} style={styles.mealItemCard}>
                      <View style={{ flex: 1, gap: 2 }}>
                        <AppText variant="headline" color={colors.grayscale[100]}>
                          {meal.name}
                        </AppText>
                        <AppText variant="footnote" color={colors.grayscale[200]}>
                          {meal.calories} kcal • P: {meal.protein}g • C:{" "}
                          {meal.carbs}g • G: {meal.fat}g
                        </AppText>
                      </View>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => removeMeal(meal.id)}
                        style={styles.deleteMealBtn}
                      >
                        <Trash2 size={16} color={colors.message[200]} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Seção: Plano Alimentar em Destaque */}
            <View style={{ gap: 14 }}>
              <AppText variant="title2" color={colors.grayscale[100]}>
                Plano Recomendado
              </AppText>

              <DietCard
                title={featuredDiet.title}
                calories={featuredDiet.calories}
                protein={featuredDiet.protein}
                carbs={featuredDiet.carbs}
                fat={featuredDiet.fat}
                imageUri={featuredDiet.imageUri}
                favorited={isDietFavorited}
                onFavoriteToggle={() => toggleFavoriteDiet(featuredDiet.id)}
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

      {/* TELA 24 — NOTIFICAÇÕES VAZIO */}
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
              style={{ maxWidth: 260 }}
            >
              Seus hábitos saudáveis estão em dia — continue assim!
            </AppText>
          </View>

          <HomeIndicator variant="light" />
        </View>
      )}

      {/* TELA 25 — LISTA DE NOTIFICAÇÕES */}
      {subScreen === "25_notification_list" && (
        <View style={styles.notifScreenWrapper}>
          <View style={{ paddingHorizontal: 20 }}>
            <TopBar
              title="Notificações"
              onBackPress={() => setSubScreen("23_home")}
              rightAction="close"
              onRightPress={() => setSubScreen("23_home")}
            />
          </View>

          <View style={styles.notifActionsHeader}>
            <AppText variant="footnote" color={colors.grayscale[200]}>
              {account.notifications.length} notificações
            </AppText>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                clearNotifications();
                setSubScreen("24_notification_empty");
              }}
            >
              <AppText variant="footnote" color={colors.primary[100]}>
                Limpar todas
              </AppText>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.notifListScroll}
            showsVerticalScrollIndicator={false}
          >
            {account.notifications.map((n) => (
              <NotificationCard
                key={n.id}
                message={n.message}
                time={n.time}
              />
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
    backgroundColor: colors.grayscale[600],
  },
  homeScroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
    gap: 20,
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
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colors.accent[200],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.full,
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
  calendarToolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  calendarNavLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  weekArrowBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.grayscale[500],
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    alignItems: "center",
    justifyContent: "center",
  },
  monthLabelBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  todayChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.full,
    backgroundColor: colors.grayscale[500],
    borderWidth: 1,
    borderColor: colors.grayscale[400],
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
    height: 84,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  dayColumnSelected: {
    backgroundColor: colors.accent[100],
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
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  monthCalendarModalCard: {
    backgroundColor: colors.grayscale[500],
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    gap: 12,
  },
  monthModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthWeekdaysHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  monthDaysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 6,
  },
  monthGridCell: {
    width: "14.28%",
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  monthGridCellActive: {
    backgroundColor: colors.primary[100],
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  macrosRow: {
    flexDirection: "row",
    gap: 16,
  },
  quickInteractiveRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  quickActionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.full,
    backgroundColor: colors.grayscale[500],
    borderWidth: 1,
    borderColor: colors.grayscale[400],
  },
  emptyMealsCard: {
    backgroundColor: colors.grayscale[500],
    borderRadius: radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.grayscale[400],
  },
  mealItemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.grayscale[500],
    borderRadius: radii.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.grayscale[400],
  },
  deleteMealBtn: {
    padding: 8,
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
  notifActionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
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
