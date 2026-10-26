import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, { Circle, Path, Rect } from "react-native-svg";
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
  PortfolioNavBar,
  ProfileAvatar,
  Toggle,
  TopBar,
} from "@/components/ui";

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

interface FavoriteDietItem {
  id: string;
  title: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  imageUri: string;
}

const INITIAL_FAVORITES: FavoriteDietItem[] = [
  {
    id: "paleo",
    title: "Plano Paleo Power",
    calories: "2.000 kcal",
    protein: "Proteína: 180g",
    carbs: "Carbo: 150g",
    fat: "Gordura: 80g",
    imageUri:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "indian-veg",
    title: "Vegetariano Indiano para Emagrecer",
    calories: "1.800 kcal",
    protein: "Proteína: 100g",
    carbs: "Carbo: 225g",
    fat: "Gordura: 45g",
    imageUri:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mediterranean",
    title: "Estilo de Vida Mediterrâneo",
    calories: "2.000 kcal",
    protein: "Proteína: 120g",
    carbs: "Carbo: 200g",
    fat: "Gordura: 70g",
    imageUri:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
  },
];

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
      color={danger ? colors.message.red : colors.grayscale[100]}
    >
      {label}
    </AppText>
    <ArrowIcon
      direction="right"
      size={20}
      color={danger ? colors.message.red : colors.grayscale[200]}
    />
  </TouchableOpacity>
);

export const SettingsFlowScreen: React.FC = () => {
  const router = useRouter();
  const [subScreen, setSubScreen] = useState<SettingsSubScreen>("33_settings");

  // Estado 34_My Profile
  const [profileName, setProfileName] = useState("Jane Cooper");
  const [profileEmail, setProfileEmail] = useState("janecooper@email.com");
  const [profileDob, setProfileDob] = useState("21-05-2003");
  const [profileHeight, setProfileHeight] = useState("1,62 m");
  const [profileGender, setProfileGender] = useState("Feminino");
  const [profileWeight, setProfileWeight] = useState("56 kg");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState(21);

  // Estado 35_Change Password
  const [newPassword, setNewPassword] = useState("nutri2026");
  const [confirmPassword, setConfirmPassword] = useState("nutri2026");

  // Estado 37_Notification
  const [mealReminders, setMealReminders] = useState(true);
  const [progressSummary, setProgressSummary] = useState(true);
  const [goalMilestone, setGoalMilestone] = useState(false);
  const [newPlanRecs, setNewPlanRecs] = useState(true);

  // Estado 38_Payment Method & 39_Add New Card
  const [selectedPayment, setSelectedPayment] = useState<
    "googlePay" | "applePay" | "visa"
  >("visa");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8910");
  const [cardHolder, setCardHolder] = useState("Jane Cooper");
  const [cardExpiry, setCardExpiry] = useState("21-05-2028");
  const [cardCvv, setCardCvv] = useState("425");

  // Estado 41_Favorite
  const [favorites, setFavorites] =
    useState<FavoriteDietItem[]>(INITIAL_FAVORITES);

  const handleBottomTabPress = (tab: BottomMenuTab) => {
    if (tab === "home") router.push("/home" as any);
    else if (tab === "analysis") router.push("/analysis" as any);
    else if (tab === "scan") router.push("/scan" as any);
    else if (tab === "diet") router.push("/diets" as any);
    else if (tab === "settings") setSubScreen("33_settings");
  };

  const toggleFavoriteItem = (id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (next.length === 0) {
        setSubScreen("40_favorite_empty");
      }
      return next;
    });
  };

  const subScreenTabs: { key: SettingsSubScreen; label: string }[] = [
    { key: "33_settings", label: "33_Ajustes" },
    { key: "34_profile", label: "34_Meu Perfil" },
    { key: "35_change_password", label: "35_Alterar Senha" },
    { key: "36_password_changed", label: "36_Senha Alterada" },
    { key: "37_notification", label: "37_Notificações" },
    { key: "38_payment_method", label: "38_Pagamento" },
    { key: "39_add_card", label: "39_Novo Cartão" },
    { key: "40_favorite_empty", label: "40_Fav Vazio" },
    { key: "41_favorite", label: "41_Favoritos" },
    { key: "42_more", label: "42_Mais" },
    { key: "43_terms", label: "43_Termos" },
    { key: "44_privacy", label: "44_Privacidade" },
    { key: "45_help", label: "45_Ajuda" },
    { key: "46_delete_account", label: "46_Excluir Conta" },
    { key: "47_logout", label: "47_Sair" },
  ];

  // Renderiza o conteúdo base de 33_Settings (também usado ao fundo do modal 47_Log out)
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
        {/* User Info Card */}
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
              imageUri="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            />
            <View style={{ flex: 1, gap: 4 }}>
              <AppText variant="headline" color={colors.grayscale[100]}>
                {profileName}
              </AppText>
              <AppText variant="body2" color={colors.grayscale[200]}>
                {profileEmail}
              </AppText>
            </View>
            <ArrowIcon
              direction="right"
              size={20}
              color={colors.grayscale[200]}
            />
          </View>
        </TouchableOpacity>

        {/* Main Settings Card */}
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
                favorites.length > 0 ? "41_favorite" : "40_favorite_empty"
              )
            }
          />
        </View>

        {/* More Container */}
        <View style={styles.groupCard}>
          <SettingsMenuRow
            label="Mais"
            onPress={() => setSubScreen("42_more")}
          />
        </View>

        {/* Log Out Container */}
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

  // Renderiza o conteúdo base de 42_More (também usado ao fundo do modal 46_Delete Account)
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
    <SafeAreaView style={styles.safeArea}>
      <PortfolioNavBar />

      {/* Seletor das 15 sub-telas do Passo 9 (33 a 47) */}
      <View style={styles.subSwitcherBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, paddingHorizontal: 16 }}
        >
          {subScreenTabs.map((item) => {
            const active = subScreen === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => setSubScreen(item.key)}
                style={[styles.subChip, active && styles.subChipActive]}
              >
                <AppText
                  variant="caption2"
                  color={active ? colors.grayscale[600] : colors.grayscale[200]}
                >
                  {item.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

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
                  userName={profileName}
                  avatarUri="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                  title={"Tem certeza de que deseja\nsair da conta?"}
                  subtitle="Sair da conta removerá seu acesso ao acompanhamento personalizado e aos dados salvos até que você entre novamente."
                  secondaryLabel="Cancelar"
                  primaryLabel="Sair"
                  onSecondaryPress={() => setSubScreen("33_settings")}
                  onPrimaryPress={() => router.push("/login" as any)}
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
            >
              <View style={{ alignItems: "center", marginVertical: 10 }}>
                <ProfileAvatar
                  type="image"
                  size={84}
                  showEditBadge
                  imageUri="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
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
                    onSelect={setProfileGender}
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
                  title="Salvar"
                  variant="primary"
                  fullWidth
                  onPress={() => setSubScreen("33_settings")}
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
            >
              <FormInput
                label="Nova Senha"
                placeholder="Digite a nova senha"
                value={newPassword}
                onChangeText={setNewPassword}
                isPassword
              />

              <FormInput
                label="Confirmar Senha"
                placeholder="Confirme a nova senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                isPassword
              />

              <View style={{ marginTop: 20 }}>
                <Button
                  title="Salvar"
                  variant="primary"
                  fullWidth
                  onPress={() => setSubScreen("36_password_changed")}
                />
              </View>
            </ScrollView>

            {subScreen === "36_password_changed" && (
              <View style={styles.modalBackdrop}>
                <MessageModalCard
                  mode="singleAction"
                  showUser
                  userName={profileName}
                  avatarUri="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
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
                    value={mealReminders}
                    onValueChange={setMealReminders}
                  />
                </View>

                <View style={[styles.toggleRow, styles.settingsRowDivider]}>
                  <AppText variant="body" color={colors.grayscale[100]}>
                    Resumo de Progresso
                  </AppText>
                  <Toggle
                    size="small"
                    value={progressSummary}
                    onValueChange={setProgressSummary}
                  />
                </View>

                <View style={[styles.toggleRow, styles.settingsRowDivider]}>
                  <AppText variant="body" color={colors.grayscale[100]}>
                    Notificações de Metas Atingidas
                  </AppText>
                  <Toggle
                    size="small"
                    value={goalMilestone}
                    onValueChange={setGoalMilestone}
                  />
                </View>

                <View style={styles.toggleRow}>
                  <AppText variant="body" color={colors.grayscale[100]}>
                    Recomendações de Novos Planos
                  </AppText>
                  <Toggle
                    size="small"
                    value={newPlanRecs}
                    onValueChange={setNewPlanRecs}
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
                  selected={selectedPayment === "googlePay"}
                  onPress={() => setSelectedPayment("googlePay")}
                />
                <PaymentMethodCard
                  brand="applePay"
                  title="Apple Pay"
                  selectable
                  selected={selectedPayment === "applePay"}
                  onPress={() => setSelectedPayment("applePay")}
                />
                <PaymentMethodCard
                  brand="visa"
                  title="Visa •••• 8910"
                  selectable
                  selected={selectedPayment === "visa"}
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
                  onPress={() => {
                    setSelectedPayment("visa");
                    setSubScreen("38_payment_method");
                  }}
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
                title="Restaurar Favoritos de Exemplo"
                variant="outline"
                onPress={() => {
                  setFavorites(INITIAL_FAVORITES);
                  setSubScreen("41_favorite");
                }}
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
              {favorites.map((diet) => (
                <DietCard
                  key={diet.id}
                  title={diet.title}
                  calories={diet.calories}
                  protein={diet.protein}
                  carbs={diet.carbs}
                  fat={diet.fat}
                  imageUri={diet.imageUri}
                  favorited
                  onFavoriteToggle={() => toggleFavoriteItem(diet.id)}
                  onPress={() => router.push("/diets" as any)}
                />
              ))}
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
                  userName={profileName}
                  avatarUri="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                  title={"Tem certeza de que deseja\nexcluir sua conta?"}
                  subtitle="Isso removerá permanentemente seus dados e encerrará sua conta no NutriAI."
                  secondaryLabel="Cancelar"
                  primaryLabel="Excluir"
                  onSecondaryPress={() => setSubScreen("42_more")}
                  onPrimaryPress={() => router.push("/" as any)}
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

              <AppText variant="body2" color={colors.grayscale[200]}>
                Ao utilizar o NutriAI, você concorda em cumprir estes Termos.
                Caso não concorde com qualquer parte dos Termos, recomendamos
                não acessar ou utilizar o aplicativo.
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
                  nutricionais e recomendações geradas por IA. No entanto:
                </AppText>
                <View style={styles.bulletList}>
                  <AppText variant="body2" color={colors.grayscale[200]}>
                    • O NutriAI não é um provedor médico ou de saúde.
                  </AppText>
                  <AppText variant="body2" color={colors.grayscale[200]}>
                    • O aplicativo não substitui consultas médicas ou
                    nutricionais profissionais.
                  </AppText>
                  <AppText variant="body2" color={colors.grayscale[200]}>
                    • Consulte sempre um médico ou nutricionista antes de
                    iniciar qualquer dieta ou programa alimentar.
                  </AppText>
                </View>
              </View>

              <View style={styles.legalSection}>
                <AppText variant="headline" color={colors.grayscale[100]}>
                  3. Contas de Usuário
                </AppText>
                <AppText variant="body2" color={colors.grayscale[200]}>
                  Ao criar uma conta conosco:
                </AppText>
                <View style={styles.bulletList}>
                  <AppText variant="body2" color={colors.grayscale[200]}>
                    • Você concorda em fornecer informações verdadeiras,
                    completas e atualizadas.
                  </AppText>
                  <AppText variant="body2" color={colors.grayscale[200]}>
                    • Você é responsável por manter a confidencialidade de suas
                    credenciais de acesso.
                  </AppText>
                  <AppText variant="body2" color={colors.grayscale[200]}>
                    • Não é permitido compartilhar sua conta ou se passar por
                    outra pessoa.
                  </AppText>
                </View>
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
                Obrigado por confiar no NutriAI. Sua privacidade é fundamental
                para nós. Esta Política de Privacidade explica como coletamos,
                usamos e protegemos suas informações pessoais no aplicativo
                NutriAI.
              </AppText>

              <AppText variant="body2" color={colors.grayscale[200]}>
                Ao utilizar o NutriAI, você concorda com as práticas descritas
                nesta Política.
              </AppText>

              <View style={styles.legalSection}>
                <AppText variant="headline" color={colors.grayscale[100]}>
                  1. Como Usamos Seus Dados
                </AppText>
                <AppText variant="body2" color={colors.grayscale[200]}>
                  Utilizamos as informações coletadas para:
                </AppText>
                <View style={styles.bulletList}>
                  <AppText variant="body2" color={colors.grayscale[200]}>
                    • Personalizar sua experiência de dieta e contagem de
                    calorias
                  </AppText>
                  <AppText variant="body2" color={colors.grayscale[200]}>
                    • Oferecer sugestões de refeições e análises por IA
                  </AppText>
                  <AppText variant="body2" color={colors.grayscale[200]}>
                    • Monitorar seu progresso e metas de saúde
                  </AppText>
                  <AppText variant="body2" color={colors.grayscale[200]}>
                    • Aprimorar as funcionalidades e a experiência do aplicativo
                  </AppText>
                  <AppText variant="body2" color={colors.grayscale[200]}>
                    • Enviar comunicações importantes (notificações e
                    atualizações)
                  </AppText>
                </View>
              </View>

              <View style={styles.legalSection}>
                <AppText variant="headline" color={colors.grayscale[100]}>
                  2. Como Compartilhamos Suas Informações
                </AppText>
                <AppText variant="body" color={colors.primary[100]}>
                  Nós não vendemos seus dados pessoais.
                </AppText>
                <AppText variant="body2" color={colors.grayscale[200]}>
                  Podemos compartilhar dados limitados apenas com:
                </AppText>
                <View style={styles.bulletList}>
                  <AppText variant="body2" color={colors.grayscale[200]}>
                    • Provedores de infraestrutura (hospedagem, análise e envio
                    de mensagens)
                  </AppText>
                  <AppText variant="body2" color={colors.grayscale[200]}>
                    • Integrações de terceiros autorizadas por você (Google Fit,
                    Apple Saúde)
                  </AppText>
                  <AppText variant="body2" color={colors.grayscale[200]}>
                    • Autoridades legais quando exigido por lei
                  </AppText>
                </View>
              </View>
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
              <View style={{ gap: 4 }}>
                <AppText variant="title3" color={colors.grayscale[100]}>
                  Precisa de Ajuda?
                </AppText>
                <AppText variant="body2" color={colors.grayscale[200]}>
                  Estamos aqui para guiar você em cada passo do caminho.
                </AppText>
              </View>

              <View style={styles.groupCard}>
                <AppText variant="headline" color={colors.grayscale[100]}>
                  Tópicos Rápidos de Ajuda
                </AppText>

                <View style={{ gap: 12, marginTop: 8 }}>
                  <View style={{ gap: 2 }}>
                    <AppText variant="body" color={colors.primary[100]}>
                      • Como registrar uma refeição
                    </AppText>
                    <AppText variant="body2" color={colors.grayscale[200]}>
                      Guia passo a passo para escanear e acompanhar seus
                      alimentos
                    </AppText>
                  </View>

                  <View style={{ gap: 2 }}>
                    <AppText variant="body" color={colors.primary[100]}>
                      • Definindo sua meta de calorias
                    </AppText>
                    <AppText variant="body2" color={colors.grayscale[200]}>
                      Entenda como o NutriAI calcula suas metas diárias
                    </AppText>
                  </View>

                  <View style={{ gap: 2 }}>
                    <AppText variant="body" color={colors.primary[100]}>
                      • Escolhendo um plano alimentar
                    </AppText>
                    <AppText variant="body2" color={colors.grayscale[200]}>
                      Descubra qual protocolo funciona melhor para seus
                      objetivos
                    </AppText>
                  </View>
                </View>
              </View>

              <View style={styles.groupCard}>
                <AppText variant="headline" color={colors.grayscale[100]}>
                  Fale com o Suporte
                </AppText>
                <AppText variant="body2" color={colors.grayscale[200]}>
                  Não encontrou o que estava procurando?
                </AppText>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSubScreen("33_settings")}
                  style={{ paddingVertical: 4 }}
                >
                  <AppText variant="headline" color={colors.primary[100]}>
                    [ Enviar uma Mensagem ]
                  </AppText>
                </TouchableOpacity>
                <AppText variant="footnote" color={colors.grayscale[200]}>
                  Costumamos responder em até 24 horas.
                </AppText>
              </View>

              <View style={styles.groupCard}>
                <AppText variant="headline" color={colors.grayscale[100]}>
                  Links Úteis
                </AppText>
                <View style={{ gap: 10, marginTop: 4 }}>
                  <TouchableOpacity onPress={() => setSubScreen("44_privacy")}>
                    <AppText variant="body" color={colors.primary[100]}>
                      Política de Privacidade →
                    </AppText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setSubScreen("43_terms")}>
                    <AppText variant="body" color={colors.primary[100]}>
                      Termos e Condições →
                    </AppText>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.grayscale[600],
  },
  subSwitcherBar: {
    width: "100%",
    maxWidth: 428,
    alignSelf: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale[500],
  },
  subChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    backgroundColor: colors.grayscale[500],
  },
  subChipActive: {
    backgroundColor: colors.accent[200],
  },
  frame: {
    flex: 1,
    width: "100%",
    maxWidth: 428,
    alignSelf: "center",
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
    paddingVertical: 10,
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
  bulletList: {
    gap: 6,
    paddingLeft: 4,
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
