import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { Sparkles } from "lucide-react-native";
import { colors, radii } from "@/theme";
import {
  AppText,
  ArrowIcon,
  BottomMenu,
  BottomMenuTab,
  Button,
  DatePickerCard,
  DietCard,
  DropdownField,
  FormInput,
  MessageModalCard,
  PaymentMethodCard,
  ProfileAvatar,
  Toggle,
  TopBar,
} from "@/components/ui";
import { DemoStepPills } from "@/components/layout";
import {
  useAppStore,
  useAccount,
  DIET_CATALOG,
  DietPlan,
} from "@/store";

export type SettingsSubScreen =
  | "33_settings"
  | "34_profile"
  | "35_change_password"
  | "36_password_changed"
  | "37_notification"
  | "38_payment_method"
  | "39_add_card"
  | "40_favorite_empty"
  | "41_favorite"
  | "42_more"
  | "43_terms"
  | "44_privacy"
  | "45_help"
  | "46_delete_account"
  | "47_logout";

const EmptyFavoritesIllustration: React.FC = () => (
  <Svg width={220} height={180} viewBox="0 0 254 216" fill="none">
    <Circle
      cx={127}
      cy={112}
      r={74}
      fill={colors.grayscale[500]}
      opacity={0.75}
    />
    <Rect
      x={68}
      y={56}
      width={118}
      height={110}
      rx={22}
      fill={colors.grayscale[400]}
      stroke={colors.primary[100]}
      strokeWidth={2}
    />
    <Path
      d="M127 136C127 136 95 116 95 95C95 84.5 103.5 76 114 76C120.2 76 125.7 79 127 83.8C128.3 79 133.8 76 140 76C150.5 76 159 84.5 159 95C159 116 127 136 127 136Z"
      fill={colors.primary[100]}
      opacity={0.9}
    />
    <Circle cx={62} cy={62} r={8} fill={colors.accent[200]} />
    <Circle cx={194} cy={80} r={6} fill={colors.primary[100]} />
    <Circle cx={182} cy={156} r={9} fill={colors.accent[200]} />
  </Svg>
);

interface SettingsRowProps {
  label: string;
  onPress: () => void;
  danger?: boolean;
  showDivider?: boolean;
}

const SettingsMenuRow: React.FC<SettingsRowProps> = ({
  label,
  onPress,
  danger = false,
  showDivider = false,
}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={[styles.settingsRow, showDivider && styles.settingsRowDivider]}
  >
    <AppText
      variant="body"
      color={danger ? colors.message[200] : colors.grayscale[100]}
    >
      {label}
    </AppText>
    <ArrowIcon
      direction="right"
      size={20}
      color={danger ? colors.message[200] : colors.grayscale[200]}
    />
  </TouchableOpacity>
);

export const SettingsFlowScreen: React.FC = () => {
  const router = useRouter();
  const {
    demoMode,
    setDemoMode,
    updateProfile,
    changePassword,
    setNotificationPref,
    setSelectedPayment,
    addCard,
    toggleFavoriteDiet,
    deleteAccount,
    logout,
  } = useAppStore();
  const account = useAccount();

  const [subScreen, setSubScreen] = useState<SettingsSubScreen>("33_settings");

  // Estado 34_My Profile
  const [profileName, setProfileName] = useState(account.profile.name);
  const [profileEmail, setProfileEmail] = useState(account.profile.email);
  const [profileDob, setProfileDob] = useState(account.profile.birthDate);
  const [profileHeight, setProfileHeight] = useState(
    `${(account.profile.heightCm / 100).toFixed(2).replace(".", ",")} m`
  );
  const [profileGender, setProfileGender] = useState(
    account.profile.gender || "Feminino"
  );
  const [profileWeight, setProfileWeight] = useState(
    `${Math.round(account.profile.weightKg)} kg`
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState(21);

  // Estado 35_Change Password
  const [newPassword, setNewPassword] = useState("Nutri@123");
  const [confirmPassword, setConfirmPassword] = useState("Nutri@123");
  const [passwordError, setPasswordError] = useState<string | undefined>();

  // Estado 38_Payment Method & 39_Add New Card
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8910");
  const [cardHolder, setCardHolder] = useState(account.profile.name);
  const [cardExpiry, setCardExpiry] = useState("21-05-2028");
  const [cardCvv, setCardCvv] = useState("425");

  // Dietas Favoritas filtradas do catálogo pela store
  const favoriteDiets = useMemo(() => {
    return DIET_CATALOG.filter((d) => account.favoriteDietIds.includes(d.id));
  }, [account.favoriteDietIds]);

  const handleBottomTabPress = (tab: BottomMenuTab) => {
    if (tab === "home") router.push("/home" as any);
    else if (tab === "analysis") router.push("/analysis" as any);
    else if (tab === "scan") router.push("/scan" as any);
    else if (tab === "diet") router.push("/diets" as any);
    else if (tab === "settings") setSubScreen("33_settings");
  };

  const handleSaveProfile = () => {
    const rawHeight = parseFloat(
      profileHeight.replace(" m", "").replace(",", ".")
    );
    const heightCm = !isNaN(rawHeight) ? Math.round(rawHeight * 100) : 162;
    const rawWeight = parseFloat(
      profileWeight.replace(" kg", "").replace(",", ".")
    );
    const weightKg = !isNaN(rawWeight) ? rawWeight : 56;
    const gender = profileGender as "Feminino" | "Masculino" | "Outro";

    updateProfile({
      name: profileName.trim(),
      email: profileEmail.trim(),
      birthDate: profileDob,
      heightCm,
      weightKg,
      gender,
    });
    setSubScreen("33_settings");
  };

  const handleChangePasswordSubmit = () => {
    setPasswordError(undefined);
    if (newPassword.length < 6) {
      setPasswordError("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas digitadas não coincidem.");
      return;
    }
    const res = changePassword(account.password || "", newPassword);
    if (!res.ok) {
      setPasswordError(res.error);
      return;
    }
    setSubScreen("36_password_changed");
  };

  const handleAddNewCardSubmit = () => {
    const last4 = cardNumber.replace(/\D/g, "").slice(-4) || "8910";
    addCard({
      brand: "visa",
      last4,
      holderName: cardHolder,
      expiry: cardExpiry,
    });
    setSubScreen("38_payment_method");
  };

  const handleConfirmLogout = () => {
    logout();
    router.replace("/login" as any);
  };

  const handleConfirmDeleteAccount = () => {
    deleteAccount();
    router.replace("/" as any);
  };

  const subScreenTabs: { key: SettingsSubScreen; label: string }[] = [
    { key: "33_settings", label: "33. Ajustes" },
    { key: "34_profile", label: "34. Meu Perfil" },
    { key: "35_change_password", label: "35. Alterar Senha" },
    { key: "36_password_changed", label: "36. Senha Alterada" },
    { key: "37_notification", label: "37. Notificações" },
    { key: "38_payment_method", label: "38. Pagamento" },
    { key: "39_add_card", label: "39. Novo Cartão" },
    { key: "40_favorite_empty", label: "40. Fav Vazio" },
    { key: "41_favorite", label: "41. Favoritos" },
    { key: "42_more", label: "42. Mais" },
    { key: "43_terms", label: "43. Termos" },
    { key: "44_privacy", label: "44. Privacidade" },
    { key: "45_help", label: "45. Ajuda" },
    { key: "46_delete_account", label: "46. Excluir Conta" },
    { key: "47_logout", label: "47. Sair" },
  ];

  // Conteúdo base de 33_Settings
  const renderSettingsMainContent = () => (
    <>
      <View style={styles.topBarWrapper}>
        <TopBar
          title="Ajustes"
          onBackPress={() => router.push("/home" as any)}
          rightAction="close"
          onRightPress={() => router.push("/home" as any)}
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContentWithBottom}
        showsVerticalScrollIndicator={false}
      >
        {/* Card do Usuário */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setSubScreen("34_profile")}
          style={styles.userCard}
        >
          <View style={styles.userCardInner}>
            <ProfileAvatar
              type="image"
              size={54}
              showEditBadge={false}
              imageUri={account.profile.avatarUri}
            />
            <View style={{ flex: 1, gap: 4 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <AppText variant="headline" color={colors.grayscale[100]}>
                  {account.profile.name}
                </AppText>
                {account.subscription.plan !== "none" ? (
                  <View style={styles.proPill}>
                    <Sparkles size={10} color={colors.grayscale[600]} />
                    <AppText
                      variant="caption2"
                      color={colors.grayscale[600]}
                      style={{ fontSize: 10, fontWeight: "700" }}
                    >
                      PRO
                    </AppText>
                  </View>
                ) : null}
              </View>
              <AppText variant="body2" color={colors.grayscale[200]}>
                {account.profile.email}
              </AppText>
            </View>
            <ArrowIcon
              direction="right"
              size={20}
              color={colors.grayscale[200]}
            />
          </View>
        </TouchableOpacity>

        {/* Toggle Modo Portfólio / Telas do Figma */}
        <View style={styles.groupCard}>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1, gap: 2, paddingRight: 10 }}>
              <AppText variant="body" color={colors.grayscale[100]}>
                Modo Portfólio (Telas do Figma)
              </AppText>
              <AppText variant="footnote" color={colors.grayscale[200]}>
                Exibe as pílulas numéricas de navegação (05_, 23_, 33_, etc.)
              </AppText>
            </View>
            <Toggle
              size="small"
              value={demoMode}
              onValueChange={setDemoMode}
            />
          </View>
        </View>

        {/* Menu Principal */}
        <View style={styles.groupCard}>
          <SettingsMenuRow
            label="Perfil"
            onPress={() => setSubScreen("34_profile")}
            showDivider
          />
          <SettingsMenuRow
            label="Alterar Senha"
            onPress={() => setSubScreen("35_change_password")}
            showDivider
          />
          <SettingsMenuRow
            label="Notificações"
            onPress={() => setSubScreen("37_notification")}
            showDivider
          />
          <SettingsMenuRow
            label="Método de Pagamento"
            onPress={() => setSubScreen("38_payment_method")}
            showDivider
          />
          <SettingsMenuRow
            label="Favoritos"
            onPress={() =>
              setSubScreen(
                favoriteDiets.length > 0 ? "41_favorite" : "40_favorite_empty"
              )
            }
          />
        </View>

        {/* Mais */}
        <View style={styles.groupCard}>
          <SettingsMenuRow
            label="Mais (Termos, Privacidade & Ajuda)"
            onPress={() => setSubScreen("42_more")}
          />
        </View>

        {/* Sair da Conta */}
        <View style={styles.groupCard}>
          <SettingsMenuRow
            label="Sair da Conta"
            danger
            onPress={() => setSubScreen("47_logout")}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomMenuFixed}>
        <BottomMenu activeTab="settings" onTabPress={handleBottomTabPress} />
      </View>
    </>
  );

  // Conteúdo base de 42_More
  const renderMoreContent = () => (
    <>
      <View style={styles.topBarWrapper}>
        <TopBar
          title="Mais"
          onBackPress={() => setSubScreen("33_settings")}
          rightAction="close"
          onRightPress={() => setSubScreen("33_settings")}
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.groupCard}>
          <SettingsMenuRow
            label="Termos e Condições"
            onPress={() => setSubScreen("43_terms")}
            showDivider
          />
          <SettingsMenuRow
            label="Política de Privacidade"
            onPress={() => setSubScreen("44_privacy")}
            showDivider
          />
          <SettingsMenuRow
            label="Ajuda"
            onPress={() => setSubScreen("45_help")}
          />
        </View>

        <View style={styles.groupCard}>
          <SettingsMenuRow
            label="Excluir Conta"
            danger
            onPress={() => setSubScreen("46_delete_account")}
          />
        </View>
      </ScrollView>
    </>
  );

  return (
    <View style={styles.screenContainer}>
      {/* Pílulas de etapas (visíveis apenas no Modo Demo) */}
      <DemoStepPills
        steps={subScreenTabs}
        active={subScreen}
        onChange={(k: SettingsSubScreen) => setSubScreen(k)}
      />

      <View style={styles.frame}>
        {/* 33_Settings & 47_Log out */}
        {(subScreen === "33_settings" || subScreen === "47_logout") && (
          <View style={{ flex: 1 }}>
            {renderSettingsMainContent()}

            {subScreen === "47_logout" && (
              <View style={styles.modalBackdrop}>
                <MessageModalCard
                  mode="dualAction"
                  showUser
                  userName={account.profile.name}
                  avatarUri={account.profile.avatarUri}
                  title={"Tem certeza de que deseja\nsair da conta?"}
                  subtitle="Sair da conta removerá seu acesso ao acompanhamento personalizado e aos dados salvos até que você entre novamente."
                  secondaryLabel="Cancelar"
                  primaryLabel="Sair"
                  onSecondaryPress={() => setSubScreen("33_settings")}
                  onPrimaryPress={handleConfirmLogout}
                />
              </View>
            )}
          </View>
        )}

        {/* 34_My Profile */}
        {subScreen === "34_profile" && (
          <View style={{ flex: 1 }}>
            <View style={styles.topBarWrapper}>
              <TopBar
                title="Meu Perfil"
                onBackPress={() => setSubScreen("33_settings")}
                rightAction="close"
                onRightPress={() => setSubScreen("33_settings")}
              />
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ alignItems: "center", marginVertical: 10 }}>
                <ProfileAvatar
                  type="image"
                  size={84}
                  showEditBadge
                  imageUri={account.profile.avatarUri}
                />
              </View>

              <FormInput
                label="Nome"
                placeholder="Digite seu nome"
                value={profileName}
                onChangeText={setProfileName}
              />

              <FormInput
                label="E-mail"
                placeholder="Digite seu e-mail"
                value={profileEmail}
                onChangeText={setProfileEmail}
                keyboardType="email-address"
              />

              <View style={styles.twoColRow}>
                <View style={{ flex: 1 }}>
                  <DropdownField
                    label="Nascimento"
                    value={profileDob}
                    options={["21-05-2003", "14-08-1999", "03-11-2001"]}
                    onSelect={(opt) => {
                      setProfileDob(opt);
                      setShowDatePicker((prev) => !prev);
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <DropdownField
                    label="Altura"
                    value={profileHeight}
                    options={["1,58 m", "1,62 m", "1,70 m", "1,78 m"]}
                    onSelect={setProfileHeight}
                  />
                </View>
              </View>

              {showDatePicker && (
                <View style={{ alignItems: "center", marginVertical: 6 }}>
                  <DatePickerCard
                    monthLabel="Maio 2003"
                    selectedDay={selectedDay}
                    onSelectDay={(d) => {
                      setSelectedDay(d);
                      setProfileDob(`${String(d).padStart(2, "0")}-05-2003`);
                      setShowDatePicker(false);
                    }}
                  />
                </View>
              )}

              <View style={styles.twoColRow}>
                <View style={{ flex: 1 }}>
                  <DropdownField
                    label="Gênero"
                    value={profileGender}
                    options={["Feminino", "Masculino", "Outro"]}
                    onSelect={(opt) =>
                      setProfileGender(opt as "Feminino" | "Masculino" | "Outro")
                    }
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <DropdownField
                    label="Peso"
                    value={profileWeight}
                    options={["52 kg", "56 kg", "62 kg", "70 kg"]}
                    onSelect={setProfileWeight}
                  />
                </View>
              </View>

              <View style={{ marginTop: 16 }}>
                <Button
                  title="Salvar Alterações"
                  variant="primary"
                  fullWidth
                  onPress={handleSaveProfile}
                />
              </View>
            </ScrollView>
          </View>
        )}

        {/* 35_Change Password & 36_Password Changed */}
        {(subScreen === "35_change_password" ||
          subScreen === "36_password_changed") && (
          <View style={{ flex: 1 }}>
            <View style={styles.topBarWrapper}>
              <TopBar
                title="Alterar Senha"
                onBackPress={() => setSubScreen("33_settings")}
                rightAction="close"
                onRightPress={() => setSubScreen("33_settings")}
              />
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <FormInput
                label="Nova Senha"
                placeholder="Digite a nova senha"
                value={newPassword}
                onChangeText={(txt) => {
                  setNewPassword(txt);
                  setPasswordError(undefined);
                }}
                isPassword
                state={passwordError ? "error" : "field"}
                errorMessage={passwordError}
              />

              <FormInput
                label="Confirmar Senha"
                placeholder="Confirme a nova senha"
                value={confirmPassword}
                onChangeText={(txt) => {
                  setConfirmPassword(txt);
                  setPasswordError(undefined);
                }}
                isPassword
                state={passwordError ? "error" : "field"}
              />

              <View style={{ marginTop: 20 }}>
                <Button
                  title="Salvar Senha"
                  variant="primary"
                  fullWidth
                  onPress={handleChangePasswordSubmit}
                />
              </View>
            </ScrollView>

            {subScreen === "36_password_changed" && (
              <View style={styles.modalBackdrop}>
                <MessageModalCard
                  mode="singleAction"
                  showUser
                  userName={account.profile.name}
                  avatarUri={account.profile.avatarUri}
                  title="Senha alterada"
                  subtitle={"Parabéns! Sua senha foi\natualizada com sucesso!"}
                  primaryLabel="Voltar"
                  onPrimaryPress={() => setSubScreen("33_settings")}
                />
              </View>
            )}
          </View>
        )}

        {/* 37_Notification */}
        {subScreen === "37_notification" && (
          <View style={{ flex: 1 }}>
            <View style={styles.topBarWrapper}>
              <TopBar
                title="Notificações"
                onBackPress={() => setSubScreen("33_settings")}
                rightAction="close"
                onRightPress={() => setSubScreen("33_settings")}
              />
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.groupCard}>
                <View style={[styles.toggleRow, styles.settingsRowDivider]}>
                  <AppText variant="body" color={colors.grayscale[100]}>
                    Lembretes de Refeição
                  </AppText>
                  <Toggle
                    size="small"
                    value={account.notificationPrefs.mealReminders}
                    onValueChange={(val) =>
                      setNotificationPref("mealReminders", val)
                    }
                  />
                </View>

                <View style={[styles.toggleRow, styles.settingsRowDivider]}>
                  <AppText variant="body" color={colors.grayscale[100]}>
                    Resumo de Progresso
                  </AppText>
                  <Toggle
                    size="small"
                    value={account.notificationPrefs.progressSummary}
                    onValueChange={(val) =>
                      setNotificationPref("progressSummary", val)
                    }
                  />
                </View>

                <View style={[styles.toggleRow, styles.settingsRowDivider]}>
                  <AppText variant="body" color={colors.grayscale[100]}>
                    Notificações de Metas Atingidas
                  </AppText>
                  <Toggle
                    size="small"
                    value={Boolean(
                      account.notificationPrefs.goalMilestones ??
                        account.notificationPrefs.goalMilestone
                    )}
                    onValueChange={(val) =>
                      setNotificationPref("goalMilestones", val)
                    }
                  />
                </View>

                <View style={styles.toggleRow}>
                  <AppText variant="body" color={colors.grayscale[100]}>
                    Recomendações de Novos Planos
                  </AppText>
                  <Toggle
                    size="small"
                    value={account.notificationPrefs.newPlanRecs}
                    onValueChange={(val) =>
                      setNotificationPref("newPlanRecs", val)
                    }
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        )}

        {/* 38_Payment Method */}
        {subScreen === "38_payment_method" && (
          <View style={{ flex: 1 }}>
            <View style={styles.topBarWrapper}>
              <TopBar
                title="Método de Pagamento"
                onBackPress={() => setSubScreen("33_settings")}
                rightAction="close"
                onRightPress={() => setSubScreen("33_settings")}
              />
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ gap: 14 }}>
                <PaymentMethodCard
                  brand="googlePay"
                  title="Google Pay"
                  selectable
                  selected={account.selectedPayment === "googlePay"}
                  onPress={() => setSelectedPayment("googlePay")}
                />
                <PaymentMethodCard
                  brand="applePay"
                  title="Apple Pay"
                  selectable
                  selected={account.selectedPayment === "applePay"}
                  onPress={() => setSelectedPayment("applePay")}
                />
                <PaymentMethodCard
                  brand="visa"
                  title="Visa •••• 8910"
                  selectable
                  selected={account.selectedPayment === "visa"}
                  onPress={() => setSelectedPayment("visa")}
                />
              </View>

              <View style={{ marginTop: 24 }}>
                <Button
                  title="Adicionar Novo Cartão"
                  variant="primary"
                  fullWidth
                  onPress={() => setSubScreen("39_add_card")}
                />
              </View>
            </ScrollView>
          </View>
        )}

        {/* 39_Add New Card */}
        {subScreen === "39_add_card" && (
          <View style={{ flex: 1 }}>
            <View style={styles.topBarWrapper}>
              <TopBar
                title="Adicionar Cartão"
                onBackPress={() => setSubScreen("38_payment_method")}
                rightAction="close"
                onRightPress={() => setSubScreen("38_payment_method")}
              />
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <FormInput
                label="Número do Cartão"
                placeholder="Digite o número do cartão"
                value={cardNumber}
                onChangeText={setCardNumber}
              />

              <FormInput
                label="Nome do Titular"
                placeholder="Digite o nome impresso no cartão"
                value={cardHolder}
                onChangeText={setCardHolder}
              />

              <View style={styles.twoColRow}>
                <View style={{ flex: 1 }}>
                  <DropdownField
                    label="Validade"
                    value={cardExpiry}
                    options={["21-05-2028", "10-12-2029", "08-04-2030"]}
                    onSelect={setCardExpiry}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FormInput
                    label="CVV"
                    placeholder="425"
                    value={cardCvv}
                    onChangeText={setCardCvv}
                  />
                </View>
              </View>

              <View style={{ marginTop: 20 }}>
                <Button
                  title="Adicionar"
                  variant="primary"
                  fullWidth
                  onPress={handleAddNewCardSubmit}
                />
              </View>
            </ScrollView>
          </View>
        )}

        {/* 40_Favorite-empty */}
        {subScreen === "40_favorite_empty" && (
          <View style={{ flex: 1 }}>
            <View style={styles.topBarWrapper}>
              <TopBar
                title="Favoritos"
                onBackPress={() => setSubScreen("33_settings")}
                rightAction="close"
                onRightPress={() => setSubScreen("33_settings")}
              />
            </View>

            <View style={styles.emptyStateCenter}>
              <EmptyFavoritesIllustration />
              <View style={{ alignItems: "center", gap: 8, maxWidth: 280 }}>
                <AppText
                  variant="title2"
                  color={colors.grayscale[100]}
                  align="center"
                >
                  Nenhum Favorito Ainda.
                </AppText>
                <AppText
                  variant="body2"
                  color={colors.grayscale[200]}
                  align="center"
                >
                  O acesso rápido aos seus itens favoritos torna o registro
                  ainda mais ágil!
                </AppText>
              </View>
              <Button
                title="Explorar Dietas no Catálogo"
                variant="outline"
                onPress={() => router.push("/diets" as any)}
              />
            </View>
          </View>
        )}

        {/* 41_Favorite */}
        {subScreen === "41_favorite" && (
          <View style={{ flex: 1 }}>
            <View style={styles.topBarWrapper}>
              <TopBar
                title="Favoritos"
                onBackPress={() => setSubScreen("33_settings")}
                rightAction="close"
                onRightPress={() => setSubScreen("33_settings")}
              />
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {favoriteDiets.length === 0 ? (
                <View style={styles.emptyStateCenter}>
                  <AppText variant="body" color={colors.grayscale[200]}>
                    Nenhum item marcado como favorito.
                  </AppText>
                </View>
              ) : (
                favoriteDiets.map((diet) => (
                  <DietCard
                    key={diet.id}
                    title={diet.title}
                    calories={diet.calories}
                    protein={diet.protein}
                    carbs={diet.carbs}
                    fat={diet.fat}
                    imageUri={diet.imageUri}
                    favorited
                    onFavoriteToggle={() => toggleFavoriteDiet(diet.id)}
                    onPress={() => router.push("/diets" as any)}
                  />
                ))
              )}
            </ScrollView>
          </View>
        )}

        {/* 42_More & 46_Delete Account */}
        {(subScreen === "42_more" || subScreen === "46_delete_account") && (
          <View style={{ flex: 1 }}>
            {renderMoreContent()}

            {subScreen === "46_delete_account" && (
              <View style={styles.modalBackdrop}>
                <MessageModalCard
                  mode="dualAction"
                  showUser
                  userName={account.profile.name}
                  avatarUri={account.profile.avatarUri}
                  title={"Tem certeza de que deseja\nexcluir sua conta?"}
                  subtitle="Isso removerá permanentemente seus dados e encerrará sua conta no NutriAI."
                  secondaryLabel="Cancelar"
                  primaryLabel="Excluir"
                  onSecondaryPress={() => setSubScreen("42_more")}
                  onPrimaryPress={handleConfirmDeleteAccount}
                />
              </View>
            )}
          </View>
        )}

        {/* 43_Terms and Conditions */}
        {subScreen === "43_terms" && (
          <View style={{ flex: 1 }}>
            <View style={styles.topBarWrapper}>
              <TopBar
                title="Termos e Condições"
                onBackPress={() => setSubScreen("42_more")}
                rightAction="close"
                onRightPress={() => setSubScreen("42_more")}
              />
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <AppText variant="footnote" color={colors.primary[100]}>
                Última atualização: 12 de junho de 2024
              </AppText>

              <AppText variant="body2" color={colors.grayscale[200]}>
                Bem-vindo ao NutriAI, seu assistente de nutrição com
                inteligência artificial. Leia atentamente estes Termos e
                Condições antes de utilizar o aplicativo móvel NutriAI.
              </AppText>

              <View style={styles.legalSection}>
                <AppText variant="headline" color={colors.grayscale[100]}>
                  1. Elegibilidade
                </AppText>
                <AppText variant="body2" color={colors.grayscale[200]}>
                  Você deve ter pelo menos 13 anos de idade para utilizar o
                  NutriAI. Caso seja menor de 18 anos, o uso do aplicativo deve
                  ocorrer com o consentimento dos pais ou responsáveis legais.
                </AppText>
              </View>

              <View style={styles.legalSection}>
                <AppText variant="headline" color={colors.grayscale[100]}>
                  2. Aviso Médico e de Saúde
                </AppText>
                <AppText variant="body2" color={colors.grayscale[200]}>
                  O NutriAI oferece monitoramento de calorias, insights
                  nutricionais e recomendações geradas por IA. No entanto o NutriAI
                  não é um provedor médico ou de saúde e não substitui acompanhamento clínico.
                </AppText>
              </View>
            </ScrollView>
          </View>
        )}

        {/* 44_Privacy Policy */}
        {subScreen === "44_privacy" && (
          <View style={{ flex: 1 }}>
            <View style={styles.topBarWrapper}>
              <TopBar
                title="Política de Privacidade"
                onBackPress={() => setSubScreen("42_more")}
                rightAction="close"
                onRightPress={() => setSubScreen("42_more")}
              />
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <AppText variant="footnote" color={colors.primary[100]}>
                Última atualização: 12 de junho de 2024
              </AppText>

              <AppText variant="body2" color={colors.grayscale[200]}>
                Obrigado por confiar no NutriAI. Seus dados são salvos localmente
                e nunca compartilhados sem sua autorização explícita.
              </AppText>
            </ScrollView>
          </View>
        )}

        {/* 45_Help */}
        {subScreen === "45_help" && (
          <View style={{ flex: 1 }}>
            <View style={styles.topBarWrapper}>
              <TopBar
                title="Ajuda"
                onBackPress={() => setSubScreen("42_more")}
                rightAction="close"
                onRightPress={() => setSubScreen("42_more")}
              />
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.groupCard}>
                <AppText variant="headline" color={colors.grayscale[100]}>
                  Central de Ajuda & FAQ
                </AppText>
                <AppText variant="body2" color={colors.grayscale[200]}>
                  • Como registrar uma refeição pelo Scan IA{"\n"}
                  • Como alterar metas diárias no Perfil{"\n"}
                  • Como cancelar ou renovar a assinatura Premium
                </AppText>
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.grayscale[600],
  },
  frame: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.grayscale[600],
  },
  topBarWrapper: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 40,
    gap: 16,
  },
  scrollContentWithBottom: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 115,
    gap: 16,
  },
  userCard: {
    backgroundColor: colors.grayscale[500],
    borderRadius: radii.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.grayscale[400],
  },
  userCardInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  proPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colors.accent[200],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  groupCard: {
    backgroundColor: colors.grayscale[500],
    borderRadius: radii.lg,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    gap: 8,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  settingsRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale[400],
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  twoColRow: {
    flexDirection: "row",
    gap: 16,
  },
  emptyStateCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 24,
  },
  legalSection: {
    backgroundColor: colors.grayscale[500],
    borderRadius: radii.lg,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.grayscale[400],
  },
  bottomMenuFixed: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(12, 13, 12, 0.78)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    zIndex: 30,
  },
});
