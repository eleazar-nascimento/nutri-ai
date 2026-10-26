import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { UtensilsCrossed } from "lucide-react-native";
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

export type DietsSubScreen =
  | "27_all_diets"
  | "28_diet_details"
  | "29_my_diets_empty"
  | "30_my_diets_list";

export interface DietPlanItem {
  id: string;
  title: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  imageUri: string;
  description: string;
  goal: string;
}

const ALL_DIET_PLANS: DietPlanItem[] = [
  {
    id: "mediterranean",
    title: "Estilo de Vida Mediterrâneo",
    calories: "2.000 kcal",
    protein: "Proteína: 120g",
    carbs: "Carbo: 200g",
    fat: "Gordura: 70g",
    imageUri:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=80",
    description:
      "Esta dieta foca em alimentos integrais, apresentando vegetais frescos, azeite de oliva de qualidade, peixes magros, castanhas nutritivas e grãos saudáveis. Oferece uma forma equilibrada e saborosa de se alimentar que apoia a sua saúde.",
    goal: "Saúde do Coração, Manutenção de Peso",
  },
  {
    id: "keto",
    title: "Partida Cetogênica (Keto)",
    calories: "1.800 kcal",
    protein: "Proteína: 70g",
    carbs: "Carbo: 30g",
    fat: "Gordura: 105g",
    imageUri:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    description:
      "Plano com baixo teor de carboidratos e rico em gorduras boas para estimular a cetose natural, promovendo saciedade prolongada e energia constante ao longo do dia.",
    goal: "Queima de Gordura, Energia Contínua",
  },
];

const MY_DIET_PLANS: DietPlanItem[] = [
  {
    id: "lowcarb",
    title: "Queima de Gordura Low-Carb",
    calories: "1.800 kcal",
    protein: "Proteína: 160g",
    carbs: "Carbo: 100g",
    fat: "Gordura: 80g",
    imageUri:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=80",
    description:
      "Estratégia reduzida em carboidratos simples e reforçada em proteínas magras para acelerar o metabolismo e preservar a massa muscular.",
    goal: "Redução de Gordura Corporal",
  },
  {
    id: "vegan",
    title: "Vitalidade Vegana",
    calories: "2.000 kcal",
    protein: "Proteína: 125g",
    carbs: "Carbo: 300g",
    fat: "Gordura: 55g",
    imageUri:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    description:
      "Cardápio 100% vegetal rico em leguminosas, grãos ancestrais, sementes e antioxidantes naturais para máxima vitalidade.",
    goal: "Bem-Estar Geral, Longevidade",
  },
  {
    id: "detox",
    title: "Plano Detox Purificante",
    calories: "1.500 kcal",
    protein: "Proteína: 95g",
    carbs: "Carbo: 180g",
    fat: "Gordura: 45g",
    imageUri:
      "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&auto=format&fit=crop&q=80",
    description:
      "Focado em alimentos leves, folhas verdes, frutas cítricas e hidratação intensiva para desinchar e renovar sua digestão.",
    goal: "Desintoxicação, Leveza Digestiva",
  },
];

const DIET_DETAIL_MACROS = [
  {
    name: "Carbos",
    current: "40%",
    max: "100%",
    progress: 0.4,
    bg: colors.accent[200], // #F5F378
  },
  {
    name: "Proteínas",
    current: "25%",
    max: "100%",
    progress: 0.25,
    bg: colors.accent[300], // #45C588
  },
  {
    name: "Calorias",
    current: "2.000 kcal",
    max: "100%",
    progress: 0.78,
    bg: colors.accent[100], // #DDC0FF
  },
  {
    name: "Gorduras",
    current: "35%",
    max: "100%",
    progress: 0.35,
    bg: colors.accent[400], // #FF6F43
  },
];

const DIET_PILLS: { key: DietsSubScreen; label: string }[] = [
  { key: "27_all_diets", label: "27. Todas as Dietas" },
  { key: "28_diet_details", label: "28. Detalhes da Dieta" },
  { key: "29_my_diets_empty", label: "29. Minhas (Vazio)" },
  { key: "30_my_diets_list", label: "30. Minhas Dietas" },
];

export interface DietsFlowScreenProps {
  onBack?: () => void;
  onNavigateTab?: (tab: BottomMenuTab) => void;
}

/**
 * Módulo 8 — 27_Diets, 28_Diet details, 29_My Diets-Empty, 30_My Diets
 * (Figma Nodes 63001:3237, 63004:2934, 63005:3126, 63005:3544)
 */
export const DietsFlowScreenView: React.FC<DietsFlowScreenProps> = ({
  onBack,
  onNavigateTab,
}) => {
  const [subScreen, setSubScreen] = useState<DietsSubScreen>("27_all_diets");
  const [selectedDiet, setSelectedDiet] = useState<DietPlanItem>(
    ALL_DIET_PLANS[0]
  );
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    mediterranean: true,
    lowcarb: true,
  });

  const toggleFav = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tabIndex = subScreen === "27_all_diets" ? 0 : 1;

  return (
    <View style={styles.screenContainer}>
      <StatusBarMock variant="white" />

      {/* Seletor rápido das 4 telas do Passo 8 */}
      <View style={styles.subNavWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subNavScroll}
        >
          {DIET_PILLS.map((p) => {
            const active = subScreen === p.key;
            return (
              <TouchableOpacity
                key={p.key}
                onPress={() => setSubScreen(p.key)}
                style={[styles.subPill, active && styles.subPillActive]}
              >
                <AppText
                  variant="footnote"
                  color={
                    active ? colors.grayscale[600] : colors.grayscale[200]
                  }
                >
                  {p.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

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
                rightAction="more"
              />
            </View>
          </View>

          <View style={styles.detailsBody}>
            {/* Grade 2x2 de Nutrientes (184x100 cada) */}
            <View style={styles.nutrientGrid}>
              {DIET_DETAIL_MACROS.map((item) => (
                <View
                  key={item.name}
                  style={[styles.nutrientCard, { backgroundColor: item.bg }]}
                >
                  <AppText variant="title3" color={colors.grayscale[600]}>
                    {item.name}
                  </AppText>

                  <View style={{ gap: 6 }}>
                    <View style={styles.nutrientBarTrack}>
                      <View
                        style={[
                          styles.nutrientBarFill,
                          { width: `${item.progress * 100}%` },
                        ]}
                      />
                    </View>
                    <View style={styles.nutrientLabelsRow}>
                      <AppText variant="footnote" color={colors.grayscale[600]}>
                        {item.current}
                      </AppText>
                      <AppText variant="footnote" color={colors.grayscale[600]}>
                        {item.max}
                      </AppText>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Título & Descrição Completa */}
            <View style={{ gap: 10 }}>
              <AppText variant="title2" color={colors.grayscale[100]}>
                {selectedDiet.title}
              </AppText>
              <AppText variant="body2" color={colors.grayscale[200]}>
                {selectedDiet.description}
              </AppText>
            </View>

            {/* Goal Container (388x107 - #232220) */}
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

            <Button
              title="Adicionar à Minha Dieta"
              variant="primary"
              size="large"
              onPress={() => setSubScreen("30_my_diets_list")}
            />
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
              onChange={(idx) =>
                setSubScreen(
                  idx === 0 ? "27_all_diets" : "30_my_diets_list"
                )
              }
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
                  Dietas
                </AppText>

                <View style={{ gap: 22 }}>
                  {ALL_DIET_PLANS.map((plan) => (
                    <DietCard
                      key={plan.id}
                      title={plan.title}
                      calories={plan.calories}
                      protein={plan.protein}
                      carbs={plan.carbs}
                      fat={plan.fat}
                      imageUri={plan.imageUri}
                      favorited={Boolean(favorites[plan.id])}
                      onFavoriteToggle={() => toggleFav(plan.id)}
                      onPress={() => {
                        setSelectedDiet(plan);
                        setSubScreen("28_diet_details");
                      }}
                    />
                  ))}
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
              </View>
            )}

            {/* TELA 30 — MINHAS DIETAS PREENCHIDA */}
            {subScreen === "30_my_diets_list" && (
              <View style={{ gap: 22 }}>
                {MY_DIET_PLANS.map((plan) => (
                  <DietCard
                    key={plan.id}
                    title={plan.title}
                    calories={plan.calories}
                    protein={plan.protein}
                    carbs={plan.carbs}
                    fat={plan.fat}
                    imageUri={plan.imageUri}
                    favorited={Boolean(favorites[plan.id])}
                    onFavoriteToggle={() => toggleFav(plan.id)}
                    onPress={() => {
                      setSelectedDiet(plan);
                      setSubScreen("28_diet_details");
                    }}
                  />
                ))}
              </View>
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
  listScroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
    gap: 18,
  },
  purpleBanner: {
    width: "100%",
    minHeight: 128,
    borderRadius: radii.xl,
    backgroundColor: colors.accent[100], // #DDC0FF
    padding: 20,
    justifyContent: "center",
    gap: 6,
  },
  emptyStateBox: {
    paddingVertical: 80,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyCircle: {
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
  floatingMenuWrapper: {
    position: "absolute",
    bottom: 14,
    left: 0,
    right: 0,
    alignItems: "center",
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
    top: 12,
    left: 20,
    right: 20,
  },
  detailsBody: {
    marginTop: -24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.grayscale[600],
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 20,
  },
  nutrientGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },
  nutrientCard: {
    width: "48%",
    height: 100,
    borderRadius: 20,
    padding: 14,
    justifyContent: "space-between",
  },
  nutrientBarTrack: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(18,18,18,0.22)",
    overflow: "hidden",
  },
  nutrientBarFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors.grayscale[600],
  },
  nutrientLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  goalCard: {
    width: "100%",
    minHeight: 107,
    borderRadius: radii.xl,
    backgroundColor: colors.grayscale[500],
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  goalIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.grayscale[400],
    alignItems: "center",
    justifyContent: "center",
  },
});
