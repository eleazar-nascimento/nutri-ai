import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { colors, typography, TypographyVariant, radii } from "@/theme";
import {
  AppText,
  NutriLogo,
  Button,
  SocialButton,
  CircleIconButton,
  IconBoxButton,
  ViewAllButton,
  FormInput,
  SearchInput,
  DropdownField,
  TextAreaField,
  Toggle,
  Checkbox,
  RadioButton,
  FilterChip,
  TopBar,
  SegmentedTabs,
  BottomMenu,
  BottomMenuTab,
  MacroIcon,
  ActionIcon,
  ArrowIcon,
  OTPInput,
  RangeSlider,
  ProfileAvatar,
  NotificationCard,
  PaymentMethodCard,
  DietCard,
  MessageModalCard,
  DatePickerCard,
  ShareSheetCard,
} from "@/components/ui";

type GuideSection =
  | "all"
  | "colors"
  | "typography"
  | "buttons"
  | "icons"
  | "forms"
  | "elements";

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <View
    style={{
      backgroundColor: colors.grayscale[400],
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderRadius: radii.lg,
      marginBottom: 16,
      gap: 2,
    }}
  >
    <AppText variant="title2" color={colors.grayscale[100]}>
      {title}
    </AppText>
    {subtitle ? (
      <AppText variant="footnote" color={colors.grayscale[200]}>
        {subtitle}
      </AppText>
    ) : null}
  </View>
);

const ColorSwatch: React.FC<{
  token: string;
  hex: string;
  label: string;
}> = ({ token, hex, label }) => (
  <View
    style={{
      width: 112,
      borderRadius: radii.lg,
      backgroundColor: colors.grayscale[600],
      borderWidth: 1,
      borderColor: colors.grayscale[400],
      overflow: "hidden",
    }}
  >
    <View
      style={{
        height: 68,
        backgroundColor: hex,
        borderBottomWidth: 1,
        borderBottomColor: colors.grayscale[500],
      }}
    />
    <View style={{ padding: 10, gap: 2 }}>
      <AppText variant="caption2" color={colors.grayscale[100]}>
        {token}
      </AppText>
      <AppText variant="footnote" color={colors.grayscale[200]}>
        {hex}
      </AppText>
      <AppText variant="footnote" color={colors.grayscale[200]} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  </View>
);

export default function StyleGuideScreen() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<GuideSection>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownValue, setDropdownValue] = useState("Dieta Cetogênica");
  const [toggleNormal, setToggleNormal] = useState(true);
  const [toggleSmall, setToggleSmall] = useState(false);
  const [checkedA, setCheckedA] = useState(true);
  const [checkedB, setCheckedB] = useState(false);
  const [radioIdx, setRadioIdx] = useState(0);
  const [periodTab, setPeriodTab] = useState(0);
  const [dietTab, setDietTab] = useState(0);
  const [bottomTab, setBottomTab] = useState<BottomMenuTab>("home");
  const [otpDigits, setOtpDigits] = useState(["4", "8", "2", ""]);
  const [selectedPayment, setSelectedPayment] = useState<
    "googlePay" | "applePay" | "visa"
  >("googlePay");
  const [dietFavorited, setDietFavorited] = useState(true);
  const [selectedDay, setSelectedDay] = useState(14);

  const sections: { key: GuideSection; label: string }[] = [
    { key: "all", label: "Tudo" },
    { key: "colors", label: "Cores" },
    { key: "typography", label: "Tipografia" },
    { key: "buttons", label: "Botões" },
    { key: "icons", label: "Ícones" },
    { key: "forms", label: "Formulários" },
    { key: "elements", label: "Elementos" },
  ];

  const show = (sec: GuideSection) =>
    activeSection === "all" || activeSection === sec;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.grayscale[600] }}>
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 480,
          alignSelf: "center",
          backgroundColor: colors.grayscale[600],
        }}
      >
        {/* Cabeçalho Fixo do Style Guide */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.grayscale[500],
            gap: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <CircleIconButton type="back" onPress={() => router.push("/")} />
              <NutriLogo variant="on" width={118} height={38} />
            </View>
            <TouchableOpacity
              onPress={() => router.push("/onboarding")}
              style={{
                backgroundColor: colors.primary[100],
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: radii.pill,
              }}
            >
              <AppText variant="footnote" color={colors.grayscale[100]}>
                Ver Telas →
              </AppText>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {sections.map((s) => (
              <FilterChip
                key={s.key}
                label={s.label}
                active={activeSection === s.key}
                onPress={() => setActiveSection(s.key)}
              />
            ))}
          </ScrollView>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 120,
            gap: 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. LOGO */}
          {show("colors") && (
            <View style={{ gap: 16 }}>
              <SectionHeader
                title="Logo Oficial"
                subtitle="Figma Node 4579:586 • Variantes Dark & Light"
              />
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View
                  style={{
                    flex: 1,
                    height: 90,
                    borderRadius: radii.lg,
                    backgroundColor: colors.grayscale[500],
                    borderWidth: 1,
                    borderColor: colors.grayscale[400],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <NutriLogo variant="on" width={138} height={46} />
                </View>
                <View
                  style={{
                    flex: 1,
                    height: 90,
                    borderRadius: radii.lg,
                    backgroundColor: colors.accent[100],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <NutriLogo variant="off" width={138} height={46} />
                </View>
              </View>
            </View>
          )}

          {/* 2. PALETA DE CORES */}
          {show("colors") && (
            <View style={{ gap: 16 }}>
              <SectionHeader
                title="Paleta de Cores"
                subtitle="Figma Node 105:224 • Variáveis em src/theme/colors.ts"
              />

              <AppText variant="headline">Primária & Mensagens</AppText>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                <ColorSwatch
                  token="Primary/100"
                  hex={colors.primary[100]}
                  label="Laranja Nutri"
                />
                <ColorSwatch
                  token="Message/100"
                  hex={colors.message[100]}
                  label="Sucesso (Verde)"
                />
                <ColorSwatch
                  token="Message/200"
                  hex={colors.message[200]}
                  label="Erro (Vermelho)"
                />
              </View>

              <AppText variant="headline">Escala de Cinza (Grayscale)</AppText>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                <ColorSwatch
                  token="Gray/600"
                  hex={colors.grayscale[600]}
                  label="Fundo Principal"
                />
                <ColorSwatch
                  token="Gray/500"
                  hex={colors.grayscale[500]}
                  label="Superfície Card"
                />
                <ColorSwatch
                  token="Gray/400"
                  hex={colors.grayscale[400]}
                  label="Bordas / Menu"
                />
                <ColorSwatch
                  token="Gray/300"
                  hex={colors.grayscale[300]}
                  label="Inativo"
                />
                <ColorSwatch
                  token="Gray/200"
                  hex={colors.grayscale[200]}
                  label="Secundário"
                />
                <ColorSwatch
                  token="Gray/100"
                  hex={colors.grayscale[100]}
                  label="Texto Principal"
                />
              </View>

              <AppText variant="headline">Cores de Destaque (Accent / Macros)</AppText>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                <ColorSwatch
                  token="Accent/100"
                  hex={colors.accent[100]}
                  label="Lilás (Carbo)"
                />
                <ColorSwatch
                  token="Accent/200"
                  hex={colors.accent[200]}
                  label="Amarelo (Gordura)"
                />
                <ColorSwatch
                  token="Accent/300"
                  hex={colors.accent[300]}
                  label="Verde (Proteína)"
                />
                <ColorSwatch
                  token="Accent/400"
                  hex={colors.accent[400]}
                  label="Coral (Calorias)"
                />
              </View>
            </View>
          )}

          {/* 3. TIPOGRAFIA */}
          {show("typography") && (
            <View style={{ gap: 12 }}>
              <SectionHeader
                title="Tipografia • Space Grotesk"
                subtitle="Figma Node 880:991 • 12 Estilos Tipográficos"
              />
              {(Object.keys(typography) as TypographyVariant[]).map(
                (variantKey, idx) => {
                  const spec = typography[variantKey];
                  return (
                    <View
                      key={variantKey}
                      style={{
                        backgroundColor:
                          idx % 2 === 0
                            ? colors.grayscale[500]
                            : colors.grayscale[600],
                        borderRadius: radii.md,
                        padding: 14,
                        borderWidth: 1,
                        borderColor: colors.grayscale[400],
                        gap: 4,
                      }}
                    >
                      <AppText variant={variantKey}>
                        {spec.labelPt}
                      </AppText>
                      <AppText variant="footnote" color={colors.grayscale[200]}>
                        {spec.weightLabel} • {spec.fontSize}px / Line-height{" "}
                        {spec.lineHeight}px
                      </AppText>
                    </View>
                  );
                }
              )}
            </View>
          )}

          {/* 4. BOTÕES */}
          {show("buttons") && (
            <View style={{ gap: 16 }}>
              <SectionHeader
                title="Botões"
                subtitle="Figma Node 880:1999 • Primary, Secondary, Outline & Social"
              />

              <AppText variant="headline">Tamanho Grande (Large • 50px)</AppText>
              <View style={{ gap: 10 }}>
                <Button title="Botão Primário" variant="primary" size="large" />
                <Button
                  title="Botão Secundário"
                  variant="secondary"
                  size="large"
                />
                <Button
                  title="Botão Contorno (Outline)"
                  variant="outline"
                  size="large"
                />
              </View>

              <AppText variant="headline">Tamanho Médio (Medium • 44px)</AppText>
              <View style={{ gap: 10 }}>
                <Button title="Botão Primário" variant="primary" size="medium" />
                <Button
                  title="Botão Secundário"
                  variant="secondary"
                  size="medium"
                />
                <Button
                  title="Botão Contorno (Outline)"
                  variant="outline"
                  size="medium"
                />
              </View>

              <AppText variant="headline">Tamanho Pequeno (Small • 34px)</AppText>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Button title="Primário" variant="primary" size="small" />
                </View>
                <View style={{ flex: 1 }}>
                  <Button title="Secundário" variant="secondary" size="small" />
                </View>
                <View style={{ flex: 1 }}>
                  <Button title="Contorno" variant="outline" size="small" />
                </View>
              </View>

              <AppText variant="headline">Login Social</AppText>
              <View style={{ gap: 10 }}>
                <SocialButton provider="google" />
                <SocialButton provider="apple" />
              </View>

              <AppText variant="headline">Botões de Ação Rápida & Ícone</AppText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <CircleIconButton type="back" />
                <CircleIconButton type="close" />
                <CircleIconButton type="favorite" favorited />
                <CircleIconButton type="more" />
                <IconBoxButton active icon="plus" />
                <IconBoxButton active={false} icon="back" variant="dark" />
                <IconBoxButton active={false} icon="back" variant="white" />
                <ViewAllButton label="Ver tudo" />
              </View>
            </View>
          )}

          {/* 5. ÍCONES */}
          {show("icons") && (
            <View style={{ gap: 16 }}>
              <SectionHeader
                title="Biblioteca de Ícones"
                subtitle="Figma Node 880:2927 • Macronutrientes, Menu & Ações"
              />

              <AppText variant="headline">Macronutrientes (SVG Oficial)</AppText>
              <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
                {(
                  [
                    { type: "calories", label: "Calorias", bg: colors.accent[400] },
                    { type: "protein", label: "Proteínas", bg: colors.accent[300] },
                    { type: "carbs", label: "Carboidratos", bg: colors.accent[100] },
                    { type: "fat", label: "Gorduras", bg: colors.accent[200] },
                  ] as const
                ).map((m) => (
                  <View
                    key={m.type}
                    style={{
                      flex: 1,
                      minWidth: 150,
                      backgroundColor: colors.grayscale[500],
                      borderRadius: radii.lg,
                      borderWidth: 1,
                      borderColor: colors.grayscale[400],
                      padding: 14,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 21,
                        backgroundColor: colors.grayscale[400],
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MacroIcon type={m.type} size={22} color={m.bg} />
                    </View>
                    <AppText variant="subheadline">{m.label}</AppText>
                  </View>
                ))}
              </View>

              <AppText variant="headline">Ícones de Ação & Sistema</AppText>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 12,
                  backgroundColor: colors.grayscale[500],
                  padding: 16,
                  borderRadius: radii.lg,
                  borderWidth: 1,
                  borderColor: colors.grayscale[400],
                }}
              >
                {(
                  [
                    "notification",
                    "close",
                    "camera",
                    "more",
                    "favorite",
                    "heart-fill",
                    "archive",
                    "goal",
                    "premium",
                    "tick-circle",
                    "scan",
                    "gallery",
                  ] as const
                ).map((ic) => (
                  <View
                    key={ic}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: radii.md,
                      backgroundColor: colors.grayscale[400],
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ActionIcon name={ic} size={22} />
                  </View>
                ))}
                {(["left", "right", "up", "down"] as const).map((dir) => (
                  <View
                    key={dir}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: radii.md,
                      backgroundColor: colors.grayscale[400],
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ArrowIcon direction={dir} size={22} />
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 6. FORMULÁRIOS */}
          {show("forms") && (
            <View style={{ gap: 18 }}>
              <SectionHeader
                title="Formulários & Controles"
                subtitle="Figma Node 880:3781 • Inputs, Busca, Dropdowns, Toggles"
              />

              <SearchInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar refeição, ingrediente..."
              />

              <FormInput
                label="Estado Padrão (Default)"
                placeholder="Digite seu primeiro nome"
                state="default"
              />

              <FormInput
                label="Estado Ativo (Active)"
                value="Mariana Costa"
                state="active"
              />

              <FormInput
                label="Senha com Visualização"
                value="NutriAI2026"
                isPassword
                state="field"
              />

              <FormInput
                label="Telefone com DDI"
                value="(11) 99876-5432"
                isPhone
                countryCode="+55"
                state="field"
              />

              <FormInput
                label="Estado de Erro (Error)"
                value="email-invalido@"
                state="error"
                errorMessage="Por favor, insira um endereço de e-mail válido."
              />

              <FormInput
                label="Estado Desabilitado (Disabled)"
                value="Campo bloqueado"
                state="disabled"
              />

              <DropdownField
                label="Plano Alimentar (Dropdown)"
                value={dropdownValue}
                state="selected"
                onSelect={setDropdownValue}
              />

              <TextAreaField
                label="Área de Texto (Master Text Area)"
                placeholder="Anote como você se sentiu após esta refeição..."
              />

              <AppText variant="headline">Toggles, Checkboxes e Radios</AppText>
              <View
                style={{
                  backgroundColor: colors.grayscale[500],
                  borderRadius: radii.lg,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.grayscale[400],
                  gap: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body2">Lembretes de Refeição (Normal)</AppText>
                  <Toggle value={toggleNormal} onValueChange={setToggleNormal} />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <AppText variant="body2">Modo Economia IA (Small)</AppText>
                  <Toggle
                    size="small"
                    value={toggleSmall}
                    onValueChange={setToggleSmall}
                  />
                </View>

                <View style={{ flexDirection: "row", gap: 24 }}>
                  <Checkbox
                    checked={checkedA}
                    onChange={setCheckedA}
                    label="Sem Glúten"
                  />
                  <Checkbox
                    checked={checkedB}
                    onChange={setCheckedB}
                    label="Vegano"
                  />
                </View>

                <View style={{ flexDirection: "row", gap: 24 }}>
                  <RadioButton
                    selected={radioIdx === 0}
                    onSelect={() => setRadioIdx(0)}
                    label="Perder Peso"
                  />
                  <RadioButton
                    selected={radioIdx === 1}
                    onSelect={() => setRadioIdx(1)}
                    label="Ganhar Massa"
                  />
                </View>
              </View>
            </View>
          )}

          {/* 7. ELEMENTOS, CARDS & NAVEGAÇÃO */}
          {show("elements") && (
            <View style={{ gap: 22 }}>
              <SectionHeader
                title="Elementos, Cards & Módulos"
                subtitle="Figma Node 885:4421 • TopBar, Tabs, Diet Card, Modais"
              />

              <AppText variant="headline">Barra Superior (TopBar)</AppText>
              <View
                style={{
                  backgroundColor: colors.grayscale[500],
                  padding: 14,
                  borderRadius: radii.lg,
                  borderWidth: 1,
                  borderColor: colors.grayscale[400],
                }}
              >
                <TopBar title="Notificações" rightAction="close" />
              </View>

              <AppText variant="headline">Abas Segmentadas (Tab/3 e Tab/2)</AppText>
              <SegmentedTabs
                tabs={["Diário", "Semanal", "Mensal"]}
                activeIndex={periodTab}
                onChange={setPeriodTab}
              />
              <SegmentedTabs
                tabs={["Todas as Dietas", "Minhas Dietas"]}
                activeIndex={dietTab}
                onChange={setDietTab}
              />

              <AppText variant="headline">Código de Verificação (OTP Outline)</AppText>
              <OTPInput value={otpDigits} onChange={setOtpDigits} />

              <AppText variant="headline">Seletor de Meta / Range Slider</AppText>
              <RangeSlider
                minLabel="0 kcal"
                currentLabel="1.850 kcal"
                maxLabel="3.000 kcal"
                progress={0.62}
              />

              <AppText variant="headline">Avatares de Perfil (Profile)</AppText>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <ProfileAvatar type="image" size={88} />
                <ProfileAvatar type="name" initial="M" size={88} />
                <ProfileAvatar type="default" size={88} />
              </View>

              <AppText variant="headline">Card de Notificação</AppText>
              <NotificationCard
                message="Hora do seu almoço – Não esqueça de registrar sua refeição."
                time="Há 10 min"
              />

              <AppText variant="headline">Card de Dieta (Diets Card)</AppText>
              <DietCard
                title="Partida Cetogênica (Keto)"
                calories="1.800 kcal"
                protein="Proteína: 70g"
                carbs="Carbo: 30g"
                fat="Gordura: 105g"
                favorited={dietFavorited}
                onFavoriteToggle={() => setDietFavorited((f) => !f)}
              />

              <AppText variant="headline">Métodos de Pagamento</AppText>
              <View style={{ gap: 12 }}>
                <PaymentMethodCard
                  brand="googlePay"
                  selectable
                  selected={selectedPayment === "googlePay"}
                  onPress={() => setSelectedPayment("googlePay")}
                />
                <PaymentMethodCard
                  brand="applePay"
                  selectable
                  selected={selectedPayment === "applePay"}
                  onPress={() => setSelectedPayment("applePay")}
                />
                <PaymentMethodCard
                  brand="visa"
                  selectable
                  selected={selectedPayment === "visa"}
                  onPress={() => setSelectedPayment("visa")}
                />
              </View>

              <AppText variant="headline">Calendário & Horário (DatePicker)</AppText>
              <DatePickerCard
                darkMode
                monthLabel="Outubro 2026"
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
                timeValue="12:30"
              />

              <AppText variant="headline">Modais de Mensagem & Confirmação</AppText>
              <MessageModalCard
                mode="singleAction"
                title="Senha alterada"
                subtitle="Sua senha foi atualizada com sucesso! Agora você já pode entrar com suas novas credenciais."
                primaryLabel="Entrar"
              />
              <MessageModalCard
                mode="dualAction"
                showUser
                userName="Mariana Costa"
                title="Deseja sair da conta?"
                subtitle="Você precisará inserir suas credenciais novamente para acessar seu diário alimentar."
                primaryLabel="Sair"
                secondaryLabel="Cancelar"
              />

              <AppText variant="headline">Compartilhar Link (Share Sheet)</AppText>
              <ShareSheetCard />
            </View>
          )}
        </ScrollView>

        {/* Menu Inferior Flutuante Fixo */}
        <View
          style={{
            position: "absolute",
            bottom: 18,
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          <BottomMenu activeTab={bottomTab} onTabPress={setBottomTab} />
        </View>
      </View>
    </SafeAreaView>
  );
}

