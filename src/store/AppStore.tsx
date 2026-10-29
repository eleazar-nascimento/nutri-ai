import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  AccountData,
  ActionResult,
  MealEntry,
  NotificationPrefs,
  NutritionGoals,
  PaymentBrandKey,
  PersistedState,
  PlanType,
  UserProfile,
} from "./types";
import { DEFAULT_AVATAR, TEST_USER, createAccount, createTestAccount } from "./seed";
import {
  EMAIL_REGEX,
  estimateGoals,
  todayKey,
  uid,
  validatePassword,
} from "./nutrition";

const STORAGE_KEY = "@nutriai/state/v1";

export const PLAN_PRICES: Record<PlanType, number> = {
  monthly: 24.9,
  annual: 149.9,
};

/** Limite diário de escaneamentos no plano gratuito */
export const FREE_SCANS_PER_DAY = 3;

function initialState(): PersistedState {
  return {
    version: 1,
    onboardingSeen: false,
    demoMode: false,
    sessionEmail: null,
    accounts: { [TEST_USER.email]: createTestAccount() },
  };
}

const norm = (email: string) => email.trim().toLowerCase();

interface AppStoreValue {
  hydrated: boolean;
  onboardingSeen: boolean;
  demoMode: boolean;
  isAuthenticated: boolean;
  account: AccountData;
  accounts: Record<string, AccountData>;
  isPremium: boolean;
  scansToday: number;

  // App
  setOnboardingSeen: () => void;
  markOnboardingSeen: () => void;
  setDemoMode: (on: boolean) => void;

  // Autenticação
  login: (email: string, password: string) => ActionResult;
  loginAsTestUser: () => void;
  signUp: (name: string, email: string, password: string) => ActionResult;
  emailExists: (email: string) => boolean;
  resetPassword: (email: string, newPassword: string) => ActionResult;
  logout: () => void;
  deleteAccount: () => void;

  // Perfil & Configurações
  updateProfile: (
    patch: Partial<Omit<UserProfile, "id" | "password" | "createdAt">>
  ) => ActionResult;
  changePassword: (
    oldOrNewPassword: string,
    newPasswordOptional?: string
  ) => ActionResult;
  updateGoals: (goals: NutritionGoals) => void;
  setNotificationPref: (
    key: keyof NotificationPrefs | "goalMilestones",
    value: boolean
  ) => void;

  // Refeições
  addMeal: (meal: Omit<MealEntry, "id" | "createdAt">) => void;
  removeMeal: (id: string) => void;

  // Dietas
  toggleFavoriteDiet: (dietId: string) => void;
  toggleMyDiet: (dietId: string) => void;

  // Pagamentos & Premium
  addCard: (card: {
    brand?: PaymentBrandKey;
    holder?: string;
    holderName?: string;
    number?: string;
    last4?: string;
    expiry: string;
  }) => ActionResult;
  setSelectedPayment: (brand: PaymentBrandKey) => void;
  subscribe: (plan: PlanType) => void;
  cancelSubscription: () => void;

  // Notificações
  markNotificationsRead: () => void;
  clearNotifications: () => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export const AppStoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<PersistedState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Hidratação a partir do armazenamento local
  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!alive || !raw) return;
        const parsed = JSON.parse(raw) as PersistedState;
        if (parsed?.version === 1 && parsed.accounts) {
          if (!parsed.accounts[TEST_USER.email]) {
            parsed.accounts[TEST_USER.email] = createTestAccount();
          }
          setState(parsed);
        }
      })
      .catch(() => {})
      .finally(() => alive && setHydrated(true));
    return () => {
      alive = false;
    };
  }, []);

  // Persistência com debounce
  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state, hydrated]);

  const activeAccount = useMemo(() => {
    if (state.sessionEmail && state.accounts[state.sessionEmail]) {
      return state.accounts[state.sessionEmail];
    }
    return state.accounts[TEST_USER.email] || createTestAccount();
  }, [state.sessionEmail, state.accounts]);

  const updateAccount = useCallback((fn: (acc: AccountData) => AccountData) => {
    setState((prev) => {
      const emailKey = prev.sessionEmail || TEST_USER.email;
      const acc = prev.accounts[emailKey] || createTestAccount();
      return {
        ...prev,
        accounts: { ...prev.accounts, [emailKey]: fn(acc) },
      };
    });
  }, []);

  const pushNotification = (acc: AccountData, message: string): AccountData => ({
    ...acc,
    notifications: [
      { id: uid("ntf"), message, createdAt: new Date().toISOString(), read: false },
      ...acc.notifications,
    ].slice(0, 30),
  });

  // ---------- App ----------
  const setOnboardingSeen = useCallback(
    () => setState((p) => ({ ...p, onboardingSeen: true })),
    []
  );

  const setDemoMode = useCallback(
    (on: boolean) => setState((p) => ({ ...p, demoMode: on })),
    []
  );

  // ---------- Autenticação ----------
  const emailExists = useCallback(
    (email: string) => Boolean(stateRef.current.accounts[norm(email)]),
    []
  );

  const login = useCallback((email: string, password: string): ActionResult => {
    const key = norm(email);
    if (!EMAIL_REGEX.test(key)) return { ok: false, error: "Informe um e-mail válido" };
    if (!password) return { ok: false, error: "Informe sua senha" };
    const acc = stateRef.current.accounts[key];
    if (!acc) return { ok: false, error: "Nenhuma conta encontrada com este e-mail" };
    if (acc.profile.password !== password) return { ok: false, error: "Senha incorreta" };
    setState((p) => ({ ...p, sessionEmail: key, onboardingSeen: true }));
    return { ok: true };
  }, []);

  const loginAsTestUser = useCallback(() => {
    setState((p) => ({
      ...p,
      onboardingSeen: true,
      sessionEmail: TEST_USER.email,
      accounts: p.accounts[TEST_USER.email]
        ? p.accounts
        : { ...p.accounts, [TEST_USER.email]: createTestAccount() },
    }));
  }, []);

  const signUp = useCallback((name: string, email: string, password: string): ActionResult => {
    const key = norm(email);
    if (name.trim().length < 2) return { ok: false, error: "Informe seu nome completo" };
    if (!EMAIL_REGEX.test(key)) return { ok: false, error: "Informe um e-mail válido" };
    if (stateRef.current.accounts[key]) return { ok: false, error: "Este e-mail já está cadastrado" };
    const pwError = validatePassword(password);
    if (pwError) return { ok: false, error: pwError };
    const acc = createAccount(
      {
        name: name.trim(),
        email: key,
        password,
        avatarUri: DEFAULT_AVATAR,
        birthDate: "01-01-1996",
        heightCm: 168,
        weightKg: 64,
        gender: "Outro",
      },
      { seedHistory: false }
    );
    setState((p) => ({
      ...p,
      onboardingSeen: true,
      sessionEmail: key,
      accounts: { ...p.accounts, [key]: acc },
    }));
    return { ok: true };
  }, []);

  const resetPassword = useCallback((email: string, newPassword: string): ActionResult => {
    const key = norm(email);
    const acc = stateRef.current.accounts[key];
    if (!acc) return { ok: false, error: "Nenhuma conta encontrada com este e-mail" };
    const pwError = validatePassword(newPassword);
    if (pwError) return { ok: false, error: pwError };
    setState((p) => ({
      ...p,
      accounts: {
        ...p.accounts,
        [key]: {
          ...acc,
          password: newPassword,
          profile: { ...acc.profile, password: newPassword },
        },
      },
    }));
    return { ok: true };
  }, []);

  const logout = useCallback(
    () => setState((p) => ({ ...p, sessionEmail: null, demoMode: false })),
    []
  );

  const deleteAccount = useCallback(() => {
    setState((p) => {
      const email = p.sessionEmail || TEST_USER.email;
      const accounts = { ...p.accounts };
      delete accounts[email];
      if (email === TEST_USER.email) {
        accounts[TEST_USER.email] = createTestAccount();
      }
      return { ...p, accounts, sessionEmail: null, demoMode: false };
    });
  }, []);

  // ---------- Perfil ----------
  const updateProfile = useCallback<AppStoreValue["updateProfile"]>(
    (patch) => {
      const current = stateRef.current;
      const emailKey = current.sessionEmail || TEST_USER.email;
      if (patch.name !== undefined && patch.name.trim().length < 2) {
        return { ok: false, error: "Informe seu nome completo" };
      }
      if (patch.email !== undefined) {
        const newKey = norm(patch.email);
        if (!EMAIL_REGEX.test(newKey)) return { ok: false, error: "Informe um e-mail válido" };
        if (newKey !== emailKey && current.accounts[newKey]) {
          return { ok: false, error: "Este e-mail já está em uso" };
        }
        if (newKey !== emailKey) {
          setState((p) => {
            const acc = p.accounts[emailKey];
            const accounts = { ...p.accounts };
            delete accounts[emailKey];
            accounts[newKey] = {
              ...acc,
              profile: { ...acc.profile, ...patch, email: newKey },
            };
            return { ...p, accounts, sessionEmail: newKey };
          });
          return { ok: true };
        }
      }
      updateAccount((acc) => {
        const updatedProfile = { ...acc.profile, ...patch };
        const estimated = estimateGoals({
          weightKg: updatedProfile.weightKg,
          heightCm: updatedProfile.heightCm,
          age: 30,
          gender: updatedProfile.gender,
        });
        return {
          ...acc,
          profile: updatedProfile,
          goals: {
            ...acc.goals,
            ...estimated,
          },
        };
      });
      return { ok: true };
    },
    [updateAccount]
  );

  const changePassword = useCallback(
    (oldOrNew: string, newPw?: string): ActionResult => {
      const targetPassword = newPw !== undefined ? newPw : oldOrNew;
      const pwError = validatePassword(targetPassword);
      if (pwError) return { ok: false, error: pwError };
      updateAccount((acc) => ({
        ...acc,
        password: targetPassword,
        profile: { ...acc.profile, password: targetPassword },
      }));
      return { ok: true };
    },
    [updateAccount]
  );

  const updateGoals = useCallback(
    (goals: NutritionGoals) => updateAccount((acc) => ({ ...acc, goals })),
    [updateAccount]
  );

  const setNotificationPref = useCallback(
    (key: keyof NotificationPrefs | "goalMilestones", value: boolean) =>
      updateAccount((acc) => {
        const canonicalKey = key === "goalMilestones" ? "goalMilestone" : key;
        return {
          ...acc,
          notificationPrefs: {
            ...acc.notificationPrefs,
            [canonicalKey]: value,
            goalMilestones: value,
          },
        };
      }),
    [updateAccount]
  );

  // ---------- Refeições ----------
  const addMeal = useCallback(
    (meal: Omit<MealEntry, "id" | "createdAt">) =>
      updateAccount((acc) => {
        const entry: MealEntry = {
          ...meal,
          id: uid("meal"),
          createdAt: new Date().toISOString(),
        };
        let next: AccountData = { ...acc, meals: [...acc.meals, entry] };
        if (acc.notificationPrefs.goalMilestone) {
          const before = acc.meals
            .filter((m) => m.dateKey === meal.dateKey)
            .reduce((s, m) => s + m.calories, 0);
          if (before < acc.goals.calories && before + meal.calories >= acc.goals.calories) {
            next = pushNotification(
              next,
              "🎯 Você atingiu 100% da sua meta calórica de hoje!"
            );
          }
        }
        return next;
      }),
    [updateAccount]
  );

  const removeMeal = useCallback(
    (id: string) =>
      updateAccount((acc) => ({
        ...acc,
        meals: acc.meals.filter((m) => m.id !== id),
      })),
    [updateAccount]
  );

  // ---------- Dietas ----------
  const toggleIn = (list: string[], id: string) =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

  const toggleFavoriteDiet = useCallback(
    (dietId: string) =>
      updateAccount((acc) => ({
        ...acc,
        favoriteDietIds: toggleIn(acc.favoriteDietIds, dietId),
      })),
    [updateAccount]
  );

  const toggleMyDiet = useCallback(
    (dietId: string) =>
      updateAccount((acc) => ({
        ...acc,
        myDietIds: toggleIn(acc.myDietIds, dietId),
      })),
    [updateAccount]
  );

  // ---------- Pagamentos & Premium ----------
  const addCard = useCallback(
    (card: {
      brand?: PaymentBrandKey;
      holder?: string;
      holderName?: string;
      number?: string;
      last4?: string;
      expiry: string;
    }): ActionResult => {
      const holder = (card.holder || card.holderName || "Mariana Costa").trim();
      const last4 = card.last4 || (card.number ? card.number.slice(-4) : "8910");
      updateAccount((acc) => ({
        ...acc,
        selectedPayment: card.brand || "visa",
        cards: [
          ...acc.cards,
          {
            id: uid("card"),
            brand: card.brand || "visa",
            holder,
            last4,
            expiry: card.expiry,
          },
        ],
      }));
      return { ok: true };
    },
    [updateAccount]
  );

  const setSelectedPayment = useCallback(
    (brand: PaymentBrandKey) =>
      updateAccount((acc) => ({ ...acc, selectedPayment: brand })),
    [updateAccount]
  );

  const subscribe = useCallback(
    (plan: PlanType) =>
      updateAccount((acc) => {
        const start = new Date();
        const renews = new Date(start);
        if (plan === "monthly") renews.setMonth(renews.getMonth() + 1);
        else renews.setFullYear(renews.getFullYear() + 1);
        return pushNotification(
          {
            ...acc,
            subscription: {
              plan,
              active: true,
              paymentMethod: acc.selectedPayment,
              startedAt: start.toISOString(),
              renewsAt: renews.toISOString(),
              price: PLAN_PRICES[plan],
            },
          },
          "👑 Bem-vinda ao NutriAI Premium! Scans ilimitados e dietas exclusivas liberados."
        );
      }),
    [updateAccount]
  );

  const cancelSubscription = useCallback(
    () =>
      updateAccount((acc) => ({
        ...acc,
        subscription: {
          plan: "none",
          active: false,
          startedAt: new Date().toISOString(),
          renewsAt: new Date().toISOString(),
          price: 0,
        },
      })),
    [updateAccount]
  );

  // ---------- Notificações ----------
  const markNotificationsRead = useCallback(
    () =>
      updateAccount((acc) => ({
        ...acc,
        notifications: acc.notifications.map((n) => ({ ...n, read: true })),
      })),
    [updateAccount]
  );

  const clearNotifications = useCallback(
    () => updateAccount((acc) => ({ ...acc, notifications: [] })),
    [updateAccount]
  );

  const scansToday = useMemo(() => {
    const t = todayKey();
    return activeAccount.meals.filter((m) => m.source === "scan" && m.dateKey === t).length;
  }, [activeAccount]);

  const value: AppStoreValue = {
    hydrated,
    onboardingSeen: state.onboardingSeen,
    demoMode: state.demoMode,
    isAuthenticated: Boolean(state.sessionEmail),
    account: activeAccount,
    accounts: state.accounts,
    isPremium: activeAccount.subscription.plan !== "none",
    scansToday,
    setOnboardingSeen,
    markOnboardingSeen: setOnboardingSeen,
    setDemoMode,
    login,
    loginAsTestUser,
    signUp,
    emailExists,
    resetPassword,
    logout,
    deleteAccount,
    updateProfile,
    changePassword,
    updateGoals,
    setNotificationPref,
    addMeal,
    removeMeal,
    toggleFavoriteDiet,
    toggleMyDiet,
    addCard,
    setSelectedPayment,
    subscribe,
    cancelSubscription,
    markNotificationsRead,
    clearNotifications,
  };

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
};

export const useAppStore = (): AppStoreValue => {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore deve ser usado dentro de AppStoreProvider");
  return ctx;
};

export const useAccount = (): AccountData => {
  const { account } = useAppStore();
  return account;
};
