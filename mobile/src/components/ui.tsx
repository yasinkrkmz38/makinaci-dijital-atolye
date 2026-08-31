import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from "react-native";
import { useState, type ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useAppTheme, palette, radius, spacing } from "@/theme/tokens";
import { useNetwork } from "@/providers/network-provider";

type IconName = React.ComponentProps<typeof Ionicons>["name"];
export function Screen({
  children,
  scroll = true,
  refreshing = false,
  onRefresh,
  contentStyle,
}: {
  children: ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentStyle?: object;
}) {
  const theme = useAppTheme(),
    content = <View style={[styles.content, contentStyle]}>{children}</View>;
  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.colors.primary}
              />
            ) : undefined
          }
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const t = useAppTheme();
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text
          accessibilityRole="header"
          style={[styles.headerTitle, { color: t.colors.text }]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: t.colors.muted }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}
export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  const t = useAppTheme();
  return (
    <View style={styles.sectionTitle}>
      <Text style={[styles.sectionText, { color: t.colors.text }]}>
        {title}
      </Text>
      {action}
    </View>
  );
}
export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: object;
}) {
  const t = useAppTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: t.colors.surface, borderColor: t.colors.line },
        style,
      ]}
    >
      {children}
    </View>
  );
}
export function AppButton({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "text";
  loading?: boolean;
  disabled?: boolean;
  icon?: IconName;
}) {
  const t = useAppTheme(),
    backgroundColor =
      variant === "primary"
        ? t.colors.primary
        : variant === "danger"
          ? "#FFF2F0"
          : variant === "text"
            ? "transparent"
            : t.colors.surface,
    color =
      variant === "primary"
        ? "#fff"
        : variant === "danger"
          ? t.colors.danger
          : variant === "text"
            ? t.colors.primary
            : t.colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderColor:
            variant === "primary"
              ? "transparent"
              : variant === "danger"
                ? "#EBC4BE"
                : t.colors.line,
          opacity: disabled ? 0.55 : pressed ? 0.78 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={18} color={color} /> : null}
          <Text style={[styles.buttonText, { color }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}
export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  secureTextEntry,
  allowPasswordReveal = false,
  keyboardType = "default",
  multiline = false,
}: {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  allowPasswordReveal?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
}) {
  const t = useAppTheme(),
    [revealed, setRevealed] = useState(false);
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onBlur, onChange },
        fieldState: { error },
      }) => (
        <View style={styles.field}>
          <Text style={[styles.label, { color: t.colors.text }]}>{label}</Text>
          <View style={styles.inputWrap}>
            <TextInput
              accessibilityLabel={label}
              value={String(value ?? "")}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={placeholder}
              placeholderTextColor={t.colors.muted}
              secureTextEntry={secureTextEntry && !revealed}
              keyboardType={keyboardType}
              autoCapitalize={
                keyboardType === "email-address" ? "none" : "sentences"
              }
              multiline={multiline}
              style={[
                styles.input,
                allowPasswordReveal && styles.inputWithAction,
                multiline && styles.textarea,
                {
                  color: t.colors.text,
                  backgroundColor: t.colors.raised,
                  borderColor: error ? t.colors.danger : t.colors.line,
                },
              ]}
            />
            {secureTextEntry && allowPasswordReveal ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={revealed ? "Şifreyi gizle" : "Şifreyi göster"}
                onPress={() => setRevealed((value) => !value)}
                style={styles.inputAction}
              >
                <Ionicons
                  name={revealed ? "eye-off-outline" : "eye-outline"}
                  size={21}
                  color={t.colors.muted}
                />
              </Pressable>
            ) : null}
          </View>
          {error ? (
            <Text style={[styles.error, { color: t.colors.danger }]}>
              {error.message}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
}
export function SearchField({
  value,
  onChange,
  placeholder = "Ara...",
}: {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}) {
  const t = useAppTheme();
  return (
    <View
      style={[
        styles.search,
        { backgroundColor: t.colors.surface, borderColor: t.colors.line },
      ]}
    >
      <Ionicons name="search" size={19} color={t.colors.muted} />
      <TextInput
        accessibilityLabel={placeholder}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={t.colors.muted}
        style={[styles.searchInput, { color: t.colors.text }]}
      />
      {value ? (
        <Pressable
          accessibilityLabel="Aramayı temizle"
          hitSlop={10}
          onPress={() => onChange("")}
        >
          <Ionicons name="close-circle" size={20} color={t.colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}
export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "success" | "danger" | "warning" | "info" | "neutral";
}) {
  const colors = {
    success: ["#E6F7F0", palette.green],
    danger: ["#FFF0EE", palette.red],
    warning: ["#FFF6E8", palette.orange],
    info: ["#EAF1FF", palette.blue],
    neutral: ["#EDF1F3", "#596A75"],
  }[tone];
  return (
    <View style={[styles.badge, { backgroundColor: colors[0] }]}>
      <View style={[styles.dot, { backgroundColor: colors[1] }]} />
      <Text style={[styles.badgeText, { color: colors[1] }]}>{label}</Text>
    </View>
  );
}
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  const t = useAppTheme();
  return (
    <View style={styles.empty}>
      <Ionicons name="file-tray-outline" size={34} color={t.colors.muted} />
      <Text style={[styles.emptyTitle, { color: t.colors.text }]}>{title}</Text>
      <Text style={[styles.emptyBody, { color: t.colors.muted }]}>{body}</Text>
      {action}
    </View>
  );
}
export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  const t = useAppTheme();
  return (
    <Card>
      <View style={styles.empty}>
        <Ionicons name="warning-outline" size={34} color={palette.red} />
        <Text style={[styles.emptyTitle, { color: t.colors.text }]}>
          İçerik yüklenemedi
        </Text>
        <Text style={[styles.emptyBody, { color: t.colors.muted }]}>
          {message}
        </Text>
        {onRetry ? (
          <AppButton
            label="Tekrar dene"
            onPress={onRetry}
            variant="secondary"
          />
        ) : null}
      </View>
    </Card>
  );
}
export function Skeleton({ rows = 3 }: { rows?: number }) {
  const t = useAppTheme();
  return (
    <View style={{ gap: 10 }}>
      {Array.from({ length: rows }, (_, index) => (
        <View
          key={index}
          style={[
            styles.skeleton,
            { backgroundColor: t.dark ? "#1D3A4C" : "#DFE7EC" },
          ]}
        />
      ))}
    </View>
  );
}
export function MetricCard({
  label,
  value,
  icon,
  tone = "info",
  onPress,
}: {
  label: string;
  value: string | number;
  icon: IconName;
  tone?: "info" | "danger" | "warning" | "success";
  onPress?: () => void;
}) {
  const t = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.metric,
        {
          backgroundColor: t.colors.surface,
          borderColor: t.colors.line,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.metricIcon,
          {
            backgroundColor:
              tone === "danger"
                ? "#FFF0EE"
                : tone === "warning"
                  ? "#FFF6E8"
                  : tone === "success"
                    ? "#E6F7F0"
                    : "#EAF1FF",
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={
            tone === "danger"
              ? palette.red
              : tone === "warning"
                ? palette.orange
                : tone === "success"
                  ? palette.green
                  : palette.blue
          }
        />
      </View>
      <Text style={[styles.metricValue, { color: t.colors.text }]}>
        {value}
      </Text>
      <Text style={[styles.metricLabel, { color: t.colors.muted }]}>
        {label}
      </Text>
    </Pressable>
  );
}
export function OfflineBanner() {
  const { online, pending, syncing, sync } = useNetwork();
  if (online && !pending) return null;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={sync}
      style={[
        styles.offline,
        { backgroundColor: online ? "#FFF6E8" : "#FFF0EE" },
      ]}
    >
      <Ionicons
        name={online ? "sync" : "cloud-offline"}
        size={18}
        color={online ? palette.orange : palette.red}
      />
      <Text
        style={{
          flex: 1,
          color: online ? "#8A5605" : "#8B3028",
          fontWeight: "700",
        }}
      >
        {online
          ? `${pending} kayıt senkronizasyon bekliyor`
          : "Çevrimdışısınız · kayıtlar taslak olarak saklanır"}
      </Text>
      {syncing ? <ActivityIndicator size="small" /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 110, gap: spacing.lg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  eyebrow: {
    color: palette.blue,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
  },
  headerTitle: { fontSize: 28, fontWeight: "900", letterSpacing: -0.6 },
  subtitle: { fontSize: 13, lineHeight: 19, marginTop: 4 },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  sectionText: { fontSize: 18, fontWeight: "900" },
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: 10,
  },
  button: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: radius.md,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { fontSize: 14, fontWeight: "800" },
  field: { gap: 6 },
  inputWrap: { position: "relative" },
  label: { fontSize: 12, fontWeight: "800" },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  inputWithAction: { paddingRight: 52 },
  inputAction: {
    position: "absolute",
    right: 4,
    top: 3,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  textarea: { height: 112, paddingTop: 12, textAlignVertical: "top" },
  error: { fontSize: 12, fontWeight: "600" },
  search: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  searchInput: { flex: 1, fontSize: 16 },
  badge: {
    alignSelf: "flex-start",
    minHeight: 26,
    paddingHorizontal: 9,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 10, fontWeight: "800" },
  empty: { alignItems: "center", paddingVertical: 24, gap: 8 },
  emptyTitle: { fontSize: 17, fontWeight: "900", textAlign: "center" },
  emptyBody: { fontSize: 13, textAlign: "center", lineHeight: 19 },
  skeleton: { height: 88, borderRadius: radius.lg },
  metric: {
    minWidth: 0,
    flex: 1,
    minHeight: 132,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 14,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  metricValue: { fontSize: 27, fontWeight: "900", marginTop: 8 },
  metricLabel: { fontSize: 11, fontWeight: "700" },
  offline: {
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
