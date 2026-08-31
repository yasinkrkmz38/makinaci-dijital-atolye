import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { api } from "@/services/api";
import { AppButton, Card, ErrorState, Screen, Skeleton } from "@/components/ui";
import { BackHeader } from "@/components/BackHeader";
import { EntityRow } from "@/components/EntityRow";
import { useAppTheme } from "@/theme/tokens";

type System = { system_key: string; label: string; node_count: number };
type Node = {
  node_key: string;
  question?: string;
  yes_next?: string;
  no_next?: string;
  result_text?: string;
  checks?: string[];
};
type Tree = { system: string; root: string; nodes: Node[] };
export default function Diagnosis() {
  const t = useAppTheme(),
    router = useRouter(),
    [system, setSystem] = useState<System | null>(null),
    [nodeKey, setNodeKey] = useState(""),
    systems = useQuery({
      queryKey: ["diagnosis-systems"],
      queryFn: () => api<System[]>("/api/diagnosis/systems"),
    }),
    tree = useQuery({
      queryKey: ["diagnosis-tree", system?.system_key],
      queryFn: () => api<Tree>(`/api/diagnosis/trees/${system!.system_key}`),
      enabled: !!system,
    });
  useEffect(() => {
    if (tree.data) setNodeKey(tree.data.root);
  }, [tree.data]);
  const node = useMemo(
    () => tree.data?.nodes.find((x) => x.node_key === nodeKey),
    [tree.data, nodeKey],
  );
  if (!system)
    return (
      <Screen>
        <BackHeader
          title="Arıza Teşhis Merkezi"
          subtitle="Belirtileri sistematik karar ağacıyla değerlendirin"
        />
        {systems.isLoading ? (
          <Skeleton rows={5} />
        ) : systems.error ? (
          <ErrorState message={(systems.error as Error).message} />
        ) : (
          systems.data?.map((item) => (
            <EntityRow
              key={item.system_key}
              title={item.label}
              subtitle={`${item.node_count} teşhis adımı`}
              icon="git-branch-outline"
              onPress={() => setSystem(item)}
            />
          ))
        )}
      </Screen>
    );
  if (tree.isLoading || !node)
    return (
      <Screen>
        <BackHeader title={system.label} />
        <Skeleton rows={4} />
      </Screen>
    );
  const result = !!node.result_text && !node.question;
  return (
    <Screen>
      <BackHeader title={system.label} subtitle="Teşhis karar ağacı" />
      <Card>
        <Text style={[styles.step, { color: t.colors.primary }]}>
          {result ? "TEŞHİS SONUCU" : "KONTROL ADIMI"}
        </Text>
        <Text style={[styles.question, { color: t.colors.text }]}>
          {node.question || node.result_text}
        </Text>
        {Array.isArray(node.checks) && node.checks.length ? (
          <View style={{ gap: 7 }}>
            {node.checks.map((check) => (
              <Text
                key={check}
                style={{ color: t.colors.muted, lineHeight: 20 }}
              >
                • {check}
              </Text>
            ))}
          </View>
        ) : null}
      </Card>
      {result ? (
        <>
          <AppButton
            label="Bu sonuçtan arıza kaydı oluştur"
            icon="add-circle-outline"
            onPress={() =>
              router.push({
                pathname: "/(app)/faults/new",
                params: {
                  system: system.system_key,
                  symptom: node.result_text || "",
                  diagnosis: node.result_text || "",
                },
              })
            }
          />
          <AppButton
            label="Teşhisi yeniden başlat"
            variant="secondary"
            onPress={() => setNodeKey(tree.data!.root)}
          />
        </>
      ) : (
        <View style={styles.actions}>
          <AppButton
            label="Evet"
            onPress={() => node.yes_next && setNodeKey(node.yes_next)}
          />
          <AppButton
            label="Hayır"
            variant="secondary"
            onPress={() => node.no_next && setNodeKey(node.no_next)}
          />
        </View>
      )}
      <AppButton
        label="Sistem seçimine dön"
        variant="text"
        onPress={() => {
          setSystem(null);
          setNodeKey("");
        }}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  step: { fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  question: {
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 28,
    marginVertical: 10,
  },
  actions: { flexDirection: "row", gap: 10 },
});
