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
 * Telas 16 a 22 — Fluxo Premium & Assinatura (Figma Nodes 63010:4643 a 63021:5521)
 */
export const PremiumFlowScreenView: React.FC<PremiumFlowScreenProps> = ({
  onClose,
}) => {
  const [step, setStep] = useState<PremiumStep>("16_offer");
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [paymentBrand, setPaymentBrand] = useState<PaymentBrand>("googlePay");

  const planTitle =
    selectedPlan === "monthly" ? "Plano Mensal" : "Plano Anual";
  const planPrice =
    selectedPlan === "monthly" ? "R$ 24,90/Mês" : "R$ 149,90/Ano";

  return (
    <View style={styles.screenContainer}>
      <StatusBarMock variant="white" />

      {/* Seletor rápido das telas 16 a 22 */}
      <View style={styles.subNavWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subNavScroll}
        >
          {PREMIUM_PILLS.map((p) => {
            const active = step === p.key;
            return (
              <TouchableOpacity
                key={p.key}
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
            onBackPress={() => setStep("16_offer")}
            rightAction="close"
            onRightPress={onClose}
          />

          {/* Banner Lilás (#DDC0FF) */}
          <View style={styles.purpleBanner}>
            <AppText variant="title3" color={colors.grayscale[600]}>
              Leve a Nutrição ao Próximo Nível
            </AppText>
            <AppText variant="body2" color={colors.grayscale[600]}>
              Monitoramento inteligente. Análises profundas. Resultados reais.
            </AppText>
          </View>

          {/* Card Amarelo (#F5F378) com Plano Mensal e Anual */}
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

      {/* TELA 20 — PAGAMENTO (63021:3844) */}
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
              title="Visa"
              selectable
              selected={paymentBrand === "visa"}
              onPress={() => setPaymentBrand("visa")}
            />
          </View>

          <View style={{ marginTop: 120, width: "100%" }}>
            <Button
              title="Continuar"
              variant="primary"
              size="large"
              onPress={() => setStep("21_summary")}
            />
          </View>
        </ScrollView>
      )}

      {/* TELAS 21 e 22 — RESUMO DO PEDIDO & MODAL PARABÉNS (63021:5401 / 63021:5521) */}
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

            <View style={{ marginTop: 100, width: "100%" }}>
              <Button
                title="Continuar"
                variant="primary"
                size="large"
                onPress={() => setStep("22_congrats")}
              />
            </View>
          </ScrollView>

          {step === "22_congrats" && (
            <View style={styles.modalBackdrop}>
              <View style={{ width: "100%", paddingHorizontal: 20 }}>
                <MessageModalCard
                  mode="singleAction"
                  showUser
                  userName="Mariana Costa"
                  title="Parabéns!"
                  subtitle={`Parabéns por fazer upgrade para o ${planTitle} Premium! Aproveite todos os seus novos recursos!`}
                  primaryLabel="Explorar Plano Premium"
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
    maxWidth: 428,
    alignSelf: "center",
    backgroundColor: colors.grayscale[600],
    justifyContent: "space-between",
  },
  subNavWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 6,
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
    gap: 24,
    alignItems: "center",
  },
  centerBlock: {
    alignItems: "center",
    gap: 8,
    maxWidth: 322,
  },
  giftIllustrationBox: {
    width: "100%",
    paddingVertical: 28,
    borderRadius: radii.xl,
    backgroundColor: colors.grayscale[500],
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    alignItems: "center",
    gap: 18,
  },
  giftCircle: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: colors.grayscale[400],
    alignItems: "center",
    justifyContent: "center",
  },
  purpleBanner: {
    width: "100%",
    minHeight: 128,
    borderRadius: radii.xl,
    backgroundColor: colors.accent[100], // #DDC0FF
    padding: 20,
    justifyContent: "center",
    gap: 6,
  },
  yellowPlansCard: {
    width: "100%",
    borderRadius: radii.xl,
    backgroundColor: colors.accent[200], // #F5F378
    padding: 24,
    gap: 18,
  },
  planRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  planDivider: {
    width: "100%",
    height: 1,
    backgroundColor: colors.grayscale[600],
  },
  upgradeIllustration: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.grayscale[500],
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    alignItems: "center",
    justifyContent: "center",
  },
  featuresList: {
    width: "100%",
    gap: 14,
    paddingHorizontal: 10,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryPlanCard: {
    width: "100%",
    height: 130,
    borderRadius: radii.xl,
    backgroundColor: colors.accent[200], // #F5F378
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
});

