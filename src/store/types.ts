export type Gender = "Feminino" | "Masculino" | "Outro";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarUri: string;
  birthDate: string; // DD-MM-AAAA
  heightCm: number;
  weightKg: number;
  gender: Gender;
  createdAt: string; // ISO
}

export interface NutritionGoals {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  caloriesGoal: number;
  carbsGrams: number;
  proteinGrams: number;
  fatGrams: number;
}

export type MealSource = "scan" | "quick" | "diet";

export interface MealEntry {
  id: string;
  dateKey: string; // AAAA-MM-DD
  createdAt: string; // ISO
  name: string;
  source: MealSource;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  imageUri?: string;
  items?: string[];
}

export interface NotificationPrefs {
  mealReminders: boolean;
  progressSummary: boolean;
  goalMilestone: boolean;
  goalMilestones?: boolean;
  newPlanRecs: boolean;
}

export type PaymentBrandKey = "googlePay" | "applePay" | "visa";

export interface PaymentCard {
  id: string;
  brand?: PaymentBrandKey;
  holder: string;
  last4: string;
  expiry: string;
}

export type PlanType = "monthly" | "annual";

export interface Subscription {
  plan: PlanType | "none";
  active?: boolean;
  paymentMethod?: PaymentBrandKey;
  startedAt: string; // ISO
  renewsAt: string; // ISO
  price: number;
}

export interface AppNotification {
  id: string;
  message: string;
  time?: string;
  createdAt: string;
  read: boolean;
}

export interface AccountData {
  password?: string;
  profile: UserProfile;
  goals: NutritionGoals;
  meals: MealEntry[];
  favoriteDietIds: string[];
  myDietIds: string[];
  notificationPrefs: NotificationPrefs;
  cards: PaymentCard[];
  selectedPayment: PaymentBrandKey;
  subscription: Subscription;
  notifications: AppNotification[];
}

export interface PersistedState {
  version: 1;
  onboardingSeen: boolean;
  demoMode: boolean;
  sessionEmail: string | null;
  accounts: Record<string, AccountData>; // chave = e-mail em minúsculas
}

export interface DietMeal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DietPlan {
  id: string;
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUri: string;
  description: string;
  goal: string;
  premium?: boolean;
  dailyMeals: DietMeal[];
}

export interface ScannedItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface ScannedDish {
  id: string;
  name: string;
  imageUri: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: ScannedItem[];
}

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };
