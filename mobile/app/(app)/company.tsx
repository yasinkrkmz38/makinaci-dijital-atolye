import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/services/api";
import { useAuth } from "@/providers/auth-provider";
import type { Company, CompanyRole } from "@/types";
import { BackHeader } from "@/components/BackHeader";
import { ChoiceField } from "@/components/ChoiceField";
import {
  AppButton,
  Card,
  EmptyState,
  ErrorState,
  FormField,
  Screen,
  SectionTitle,
  Skeleton,
  StatusBadge,
} from "@/components/ui";
import { useAppTheme } from "@/theme/tokens";

type Member = {
  id: number;
  name: string;
  email: string;
  role: CompanyRole;
  is_active: boolean;
};
type CompanyData = {
  active: Company;
  companies: Company[];
  members: Member[];
  permissions: {
    canManageCompany: boolean;
    canManageRoles: boolean;
  };
};
type Invitation = {
  id: number;
  email: string;
  role: CompanyRole;
  status: string;
  expires_at: string;
  last_sent_at?: string;
};

const roles: Array<{ label: string; value: CompanyRole }> = [
  { label: "Yönetici", value: "manager" },
  { label: "Bakım yöneticisi", value: "maintenance_manager" },
  { label: "Teknisyen", value: "technician" },
  { label: "Operatör", value: "operator" },
  { label: "Depo yöneticisi", value: "warehouse_manager" },
  { label: "Görüntüleyici", value: "viewer" },
];
const roleLabel = (role: CompanyRole) =>
  ([{ label: "Firma sahibi", value: "owner" }, ...roles].find(
    (item) => item.value === role,
  )?.label || role);
const inviteSchema = z.object({
  email: z.string().trim().email("Geçerli bir e-posta girin"),
  role: z.enum([
    "manager",
    "maintenance_manager",
    "technician",
    "operator",
    "warehouse_manager",
    "viewer",
  ]),
});
type InviteForm = z.infer<typeof inviteSchema>;

export default function CompanyScreen() {
  const t = useAppTheme(),
    qc = useQueryClient(),
    { user, reload } = useAuth(),
    [editing, setEditing] = useState<Member | null>(null),
    query = useQuery({
      queryKey: ["company"],
      queryFn: () => api<CompanyData>("/api/company"),
    }),
    invitations = useQuery({
      queryKey: ["company-invitations", query.data?.active.id],
      queryFn: () => api<Invitation[]>("/api/company/invitations"),
      enabled: !!query.data?.permissions.canManageCompany,
    }),
    { control, handleSubmit, reset } = useForm<InviteForm>({
      resolver: zodResolver(inviteSchema),
      defaultValues: { email: "", role: "technician" },
    });

  const refreshCompany = async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["company"] }),
      qc.invalidateQueries({ queryKey: ["company-invitations"] }),
    ]);
  };
  const invite = useMutation({
    mutationFn: (values: InviteForm) =>
      api<Invitation>("/api/company/invitations", {
        method: "POST",
        body: JSON.stringify(values),
      }),
    onSuccess: async () => {
      reset();
      await refreshCompany();
      Alert.alert("Davet gönderildi", "Davet bağlantısı e-posta ile gönderildi.");
    },
    onError: (error) => Alert.alert("Davet gönderilemedi", error.message),
  });
  const action = useMutation({
    mutationFn: ({ method, path, body }: { method: string; path: string; body?: object }) =>
      api(path, { method, body: body ? JSON.stringify(body) : undefined }),
    onSuccess: refreshCompany,
    onError: (error) => Alert.alert("İşlem tamamlanamadı", error.message),
  });
  const switchCompany = useMutation({
    mutationFn: (id: number) => api<Company>(`/api/company/switch/${id}`, { method: "POST" }),
    onSuccess: async () => {
      qc.clear();
      await reload();
      Alert.alert("Firma değiştirildi", "Aktif çalışma alanınız güncellendi.");
    },
    onError: (error) => Alert.alert("Firma değiştirilemedi", error.message),
  });
  const confirmRemove = (member: Member) =>
    Alert.alert(
      "Ekip üyesini çıkar",
      `${member.name} bu firmanın kayıtlarına erişemeyecek. Devam edilsin mi?`,
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Çıkar",
          style: "destructive",
          onPress: () =>
            action.mutate({ method: "DELETE", path: `/api/company/members/${member.id}` }),
        },
      ],
    );
  const confirmCancel = (item: Invitation) =>
    Alert.alert("Daveti iptal et", `${item.email} daveti iptal edilsin mi?`, [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "İptal et",
        style: "destructive",
        onPress: () =>
          action.mutate({ method: "DELETE", path: `/api/company/invitations/${item.id}` }),
      },
    ]);

  if (query.isLoading)
    return (
      <Screen>
        <BackHeader title="Firma ve ekip" />
        <Skeleton rows={5} />
      </Screen>
    );
  if (query.error || !query.data)
    return (
      <Screen>
        <BackHeader title="Firma ve ekip" />
        <ErrorState message={(query.error as Error)?.message || "Firma bilgisi bulunamadı"} onRetry={query.refetch} />
      </Screen>
    );

  const data = query.data;
  return (
    <Screen refreshing={query.isRefetching} onRefresh={query.refetch}>
      <BackHeader title="Firma ve ekip" subtitle="Üyeler, roller ve bekleyen davetler" />

      {data.companies.length > 1 ? (
        <>
          <SectionTitle title="Çalışma alanları" />
          <View style={styles.companyList}>
            {data.companies.map((company) => {
              const active = company.id === data.active.id;
              return (
                <Pressable
                  key={company.id}
                  disabled={active || switchCompany.isPending}
                  onPress={() => switchCompany.mutate(company.id)}
                  style={[
                    styles.company,
                    {
                      backgroundColor: active ? t.colors.raised : t.colors.surface,
                      borderColor: active ? t.colors.primary : t.colors.line,
                    },
                  ]}
                >
                  <Ionicons name={active ? "checkmark-circle" : "business-outline"} size={22} color={active ? t.colors.primary : t.colors.muted} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.name, { color: t.colors.text }]}>{company.name}</Text>
                    <Text style={[styles.detail, { color: t.colors.muted }]}>{roleLabel(company.role)}</Text>
                  </View>
                  {active ? <StatusBadge label="Aktif" tone="success" /> : null}
                </Pressable>
              );
            })}
          </View>
        </>
      ) : null}

      <SectionTitle title={`Ekip üyeleri · ${data.members.length}`} />
      <View style={styles.list}>
        {data.members.map((member) => (
          <Card key={member.id}>
            <View style={styles.memberTop}>
              <View style={[styles.avatar, { backgroundColor: t.colors.raised }]}>
                <Text style={{ color: t.colors.primary, fontWeight: "900" }}>
                  {member.name.slice(0, 1).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: t.colors.text }]}>{member.name}</Text>
                <Text style={[styles.detail, { color: t.colors.muted }]}>{member.email}</Text>
              </View>
              <StatusBadge label={roleLabel(member.role)} tone={member.role === "owner" ? "info" : "neutral"} />
            </View>
            {data.permissions.canManageRoles && member.id !== user?.id && member.role !== "owner" ? (
              editing?.id === member.id ? (
                <View style={styles.actions}>
                  {roles.map((role) => (
                    <Pressable
                      key={role.value}
                      onPress={() => {
                        action.mutate({
                          method: "PATCH",
                          path: `/api/company/members/${member.id}`,
                          body: { role: role.value },
                        });
                        setEditing(null);
                      }}
                      style={[styles.roleButton, { borderColor: t.colors.line }]}
                    >
                      <Text style={{ color: t.colors.text, fontSize: 11, fontWeight: "800" }}>{role.label}</Text>
                    </Pressable>
                  ))}
                  <AppButton label="Kapat" variant="text" onPress={() => setEditing(null)} />
                </View>
              ) : (
                <View style={styles.buttonRow}>
                  <AppButton label="Rolü değiştir" variant="secondary" onPress={() => setEditing(member)} />
                  <AppButton label="Ekipten çıkar" variant="danger" onPress={() => confirmRemove(member)} />
                </View>
              )
            ) : null}
          </Card>
        ))}
      </View>

      {data.permissions.canManageCompany ? (
        <>
          <SectionTitle title="Yeni ekip daveti" />
          <Card>
            <FormField control={control} name="email" label="E-posta" keyboardType="email-address" placeholder="teknisyen@firma.com" />
            <ChoiceField control={control} name="role" label="Firma rolü" choices={roles} />
            <AppButton label="E-posta daveti gönder" icon="mail-outline" loading={invite.isPending} onPress={handleSubmit((values) => invite.mutate(values))} />
          </Card>

          <SectionTitle title={`Bekleyen davetler · ${invitations.data?.length || 0}`} />
          {invitations.isLoading ? (
            <Skeleton rows={2} />
          ) : invitations.error ? (
            <ErrorState message={(invitations.error as Error).message} onRetry={invitations.refetch} />
          ) : invitations.data?.length ? (
            invitations.data.map((item) => (
              <Card key={item.id}>
                <Text style={[styles.name, { color: t.colors.text }]}>{item.email}</Text>
                <Text style={[styles.detail, { color: t.colors.muted }]}>
                  {roleLabel(item.role)} · Son tarih {new Date(item.expires_at).toLocaleDateString("tr-TR")}
                </Text>
                <View style={styles.buttonRow}>
                  <AppButton
                    label="Tekrar gönder"
                    variant="secondary"
                    icon="refresh"
                    loading={action.isPending}
                    onPress={() => action.mutate({ method: "POST", path: `/api/company/invitations/${item.id}/resend` })}
                  />
                  <AppButton label="İptal et" variant="danger" onPress={() => confirmCancel(item)} />
                </View>
              </Card>
            ))
          ) : (
            <EmptyState title="Bekleyen davet yok" body="Gönderdiğiniz yeni davetler burada görünür." />
          )}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  companyList: { gap: 8 },
  company: {
    minHeight: 68,
    borderWidth: 1,
    borderRadius: 16,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  list: { gap: 10 },
  memberTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 14, fontWeight: "900" },
  detail: { fontSize: 11, lineHeight: 17, marginTop: 2 },
  buttonRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  actions: { gap: 7 },
  roleButton: {
    minHeight: 42,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
});
