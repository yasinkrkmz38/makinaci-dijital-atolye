import { useEffect, useState } from "react";
import { Alert, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { saveTokens } from "@/services/token-store";
import { registerPushNotifications } from "@/services/push-notifications";
import type { AuthTokens } from "@/types";
import { useAuth } from "@/providers/auth-provider";
import { useAppLock } from "@/providers/app-lock-provider";
import {
  AppButton,
  Card,
  ErrorState,
  Screen,
  SectionTitle,
  Skeleton,
  StatusBadge,
} from "@/components/ui";
import { BackHeader } from "@/components/BackHeader";
import { EntityRow } from "@/components/EntityRow";
import { useAppTheme } from "@/theme/tokens";
import { formatDateTime } from "@/utils/presentation";

type Session = {
  id: string;
  device_name: string;
  ip: string;
  last_seen_at: string;
  created_at: string;
  expires_at: string;
  current: boolean;
  mfa_verified: boolean;
};
type Security = {
  email_verified: boolean;
  email_verification_required: boolean;
  mfa_enabled: boolean;
  mfa_required: boolean;
  sessions: Session[];
};
export default function Account() {
  const t = useAppTheme(),
    { user, logout, reload } = useAuth(),
    { enabled, setEnabled } = useAppLock(),
    [name, setName] = useState(user?.name || ""),
    [current, setCurrent] = useState(""),
    [next, setNext] = useState("");
  useEffect(() => setName(user?.name || ""), [user?.name]);
  const query = useQuery({
    queryKey: ["security"],
    queryFn: () => api<Security>("/api/account/security"),
  });
  const action = useMutation({
    mutationFn: ({
      path,
      method = "POST",
    }: {
      path: string;
      method?: string;
    }) => api(path, { method, body: method === "DELETE" ? undefined : "{}" }),
    onSuccess: () => query.refetch(),
    onError: (error) =>
      Alert.alert("İşlem yapılamadı", (error as Error).message),
  });
  const password = useMutation({
    mutationFn: () =>
      api<AuthTokens & { ok: boolean }>("/api/account/password", {
        method: "POST",
        body: JSON.stringify({
          current_password: current,
          new_password: next,
          client: "mobile",
        }),
      }),
    onSuccess: async (response) => {
      if (response.access_token) await saveTokens(response);
      setCurrent("");
      setNext("");
      await Promise.all([reload(), query.refetch()]);
      Alert.alert(
        "Şifre değiştirildi",
        "Diğer tüm cihaz oturumları kapatıldı.",
      );
    },
    onError: (error) =>
      Alert.alert("Şifre değiştirilemedi", (error as Error).message),
  });
  const profile = useMutation({
    mutationFn: () =>
      api("/api/account/profile", {
        method: "PATCH",
        body: JSON.stringify({ name }),
      }),
    onSuccess: async () => {
      await reload();
      Alert.alert("Profil güncellendi", "Ad soyad bilginiz kaydedildi.");
    },
    onError: (error) =>
      Alert.alert("Profil güncellenemedi", (error as Error).message),
  });
  return (
    <Screen refreshing={query.isRefetching} onRefresh={query.refetch}>
      <BackHeader title="Hesabım ve güvenlik" subtitle={user?.email} />
      {query.isLoading ? (
        <Skeleton rows={4} />
      ) : query.error ? (
        <ErrorState message={(query.error as Error).message} />
      ) : query.data ? (
        <>
          <Card>
            <Text style={[styles.label, { color: t.colors.text }]}>Ad soyad</Text>
            <TextInput
              accessibilityLabel="Ad soyad"
              value={name}
              onChangeText={setName}
              style={[
                styles.input,
                {
                  color: t.colors.text,
                  borderColor: t.colors.line,
                  backgroundColor: t.colors.raised,
                },
              ]}
            />
            <Text style={[styles.help, { color: t.colors.muted }]}>
              Giriş e-postanız: {user?.email}
            </Text>
            <AppButton
              label="Profil adını kaydet"
              variant="secondary"
              disabled={name.trim().length < 2 || name.trim() === user?.name}
              loading={profile.isPending}
              onPress={() => profile.mutate()}
            />
          </Card>
          <Card>
            <View style={styles.line}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: t.colors.text }]}>
                  E-posta doğrulaması
                </Text>
                <Text style={[styles.help, { color: t.colors.muted }]}>
                  {query.data.email_verified
                    ? "Adresiniz doğrulandı."
                    : "İsteğe bağlı; hesabınızı kullanmaya devam edebilirsiniz."}
                </Text>
              </View>
              <StatusBadge
                label={
                  query.data.email_verified ? "Doğrulandı" : "Doğrulanmadı"
                }
                tone={query.data.email_verified ? "success" : "warning"}
              />
            </View>
            {!query.data.email_verified ? (
              <AppButton
                label="Doğrulama e-postası gönder"
                variant="secondary"
                onPress={() =>
                  action.mutate({ path: "/api/account/resend-verification" })
                }
                loading={action.isPending}
              />
            ) : null}
          </Card>
          <Card>
            <View style={styles.line}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: t.colors.text }]}>
                  Biyometrik uygulama kilidi
                </Text>
                <Text style={[styles.help, { color: t.colors.muted }]}>
                  Parmak izi, yüz tanıma veya cihaz kilidiyle korur.
                </Text>
              </View>
              <Switch
                value={enabled}
                onValueChange={async (value) => {
                  if (!(await setEnabled(value)))
                    Alert.alert(
                      "Etkinleştirilemedi",
                      "Cihazınızda biyometrik kimlik tanımlı olmalı.",
                    );
                }}
                trackColor={{ true: t.colors.primary }}
              />
            </View>
            <AppButton
              label="Push bildirimlerini etkinleştir"
              variant="secondary"
              icon="notifications-outline"
              onPress={async () => {
                try {
                  await registerPushNotifications();
                  Alert.alert(
                    "Bildirimler etkin",
                    "Bu cihaz bakım ve görev bildirimlerini alacak.",
                  );
                } catch (error) {
                  Alert.alert(
                    "Bildirimler etkinleştirilemedi",
                    (error as Error).message,
                  );
                }
              }}
            />
          </Card>
          <SectionTitle title="Şifre değiştir" />
          <Card>
            <SecureInput
              label="Mevcut şifre"
              value={current}
              onChange={setCurrent}
            />
            <SecureInput label="Yeni şifre" value={next} onChange={setNext} />
            <AppButton
              label="Şifreyi değiştir ve diğer cihazlardan çık"
              onPress={() => password.mutate()}
              disabled={!current || next.length < 8}
              loading={password.isPending}
            />
          </Card>
          <SectionTitle title="Aktif oturumlar" />
          {query.data.sessions.map((session) => (
            <Card key={session.id}>
              <EntityRow
                title={session.device_name || "Bilinmeyen cihaz"}
                subtitle={`${session.ip || "IP yok"} · ${formatDateTime(session.last_seen_at)}`}
                status={
                  session.current
                    ? "Bu cihaz"
                    : session.mfa_verified
                      ? "MFA doğrulandı"
                      : "Aktif"
                }
                icon="phone-portrait-outline"
              />
              <AppButton
                label={
                  session.current ? "Bu cihazdan çıkış yap" : "Bu oturumu kapat"
                }
                variant={session.current ? "danger" : "secondary"}
                onPress={() =>
                  session.current
                    ? logout()
                    : action.mutate({
                        path: `/api/account/sessions/${session.id}`,
                        method: "DELETE",
                      })
                }
              />
            </Card>
          ))}
          <AppButton
            label="Diğer tüm cihazlardan çıkış yap"
            variant="danger"
            onPress={() =>
              action.mutate({ path: "/api/account/sessions/revoke-others" })
            }
          />
          <Card>
            <View style={styles.line}>
              <Text style={[styles.label, { color: t.colors.text }]}>
                İki adımlı doğrulama
              </Text>
              <StatusBadge
                label={query.data.mfa_enabled ? "Etkin" : "Kapalı"}
                tone={query.data.mfa_enabled ? "success" : "neutral"}
              />
            </View>
            <Text style={[styles.help, { color: t.colors.muted }]}>
              MFA kurulumu için web hesabınızdaki Güvenlik bölümünü
              kullanabilirsiniz. Aktif MFA, mobil girişte de zorunludur.
            </Text>
          </Card>
        </>
      ) : null}
    </Screen>
  );
}
function SecureInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const t = useAppTheme();
  return (
    <View style={{ gap: 6 }}>
      <Text style={[styles.label, { color: t.colors.text }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        secureTextEntry
        style={[
          styles.input,
          {
            color: t.colors.text,
            borderColor: t.colors.line,
            backgroundColor: t.colors.raised,
          },
        ]}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  line: { flexDirection: "row", alignItems: "center", gap: 10 },
  label: { fontSize: 13, fontWeight: "900" },
  help: { fontSize: 11, lineHeight: 17, marginTop: 3 },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 13,
    fontSize: 16,
  },
});
