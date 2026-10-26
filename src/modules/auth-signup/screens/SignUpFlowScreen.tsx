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
} from "@/components/ui";
import { NumericKeypad } from "@/modules/auth-login";

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
 * - 13_Sign Up-Default (62993:3844)
 * - 14_Sign Up-Fill (62993:3967)
 * - 15_Verification (62993:4275)
 */
export const SignUpFlowScreenView: React.FC<SignUpFlowScreenProps> = ({
  onNavigateToLogin,
  onSignUpSuccess,
}) => {
  const [step, setStep] = useState<SignUpScreenStep>("13_signup_default");
  const [fullName, setFullName] = useState("Mariana Costa");
  const [email, setEmail] = useState("marianacosta@email.com");
  const [password, setPassword] = useState("NutriAI@2026");
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

  const isFilled = step === "14_signup_fill";

  return (
    <View style={styles.screenContainer}>
      <StatusBarMock variant="white" />

      {/* Seletor rápido das 3 telas do Passo 4 do Figma */}
      <View style={styles.subNavWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subNavScroll}
        >
          {SIGNUP_PILLS.map((p) => {
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

      {/* TELAS 13 e 14 — FORMULÁRIO DE CADASTRO */}
      {(step === "13_signup_default" || step === "14_signup_fill") && (
        <ScrollView
          contentContainerStyle={styles.contentScroll}
          showsVerticalScrollIndicator={false}
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
              value={isFilled ? fullName : ""}
              onChangeText={(txt) => {
                setFullName(txt);
                setStep("14_signup_fill");
              }}
              state={isFilled ? "field" : "default"}
            />

            <FormInput
              label="E-mail"
              placeholder="Digite seu e-mail"
              value={isFilled ? email : ""}
              onChangeText={(txt) => {
                setEmail(txt);
                setStep("14_signup_fill");
              }}
              state={isFilled ? "field" : "default"}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FormInput
              label="Senha"
              placeholder="Digite sua senha"
              value={isFilled ? password : ""}
              onChangeText={(txt) => {
                setPassword(txt);
                setStep("14_signup_fill");
              }}
              isPassword
              state={isFilled ? "field" : "default"}
            />
          </View>

          <View style={styles.bottomButtonSection}>
            <Button
              title="Cadastrar"
              variant="primary"
              size="large"
              onPress={() => {
                if (step === "13_signup_default") {
                  setStep("14_signup_fill");
                } else {
                  setStep("15_verification");
                }
              }}
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
                {email}
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
              onPress={onSignUpSuccess}
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
    paddingTop: 8,
    paddingBottom: 32,
    gap: 26,
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
    marginTop: 28,
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
});

