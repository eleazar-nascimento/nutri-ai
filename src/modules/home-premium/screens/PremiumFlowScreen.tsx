import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Gift, Crown } from "lucide-react-native";
import { colors, radii } from "@/theme";
import {
  AppText,
  StatusBarMock,
  HomeIndicator,
  TopBar,
  Button,
  ArrowIcon,
  ActionIcon,
  PaymentMethodCard,
  PaymentBrand,
  MessageModalCard,
} from "@/components/ui";
import { DemoStepPills } from "@/components/layout";
import { useAppStore, useAccount } from "@/store";

export type PremiumStep =
  | "16_offer"
  | "17_plans"
  | "18_monthly"
  | "19_annual"
  | "20_payment"
  | "21_summary"
  | "22_congrats";

const PREMIUM_PILLS: { key: PremiumStep; label: string }[] = [
  { key: "16_offer", label: "16. Oferta 50%" },
  { key: "17_plans", label: "17. Planos" },
  { key: "18_monthly", label: "18. Mensal" },
  { key: "19_annual", label: "19. Anual" },
  { key: "20_payment", label: "20. Pagamento" },
  { key: "21_summary", label: "21. Resumo" },
  { key: "22_congrats", label: "22. Parabéns" },
];

const MONTHLY_FEATURES = [
  "Sugestões de Refeições com IA",
  "Detalhamento Avançado de Nutrientes",
  "Acesso a Todas as Dietas Premium",
  "Alimentos e Refeições Salvos Ilimitados",
  "Relatórios Semanais de Progresso IA",
];

const ANNUAL_FEATURES = [
  "Sugestões de Refeições com IA",
  "Análise Nutricional Completa",
  "Programas de Dieta Exclusivos",
  "Refeições e Alimentos Salvos Ilimitados",
  "Relatórios de Progresso com IA",
];

export interface PremiumFlowScreenProps {
  onClose?: () => void;
}

/**
 * Telas 16 a 22 — Fluxo Premium & Assinatura
 */
export const PremiumFlowScreenView: React.FC<PremiumFlowScreenProps> = ({
  onClose,
}) => {
  const { demoMode, subscribe, setSelectedPayment } = useAppStore();
  const account = useAccount();

  const [step, setStep] = useState<PremiumStep>("17_plans");
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [paymentBrand, setPaymentBrand] = useState<PaymentBrand>(
    (account.selectedPayment as PaymentBrand) || "googlePay"
  );

  const planTitle =
    selectedPlan === "monthly" ? "Plano Mensal" : "Plano Anual";
  const planPrice =
    selectedPlan === "monthly" ? "R$ 24,90/Mês" : "R$ 149,90/Ano";

  const handleConfirmSubscription = () => {
    setSelectedPayment(paymentBrand);
    subscribe(selectedPlan);
    setStep("22_congrats");
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBarMock variant="white" />

      {/* Pílulas de etapas (visíveis apenas no Modo Demo) */}
      <DemoStepPills
        steps={PREMIUM_PILLS}
        active={step}
        onChange={(k: PremiumStep) => setStep(k)}
      />

      {/* TELA 16 — OFERTA ÚNICA (63010:4643) */}
      {step === "16_offer" && (
        <ScrollView
          contentContainerStyle={styles.contentScroll}
          showsVerticalScrollIndicator={false}
        >
          <TopBar
            title="Escaneando..."
            onBackPress={onClose}
            rightAction="close"
            onRightPress={onClose}
          />

          <View style={styles.centerBlock}>
            <AppText
              variant="title1"
              color={colors.grayscale[100]}
              align="center"
            >
              Oferta Única
            </AppText>
            <AppText
              variant="body2"
              color={colors.grayscale[200]}
              align="center"
            >
              Desbloqueie uma nutrição mais inteligente com ferramentas de IA.
            </AppText>
          </View>

          <View style={styles.giftIllustrationBox}>
            <View style={styles.giftCircle}>
              <Gift size={68} color={colors.accent[200]} />
            </View>
            <AppText
              variant="title1"
              color={colors.grayscale[100]}
              align="center"
            >
              50% OFF no 1º Ano
            </AppText>
          </View>

          <View style={{ width: "100%", gap: 14, marginTop: 16 }}>
            <Button
              title="Assinar o Premium"
              variant="primary"
              size="large"
              onPress={() => setStep("17_plans")}
            />
            <TouchableOpacity
              onPress={onClose}
              style={{ alignSelf: "center", paddingVertical: 6 }}
            >
              <AppText variant="headline" color={colors.grayscale[300]}>
                Pular
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* TELA 17 — SELEÇÃO DE PLANOS PREMIUM (63012:4472) */}
      {step === "17_plans" && (
        <ScrollView
          contentContainerStyle={styles.contentScroll}
          showsVerticalScrollIndicator={false}
        >
          <TopBar
            title="Premium"
            onBackPress={onClose}
            rightAction="close"
            onRightPress={onClose}
          />

          {/* Banner Lilás */}
          <View style={styles.purpleBanner}>
            <AppText variant="title3" color={colors.grayscale[600]}>
              Leve a Nutrição ao Próximo Nível
            </AppText>
            <AppText variant="body2" color={colors.grayscale[600]}>
              Monitoramento inteligente. Análises profundas. Resultados reais.
            </AppText>
          </View>

          {/* Card Amarelo com Plano Mensal e Anual */}
          <View style={styles.yellowPlansCard}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setSelectedPlan("monthly");
                setStep("18_monthly");
              }}
              style={styles.planRow}
            >
              <View style={{ gap: 4 }}>
                <AppText variant="title3" color={colors.grayscale[600]}>
                  Plano Mensal
                </AppText>
                <AppText variant="largeTitle" color={colors.grayscale[600]}>
                  R$ 24,90/Mês
                </AppText>
              </View>
              <ArrowIcon
                direction="right"
                size={24}
                color={colors.grayscale[600]}
              />
            </TouchableOpacity>

            <View style={styles.planDivider} />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setSelectedPlan("annual");
                setStep("19_annual");
              }}
              style={styles.planRow}
            >
              <View style={{ gap: 4 }}>
                <AppText variant="title3" color={colors.grayscale[600]}>
                  Plano Anual
                </AppText>
                <AppText variant="largeTitle" color={colors.grayscale[600]}>
                  R$ 149,90/Ano
                </AppText>
              </View>
              <ArrowIcon
                direction="right"
                size={24}
                color={colors.grayscale[600]}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* TELAS 18 e 19 — DETALHES DO PLANO MENSAL / ANUAL */}
      {(step === "18_monthly" || step === "19_annual") && (
        <ScrollView
          contentContainerStyle={styles.contentScroll}
          showsVerticalScrollIndicator={false}
        >
          <TopBar
            title={step === "18_monthly" ? "Plano Mensal" : "Plano Anual"}
            onBackPress={() => setStep("17_plans")}
            rightAction="close"
            onRightPress={onClose}
          />

          <View style={styles.upgradeIllustration}>
            <Crown size={64} color={colors.accent[200]} />
          </View>

          <AppText
            variant="title1"
            color={colors.grayscale[100]}
            align="center"
          >
            Faça Upgrade para o Premium
          </AppText>

          <View style={styles.featuresList}>
            {(step === "18_monthly" ? MONTHLY_FEATURES : ANNUAL_FEATURES).map(
              (feat) => (
                <View key={feat} style={styles.featureRow}>
                  <ActionIcon name="tick-circle" size={22} />
                  <AppText variant="body" color={colors.grayscale[100]}>
                    {feat}
                  </AppText>
                </View>
              )
            )}
          </View>

          <Button
            title={
              step === "18_monthly"
                ? "Continuar com R$ 24,90"
                : "Continuar com R$ 149,90"
            }
            variant="primary"
            size="large"
            onPress={() => {
              setSelectedPlan(step === "18_monthly" ? "monthly" : "annual");
              setStep("20_payment");
            }}
          />
        </ScrollView>
      )}

      {/* TELA 20 — PAGAMENTO */}
      {step === "20_payment" && (
        <ScrollView
          contentContainerStyle={styles.contentScroll}
          showsVerticalScrollIndicator={false}
        >
          <TopBar
            title="Pagamento"
            onBackPress={() =>
              setStep(selectedPlan === "monthly" ? "18_monthly" : "19_annual")
            }
            rightAction="close"
            onRightPress={onClose}
          />

          <View style={{ gap: 14, width: "100%" }}>
            <PaymentMethodCard
              brand="googlePay"
              selectable
              selected={paymentBrand === "googlePay"}
              onPress={() => setPaymentBrand("googlePay")}
            />
            <PaymentMethodCard
              brand="applePay"
              selectable
              selected={paymentBrand === "applePay"}
              onPress={() => setPaymentBrand("applePay")}
            />
            <PaymentMethodCard
              brand="visa"
              title="Visa (Final 8910)"
              selectable
              selected={paymentBrand === "visa"}
              onPress={() => setPaymentBrand("visa")}
            />
          </View>

          <View style={{ marginTop: 80, width: "100%" }}>
            <Button
              title="Continuar"
              variant="primary"
              size="large"
              onPress={() => setStep("21_summary")}
            />
          </View>
        </ScrollView>
      )}

      {/* TELAS 21 e 22 — RESUMO DO PEDIDO & MODAL PARABÉNS */}
      {(step === "21_summary" || step === "22_congrats") && (
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.contentScroll}
            showsVerticalScrollIndicator={false}
          >
            <TopBar
              title="Resumo do Pedido"
              onBackPress={() => setStep("20_payment")}
              rightAction="close"
              onRightPress={onClose}
            />

            <View style={{ width: "100%", gap: 12 }}>
              <AppText variant="title2" color={colors.grayscale[100]}>
                Seu Plano
              </AppText>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setStep("17_plans")}
                style={styles.summaryPlanCard}
              >
                <View style={{ gap: 4 }}>
                  <AppText variant="title3" color={colors.grayscale[600]}>
                    {planTitle}
                  </AppText>
                  <AppText variant="largeTitle" color={colors.grayscale[600]}>
                    {planPrice}
                  </AppText>
                </View>
                <ArrowIcon
                  direction="right"
                  size={24}
                  color={colors.grayscale[600]}
                />
              </TouchableOpacity>
            </View>

            <View style={{ width: "100%", gap: 12 }}>
              <AppText variant="title2" color={colors.grayscale[100]}>
                Método de Pagamento
              </AppText>
              <PaymentMethodCard
                brand={paymentBrand}
                onPress={() => setStep("20_payment")}
              />
            </View>

            <View style={{ marginTop: 60, width: "100%" }}>
              <Button
                title="Confirmar e Assinar"
                variant="primary"
                size="large"
                onPress={handleConfirmSubscription}
              />
            </View>
          </ScrollView>

          {/* Modal 22_Congrats */}
          {step === "22_congrats" && (
            <View style={styles.modalBackdrop}>
              <View style={{ width: "100%", paddingHorizontal: 20 }}>
                <MessageModalCard
                  mode="singleAction"
                  title="Parabéns!"
                  subtitle="Sua assinatura Premium está ativa! Agora você tem acesso a scans ilimitados com IA e todas as dietas exclusivas."
                  primaryLabel="Começar a Usar"
                  onPrimaryPress={onClose}
                />
              </View>
            </View>
          )}
        </View>
      )}

      <HomeIndicator variant="light" />
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
    gap: 22,
    alignItems: "center",
  },
  centerBlock: {
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  giftIllustrationBox: {
    width: "100%",
    height: 250,
    borderRadius: radii.xl,
    backgroundColor: colors.grayscale[500],
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  giftCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.grayscale[400],
    alignItems: "center",
    justifyContent: "center",
  },
  purpleBanner: {
    width: "100%",
    backgroundColor: colors.accent[100],
    borderRadius: radii.xl,
    padding: 20,
    gap: 6,
  },
  yellowPlansCard: {
    width: "100%",
    backgroundColor: colors.accent[200],
    borderRadius: radii.xl,
    padding: 20,
    gap: 16,
  },
  planRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  planDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(18,18,18,0.15)",
  },
  upgradeIllustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.grayscale[500],
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  featuresList: {
    width: "100%",
    gap: 14,
    backgroundColor: colors.grayscale[500],
    borderRadius: radii.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.grayscale[400],
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryPlanCard: {
    width: "100%",
    backgroundColor: colors.accent[200],
    borderRadius: radii.xl,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
});
