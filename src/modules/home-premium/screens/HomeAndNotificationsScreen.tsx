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
import {
  CalorieGaugeCard,
  MacroProgressCard,
} from "../components/CalorieGaugeCard";

export type HomeSubScreen =
  | "23_home"
  | "24_notification_empty"
  | "25_notification_list";

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

interface DailyNutritionEntry {
  caloriesGoal: number;
  caloriesConsumed: number;
  carbsGrams: number;
  carbsGoal: number;
  proteinGrams: number;
  proteinGoal: number;
  planTitle: string;
  planCalories: string;
  planProtein: string;
  planCarbs: string;
  planFat: string;
  planImage: string;
}

const DAILY_PLANS = [
  {
    planTitle: "Vitalidade Vegana",
    planCalories: "2.000 kcal",
    planProtein: "Proteína: 125g",
    planCarbs: "Carbo: 300g",
    planFat: "Gordura: 55g",
    planImage:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
  },
  {
    planTitle: "Partida Cetogênica (Keto)",
    planCalories: "1.850 kcal",
    planProtein: "Proteína: 140g",
    planCarbs: "Carbo: 45g",
    planFat: "Gordura: 115g",
    planImage:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
  },
  {
    planTitle: "Estilo Mediterrâneo",
    planCalories: "2.100 kcal",
    planProtein: "Proteína: 130g",
    planCarbs: "Carbo: 210g",
    planFat: "Gordura: 70g",
    planImage:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
  },
  {
    planTitle: "Hiperproteica Magra",
    planCalories: "2.250 kcal",
    planProtein: "Proteína: 185g",
    planCarbs: "Carbo: 190g",
    planFat: "Gordura: 65g",
    planImage:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
  },
];

/**
 * Gera dados nutricionais determinísticos e variados para qualquer data do calendário.
 * O dia 11 de Outubro mantém exatamente os números originais do Figma (1672 restantes, 72%, 140g Carbos, 60g Proteínas).
 */
function getBaseNutritionForDate(
  year: number,
  month: number,
  day: number
): DailyNutritionEntry {
  if (month === 9 && day === 11) {
    return {
      caloriesGoal: 2200,
      caloriesConsumed: 528, // 2200 - 528 = 1672 restantes
      carbsGrams: 140,
      carbsGoal: 200,
      proteinGrams: 60,
      proteinGoal: 120,
      ...DAILY_PLANS[0],
    };
  }

  const seed = year * 372 + month * 31 + day;
  const caloriesGoal = 2200;
  // Varia entre 350 e 1920 kcal consumidas
  const caloriesConsumed = 350 + ((seed * 173) % 1570);
  const carbsGoal = 200;
  const carbsGrams = 55 + ((seed * 47) % 140);
  const proteinGoal = 120;
  const proteinGrams = 38 + ((seed * 29) % 80);
  const plan = DAILY_PLANS[seed % DAILY_PLANS.length];

  return {
    caloriesGoal,
    caloriesConsumed,
    carbsGrams,
    carbsGoal,
    proteinGrams,
    proteinGoal,
    ...plan,
  };
}

/**
 * Retorna o índice do dia da semana (0 = Seg ... 6 = Dom)
 */
function getMondayBasedWeekday(year: number, month: number, day: number): number {
  const jsDay = new Date(year, month, day).getDay(); // 0 = Dom .. 6 = Sáb
  return jsDay === 0 ? 6 : jsDay - 1;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

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

  // Estado do calendário funcional (Padrão: 11 de Outubro de 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 9 = Outubro (0-indexed)
  const [selectedDay, setSelectedDay] = useState(11);
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);

  // Ajustes extras adicionados pelo usuário por data (ex.: "+ Refeição")
  const [customDeltas, setCustomDeltas] = useState<
    Record<string, { calories: number; carbs: number; protein: number }>
  >({});

  const [dietFav, setDietFav] = useState(false);

  const dateKey = `${currentYear}-${currentMonth}-${selectedDay}`;

  // Calcula os 7 dias da semana contendo o `selectedDay`
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
      return {
        label: WEEKDAY_SHORT_PT[i],
        year: d.getFullYear(),
        month: d.getMonth(),
        day: d.getDate(),
        dateStr: String(d.getDate()).padStart(2, "0"),
      };
    });
  }, [currentYear, currentMonth, selectedDay]);

  // Dados nutricionais calculados para a data selecionada + incrementos interativos
  const activeNutrition = useMemo(() => {
    const base = getBaseNutritionForDate(
      currentYear,
      currentMonth,
      selectedDay
    );
    const delta = customDeltas[dateKey] ?? {
      calories: 0,
      carbs: 0,
      protein: 0,
    };

    const totalConsumed = Math.min(
      base.caloriesGoal,
      Math.max(0, base.caloriesConsumed + delta.calories)
    );
    const caloriesLeft = Math.max(0, base.caloriesGoal - totalConsumed);

    // No dia 11 de Outubro sem delta, mantém 72% fiel ao Figma
    const progressPercent =
      currentMonth === 9 && selectedDay === 11 && delta.calories === 0
        ? 72
        : Math.min(100, Math.round((totalConsumed / base.caloriesGoal) * 100));

    const carbsGrams = Math.min(
      base.carbsGoal,
      Math.max(0, base.carbsGrams + delta.carbs)
    );
    const proteinGrams = Math.min(
      base.proteinGoal,
      Math.max(0, base.proteinGrams + delta.protein)
    );

    return {
      ...base,
      caloriesLeft,
      progressPercent,
      carbsGrams,
      carbsProgress: carbsGrams / base.carbsGoal,
      proteinGrams,
      proteinProgress: proteinGrams / base.proteinGoal,
    };
  }, [currentYear, currentMonth, selectedDay, customDeltas, dateKey]);

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
    calories: number,
    carbs: number,
    protein: number
  ) => {
    setCustomDeltas((prev) => {
      const curr = prev[dateKey] ?? { calories: 0, carbs: 0, protein: 0 };
      return {
        ...prev,
        [dateKey]: {
          calories: curr.calories + calories,
          carbs: curr.carbs + carbs,
          protein: curr.protein + protein,
        },
      };
    });
  };

  const handleResetDay = () => {
    setCustomDeltas((prev) => {
      const next = { ...prev };
      delete next[dateKey];
      return next;
    });
  };

  // Matriz do calendário mensal expandido
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

            {/* Bloco do Calendário Funcional (Barra de controle + Strip Semanal + Mês Expansível) */}
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
                    onPress={() => handleSelectFullDate(2026, 9, 11)}
                    style={styles.todayChip}
                  >
                    <AppText variant="caption2" color={colors.grayscale[100]}>
                      Hoje (11/10)
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
                      {showMonthCalendar ? "Fechar Mês" : "Mês"}
                    </AppText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Calendário Semanal Branco (388x110 - Figma Node 62993:4376) */}
              <View style={styles.weekCalendarCard}>
                {weekDaysStrip.map((item) => {
                  const isSelected =
                    item.year === currentYear &&
                    item.month === currentMonth &&
                    item.day === selectedDay;

                  const dayMetrics = getBaseNutritionForDate(
                    item.year,
                    item.month,
                    item.day
                  );
                  const hasHighProgress =
                    dayMetrics.caloriesConsumed / dayMetrics.caloriesGoal > 0.55;

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

                      {/* Indicador de atividade nutricional na data */}
                      <View
                        style={[
                          styles.dayDot,
                          {
                            backgroundColor: isSelected
                              ? colors.primary[100]
                              : hasHighProgress
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
                  backgroundColor={colors.accent[200]} // #F5F378
                />
                <MacroProgressCard
                  type="protein"
                  title="Proteínas"
                  currentValue={activeNutrition.proteinGrams}
                  maxValue={activeNutrition.proteinGoal}
                  maxLabel={`${activeNutrition.proteinGoal}g`}
                  progress={activeNutrition.proteinProgress}
                  backgroundColor={colors.accent[300]} // #45C588
                />
              </View>

              {/* Ações rápidas interativas para testar os contadores animados no dia selecionado */}
              <View style={styles.quickInteractiveRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleLogQuickMeal(180, 22, 14)}
                  style={styles.quickActionPill}
                >
                  <Plus size={14} color={colors.accent[200]} />
                  <AppText variant="caption2" color={colors.grayscale[100]}>
                    Lanche (+180 kcal)
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleLogQuickMeal(380, 38, 28)}
                  style={styles.quickActionPill}
                >
                  <Plus size={14} color={colors.accent[300]} />
                  <AppText variant="caption2" color={colors.grayscale[100]}>
                    Refeição (+380 kcal)
                  </AppText>
                </TouchableOpacity>

                {customDeltas[dateKey] ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleResetDay}
                    style={styles.quickResetPill}
                  >
                    <RotateCcw size={13} color={colors.primary[100]} />
                    <AppText variant="caption2" color={colors.primary[100]}>
                      Resetar
                    </AppText>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            {/* Seção: Plano Alimentar do Dia */}
            <View style={{ gap: 14 }}>
              <AppText variant="title2" color={colors.grayscale[100]}>
                Plano Alimentar ({formattedSelectedDate})
              </AppText>

              <DietCard
                title={activeNutrition.planTitle}
                calories={activeNutrition.planCalories}
                protein={activeNutrition.planProtein}
                carbs={activeNutrition.planCarbs}
                fat={activeNutrition.planFat}
                imageUri={activeNutrition.planImage}
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
  quickResetPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radii.full,
    backgroundColor: colors.grayscale[500],
    borderWidth: 1,
    borderColor: colors.primary[100],
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
