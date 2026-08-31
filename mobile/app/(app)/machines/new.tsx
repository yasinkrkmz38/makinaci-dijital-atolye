import { Alert } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { api } from "@/services/api";
import { machineSchema, type MachineForm } from "@/validation/schemas";
import { AppButton, Card, FormField, Screen } from "@/components/ui";
import { BackHeader } from "@/components/BackHeader";
import { ChoiceField } from "@/components/ChoiceField";

export default function NewMachine() {
  const router = useRouter(),
    qc = useQueryClient(),
    { control, handleSubmit } = useForm<MachineForm>({
      resolver: zodResolver(machineSchema),
      defaultValues: {
        name: "",
        manufacturer: "",
        model: "",
        serial_no: "",
        location: "",
        criticality: "Normal",
        note: "",
      },
    }),
    mutation = useMutation({
      mutationFn: (body: MachineForm) =>
        api<{ id: number }>("/api/machines", {
          method: "POST",
          body: JSON.stringify(body),
        }),
      onSuccess: async (row) => {
        await qc.invalidateQueries({ queryKey: ["machines"] });
        router.replace(`/(app)/machines/${row.id}`);
      },
      onError: (error) =>
        Alert.alert("Makine eklenemedi", (error as Error).message),
    });
  return (
    <Screen>
      <BackHeader
        title="Yeni makine"
        subtitle="Firma varlık envanterine ekle"
      />
      <Card>
        <FormField control={control} name="name" label="Makine adı" />
        <FormField control={control} name="manufacturer" label="Üretici" />
        <FormField control={control} name="model" label="Model" />
        <FormField control={control} name="serial_no" label="Seri numarası" />
        <FormField control={control} name="location" label="Konum" />
        <ChoiceField
          control={control}
          name="criticality"
          label="Kritiklik"
          choices={["Düşük", "Normal", "Yüksek", "Kritik"].map((x) => ({
            label: x,
            value: x,
          }))}
        />
        <FormField control={control} name="note" label="Not" multiline />
        <AppButton
          label="Makineyi kaydet"
          onPress={handleSubmit((values) => mutation.mutate(values))}
          loading={mutation.isPending}
        />
      </Card>
    </Screen>
  );
}
