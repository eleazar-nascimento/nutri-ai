import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors, radii } from "@/theme";
import {
  AppText,
  StatusBarMock,
  HomeIndicator,
  FormInput,
  Button,
  SocialButton,
  CircleIconButton,
  MessageModalCard,
} from "@/components/ui";
import { NumericKeypad } from "../components/NumericKeypad";

export type LoginScreenStep =
  | "05_login_default"
  | "06_login_error"
  | "07_login_active"
  | "08_login_fill"
  | "09_verification"
  | "10_forgot_password"
  | "11_reset_password"
  | "12_reset_modal";

const STEP_PILLS: { key: LoginScreenStep; label: string }[] = [
  { key: "05_login_default", label: "05. Padrão" },
  { key: "06_login_error", label: "06. Erro" },
  { key: "07_login_active", label: "07. Ativo" },
  { key: "08_login_fill", label: "08. Preenchido" },
  { key: "09_verification", label: "09. Código OTP" },
  { key: "10_forgot_password", label: "10. Esqueci Senha" },
  { key: "11_reset_password", label: "11. Nova Senha" },
  { key: "12_reset_modal", label: "12. Modal Sucesso" },
];

export interface LoginFlowScreenProps {
  onNavigateToSignUp?: () => void;
  onLoginSuccess?: () => void;
}

/**
 * Módulo 3 — Log In & Forgot Password (Telas 05 a 12 do Figma)
 * - 05_Log in-Default (62991:784)
 * - 06_Log in-Error (62993:1462)
 * - 07_Log in-Active (62993:1594)
 * - 08_Log in-Fill (62993:1744)
 * - 09_Verification (62993:2224)
 * - 10_Forgot Password (62993:2959)
 * - 11_Reset Password (62993:3555)
 * - 12_Reset Password Modal (62993:3629)
 */
export const LoginFlowScreenView: React.FC<LoginFlowScreenProps> = ({
  onNavigateToSignUp,
  onLoginSuccess,
}) => {
  const [step, setStep] = useState<LoginScreenStep>("05_login_default");
  const [email, setEmail] = useState("marianacosta@email.com");
  const [password, setPassword] = useState("NutriAI2026");
  const [newPassword, setNewPassword] = useState("NovaSenha@2026");
  const [confirmPassword, setConfirmPassword] = useState("NovaSenha@2026");
  const [otpDigits, setOtpDigits] = useState<string[]>([
    "8",
    "5",
    "6",
    "3",
    "4",
    "6",
  ]);

  const handleKeypadDigit = (digit: string) => {
    const emptyIdx = otpDigits.findIndex((d) => d === "");
    if (emptyIdx !== -1) {
      const next = [...otpDigits];
      next[emptyIdx] = digit;
      setOtpDigits(next);
    } else {
      const next = [...otpDigits.slice(1), digit];
      setOtpDigits(next);
    }
  };

  const handleKeypadBackspace = () => {
    const lastFilled = [...otpDigits]
      .reverse()
      .findIndex((d) => d.length > 0);
    if (lastFilled !== -1) {
      const idx = otpDigits.length - 1 - lastFilled;
      const next = [...otpDigits];
      next[idx] = "";
      setOtpDigits(next);
    }
  };

  const isLoginScreen =
    step === "05_login_default" ||
    step === "06_login_error" ||
    step === "07_login_active" ||
    step === "08_login_fill";

  const getEmailValue = () => {
    if (step === "05_login_default") return "";
    if (step === "06_login_error") return "";
    if (step === "07_login_active") return "marianacos|";
    return email;
  };

  const getPasswordValue = () => {
    if (step === "05_login_default" || step === "06_login_error") return "";
    return password;
  };

  const getInputState = () => {
    if (step === "06_login_error") return "error" as const;
    if (step === "07_login_active") return "active" as const;
    if (step === "08_login_fill") return "field" as const;
    return "default" as const;
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBarMock variant="white" />

      {/* Seletor rápido das 8 telas do Passo 3 do Figma */}
      <View style={styles.subNavWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subNavScroll}
        >
          {STEP_PILLS.map((p) => {
            const active = step === p.key;
            return (
              <TouchableOpacity
                key={p.key}
                activeOpacity={0.8}
                onPress={() => setStep(p.key)}
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

      {/* TELAS 05, 06, 07 e 08 — LOGIN */}
      {isLoginScreen && (
        <ScrollView
          contentContainerStyle={styles.contentScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.welcomeBlock}>
            <AppText
              variant="title1"
              color={colors.grayscale[100]}
              align="center"
            >
              Bem-vindo de volta ao NutriAI
            </AppText>
            <AppText
              variant="body"
              color={colors.grayscale[200]}
              align="center"
            >
              Coma melhor. Volte ao foco.
            </AppText>
          </View>

          <View style={styles.formContainer}>
            <FormInput
              label="E-mail"
              placeholder="Digite seu e-mail"
              value={getEmailValue()}
              onChangeText={(txt) => {
                setEmail(txt);
                setStep("08_login_fill");
              }}
              state={getInputState()}
              errorMessage="Por favor, informe seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={{ gap: 10 }}>
              <FormInput
                label="Senha"
                placeholder="Digite sua senha"
                value={getPasswordValue()}
                onChangeText={(txt) => {
                  setPassword(txt);
                  setStep("08_login_fill");
                }}
                isPassword
                state={getInputState()}
                errorMessage="Por favor, informe sua senha"
              />
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => setStep("10_forgot_password")}
                style={{ alignSelf: "flex-end" }}
              >
                <AppText variant="body2" color={colors.grayscale[100]}>
                  Esqueceu a senha?
                </AppText>
              </TouchableOpacity>
            </View>

            {/* Divisor "Ou" (Divider Container 388x19) */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <View style={styles.orBadge}>
                <AppText variant="footnote" color={colors.grayscale[100]}>
                  Ou
                </AppText>
              </View>
            </View>

            {/* Botões Sociais */}
            <View style={{ gap: 16 }}>
              <SocialButton
                provider="google"
                onPress={() => setStep("09_verification")}
              />
              <SocialButton
                provider="apple"
                onPress={() => setStep("09_verification")}
              />
            </View>
          </View>

          {/* Botão Entrar + Ir para Cadastro */}
          <View style={styles.bottomButtonSection}>
            <Button
              title="Entrar"
              variant="primary"
              size="large"
              onPress={() => {
                if (step === "05_login_default") {
                  setStep("06_login_error");
                } else if (step === "06_login_error") {
                  setStep("08_login_fill");
                } else {
                  setStep("09_verification");
                }
              }}
            />

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={onNavigateToSignUp}
              style={styles.switchAuthRow}
            >
              <AppText variant="body2" color={colors.grayscale[100]}>
                Não tem uma conta?{" "}
              </AppText>
              <AppText variant="headline" color={colors.primary[100]}>
                Cadastre-se
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* TELA 09 — VERIFICAÇÃO DE E-MAIL (62993:2224) */}
      {step === "09_verification" && (
        <View style={styles.verificationWrapper}>
          <View style={styles.verificationTopContent}>
            <View style={{ alignSelf: "flex-start" }}>
              <CircleIconButton
                type="back"
                onPress={() => setStep("08_login_fill")}
              />
            </View>

            <View style={styles.welcomeBlock}>
              <AppText
                variant="title1"
                color={colors.grayscale[100]}
                align="center"
              >
                Verifique Seu E-mail
              </AppText>
              <AppText
                variant="body2"
                color={colors.grayscale[200]}
                align="center"
              >
                {"Digite o código de 6 dígitos que enviamos para\n"}
                {email}
              </AppText>
            </View>

            {/* 6 Caixas de Código 51x51px (Figma Node 62993:2224) */}
            <View style={styles.otpSixRow}>
              {otpDigits.map((digit, index) => (
                <View
                  key={index}
                  style={[
                    styles.otpBox51,
                    digit.length > 0 && {
                      borderColor: colors.grayscale[100],
                    },
                  ]}
                >
                  <AppText variant="headline" color={colors.grayscale[100]}>
                    {digit}
                  </AppText>
                </View>
              ))}
            </View>

            <View style={styles.resendBlock}>
              <AppText variant="body2" color={colors.grayscale[100]}>
                Não recebeu o código?
              </AppText>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => setOtpDigits(["8", "5", "6", "3", "4", "6"])}
              >
                <AppText variant="headline" color={colors.primary[100]}>
                  Reenviar código
                </AppText>
              </TouchableOpacity>
            </View>

            <Button
              title="Verificar"
              variant="primary"
              size="large"
              onPress={onLoginSuccess}
            />
          </View>

          <NumericKeypad
            onKeyPress={handleKeypadDigit}
            onBackspace={handleKeypadBackspace}
          />
        </View>
      )}

      {/* TELA 10 — ESQUECI A SENHA (62993:2959) */}
      {step === "10_forgot_password" && (
        <ScrollView
          contentContainerStyle={styles.contentScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ alignSelf: "flex-start" }}>
            <CircleIconButton
              type="back"
              onPress={() => setStep("08_login_fill")}
            />
          </View>

          <View style={styles.welcomeBlock}>
            <AppText
              variant="title1"
              color={colors.grayscale[100]}
              align="center"
            >
              Esqueceu Sua Senha?
            </AppText>
            <AppText
              variant="body2"
              color={colors.grayscale[200]}
              align="center"
            >
              {
                "Não se preocupe! Digite seu e-mail e enviaremos\num link para redefini-la."
              }
            </AppText>
          </View>

          <View style={{ width: "100%", marginTop: 12 }}>
            <FormInput
              label="E-mail"
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              state="field"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.bottomButtonSection, { marginTop: 120 }]}>
            <Button
              title="Enviar Link de Recuperação"
              variant="primary"
              size="large"
              onPress={() => setStep("11_reset_password")}
            />

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setStep("05_login_default")}
              style={{ alignSelf: "center", paddingVertical: 6 }}
            >
              <AppText variant="headline" color={colors.primary[100]}>
                Voltar para o Login
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* TELAS 11 e 12 — REDEFINIR SENHA + MODAL SENHA ALTERADA (62993:3555 / 62993:3629) */}
      {(step === "11_reset_password" || step === "12_reset_modal") && (
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.contentScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ alignSelf: "flex-start" }}>
              <CircleIconButton
                type="back"
                onPress={() => setStep("10_forgot_password")}
              />
            </View>

            <View style={styles.welcomeBlock}>
              <AppText
                variant="title1"
                color={colors.grayscale[100]}
                align="center"
              >
                Redefinir Sua Senha
              </AppText>
              <AppText
                variant="body2"
                color={colors.grayscale[200]}
                align="center"
              >
                {"Crie uma nova senha para recuperar o acesso\nà sua conta."}
              </AppText>
            </View>

            <View style={styles.formContainer}>
              <FormInput
                label="Nova Senha"
                placeholder="Digite a nova senha"
                value={newPassword}
                onChangeText={setNewPassword}
                isPassword
                state="field"
              />
              <FormInput
                label="Confirmar Senha"
                placeholder="Confirme a nova senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                isPassword
                state="field"
              />
            </View>

            <View style={[styles.bottomButtonSection, { marginTop: 80 }]}>
              <Button
                title="Redefinir Senha"
                variant="primary"
                size="large"
                onPress={() => setStep("12_reset_modal")}
              />
            </View>
          </ScrollView>

          {/* Overlay 12_Reset Password Modal (62993:3629) */}
          {step === "12_reset_modal" && (
            <View style={styles.modalBackdrop}>
              <View style={{ width: "100%", paddingHorizontal: 20 }}>
                <MessageModalCard
                  mode="singleAction"
                  title="Senha alterada"
                  subtitle="Sua senha foi atualizada com sucesso! Agora você já pode entrar com suas novas credenciais."
                  primaryLabel="Entrar"
                  onPrimaryPress={() => setStep("08_login_fill")}
                />
              </View>
            </View>
          )}
        </View>
      )}

      {step !== "09_verification" && <HomeIndicator variant="light" />}
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
    justifyContent: "space-between",
  },
  subNavWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 8,
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
  contentScroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 28,
  },
  welcomeBlock: {
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  formContainer: {
    width: "100%",
    gap: 18,
  },
  dividerContainer: {
    width: "100%",
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginVertical: 4,
  },
  dividerLine: {
    width: "100%",
    height: 1,
    backgroundColor: colors.grayscale[400],
  },
  orBadge: {
    position: "absolute",
    paddingHorizontal: 12,
    backgroundColor: colors.grayscale[600],
  },
  bottomButtonSection: {
    width: "100%",
    gap: 18,
    marginTop: 12,
  },
  switchAuthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  verificationWrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  verificationTopContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 24,
    alignItems: "center",
  },
  otpSixRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 8,
  },
  otpBox51: {
    width: 51,
    height: 51,
    borderRadius: radii.md,
    backgroundColor: colors.grayscale[600],
    borderWidth: 1.5,
    borderColor: colors.grayscale[500],
    alignItems: "center",
    justifyContent: "center",
  },
  resendBlock: {
    alignItems: "center",
    gap: 4,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
});
