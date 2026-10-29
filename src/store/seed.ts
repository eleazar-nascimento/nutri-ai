import type {
  AccountData,
  DietPlan,
  MealEntry,
  ScannedDish,
  UserProfile,
} from "./types";
import { addDays, toDateKey, uid } from "./nutrition";

/** Credenciais do usuário de teste (exibidas na tela de login) */
export const TEST_USER = {
  name: "Mariana Costa",
  email: "teste@nutriai.com",
  password: "Nutri@123",
  /** Código OTP aceito nas verificações simuladas */
  otp: "123456",
};

export const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80";

export const DIET_CATALOG: DietPlan[] = [
  {
    id: "mediterranean",
    title: "Estilo de Vida Mediterrâneo",
    calories: 2000,
    protein: 120,
    carbs: 200,
    fat: 70,
    imageUri:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=80",
    description:
      "Foco em alimentos integrais: vegetais frescos, azeite de oliva, peixes magros, castanhas e grãos saudáveis. Uma forma equilibrada e saborosa de se alimentar.",
    goal: "Saúde do Coração, Manutenção de Peso",
    premium: false,
    dailyMeals: [
      { name: "Iogurte grego com mel e nozes", calories: 420, protein: 22, carbs: 45, fat: 16 },
      { name: "Salmão grelhado com quinoa", calories: 650, protein: 48, carbs: 55, fat: 26 },
      { name: "Homus com palitos de cenoura", calories: 280, protein: 10, carbs: 32, fat: 12 },
      { name: "Frango com legumes ao azeite", calories: 650, protein: 40, carbs: 68, fat: 16 },
    ],
  },
  {
    id: "vegan",
    title: "Vitalidade Vegana",
    calories: 2000,
    protein: 125,
    carbs: 300,
    fat: 55,
    imageUri:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    description:
      "Cardápio 100% vegetal rico em leguminosas, grãos ancestrais, sementes e antioxidantes naturais para máxima vitalidade.",
    goal: "Bem-Estar Geral, Longevidade",
    premium: false,
    dailyMeals: [
      { name: "Mingau de aveia com banana e chia", calories: 450, protein: 18, carbs: 75, fat: 8 },
      { name: "Bowl de grão-de-bico com tofu", calories: 700, protein: 45, carbs: 88, fat: 18 },
      { name: "Smoothie verde com pasta de amendoim", calories: 300, protein: 14, carbs: 38, fat: 10 },
      { name: "Curry de lentilha com legumes", calories: 550, protein: 48, carbs: 99, fat: 19 },
    ],
  },
  {
    id: "lowcarb",
    title: "Queima de Gordura Low-Carb",
    calories: 1800,
    protein: 160,
    carbs: 100,
    fat: 80,
    imageUri:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=80",
    description:
      "Reduzida em carboidratos simples e reforçada em proteínas magras para acelerar o metabolismo e preservar a massa muscular.",
    goal: "Redução de Gordura Corporal",
    premium: false,
    dailyMeals: [
      { name: "Omelete de espinafre com queijo branco", calories: 380, protein: 32, carbs: 6, fat: 26 },
      { name: "Carne magra com brócolis grelhado", calories: 620, protein: 58, carbs: 34, fat: 28 },
      { name: "Mix de castanhas e queijo", calories: 250, protein: 15, carbs: 12, fat: 16 },
      { name: "Peixe branco com salada verde", calories: 550, protein: 55, carbs: 48, fat: 10 },
    ],
  },
  {
    id: "keto",
    title: "Partida Cetogênica (Keto)",
    calories: 1800,
    protein: 70,
    carbs: 30,
    fat: 155,
    imageUri:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    description:
      "Baixo teor de carboidratos e rico em gorduras boas para estimular a cetose natural, com saciedade prolongada e energia constante.",
    goal: "Queima de Gordura, Energia Contínua",
    premium: true,
    dailyMeals: [
      { name: "Ovos mexidos com abacate e bacon", calories: 520, protein: 22, carbs: 6, fat: 46 },
      { name: "Sobrecoxa com couve-flor gratinada", calories: 650, protein: 26, carbs: 10, fat: 56 },
      { name: "Chocolate 85% e macadâmias", calories: 230, protein: 4, carbs: 6, fat: 21 },
      { name: "Salmão com manteiga de ervas e aspargos", calories: 400, protein: 18, carbs: 8, fat: 32 },
    ],
  },
  {
    id: "protein",
    title: "Hiperproteica Magra",
    calories: 2250,
    protein: 185,
    carbs: 190,
    fat: 65,
    imageUri:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    description:
      "Distribuição de proteínas ao longo do dia para ganho de massa magra e recuperação muscular após treinos.",
    goal: "Hipertrofia, Recuperação Muscular",
    premium: true,
    dailyMeals: [
      { name: "Panqueca proteica com frutas", calories: 520, protein: 42, carbs: 58, fat: 12 },
      { name: "Peito de frango com arroz e salada", calories: 780, protein: 65, carbs: 85, fat: 18 },
      { name: "Shake de whey com aveia", calories: 350, protein: 35, carbs: 32, fat: 6 },
      { name: "Patinho moído com batata-doce", calories: 600, protein: 43, carbs: 15, fat: 29 },
    ],
  },
  {
    id: "detox",
    title: "Plano Detox Purificante",
    calories: 1500,
    protein: 95,
    carbs: 180,
    fat: 45,
    imageUri:
      "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&auto=format&fit=crop&q=80",
    description:
      "Alimentos leves, folhas verdes, frutas cítricas e hidratação intensiva para desinchar e renovar a digestão.",
    goal: "Desintoxicação, Leveza Digestiva",
    premium: true,
    dailyMeals: [
      { name: "Suco verde e tapioca com cottage", calories: 330, protein: 22, carbs: 45, fat: 6 },
      { name: "Salada com grão-de-bico e frango", calories: 520, protein: 42, carbs: 58, fat: 16 },
      { name: "Frutas cítricas e água de coco", calories: 180, protein: 3, carbs: 40, fat: 1 },
      { name: "Sopa de legumes com gengibre", calories: 470, protein: 28, carbs: 37, fat: 22 },
    ],
  },
];

export const SCAN_DISHES: ScannedDish[] = [
  {
    id: "dish-1",
    name: "Frango Grelhado com Naan e Pimentões",
    calories: 620,
    carbs: 56,
    protein: 52,
    fat: 20,
    imageUri:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&auto=format&fit=crop&q=80",
    items: [
      { name: "Tiras de Frango Grelhado", calories: 280, carbs: 4, protein: 42, fat: 9 },
      { name: "Pão Naan Artesanal", calories: 210, carbs: 38, protein: 7, fat: 4 },
      { name: "Pimentões Salteados", calories: 130, carbs: 14, protein: 3, fat: 7 },
    ],
  },
  {
    id: "dish-2",
    name: "Bowl de Salmão com Arroz e Abacate",
    calories: 630,
    carbs: 55,
    protein: 38,
    fat: 28,
    imageUri:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    items: [
      { name: "Salmão Grelhado", calories: 250, carbs: 0, protein: 28, fat: 15 },
      { name: "Arroz Japonês", calories: 200, carbs: 44, protein: 4, fat: 0 },
      { name: "Abacate Fatiado", calories: 120, carbs: 6, protein: 1, fat: 11 },
      { name: "Edamame", calories: 60, carbs: 5, protein: 5, fat: 2 },
    ],
  },
  {
    id: "dish-3",
    name: "Prato Feito Brasileiro",
    calories: 610,
    carbs: 67,
    protein: 43,
    fat: 19,
    imageUri:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=800&auto=format&fit=crop&q=80",
    items: [
      { name: "Arroz Branco", calories: 180, carbs: 40, protein: 3, fat: 0 },
      { name: "Feijão Carioca", calories: 110, carbs: 19, protein: 7, fat: 1 },
      { name: "Bife Acebolado", calories: 290, carbs: 3, protein: 32, fat: 17 },
      { name: "Salada de Alface e Tomate", calories: 30, carbs: 5, protein: 1, fat: 1 },
    ],
  },
  {
    id: "dish-4",
    name: "Salada Caesar com Frango",
    calories: 460,
    carbs: 19,
    protein: 42,
    fat: 23,
    imageUri:
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&auto=format&fit=crop&q=80",
    items: [
      { name: "Alface Romana", calories: 20, carbs: 4, protein: 1, fat: 0 },
      { name: "Frango Grelhado", calories: 190, carbs: 0, protein: 35, fat: 5 },
      { name: "Croutons", calories: 90, carbs: 13, protein: 2, fat: 3 },
      { name: "Molho Caesar e Parmesão", calories: 160, carbs: 2, protein: 4, fat: 15 },
    ],
  },
];

export const QUICK_MEALS = {
  snack: { name: "Lanche Rápido", calories: 180, carbs: 22, protein: 14, fat: 5 },
  meal: { name: "Refeição Completa", calories: 380, carbs: 38, protein: 28, fat: 12 },
};

/** Histórico de exemplo dos últimos 6 dias + parte de hoje para o usuário de teste */
function buildSeedMeals(now: Date): MealEntry[] {
  const templates = [
    { name: "Café da Manhã", calories: 420, carbs: 55, protein: 18, fat: 14, h: 8 },
    { name: "Almoço", calories: 650, carbs: 70, protein: 42, fat: 20, h: 12 },
    { name: "Lanche", calories: 230, carbs: 26, protein: 12, fat: 8, h: 16 },
    { name: "Jantar", calories: 560, carbs: 48, protein: 38, fat: 22, h: 20 },
  ];
  const meals: MealEntry[] = [];
  for (let back = 6; back >= 0; back--) {
    const day = addDays(now, -back);
    const key = toDateKey(day);
    // Hoje: café da manhã registrado
    const count = back === 0 ? 1 : 4;
    const variation = 0.8 + ((back * 37) % 45) / 100;
    templates.slice(0, count).forEach((t) => {
      const created = new Date(day.getFullYear(), day.getMonth(), day.getDate(), t.h, 0);
      meals.push({
        id: uid("meal"),
        dateKey: key,
        createdAt: created.toISOString(),
        name: t.name,
        source: "quick",
        calories: Math.round(t.calories * variation),
        carbs: Math.round(t.carbs * variation),
        protein: Math.round(t.protein * variation),
        fat: Math.round(t.fat * variation),
      });
    });
  }
  return meals;
}

export function createAccount(
  profile: Omit<UserProfile, "id" | "createdAt">,
  opts: { seedHistory: boolean }
): AccountData {
  const now = new Date();
  return {
    password: profile.password,
    profile: { ...profile, id: uid("user"), createdAt: now.toISOString() },
    goals: {
      calories: 2200,
      carbs: 250,
      protein: 120,
      fat: 70,
      caloriesGoal: 2200,
      carbsGrams: 250,
      proteinGrams: 120,
      fatGrams: 70,
    },
    meals: opts.seedHistory ? buildSeedMeals(now) : [],
    favoriteDietIds: opts.seedHistory ? ["mediterranean"] : [],
    myDietIds: opts.seedHistory ? ["vegan"] : [],
    notificationPrefs: {
      mealReminders: true,
      progressSummary: true,
      goalMilestone: false,
      newPlanRecs: true,
    },
    cards: opts.seedHistory
      ? [{ id: uid("card"), brand: "visa", holder: profile.name, last4: "8910", expiry: "21-05-2028" }]
      : [],
    selectedPayment: "visa",
    subscription: {
      plan: "none",
      active: false,
      startedAt: now.toISOString(),
      renewsAt: now.toISOString(),
      price: 0,
    },
    notifications: [
      {
        id: uid("ntf"),
        message: `Bem-vinda ao NutriAI, ${profile.name.split(" ")[0]}! Registre sua primeira refeição pelo Scan IA.`,
        createdAt: now.toISOString(),
        read: false,
      },
      ...(opts.seedHistory
        ? [
            {
              id: uid("ntf"),
              message: "Hora do seu almoço – Não esqueça de registrar sua refeição.",
              createdAt: now.toISOString(),
              read: false,
            },
            {
              id: uid("ntf"),
              message: "Mantenha-se hidratada! Tente beber pelo menos 8 copos de água hoje.",
              createdAt: now.toISOString(),
              read: false,
            },
          ]
        : []),
    ],
  };
}

export function createTestAccount(): AccountData {
  return createAccount(
    {
      name: TEST_USER.name,
      email: TEST_USER.email,
      password: TEST_USER.password,
      avatarUri: DEFAULT_AVATAR,
      birthDate: "21-05-1996",
      heightCm: 165,
      weightKg: 62,
      gender: "Feminino",
    },
    { seedHistory: true }
  );
}
