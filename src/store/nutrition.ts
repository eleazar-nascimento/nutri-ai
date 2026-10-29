import type { MealEntry, NutritionGoals } from "./types";

export const MONTHS_PT = [
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

export const WEEKDAY_SHORT_PT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

/** AAAA-MM-DD no fuso local */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** 0 = Seg ... 6 = Dom */
export function mondayBasedWeekday(date: Date): number {
  const js = date.getDay();
  return js === 0 ? 6 : js - 1;
}

export function startOfWeek(date: Date): Date {
  return addDays(date, -mondayBasedWeekday(date));
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function formatDayMonth(key: string): string {
  const d = fromDateKey(key);
  return `${String(d.getDate()).padStart(2, "0")} de ${MONTHS_PT[d.getMonth()]}`;
}

export function formatKcal(n: number): string {
  return `${Math.round(n).toLocaleString("pt-BR")} kcal`;
}

export interface DayTotals {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  mealsCount: number;
}

export function totalsForDay(meals: MealEntry[], dateKey: string): DayTotals {
  return meals
    .filter((m) => m.dateKey === dateKey)
    .reduce<DayTotals>(
      (acc, m) => ({
        calories: acc.calories + m.calories,
        carbs: acc.carbs + m.carbs,
        protein: acc.protein + m.protein,
        fat: acc.fat + m.fat,
        mealsCount: acc.mealsCount + 1,
      }),
      { calories: 0, carbs: 0, protein: 0, fat: 0, mealsCount: 0 }
    );
}

export function ratio(value: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.max(0, Math.min(1, value / goal));
}

/** Percentual de cada macro na energia total (4/4/9 kcal por grama) */
export function macroEnergySplit(
  arg1: { carbs: number; protein: number; fat: number } | number,
  arg2?: number,
  arg3?: number
) {
  let carbs = 0;
  let protein = 0;
  let fat = 0;

  if (typeof arg1 === "object" && arg1 !== null) {
    carbs = arg1.carbs;
    protein = arg1.protein;
    fat = arg1.fat;
  } else {
    carbs = Number(arg1 || 0);
    protein = Number(arg2 || 0);
    fat = Number(arg3 || 0);
  }

  const c = carbs * 4;
  const p = protein * 4;
  const f = fat * 9;
  const total = c + p + f;

  if (total === 0) {
    return {
      carbs: 0,
      protein: 0,
      fat: 0,
      carbsPercent: 0,
      proteinPercent: 0,
      fatPercent: 0,
    };
  }

  const carbsPercent = Math.round((c / total) * 100);
  const proteinPercent = Math.round((p / total) * 100);
  const fatPercent = Math.round((f / total) * 100);

  return {
    carbs: carbsPercent,
    protein: proteinPercent,
    fat: fatPercent,
    carbsPercent,
    proteinPercent,
    fatPercent,
  };
}

/** Meta diária estimada (Mifflin-St Jeor, atividade leve 1.375, déficit leve de 10%) */
export function estimateGoals(input: {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: "Feminino" | "Masculino" | "Outro";
}): NutritionGoals {
  const base = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age;
  const bmr = input.gender === "Masculino" ? base + 5 : base - 161;
  const calories = Math.round((bmr * 1.375 * 0.9) / 10) * 10;
  const carbs = Math.round((calories * 0.45) / 4);
  const protein = Math.round((calories * 0.25) / 4);
  const fat = Math.round((calories * 0.3) / 9);

  return {
    calories,
    carbs,
    protein,
    fat,
    caloriesGoal: calories,
    carbsGrams: carbs,
    proteinGrams: protein,
    fatGrams: fat,
  };
}

export function ageFromBirthDate(birth: string): number {
  const [d, m, y] = birth.split("-").map(Number);
  if (!d || !m || !y) return 30;
  const now = new Date();
  let age = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) {
    age -= 1;
  }
  return age;
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Mínimo 8 caracteres, 1 letra maiúscula e 1 número */
export function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "A senha deve ter pelo menos 8 caracteres";
  if (!/[A-Z]/.test(pw)) return "Inclua ao menos 1 letra maiúscula";
  if (!/\d/.test(pw)) return "Inclua ao menos 1 número";
  return null;
}
