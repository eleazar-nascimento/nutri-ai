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
  CircleIconButton,
  Checkbox,
} from "@/components/ui";
import { DemoStepPills } from "@/components/layout";
import { NumericKeypad } from "@/modules/auth-login";
import {
  useAppStore,
  TEST_USER,
  EMAIL_REGEX,
  validatePassword,
} from "@/store";

export type SignUpScreenStep =
  | "13_signup_default"
  | "14_signup_fill"
  | "15_verification";

const SIGNUP_PILLS: { key: SignUpScreenStep; label: string }[] = [
  { key: "13_signup_default", label: "13. Cadastro Padrão" },
  { key: "14_signup_fill", label: "14. Cadastro Preenchido" },
  { key: "15_verification", label: "15. Verificação OTP" },
];

export interface SignUpFlowScreenProps {
  onNavigateToLogin?: () => void;
  onSignUpSuccess?: () => void;
}

/**
 * Módulo 4 — Sign Up (Telas 13 a 15 do Figma)
 */
export const SignUpFlowScreenView: React.FC<SignUpFlowScreenProps> = ({
  onNavigateToLogin,
  onSignUpSuccess,
}) => {
  const { demoMode, signUp } = useAppStore();
  const [step, setStep] = useState<SignUpScreenStep>("14_signup_fill");
  const [fullName, setFullName] = useState("Lucas Mendes");
  const [email, setEmail] = useState("lucas@nutriai.com");
  const [password, setPassword] = useState("Nutri@123");
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [otpError, setOtpError] = useState<string | undefined>();

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

  const handleContinueSignUp = () => {
    setNameError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);

    if (fullName.trim().length < 2) {
      setNameError("Informe seu nome completo (mínimo 2 caracteres).");
      return;
    }
    if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
      setEmailError("Informe um endereço de e-mail válido.");
      return;
    }
    const pwdErr = validatePassword(password);
    if (pwdErr) {
      setPasswordError(pwdErr);
      return;
    }
    if (!acceptTerms) {
      setPasswordError("Aceite os termos de uso para continuar.");
      return;
    }

    setOtpDigits(["1", "2", "3", "4", "5", "6"]);
    setOtpError(undefined);
    setStep("15_verification");
  };

  const handleVerifyAndCreate = () => {
    const code = otpDigits.join("");
    if (code.length < 6) {
      setOtpError("Digite os 6 dígitos do código.");
      return;
    }
    const res = signUp(fullName, email, password);
    if (!res.ok) {
      setOtpError(res.error);
      return;
    }
    onSignUpSuccess?.();
  };

  const showEmpty = demoMode && step === "13_signup_default";

  return (
    <View style={styles.screenContainer}>
      <StatusBarMock variant="white" />

      <DemoStepPills
        steps={SIGNUP_PILLS}
        active={step}
        onChange={(k: SignUpScreenStep) => setStep(k)}
      />

      {/* TELAS 13 e 14 — FORMULÁRIO DE CADASTRO */}
      {(step === "13_signup_default" || step === "14_signup_fill") && (
        <ScrollView
          contentContainerStyle={styles.contentScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ alignSelf: "flex-start" }}>
            <CircleIconButton type="back" onPress={onNavigateToLogin} />
          </View>

          <View style={styles.welcomeBlock}>
            <AppText
              variant="title1"
              color={colors.grayscale[100]}
              align="center"
            >
              Crie Sua Conta NutriAI
            </AppText>
            <AppText
              variant="body"
              color={colors.grayscale[200]}
              align="center"
            >
              Coma melhor. Volte ao foco.
            </AppText>
          </View>

          <View style={styles.fieldsContainer}>
            <FormInput
              label="Nome Completo"
              placeholder="Digite seu nome completo"
              value={showEmpty ? "" : fullName}
              onChangeText={(txt) => {
                setFullName(txt);
                setNameError(undefined);
                setStep("14_signup_fill");
              }}
              state={nameError ? "error" : showEmpty ? "default" : "field"}
              errorMessage={nameError}
            />

            <FormInput
              label="E-mail"
              placeholder="Digite seu e-mail"
              value={showEmpty ? "" : email}
              onChangeText={(txt) => {
                setEmail(txt);
                setEmailError(undefined);
                setStep("14_signup_fill");
              }}
              state={emailError ? "error" : showEmpty ? "default" : "field"}
              errorMessage={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FormInput
              label="Senha"
              placeholder="Digite sua senha"
              value={showEmpty ? "" : password}
              onChangeText={(txt) => {
                setPassword(txt);
                setPasswordError(undefined);
                setStep("14_signup_fill");
              }}
              isPassword
              state={passwordError ? "error" : showEmpty ? "default" : "field"}
              errorMessage={passwordError}
            />

            <Checkbox
              checked={acceptTerms}
              onChange={setAcceptTerms}
              label="Concordo com os Termos de Uso e Política de Privacidade"
            />
          </View>

          <View style={styles.bottomButtonSection}>
            <Button
              title="Cadastrar"
              variant="primary"
              size="large"
              onPress={handleContinueSignUp}
            />

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={onNavigateToLogin}
              style={styles.switchAuthRow}
            >
              <AppText variant="body2" color={colors.grayscale[100]}>
                Já tem uma conta?{" "}
              </AppText>
              <AppText variant="headline" color={colors.primary[100]}>
                Entrar
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* TELA 15 — VERIFICAÇÃO DO CADASTRO (62993:4275) */}
      {step === "15_verification" && (
        <View style={styles.verificationWrapper}>
          <View style={styles.verificationTopContent}>
            <View style={{ alignSelf: "flex-start" }}>
              <CircleIconButton
                type="back"
                onPress={() => setStep("14_signup_fill")}
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
                {"Digite o código que enviamos por mensagem para\n"}
                {email} (código: {TEST_USER.otp})
              </AppText>
            </View>

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
                  Reenviar código
                </AppText>
              </TouchableOpacity>
            </View>

            <Button
              title="Verificar e Criar Conta"
              variant="primary"
              size="large"
              onPress={handleVerifyAndCreate}
            />
          </View>

          <NumericKeypad
            onKeyPress={handleKeypadDigit}
            onBackspace={handleKeypadBackspace}
          />
        </View>
      )}

      {step !== "15_verification" && <HomeIndicator variant="light" />}
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
    paddingTop: 8,
    paddingBottom: 32,
    gap: 24,
  },
  welcomeBlock: {
    alignItems: "center",
    gap: 8,
  },
  fieldsContainer: {
    width: "100%",
    gap: 18,
  },
  bottomButtonSection: {
    width: "100%",
    gap: 18,
    marginTop: 18,
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
});
