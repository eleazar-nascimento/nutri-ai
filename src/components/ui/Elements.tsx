import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { User, Share2, MessageCircle, Send, Mail, MoreHorizontal } from "lucide-react-native";
import { colors, fontFamilies, radii } from "@/theme";
import { AppText } from "./Typography";
import { ActionIcon, GoogleIcon, AppleIcon, ArrowIcon } from "./Icons";
import { Button, CircleIconButton } from "./Button";
import { RadioButton } from "./SelectionControls";

/**
 * OTP Outline — Campos de Código de Verificação (Figma Node 885:5237)
 * - Caixa 50x50px, radius 12px
 * - Estados: Default (borda #474747), Selected (borda #FFFFFF), Error (borda #C93838)
 */
export const OTPInput: React.FC<{
  length?: number;
  value?: string[];
  onChange?: (digits: string[]) => void;
  hasError?: boolean;
}> = ({ length = 4, value = ["1", "8", "", ""], onChange, hasError = false }) => {
  const [selectedIndex, setSelectedIndex] = useState(1);

  return (
    <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
      {Array.from({ length }).map((_, idx) => {
        const digit = value[idx] ?? "";
        const isSelected = idx === selectedIndex || digit.length > 0;
        const borderColor = hasError
          ? colors.message.red
          : isSelected
          ? colors.grayscale[100]
          : colors.grayscale[300];

        return (
          <View
            key={idx}
            style={{
              width: 50,
              height: 50,
              borderRadius: radii.md,
              borderWidth: 1.5,
              borderColor,
              backgroundColor: colors.grayscale[600],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextInput
              value={digit}
              maxLength={1}
              keyboardType="number-pad"
              onFocus={() => setSelectedIndex(idx)}
              onChangeText={(text) => {
                const next = [...value];
                next[idx] = text;
                onChange?.(next);
              }}
              style={{
                fontFamily: fontFamilies.semiBold,
                fontSize: 18,
                color: colors.grayscale[100],
                textAlign: "center",
                width: "100%",
                height: "100%",
              }}
            />
          </View>
        );
      })}
    </View>
  );
};

/**
 * Pricing / Range Slider (Figma Node 885:5206)
 * - Track inativo: #F4F4F4, altura 8px, radius 32px
 * - Track ativo: #FF5A16
 * - Thumb circular: 14x14px #FF5A16 com borda branca
 */
export const RangeSlider: React.FC<{
  minLabel?: string;
  currentLabel?: string;
  maxLabel?: string;
  progress?: number; // 0 a 1
}> = ({
  minLabel = "0",
  currentLabel = "1.800 kcal",
  maxLabel = "3.000 kcal",
  progress = 0.42,
}) => {
  const clamped = Math.max(0.05, Math.min(0.95, progress));

  return (
    <View style={{ width: "100%", gap: 10 }}>
      <View
        style={{
          height: 20,
          justifyContent: "center",
          position: "relative",
        }}
      >
        <View
          style={{
            height: 8,
            width: "100%",
            borderRadius: 32,
            backgroundColor: colors.system.surfaceLight,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${clamped * 100}%`,
              backgroundColor: colors.primary[100],
            }}
          />
        </View>

        {/* Ponto inicial */}
        <View
          style={{
            position: "absolute",
            left: 0,
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: colors.primary[100],
            borderWidth: 2,
            borderColor: colors.grayscale[700],
          }}
        />

        {/* Ponto atual */}
        <View
          style={{
            position: "absolute",
            left: `${clamped * 100}%`,
            marginLeft: -7,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: colors.primary[100],
            borderWidth: 2,
            borderColor: colors.grayscale[100],
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <AppText variant="body2" color={colors.grayscale[200]}>
          {minLabel}
        </AppText>
        <AppText variant="headline" color={colors.grayscale[100]}>
          {currentLabel}
        </AppText>
        <AppText variant="body2" color={colors.grayscale[200]}>
          {maxLabel}
        </AppText>
      </View>
    </View>
  );
};

/**
 * Profile Avatar (Figma Node 885:5224)
 * - 100x100px circular com 3 tipos: "image", "name" (inicial em fundo #F4F4F4), "default" (ícone de usuário em #474747)
 * - Badge de câmera/edição 32x32px no canto inferior direito
 */
export const ProfileAvatar: React.FC<{
  type?: "image" | "name" | "default";
  imageUri?: string;
  initial?: string;
  size?: number;
  showEditBadge?: boolean;
  onEditPress?: () => void;
}> = ({
  type = "default",
  imageUri = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  initial = "D",
  size = 100,
  showEditBadge = true,
  onEditPress,
}) => {
  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      {type === "image" ? (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.grayscale[400],
          }}
        />
      ) : type === "name" ? (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.system.surfaceLight,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppText variant="largeTitle" color={colors.grayscale[400]}>
            {initial}
          </AppText>
        </View>
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.grayscale[300],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <User size={size * 0.48} color={colors.grayscale[100]} />
        </View>
      )}

      {showEditBadge && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onEditPress}
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.primary[100],
            borderWidth: 2,
            borderColor: colors.grayscale[600],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActionIcon name="camera" size={16} color={colors.grayscale[100]} />
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * Notification Card (Figma Node 62999:2916)
 * - 388x92px (ou 100%), fundo #232220, borda #2F2F2F, radius 24px
 * - Ícone circular 44x44px (#2F2F2F) + texto em Português
 */
export const NotificationCard: React.FC<{
  message?: string;
  time?: string;
  onPress?: () => void;
}> = ({
  message = "Hora do seu almoço – Não esqueça de registrar sua refeição.",
  time,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        width: "100%",
        minHeight: 92,
        borderRadius: radii.xl,
        backgroundColor: colors.grayscale[500],
        borderWidth: 1,
        borderColor: colors.grayscale[400],
        paddingHorizontal: 18,
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.grayscale[400],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActionIcon
          name="notification"
          size={22}
          color={colors.grayscale[100]}
        />
      </View>

      <View style={{ flex: 1, gap: 4 }}>
        <AppText variant="body2" color={colors.grayscale[100]}>
          {message}
        </AppText>
        {time ? (
          <AppText variant="footnote" color={colors.grayscale[200]}>
            {time}
          </AppText>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export type PaymentBrand = "googlePay" | "applePay" | "visa";

/**
 * Badge de bandeira de pagamento 70x48px (Figma Node 63009:5606)
 */
export const PaymentBrandBadge: React.FC<{ brand: PaymentBrand }> = ({
  brand,
}) => {
  return (
    <View
      style={{
        width: 70,
        height: 48,
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: colors.grayscale[400],
        backgroundColor: colors.grayscale[600],
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      {brand === "googlePay" && (
        <>
          <GoogleIcon size={16} />
          <AppText variant="caption2" color={colors.grayscale[100]}>
            Pay
          </AppText>
        </>
      )}
      {brand === "applePay" && (
        <>
          <AppleIcon size={16} color={colors.grayscale[100]} />
          <AppText variant="caption2" color={colors.grayscale[100]}>
            Pay
          </AppText>
        </>
      )}
      {brand === "visa" && (
        <AppText
          variant="headline"
          color={colors.grayscale[100]}
          style={{ fontStyle: "italic" }}
        >
          VISA
        </AppText>
      )}
    </View>
  );
};

/**
 * Payment Method Card & Select Payment Method (Figma Nodes 63009:5667 & 63021:5260)
 * - 388x88px, fundo #232220, borda #2F2F2F, radius 24px
 */
export const PaymentMethodCard: React.FC<{
  brand: PaymentBrand;
  title?: string;
  selectable?: boolean;
  selected?: boolean;
  onPress?: () => void;
}> = ({ brand, title, selectable = false, selected = false, onPress }) => {
  const defaultTitle: Record<PaymentBrand, string> = {
    googlePay: "Google Pay",
    applePay: "Apple Pay",
    visa: "Cartão Visa •••• 4242",
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        width: "100%",
        height: 88,
        borderRadius: radii.xl,
        backgroundColor: colors.grayscale[500],
        borderWidth: 1,
        borderColor: selected ? colors.primary[100] : colors.grayscale[400],
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <PaymentBrandBadge brand={brand} />
        <AppText variant="body" color={colors.grayscale[100]}>
          {title ?? defaultTitle[brand]}
        </AppText>
      </View>

      {selectable && <RadioButton selected={selected} onSelect={onPress} />}
    </TouchableOpacity>
  );
};

/**
 * Diets Card Oficial (Figma Node 63003:2628)
 * - Imagem 388x220px, radius 24px + botão circular branco de favorito (40x40) no canto superior direito
 * - Título da dieta (Headline)
 * - Linha de nutrição com divisores: "1.800 kcal | Proteína: 70g | Carbo: 30g | Gordura: 105g"
 */
export const DietCard: React.FC<{
  title?: string;
  calories?: string;
  protein?: string;
  carbs?: string;
  fat?: string;
  imageUri?: string;
  favorited?: boolean;
  onFavoriteToggle?: () => void;
  onPress?: () => void;
}> = ({
  title = "Partida Cetogênica (Keto)",
  calories = "1.800 kcal",
  protein = "Proteína: 70g",
  carbs = "Carbo: 30g",
  fat = "Gordura: 105g",
  imageUri = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
  favorited = false,
  onFavoriteToggle,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{ width: "100%", gap: 12 }}
    >
      <View
        style={{
          width: "100%",
          height: 220,
          borderRadius: radii.xl,
          overflow: "hidden",
          backgroundColor: colors.grayscale[500],
          position: "relative",
        }}
      >
        <Image
          source={{ uri: imageUri }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />

        <View style={{ position: "absolute", top: 14, right: 14 }}>
          <CircleIconButton
            type="favorite"
            favorited={favorited}
            lightBg
            onPress={onFavoriteToggle}
          />
        </View>
      </View>

      <View style={{ gap: 4 }}>
        <AppText variant="headline" color={colors.grayscale[100]}>
          {title}
        </AppText>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <AppText variant="footnote" color={colors.grayscale[100]}>
            {calories}
          </AppText>
          <View
            style={{
              width: 1,
              height: 14,
              backgroundColor: colors.grayscale[400],
            }}
          />
          <AppText variant="footnote" color={colors.grayscale[100]}>
            {protein}
          </AppText>
          <View
            style={{
              width: 1,
              height: 14,
              backgroundColor: colors.grayscale[400],
            }}
          />
          <AppText variant="footnote" color={colors.grayscale[100]}>
            {carbs}
          </AppText>
          <View
            style={{
              width: 1,
              height: 14,
              backgroundColor: colors.grayscale[400],
            }}
          />
          <AppText variant="footnote" color={colors.grayscale[100]}>
            {fat}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * Message Container / Modal Card (Figma Node 62993:3739)
 * - 388x274px, fundo #121212, borda #232220, radius 24px
 * - Usado para "Senha alterada", "Sair da conta" e "Excluir conta"
 */
export const MessageModalCard: React.FC<{
  mode?: "singleAction" | "dualAction";
  userName?: string;
  avatarUri?: string;
  showUser?: boolean;
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
}> = ({
  mode = "singleAction",
  userName = "Mariana Costa",
  avatarUri = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  showUser = false,
  title = "Senha alterada",
  subtitle = "Sua senha foi atualizada com sucesso! Agora você já pode entrar com suas novas credenciais.",
  primaryLabel = mode === "singleAction" ? "Entrar" : "Sair",
  secondaryLabel = "Cancelar",
  onPrimaryPress,
  onSecondaryPress,
}) => {
  return (
    <View
      style={{
        width: "100%",
        borderRadius: radii.xl,
        backgroundColor: colors.grayscale[600],
        borderWidth: 1,
        borderColor: colors.grayscale[500],
        padding: 28,
        alignItems: "center",
        gap: 24,
      }}
    >
      {showUser && (
        <View style={{ alignItems: "center", gap: 8 }}>
          <Image
            source={{ uri: avatarUri }}
            style={{ width: 54, height: 54, borderRadius: 27 }}
          />
          <AppText variant="headline" color={colors.grayscale[100]}>
            {userName}
          </AppText>
        </View>
      )}

      <View style={{ alignItems: "center", gap: 8 }}>
        <AppText variant="title2" color={colors.grayscale[100]} align="center">
          {title}
        </AppText>
        <AppText variant="body2" color={colors.grayscale[200]} align="center">
          {subtitle}
        </AppText>
      </View>

      {mode === "singleAction" ? (
        <View style={{ width: 226 }}>
          <Button
            title={primaryLabel}
            variant="primary"
            size="large"
            onPress={onPrimaryPress}
          />
        </View>
      ) : (
        <View style={{ flexDirection: "row", gap: 16, width: "100%" }}>
          <View style={{ flex: 1 }}>
            <Button
              title={secondaryLabel}
              variant="outline"
              size="large"
              onPress={onSecondaryPress}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title={primaryLabel}
              variant="primary"
              size="large"
              onPress={onPrimaryPress}
            />
          </View>
        </View>
      )}
    </View>
  );
};

/**
 * DatePicker & TimePicker Card (Figma Node 1523:2463)
 * - Variantes: dark (#030401 / #121212) e light (#FFFFFF)
 * - Dia selecionado circular 40x40px em #FF5A16
 * - Dias da semana traduzidos para Português: DOM, SEG, TER, QUA, QUI, SEX, SÁB
 */
export const DatePickerCard: React.FC<{
  darkMode?: boolean;
  monthLabel?: string;
  selectedDay?: number;
  onSelectDay?: (day: number) => void;
  timeValue?: string;
}> = ({
  darkMode = true,
  monthLabel = "Outubro 2026",
  selectedDay = 14,
  onSelectDay,
  timeValue = "09:41",
}) => {
  const daysOfWeek = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const bg = darkMode ? colors.grayscale[800] : colors.grayscale[100];
  const textColor = darkMode ? colors.grayscale[100] : colors.grayscale[800];
  const mutedColor = darkMode ? colors.grayscale[200] : colors.grayscale[300];

  return (
    <View
      style={{
        width: "100%",
        borderRadius: 13,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: darkMode ? colors.grayscale[400] : colors.grayscale[200],
        padding: 16,
        gap: 14,
      }}
    >
      {/* Cabeçalho do Mês */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <AppText variant="headline" color={textColor}>
            {monthLabel}
          </AppText>
          <ArrowIcon direction="right" size={16} color={colors.primary[100]} />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <ArrowIcon direction="left" size={18} color={colors.primary[100]} />
          <ArrowIcon direction="right" size={18} color={colors.primary[100]} />
        </View>
      </View>

      {/* Dias da Semana */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {daysOfWeek.map((d) => (
          <View key={d} style={{ width: 40, alignItems: "center" }}>
            <AppText variant="footnote" color={mutedColor}>
              {d}
            </AppText>
          </View>
        ))}
      </View>

      {/* Grade de Dias */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          rowGap: 6,
          justifyContent: "flex-start",
        }}
      >
        {days.map((day) => {
          const isSelected = day === selectedDay;
          return (
            <TouchableOpacity
              key={day}
              onPress={() => onSelectDay?.(day)}
              style={{
                width: "14.28%",
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: isSelected
                    ? colors.primary[100]
                    : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText
                  variant="body2"
                  color={isSelected ? colors.grayscale[100] : textColor}
                >
                  {day}
                </AppText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Seletor de Horário */}
      <View
        style={{
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: darkMode
            ? colors.grayscale[400]
            : colors.grayscale[200],
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <AppText variant="body" color={textColor}>
          Horário
        </AppText>
        <View
          style={{
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: radii.sm,
            backgroundColor: darkMode
              ? colors.grayscale[400]
              : colors.system.surfaceLight,
          }}
        >
          <AppText variant="callout" color={textColor}>
            {timeValue}
          </AppText>
        </View>
      </View>
    </View>
  );
};

/**
 * Share Sheet (Figma Node 23:3138)
 * - Fundo #252B39, Título "Compartilhar Link", ícones de apps e campo de copiar link com botão "Copiar" em #FF5A16
 */
export const ShareSheetCard: React.FC<{
  link?: string;
  onCopy?: () => void;
}> = ({ link = "https://nutriai.app/plano/keto", onCopy }) => {
  const [copied, setCopied] = useState(false);

  const channels = [
    { name: "WhatsApp", icon: MessageCircle, bg: "#25D366" },
    { name: "Telegram", icon: Send, bg: "#2AABEE" },
    { name: "E-mail", icon: Mail, bg: "#FF5A16" },
    { name: "Direto", icon: Share2, bg: "#8B5CF6" },
    { name: "Mais", icon: MoreHorizontal, bg: "#474747" },
  ];

  return (
    <View
      style={{
        width: "100%",
        borderRadius: radii.xl,
        backgroundColor: colors.system.shareSheetBg,
        padding: 20,
        gap: 18,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.12)",
        }}
      >
        <AppText variant="title3" color={colors.grayscale[100]}>
          Compartilhar Link
        </AppText>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {channels.map((ch) => {
          const IconComp = ch.icon;
          return (
            <TouchableOpacity
              key={ch.name}
              activeOpacity={0.8}
              style={{ alignItems: "center", gap: 6 }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: ch.bg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconComp size={22} color={colors.grayscale[100]} />
              </View>
              <AppText variant="footnote" color={colors.grayscale[200]}>
                {ch.name}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      <View
        style={{
          height: 54,
          borderRadius: radii.lg,
          backgroundColor: "#1C202B",
          borderWidth: 1,
          borderColor: colors.grayscale[500],
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <AppText
          variant="body2"
          color={colors.grayscale[100]}
          numberOfLines={1}
        >
          {link}
        </AppText>

        <TouchableOpacity
          onPress={() => {
            setCopied(true);
            onCopy?.();
          }}
        >
          <AppText variant="headline" color={colors.primary[100]}>
            {copied ? "Copiado!" : "Copiar"}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

