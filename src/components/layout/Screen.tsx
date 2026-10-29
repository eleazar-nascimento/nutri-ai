import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, radii } from "@/theme";
import { AppText, PortfolioNavBar } from "@/components/ui";
import { TEST_USER, useAppStore } from "@/store";

/**
 * Container padrão das rotas (mobile-first):
 * - Respeita safe areas (notch, barra de gestos) em iOS/Android
 * - Evita que o teclado cubra formulários
 * - Exibe a barra de navegação do portfólio apenas no Modo Demo
 */
export const Screen: React.FC<{
  children: React.ReactNode;
  edges?: Edge[];
  keyboard?: boolean;
  keyboardAvoiding?: boolean;
}> = ({
  children,
  edges = ["top", "bottom"],
  keyboard = false,
  keyboardAvoiding = false,
}) => {
  const { demoMode } = useAppStore();
  const shouldUseKeyboard = keyboard || keyboardAvoiding;

  const content = (
    <View style={styles.inner}>
      {demoMode && <DemoBanner />}
      {demoMode && <PortfolioNavBar />}
      {children}
    </View>
  );

  return (
    <SafeAreaView edges={edges} style={styles.root}>
      {shouldUseKeyboard ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
};

const DemoBanner: React.FC = () => {
  const { setDemoMode } = useAppStore();
  return (
    <View style={styles.demoBanner}>
      <AppText variant="footnote" color={colors.grayscale[600]}>
        Modo Demo: atalhos para todas as telas do Figma
      </AppText>
      <TouchableOpacity onPress={() => setDemoMode(false)} hitSlop={8}>
        <AppText variant="caption2" color={colors.grayscale[600]}>
          Sair
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

/** Chips de sub-telas do Figma — renderizados apenas no Modo Demo */
export function DemoStepPills<K extends string>(props: {
  steps?: { key: K; label: string }[];
  pills?: { key: K; label: string }[];
  active?: K;
  activeKey?: K;
  onChange?: (key: K) => void;
  onSelect?: (key: K) => void;
}) {
  const { demoMode } = useAppStore();
  if (!demoMode) return null;

  const items = props.steps || props.pills || [];
  const current = (props.active ?? props.activeKey) as K;
  const handleChange = props.onChange || props.onSelect || (() => {});

  return (
    <View style={styles.pillsWrapper}>
      <View style={styles.pillsRow}>
        {items.map((s) => {
          const isActive = s.key === current;
          return (
            <TouchableOpacity
              key={s.key}
              onPress={() => handleChange(s.key as K)}
              style={[styles.pill, isActive && styles.pillActive]}
            >
              <AppText
                variant="footnote"
                color={isActive ? colors.grayscale[600] : colors.grayscale[200]}
              >
                {s.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/**
 * Painel lateral visível no desktop Web (largura >= 700px):
 * Exibe as credenciais do usuário de teste e atalhos de depuração rápida.
 */
export const TestUserPanel: React.FC = () => {
  const router = useRouter();
  const {
    demoMode,
    setDemoMode,
    loginAsTestUser,
    logout,
    account,
    isAuthenticated,
  } = useAppStore();

  return (
    <View style={styles.sideCard}>
      <View style={{ gap: 4 }}>
        <AppText variant="caption2" color={colors.primary[100]}>
          Ambiente de Testes • Mobile-First
        </AppText>
        <AppText variant="title3" color={colors.grayscale[100]}>
          Usuário de Teste
        </AppText>
        <AppText variant="footnote" color={colors.grayscale[200]}>
          Experimente o fluxo completo como um usuário mobile real ou ative o
          Modo Demo para navegar pelas 47 telas do Figma.
        </AppText>
      </View>

      {/* Caixa de Credenciais */}
      <View style={styles.credBox}>
        <View style={styles.credRow}>
          <AppText variant="caption2" color={colors.grayscale[200]}>
            E-mail:
          </AppText>
          <AppText variant="caption2" color={colors.grayscale[100]}>
            {TEST_USER.email}
          </AppText>
        </View>
        <View style={styles.credRow}>
          <AppText variant="caption2" color={colors.grayscale[200]}>
            Senha:
          </AppText>
          <AppText variant="caption2" color={colors.grayscale[100]}>
            {TEST_USER.password}
          </AppText>
        </View>
        <View style={styles.credRow}>
          <AppText variant="caption2" color={colors.grayscale[200]}>
            Código OTP:
          </AppText>
          <AppText variant="caption2" color={colors.accent[300]}>
            {TEST_USER.otp}
          </AppText>
        </View>
      </View>

      {/* Estado Atual */}
      <View style={styles.statusBox}>
        <AppText variant="caption2" color={colors.grayscale[200]}>
          Sessão:{" "}
          <AppText
            variant="caption2"
            color={
              isAuthenticated ? colors.accent[300] : colors.grayscale[300]
            }
          >
            {isAuthenticated
              ? `Conectado como ${account?.profile.name}`
              : "Desconectado"}
          </AppText>
        </AppText>
        {isAuthenticated && (
          <AppText variant="caption2" color={colors.grayscale[200]}>
            Plano:{" "}
            <AppText
              variant="caption2"
              color={
                account?.subscription ? colors.accent[200] : colors.grayscale[200]
              }
            >
              {account?.subscription ? "Premium Ativo" : "Gratuito"}
            </AppText>
          </AppText>
        )}
      </View>

      {/* Ações Rápidas */}
      <View style={{ gap: 8 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            loginAsTestUser();
            router.replace("/home" as any);
          }}
          style={styles.actionBtnPrimary}
        >
          <AppText variant="footnote" color={colors.grayscale[100]}>
            Entrar como Usuário de Teste
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setDemoMode(!demoMode)}
          style={[styles.actionBtn, demoMode && styles.actionBtnActive]}
        >
          <AppText
            variant="footnote"
            color={demoMode ? colors.grayscale[600] : colors.grayscale[100]}
          >
            {demoMode ? "Desativar Modo Demo" : "Ativar Modo Demo"}
          </AppText>
        </TouchableOpacity>

        {isAuthenticated && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              logout();
              router.replace("/login" as any);
            }}
            style={styles.actionBtnOutline}
          >
            <AppText variant="footnote" color={colors.message[200]}>
              Desconectar
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.grayscale[600],
  },
  inner: {
    flex: 1,
    width: "100%",
  },
  demoBanner: {
    backgroundColor: colors.accent[200],
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pillsWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: colors.grayscale[600],
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale[500],
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    backgroundColor: colors.grayscale[500],
  },
  pillActive: {
    backgroundColor: colors.accent[200],
  },
  sideCard: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: colors.grayscale[500],
    borderRadius: radii.xl,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.grayscale[400],
  },
  credBox: {
    backgroundColor: colors.grayscale[600],
    borderRadius: radii.md,
    padding: 12,
    gap: 6,
  },
  credRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBox: {
    backgroundColor: colors.grayscale[600],
    borderRadius: radii.md,
    padding: 10,
    gap: 4,
  },
  actionBtnPrimary: {
    backgroundColor: colors.primary[100],
    borderRadius: radii.full,
    paddingVertical: 10,
    alignItems: "center",
  },
  actionBtn: {
    backgroundColor: colors.grayscale[400],
    borderRadius: radii.full,
    paddingVertical: 10,
    alignItems: "center",
  },
  actionBtnActive: {
    backgroundColor: colors.accent[200],
  },
  actionBtnOutline: {
    borderWidth: 1,
    borderColor: colors.message[200],
    borderRadius: radii.full,
    paddingVertical: 8,
    alignItems: "center",
  },
});
