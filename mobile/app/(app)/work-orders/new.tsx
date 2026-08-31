import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { apiWithOfflineCache } from "@/services/offline-cache";
import { enqueue } from "@/services/offline-queue";
import type { Machine } from "@/types";
import { workOrderSchema, type WorkOrderForm } from "@/validation/schemas";
import { useAuth } from "@/providers/auth-provider";
import { useNetwork } from "@/providers/network-provider";
import { AppButton, Card, FormField, Screen } from "@/components/ui";
import { BackHeader } from "@/components/BackHeader";
import { ChoiceField } from "@/components/ChoiceField";

type CompanyData = {
  members: Array<{
    id: number;
    name: string;
    role: string;
    is_active: boolean;
  }>;
};
export default function NewWorkOrder() {
  const params = useLocalSearchParams<{ machine_id?: string }>(),
    router = useRouter(),
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
    { control, handleSubmit } = useForm<WorkOrderForm>({
      resolver: zodResolver(workOrderSchema),
      defaultValues: {
        machine_id: params.machine_id || "",
        title: "",
        description: "",
        priority: "Normal",
        assigned_user_id: user ? String(user.id) : "",
        due_date: "",
      },
    }),
    mutation = useMutation({
      mutationFn: async (values: WorkOrderForm) => {
        const body = {
          ...values,
          machine_id: values.machine_id || null,
          assigned_user_id: Number(values.assigned_user_id),
          due_date: values.due_date || null,
        };
        if (!online && user) {
          await enqueue(user.id, {
            method: "POST",
            path: "/api/work-orders",
            body,
            kind: "work-order",
          });
          return { queued: true };
        }
        return api<{ id: number }>("/api/work-orders", {
          method: "POST",
          body: JSON.stringify(body),
        });
      },
      onSuccess: async (result) => {
        await qc.invalidateQueries({ queryKey: ["work-orders"] });
        await refresh();
        if ("queued" in result) {
          Alert.alert(
            "Çevrimdışı kaydedildi",
            "İş emri internet geldiğinde gönderilecek.",
          );
          router.replace("/(app)/(tabs)/work-orders");
        } else router.replace(`/(app)/work-orders/${result.id}`);
      },
      onError: (error) =>
        Alert.alert("İş emri oluşturulamadı", (error as Error).message),
    });
  return (
    <Screen>
      <BackHeader
        title="Yeni iş emri"
        subtitle="Gerçek ekip üyesine görev ata"
      />
      <Card>
        <ChoiceField
          control={control}
          name="machine_id"
          label="Makine"
          choices={[
            { label: "Makine seçilmedi", value: "" },
            ...(machines.data || []).map((x) => ({
              label: x.name,
              value: String(x.id),
            })),
          ]}
        />
        <FormField control={control} name="title" label="İş emri başlığı" />
        <FormField
          control={control}
          name="description"
          label="Açıklama"
          multiline
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
          name="assigned_user_id"
          label="Sorumlu ekip üyesi"
          choices={(company.data?.members || [])
            .filter((x) => x.is_active !== false)
            .map((x) => ({
              label: `${x.name} · ${x.role}`,
              value: String(x.id),
            }))}
        />
        <FormField
          control={control}
          name="due_date"
          label="Termin tarihi"
          placeholder="YYYY-AA-GG"
        />
        <AppButton
          label={online ? "İş emrini oluştur" : "Çevrimdışı kaydet"}
          onPress={handleSubmit((values) => mutation.mutate(values))}
          loading={mutation.isPending}
        />
      </Card>
    </Screen>
  );
}
