import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { Part } from "@/types";
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
import { useAuth } from "@/providers/auth-provider";
import { canUser } from "@/services/permissions";

type Movement = {
  id: number;
  movement_type: "in" | "out" | "count";
  quantity: number;
  previous_qty: number;
  new_qty: number;
  note?: string;
  user_name?: string;
  created_at: string;
};
export default function PartDetail() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    t = useAppTheme(),
    { user } = useAuth(),
    qc = useQueryClient(),
    [type, setType] = useState<"in" | "out" | "count">("in"),
    [quantity, setQuantity] = useState(""),
    [note, setNote] = useState(""),
    parts = useQuery({
      queryKey: ["parts"],
      queryFn: () => api<Part[]>("/api/parts"),
    }),
    movements = useQuery({
      queryKey: ["part-movements", id],
      queryFn: () => api<Movement[]>(`/api/parts/${id}/movements`),
    }),
    part = parts.data?.find((x) => String(x.id) === id),
    mutation = useMutation({
      mutationFn: () =>
        api(`/api/parts/${id}/movement`, {
          method: "POST",
          body: JSON.stringify({
            type,
            quantity: Number(quantity.replace(",", ".")),
            note,
          }),
        }),
      onSuccess: async () => {
        setQuantity("");
        setNote("");
        await Promise.all([
          qc.invalidateQueries({ queryKey: ["parts"] }),
          movements.refetch(),
        ]);
      },
      onError: (error) =>
        Alert.alert("Stok hareketi yapılamadı", (error as Error).message),
    });
  if (parts.isLoading)
    return (
      <Screen>
        <BackHeader title="Stok kartı" />
        <Skeleton rows={4} />
      </Screen>
    );
  if (parts.error || !part)
    return (
      <Screen>
        <BackHeader title="Stok kartı" />
        <ErrorState
          message={(parts.error as Error)?.message || "Parça bulunamadı"}
        />
      </Screen>
    );
  return (
    <Screen>
      <BackHeader title={part.name} subtitle={part.part_code} />
      <StatusBadge
        label={
          part.quantity <= part.min_quantity ? "Düşük stok" : "Stok yeterli"
        }
        tone={part.quantity <= part.min_quantity ? "danger" : "success"}
      />
      <Card>
        <Text style={[styles.quantity, { color: t.colors.text }]}>
          {part.quantity}{" "}
          <Text style={{ fontSize: 16 }}>{part.unit || "adet"}</Text>
        </Text>
        <Text style={{ color: t.colors.muted }}>
          Minimum: {part.min_quantity} · Konum: {part.location || "—"}
        </Text>
      </Card>
      {canUser(user, "work") ? <>
      <SectionTitle title="Yeni stok hareketi" />
      <Card>
        <View style={styles.row}>
          <AppButton
            label="Giriş"
            variant={type === "in" ? "primary" : "secondary"}
            onPress={() => setType("in")}
          />
          <AppButton
            label="Çıkış"
            variant={type === "out" ? "primary" : "secondary"}
            onPress={() => setType("out")}
          />
          <AppButton
            label="Sayım"
            variant={type === "count" ? "primary" : "secondary"}
            onPress={() => setType("count")}
          />
        </View>
        <Text style={{ color: t.colors.text, fontSize: 12, fontWeight: "800" }}>
          {type === "count" ? "Yeni sayım miktarı" : "Hareket miktarı"}
        </Text>
        <TextInput
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={t.colors.muted}
          style={[
            styles.input,
            {
              color: t.colors.text,
              borderColor: t.colors.line,
              backgroundColor: t.colors.raised,
            },
          ]}
        />
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Hareket notu"
          placeholderTextColor={t.colors.muted}
          style={[
            styles.input,
            {
              color: t.colors.text,
              borderColor: t.colors.line,
              backgroundColor: t.colors.raised,
            },
          ]}
        />
        <AppButton
          label="Stok hareketini kaydet"
          onPress={() => mutation.mutate()}
          disabled={!quantity}
          loading={mutation.isPending}
        />
      </Card>
      </> : null}
      <SectionTitle title="Hareket geçmişi" />
      {movements.isLoading ? (
        <Skeleton rows={3} />
      ) : (
        movements.data?.map((item) => (
          <EntityRow
            key={item.id}
            title={
              item.movement_type === "in"
                ? "Stok girişi"
                : item.movement_type === "out"
                  ? "Stok çıkışı"
                  : "Sayım düzeltmesi"
            }
            subtitle={item.note || item.user_name}
            status={`${item.previous_qty} → ${item.new_qty}`}
            meta={new Date(item.created_at).toLocaleString("tr-TR")}
            icon="swap-horizontal-outline"
          />
        ))
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  quantity: { fontSize: 34, fontWeight: "900" },
  row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 13,
    fontSize: 16,
  },
});
