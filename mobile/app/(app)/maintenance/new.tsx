import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { apiWithOfflineCache } from "@/services/offline-cache";
import { enqueue } from "@/services/offline-queue";
import type { Machine } from "@/types";
import { maintenanceSchema, type MaintenanceForm } from "@/validation/schemas";
import { AppButton, Card, FormField, Screen } from "@/components/ui";
import { BackHeader } from "@/components/BackHeader";
import { ChoiceField } from "@/components/ChoiceField";
import { useAuth } from "@/providers/auth-provider";
import { useNetwork } from "@/providers/network-provider";

type CompanyData = {
  members: Array<{
    id: number;
    name: string;
    role: string;
    is_active: boolean;
  }>;
};
export default function NewMaintenance() {
  const router = useRouter(),
    qc = useQueryClient(),
    { user } = useAuth(),
    { online, refresh } = useNetwork(),
    machines = useQuery({
      queryKey: ["machines"],
      queryFn: () =>
        user?.company
          ? apiWithOfflineCache<Machine[]>({
              userId: user.id,
              companyId: user.company.id,
              name: "machines_all",
              path: "/api/machines",
            })
          : api<Machine[]>("/api/machines"),
    }),
    company = useQuery({
      queryKey: ["company"],
      queryFn: () =>
        user?.company
          ? apiWithOfflineCache<CompanyData>({
              userId: user.id,
              companyId: user.company.id,
              name: "company_team",
              path: "/api/company",
            })
          : api<CompanyData>("/api/company"),
    }),
    { control, handleSubmit, watch } = useForm<MaintenanceForm>({
      resolver: zodResolver(maintenanceSchema),
      defaultValues: {
        machine_id: "",
        task: "",
        due_date: new Date().toISOString().slice(0, 10),
        priority: "Normal",
        technician_user_id: "",
        recurrence_type: "none",
        interval_value: "",
        note: "",
      },
    }),
    recurrence = watch("recurrence_type"),
    mutation = useMutation({
      mutationFn: async (values: MaintenanceForm) => {
        const body = {
            ...values,
            machine_id: Number(values.machine_id),
            technician_user_id: Number(values.technician_user_id),
            interval_months:
              values.recurrence_type === "calendar"
                ? Number(values.interval_value)
                : null,
            interval_hours:
              values.recurrence_type === "hours"
                ? Number(values.interval_value)
                : null,
            checklist: [
              "Görsel kontrol",
              "Emniyet kontrolleri",
              "Ölçüm ve test",
            ],
          };
        if (!online && user) {
          await enqueue(user.id, {
            method: "POST",
            path: "/api/maintenance",
            body,
            kind: "maintenance",
          });
          return { queued: true };
        }
        return api<{ id: number }>("/api/maintenance", {
          method: "POST",
          body: JSON.stringify(body),
        });
      },
      onSuccess: async (row) => {
        await qc.invalidateQueries({ queryKey: ["maintenance"] });
        await refresh();
        if ("queued" in row) {
          Alert.alert(
            "Çevrimdışı kaydedildi",
            "Bakım planı internet geldiğinde güvenli biçimde gönderilecek.",
          );
          router.replace("/(app)/maintenance");
        } else router.replace(`/(app)/maintenance/${row.id}`);
      },
      onError: (error) =>
        Alert.alert("Bakım oluşturulamadı", (error as Error).message),
    });
  return (
    <Screen>
      <BackHeader
        title="Yeni bakım planı"
        subtitle="Takvim veya sayaç bazlı otomatik tekrar"
      />
      <Card>
        <ChoiceField
          control={control}
          name="machine_id"
          label="Makine"
          choices={(machines.data || []).map((x) => ({
            label: x.name,
            value: String(x.id),
          }))}
        />
        <FormField control={control} name="task" label="Bakım görevi" />
        <FormField
          control={control}
          name="due_date"
          label="İlk bakım tarihi"
          placeholder="YYYY-AA-GG"
        />
        <ChoiceField
          control={control}
          name="priority"
          label="Öncelik"
          choices={["Düşük", "Normal", "Yüksek", "Kritik"].map((x) => ({
            label: x,
            value: x,
          }))}
        />
        <ChoiceField
          control={control}
          name="technician_user_id"
          label="Teknisyen"
          choices={(company.data?.members || [])
            .filter((x) => x.is_active !== false)
            .map((x) => ({ label: x.name, value: String(x.id) }))}
        />
        <ChoiceField
          control={control}
          name="recurrence_type"
          label="Tekrar"
          choices={[
            { label: "Tekrarsız", value: "none" },
            { label: "Takvim (ay)", value: "calendar" },
            { label: "Çalışma saati", value: "hours" },
          ]}
        />
        {recurrence !== "none" ? (
          <FormField
            control={control}
            name="interval_value"
            label={
              recurrence === "calendar" ? "Kaç ayda bir?" : "Kaç saatte bir?"
            }
            keyboardType="numeric"
          />
        ) : null}
        <FormField
          control={control}
          name="note"
          label="Talimat / not"
          multiline
        />
        <AppButton
          label={online ? "Bakım planını oluştur" : "Çevrimdışı kaydet"}
          onPress={handleSubmit((values) => mutation.mutate(values))}
          loading={mutation.isPending}
        />
      </Card>
    </Screen>
  );
}
