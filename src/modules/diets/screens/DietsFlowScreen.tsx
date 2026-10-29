import React, { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { UtensilsCrossed, Sparkles, Check } from "lucide-react-native";
import { colors, radii } from "@/theme";
import {
  AppText,
  StatusBarMock,
  TopBar,
  SegmentedTabs,
  DietCard,
  ActionIcon,
  Button,
  BottomMenu,
  BottomMenuTab,
} from "@/components/ui";
import { DemoStepPills } from "@/components/layout";
import {
  useAppStore,
  useAccount,
  DIET_CATALOG,
  DietPlan,
  todayKey,
} from "@/store";

export type DietsSubScreen =
  | "27_all_diets"
  | "28_diet_details"
  | "29_my_diets_empty"
  | "30_my_diets_list";

const DIET_PILLS: { key: DietsSubScreen; label: string }[] = [
  { key: "27_all_diets", label: "27. Todas as Dietas" },
  { key: "28_diet_details", label: "28. Detalhes da Dieta" },
  { key: "29_my_diets_empty", label: "29. Minhas (Vazio)" },
  { key: "30_my_diets_list", label: "30. Minhas Dietas" },
];

export interface DietsFlowScreenProps {
  onBack?: () => void;
  onNavigateTab?: (tab: BottomMenuTab) => void;
  onOpenPremium?: () => void;
}

/**
 * Módulo 8 — 27_Diets, 28_Diet details, 29_My Diets-Empty, 30_My Diets
 */
export const DietsFlowScreenView: React.FC<DietsFlowScreenProps> = ({
  onBack,
  onNavigateTab,
  onOpenPremium,
}) => {
  const { demoMode, toggleFavoriteDiet, toggleMyDiet, addMeal } = useAppStore();
  const account = useAccount();

  const [subScreen, setSubScreen] = useState<DietsSubScreen>("27_all_diets");
  const [selectedDiet, setSelectedDiet] = useState<DietPlan>(DIET_CATALOG[0]);
  const [justLoggedMeal, setJustLoggedMeal] = useState(false);

  const isPremium = account.subscription.plan !== "none";

  const myDiets = useMemo(() => {
    return DIET_CATALOG.filter((d) => account.myDietIds.includes(d.id));
  }, [account.myDietIds]);

  const isSelectedDietInMyDiets = account.myDietIds.includes(selectedDiet.id);
  const isSelectedDietFavorited = account.favoriteDietIds.includes(selectedDiet.id);

  const tabIndex =
    subScreen === "27_all_diets" || subScreen === "28_diet_details" ? 0 : 1;

  const handleSelectTab = (idx: number) => {
    if (idx === 0) {
      setSubScreen("27_all_diets");
    } else {
      setSubScreen(myDiets.length === 0 ? "29_my_diets_empty" : "30_my_diets_list");
    }
  };

  const handleToggleMyDietAction = (diet: DietPlan) => {
    if (diet.premium && !isPremium && !isSelectedDietInMyDiets) {
      onOpenPremium?.();
      return;
    }
    toggleMyDiet(diet.id);
  };

  const handleLogDietSampleMeal = () => {
    const meal = selectedDiet.dailyMeals[0] || {
      name: `Refeição: ${selectedDiet.title}`,
      calories: 450,
      carbs: 35,
      protein: 30,
      fat: 12,
    };
    addMeal({
      dateKey: todayKey(),
      name: meal.name,
      source: "diet",
      calories: meal.calories,
      carbs: meal.carbs,
      protein: meal.protein,
      fat: meal.fat,
      imageUri: selectedDiet.imageUri,
    });
    setJustLoggedMeal(true);
    setTimeout(() => setJustLoggedMeal(false), 2400);
  };

  const dietDetailMacros = [
    {
      name: "Carbos",
      current: selectedDiet.carbs,
      bg: colors.accent[200],
    },
    {
      name: "Proteínas",
      current: selectedDiet.protein,
      bg: colors.accent[300],
    },
    {
      name: "Calorias",
      current: selectedDiet.calories,
      bg: colors.accent[100],
    },
    {
      name: "Gorduras",
      current: selectedDiet.fat,
      bg: colors.accent[400],
    },
  ];

  return (
    <View style={styles.screenContainer}>
      <StatusBarMock variant="white" />

      {/* Pílulas de etapas (visíveis apenas no Modo Demo) */}
      <DemoStepPills
        steps={DIET_PILLS}
        active={subScreen}
        onChange={(k: DietsSubScreen) => setSubScreen(k)}
      />

      {/* TELA 28 — DIET DETAILS (63004:2934) */}
      {subScreen === "28_diet_details" ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.detailsHeroBox}>
            <Image
              source={{ uri: selectedDiet.imageUri }}
              style={styles.detailsHeroImage}
              resizeMode="cover"
            />
            <View style={styles.detailsTopBarOverlay}>
              <TopBar
                title="Dieta"
                onBackPress={() => setSubScreen("27_all_diets")}
                rightAction="favorite"
                favorited={isSelectedDietFavorited}
                onRightPress={() => toggleFavoriteDiet(selectedDiet.id)}
              />
            </View>
          </View>

          <View style={styles.detailsBody}>
            {/* Grade 2x2 de Nutrientes */}
            <View style={styles.nutrientGrid}>
              {dietDetailMacros.map((item) => (
                <View
                  key={item.name}
                  style={[styles.nutrientCard, { backgroundColor: item.bg }]}
                >
                  <AppText variant="title3" color={colors.grayscale[600]}>
                    {item.name}
                  </AppText>
                  <AppText variant="largeTitle" color={colors.grayscale[600]}>
                    {item.current}
                  </AppText>
                </View>
              ))}
            </View>

            {/* Título & Descrição Completa */}
            <View style={{ gap: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <AppText variant="title2" color={colors.grayscale[100]}>
                  {selectedDiet.title}
                </AppText>
                {selectedDiet.premium ? (
                  <View style={styles.premiumTag}>
                    <Sparkles size={11} color={colors.grayscale[600]} />
                    <AppText
                      variant="caption2"
                      color={colors.grayscale[600]}
                      style={{ fontWeight: "700" }}
                    >
                      PREMIUM
                    </AppText>
                  </View>
                ) : null}
              </View>
              <AppText variant="body2" color={colors.grayscale[200]}>
                {selectedDiet.description}
              </AppText>
            </View>

            {/* Goal Container */}
            <View style={styles.goalCard}>
              <View style={styles.goalIconCircle}>
                <ActionIcon
                  name="goal"
                  size={24}
                  color={colors.grayscale[100]}
                />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <AppText variant="title3" color={colors.grayscale[100]}>
                  Objetivo
                </AppText>
                <AppText variant="body2" color={colors.grayscale[100]}>
                  {selectedDiet.goal}
                </AppText>
              </View>
            </View>

            {/* Ações da Dieta */}
            <View style={{ gap: 12 }}>
              <Button
                title={
                  selectedDiet.premium && !isPremium && !isSelectedDietInMyDiets
                    ? "Desbloquear com Premium"
                    : isSelectedDietInMyDiets
                    ? "Remover de Minhas Dietas"
                    : "Adicionar à Minha Dieta"
                }
                variant={isSelectedDietInMyDiets ? "outline" : "primary"}
                size="large"
                onPress={() => handleToggleMyDietAction(selectedDiet)}
              />

              <Button
                title={
                  justLoggedMeal
                    ? "✓ Refeição Registrada no Diário!"
                    : "+ Registrar Refeição Deste Plano Hoje"
                }
                variant="secondary"
                size="large"
                onPress={handleLogDietSampleMeal}
              />
            </View>
          </View>
        </ScrollView>
      ) : (
        /* TELAS 27, 29 e 30 — LISTAGEM E ABAS DE DIETAS */
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.listScroll}
            showsVerticalScrollIndicator={false}
          >
            <TopBar
              title="Dietas"
              onBackPress={onBack}
              rightAction="close"
              onRightPress={onBack}
            />

            <SegmentedTabs
              tabs={["Todas as Dietas", "Minhas Dietas"]}
              activeIndex={tabIndex}
              onChange={handleSelectTab}
            />

            {/* TELA 27 — TODAS AS DIETAS */}
            {subScreen === "27_all_diets" && (
              <>
                <View style={styles.purpleBanner}>
                  <AppText variant="title3" color={colors.grayscale[600]}>
                    Explore Planos de Dieta
                  </AppText>
                  <AppText variant="body2" color={colors.grayscale[600]}>
                    Planos personalizados para combinar com suas metas e estilo
                    de vida.
                  </AppText>
                </View>

                <AppText variant="title2" color={colors.grayscale[100]}>
                  Dietas ({DIET_CATALOG.length})
                </AppText>

                <View style={{ gap: 20 }}>
                  {DIET_CATALOG.map((plan) => {
                    const isFav = account.favoriteDietIds.includes(plan.id);
                    const isInMy = account.myDietIds.includes(plan.id);
                    return (
                      <View key={plan.id} style={{ position: "relative" }}>
                        <DietCard
                          title={plan.title}
                          calories={plan.calories}
                          protein={plan.protein}
                          carbs={plan.carbs}
                          fat={plan.fat}
                          imageUri={plan.imageUri}
                          favorited={isFav}
                          onFavoriteToggle={() => toggleFavoriteDiet(plan.id)}
                          onPress={() => {
                            setSelectedDiet(plan);
                            setSubScreen("28_diet_details");
                          }}
                        />
                        {isInMy ? (
                          <View style={styles.enrolledBadge}>
                            <Check size={12} color={colors.grayscale[600]} />
                            <AppText
                              variant="caption2"
                              color={colors.grayscale[600]}
                              style={{ fontWeight: "700" }}
                            >
                              Adicionada
                            </AppText>
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              </>
            )}

            {/* TELA 29 — MINHAS DIETAS VAZIO */}
            {subScreen === "29_my_diets_empty" && (
              <View style={styles.emptyStateBox}>
                <View style={styles.emptyCircle}>
                  <UtensilsCrossed size={60} color={colors.accent[100]} />
                </View>
                <AppText
                  variant="title2"
                  color={colors.grayscale[100]}
                  align="center"
                >
                  Nenhum Plano de Dieta Ainda.
                </AppText>
                <AppText
                  variant="body2"
                  color={colors.grayscale[200]}
                  align="center"
                  style={{ maxWidth: 260 }}
                >
                  Comece uma dieta personalizada para tornar seu acompanhamento
                  ainda mais fácil.
                </AppText>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSubScreen("27_all_diets")}
                  style={styles.exploreBtn}
                >
                  <AppText variant="headline" color={colors.grayscale[600]}>
                    Explorar Dietas
                  </AppText>
                </TouchableOpacity>
              </View>
            )}

            {/* TELA 30 — MINHAS DIETAS PREENCHIDA */}
            {subScreen === "30_my_diets_list" && (
              <>
                <View style={styles.purpleBanner}>
                  <AppText variant="title3" color={colors.grayscale[600]}>
                    Seus Planos em Andamento
                  </AppText>
                  <AppText variant="body2" color={colors.grayscale[600]}>
                    Acompanhe os planos alimentares que você escolheu seguir.
                  </AppText>
                </View>

                {myDiets.length === 0 ? (
                  <View style={styles.emptyStateBox}>
                    <UtensilsCrossed size={48} color={colors.accent[100]} />
                    <AppText
                      variant="body"
                      color={colors.grayscale[200]}
                      align="center"
                    >
                      Você ainda não adicionou nenhuma dieta a esta lista.
                    </AppText>
                    <TouchableOpacity
                      onPress={() => setSubScreen("27_all_diets")}
                      style={styles.exploreBtn}
                    >
                      <AppText variant="headline" color={colors.grayscale[600]}>
                        Ver Todas as Dietas
                      </AppText>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ gap: 20 }}>
                    {myDiets.map((plan) => {
                      const isFav = account.favoriteDietIds.includes(plan.id);
                      return (
                        <DietCard
                          key={plan.id}
                          title={plan.title}
                          calories={plan.calories}
                          protein={plan.protein}
                          carbs={plan.carbs}
                          fat={plan.fat}
                          imageUri={plan.imageUri}
                          favorited={isFav}
                          onFavoriteToggle={() => toggleFavoriteDiet(plan.id)}
                          onPress={() => {
                            setSelectedDiet(plan);
                            setSubScreen("28_diet_details");
                          }}
                        />
                      );
                    })}
                  </View>
                )}
              </>
            )}
          </ScrollView>

          <View style={styles.floatingMenuWrapper}>
            <BottomMenu
              activeTab="diet"
              onTabPress={(tab) => onNavigateTab?.(tab)}
            />
          </View>
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
  listScroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
    gap: 20,
  },
  purpleBanner: {
    width: "100%",
    backgroundColor: colors.accent[100],
    borderRadius: radii.xl,
    padding: 20,
    gap: 6,
  },
  detailsHeroBox: {
    width: "100%",
    height: 320,
    position: "relative",
  },
  detailsHeroImage: {
    width: "100%",
    height: "100%",
  },
  detailsTopBarOverlay: {
    position: "absolute",
    top: 10,
    left: 20,
    right: 20,
  },
  detailsBody: {
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 20,
  },
  nutrientGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  nutrientCard: {
    width: "48%",
    height: 90,
    borderRadius: radii.xl,
    padding: 14,
    justifyContent: "space-between",
  },
  premiumTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.accent[200],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  enrolledBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.accent[300],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  goalCard: {
    width: "100%",
    backgroundColor: colors.grayscale[500],
    borderRadius: radii.xl,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: colors.grayscale[400],
  },
  goalIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.grayscale[400],
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateBox: {
    width: "100%",
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  emptyCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.grayscale[500],
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  exploreBtn: {
    marginTop: 8,
    backgroundColor: colors.accent[200],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radii.full,
  },
  floatingMenuWrapper: {
    position: "absolute",
    bottom: 14,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
