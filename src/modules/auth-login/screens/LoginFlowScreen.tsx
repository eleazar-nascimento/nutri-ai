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
import { DemoStepPills } from "@/components/layout";
import {
  useAppStore,
  TEST_USER,
  EMAIL_REGEX,
  validatePassword,
} from "@/store";
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
 */
export const LoginFlowScreenView: React.FC<LoginFlowScreenProps> = ({
  onNavigateToSignUp,
  onLoginSuccess,
}) => {
  const {
    demoMode,
    accounts,
    login,
    loginAsTestUser,
    resetPassword,
  } = useAppStore();

  const [step, setStep] = useState<LoginScreenStep>("08_login_fill");
  const [email, setEmail] = useState<string>(TEST_USER.email);
  const [password, setPassword] = useState<string>(TEST_USER.password);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [otpError, setOtpError] = useState<string | undefined>();

  const [forgotEmail, setForgotEmail] = useState<string>(TEST_USER.email);
  const [forgotError, setForgotError] = useState<string | undefined>();
  const [newPassword, setNewPassword] = useState<string>("Nutri@2026");
  const [confirmPassword, setConfirmPassword] = useState<string>("Nutri@2026");
  const [resetError, setResetError] = useState<string | undefined>();

  const [otpDigits, setOtpDigits] = useState<string[]>([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
  ]);

  const handleKeypadDigit = (digit: string) => {
    setOtpError(undefined);
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
    setOtpError(undefined);
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

  const handleFillTestUser = () => {
    setEmail(TEST_USER.email);
    setPassword(TEST_USER.password);
    setEmailError(undefined);
    setPasswordError(undefined);
    setStep("08_login_fill");
  };

  const handleSubmitLogin = () => {
    setEmailError(undefined);
    setPasswordError(undefined);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setEmailError("Por favor, informe seu e-mail.");
      setStep("06_login_error");
      return;
    }
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setEmailError("Formato de e-mail inválido.");
      setStep("06_login_error");
      return;
    }
    if (!password) {
      setPasswordError("Por favor, informe sua senha.");
      setStep("06_login_error");
      return;
    }

    const account = accounts[normalizedEmail];
    if (!account) {
      setEmailError(
        `Conta não encontrada. Use ${TEST_USER.email} ou cadastre-se.`
      );
      setStep("06_login_error");
      return;
    }
    if (account.password !== password) {
      setPasswordError(
        `Senha incorreta para esta conta (teste: ${TEST_USER.password}).`
      );
      setStep("06_login_error");
      return;
    }

    setOtpDigits(["1", "2", "3", "4", "5", "6"]);
    setOtpError(undefined);
    setStep("09_verification");
  };

  const handleVerifyOtp = () => {
    const code = otpDigits.join("");
    if (code.length < 6) {
      setOtpError("Digite os 6 dígitos do código de verificação.");
      return;
    }
    if (code !== TEST_USER.otp && !demoMode) {
      setOtpError(`Código inválido. Para o usuário de teste use ${TEST_USER.otp}.`);
      return;
    }
    const res = login(email, password);
    if (!res.ok) {
      setOtpError(res.error);
      return;
    }
    onLoginSuccess?.();
  };

  const handleSocialLogin = () => {
    loginAsTestUser();
    onLoginSuccess?.();
  };

  const handleSendRecoveryLink = () => {
    setForgotError(undefined);
    const normalized = forgotEmail.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalized)) {
      setForgotError("Informe um e-mail válido para recuperação.");
      return;
    }
    if (!accounts[normalized]) {
      setForgotError(
        `E-mail não encontrado. Experimente ${TEST_USER.email}.`
      );
      return;
    }
    setStep("11_reset_password");
  };

  const handleConfirmResetPassword = () => {
    setResetError(undefined);
    const pwdErr = validatePassword(newPassword);
    if (pwdErr) {
      setResetError(pwdErr);
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("As senhas digitadas não coincidem.");
      return;
    }
    const res = resetPassword(forgotEmail, newPassword);
    if (!res.ok) {
      setResetError(res.error);
      return;
    }
    setEmail(forgotEmail.trim().toLowerCase());
    setPassword(newPassword);
    setStep("12_reset_modal");
  };

  const getEmailDisplay = () => {
    if (demoMode && step === "05_login_default") return "";
    if (demoMode && step === "07_login_active") return "marianacos|";
    return email;
  };

  const getPasswordDisplay = () => {
    if (demoMode && step === "05_login_default") return "";
    return password;
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBarMock variant="white" />

      {/* Seletor rápido das 8 telas do Passo 3 (visível apenas no Modo Demo) */}
      <DemoStepPills
        steps={STEP_PILLS}
        active={step}
        onChange={(key: LoginScreenStep) => {
          setEmailError(undefined);
          setPasswordError(undefined);
          setStep(key);
        }}
      />

      {/* TELAS 05, 06, 07 e 08 — LOGIN */}
      {isLoginScreen && (
        <ScrollView
          contentContainerStyle={styles.contentScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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

          {/* Card de Acesso Rápido do Usuário de Teste */}
          <View style={styles.testHelperBanner}>
            <View style={{ flex: 1, gap: 2 }}>
              <AppText variant="caption2" color={colors.accent[300]}>
                Credenciais de Teste • Mobile-First
              </AppText>
              <AppText variant="footnote" color={colors.grayscale[200]}>
                {TEST_USER.email} • Senha: {TEST_USER.password} • OTP:{" "}
                {TEST_USER.otp}
              </AppText>
            </View>
            <View style={{ flexDirection: "row", gap: 6 }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleFillTestUser}
                style={styles.testBannerBtnSecondary}
              >
                <AppText variant="footnote" color={colors.grayscale[100]}>
                  Preencher
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  loginAsTestUser();
                  onLoginSuccess?.();
                }}
                style={styles.testBannerBtnPrimary}
              >
                <AppText variant="footnote" color={colors.grayscale[100]}>
                  1-Click
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formContainer}>
            <FormInput
              label="E-mail"
              placeholder="Digite seu e-mail"
              value={getEmailDisplay()}
              onChangeText={(txt) => {
                setEmail(txt);
                setEmailError(undefined);
                setStep("08_login_fill");
              }}
              state={
                emailError || (demoMode && step === "06_login_error")
                  ? "error"
                  : demoMode && step === "07_login_active"
                  ? "active"
                  : email
                  ? "field"
                  : "default"
              }
              errorMessage={emailError ?? "Por favor, informe seu e-mail"}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={{ gap: 10 }}>
              <FormInput
                label="Senha"
                placeholder="Digite sua senha"
                value={getPasswordDisplay()}
                onChangeText={(txt) => {
                  setPassword(txt);
                  setPasswordError(undefined);
                  setStep("08_login_fill");
                }}
                isPassword
                state={
                  passwordError || (demoMode && step === "06_login_error")
                    ? "error"
                    : password
                    ? "field"
                    : "default"
                }
                errorMessage={passwordError ?? "Por favor, informe sua senha"}
              />
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => {
                  setForgotEmail(email || TEST_USER.email);
                  setForgotError(undefined);
                  setStep("10_forgot_password");
                }}
                style={{ alignSelf: "flex-end" }}
              >
                <AppText variant="body2" color={colors.grayscale[100]}>
                  Esqueceu a senha?
                </AppText>
              </TouchableOpacity>
            </View>

            {/* Divisor "Ou" */}
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
              <SocialButton provider="google" onPress={handleSocialLogin} />
              <SocialButton provider="apple" onPress={handleSocialLogin} />
            </View>
          </View>

          {/* Botão Entrar + Ir para Cadastro */}
          <View style={styles.bottomButtonSection}>
            <Button
              title="Entrar"
              variant="primary"
              size="large"
              onPress={handleSubmitLogin}
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
                {email} (código de teste: {TEST_USER.otp})
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
                    otpError && {
                      borderColor: colors.message[200],
                    },
                  ]}
                >
                  <AppText variant="headline" color={colors.grayscale[100]}>
                    {digit}
                  </AppText>
                </View>
              ))}
            </View>

            {otpError ? (
              <AppText
                variant="footnote"
                color={colors.message[200]}
                align="center"
              >
                {otpError}
              </AppText>
            ) : null}

            <View style={styles.resendBlock}>
              <AppText variant="body2" color={colors.grayscale[100]}>
                Não recebeu o código?
              </AppText>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => {
                  setOtpDigits(["1", "2", "3", "4", "5", "6"]);
                  setOtpError(undefined);
                }}
              >
                <AppText variant="headline" color={colors.primary[100]}>
                  Reenviar código ({TEST_USER.otp})
                </AppText>
              </TouchableOpacity>
            </View>

            <Button
              title="Verificar"
              variant="primary"
              size="large"
              onPress={handleVerifyOtp}
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
          keyboardShouldPersistTaps="handled"
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
              value={forgotEmail}
              onChangeText={(txt) => {
                setForgotEmail(txt);
                setForgotError(undefined);
              }}
              state={forgotError ? "error" : "field"}
              errorMessage={forgotError}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.bottomButtonSection, { marginTop: 80 }]}>
            <Button
              title="Enviar Link de Recuperação"
              variant="primary"
              size="large"
              onPress={handleSendRecoveryLink}
            />

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setStep("08_login_fill")}
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
            keyboardShouldPersistTaps="handled"
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
                onChangeText={(txt) => {
                  setNewPassword(txt);
                  setResetError(undefined);
                }}
                isPassword
                state={resetError ? "error" : "field"}
                errorMessage={resetError}
              />
              <FormInput
                label="Confirmar Senha"
                placeholder="Confirme a nova senha"
                value={confirmPassword}
                onChangeText={(txt) => {
                  setConfirmPassword(txt);
                  setResetError(undefined);
                }}
                isPassword
                state={resetError ? "error" : "field"}
              />
            </View>

            <View style={[styles.bottomButtonSection, { marginTop: 60 }]}>
              <Button
                title="Redefinir Senha"
                variant="primary"
                size="large"
                onPress={handleConfirmResetPassword}
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
    backgroundColor: colors.grayscale[600],
    justifyContent: "space-between",
  },
  contentScroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 22,
  },
  welcomeBlock: {
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  testHelperBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: colors.grayscale[500],
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: "rgba(69, 197, 136, 0.35)",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  testBannerBtnSecondary: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: colors.grayscale[400],
  },
  testBannerBtnPrimary: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: colors.primary[100],
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
    marginTop: 8,
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
    gap: 20,
    alignItems: "center",
  },
  otpSixRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 8,
  },
  otpBox51: {
    flex: 1,
    maxWidth: 51,
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
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
});
