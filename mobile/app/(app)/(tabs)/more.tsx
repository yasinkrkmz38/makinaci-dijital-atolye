import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { PageHeader, Screen, SectionTitle } from "@/components/ui";
import { useAuth } from "@/providers/auth-provider";
import { useAppTheme } from "@/theme/tokens";

const items = [
  ["Global arama", "Tüm firma kayıtlarında ara", "search-outline", "/(app)/search"],
  [
    "Bakım planları",
    "Takvim, saat ve checklist",
    "calendar-outline",
    "/(app)/maintenance",
  ],
  ["Stok ve parçalar", "Giriş, çıkış ve sayım", "cube-outline", "/(app)/parts"],
  [
    "Firma ve ekip",
    "Üyeler, roller ve e-posta davetleri",
    "people-outline",
    "/(app)/company",
  ],
  [
    "Arıza Teşhis Merkezi",
    "Karar ağaçlarıyla teşhis",
    "git-branch-outline",
    "/(app)/diagnosis",
  ],
  [
    "Teknik kütüphane",
    "Standartlar ve saha notları",
    "library-outline",
    "/(app)/library",
  ],
  [
    "Hesaplama araçları",
    "10 teknik hesaplayıcı",
    "calculator-outline",
    "/(app)/calculators",
  ],
  [
    "Raporlar",
    "Bakım ve güvenilirlik KPI",
    "bar-chart-outline",
    "/(app)/reports",
  ],
  [
    "Çevrimdışı kayıtlar",
    "Bekleyen saha işlemleri",
    "cloud-offline-outline",
    "/(app)/offline",
  ],
] as const;
export default function More() {
  const t = useAppTheme(),
    router = useRouter(),
    { user } = useAuth();
  return (
    <Screen>
      <PageHeader
        eyebrow="DİJİTAL MAKİNACI"
        title="Daha Fazla"
        subtitle="Tüm CMMS modülleri ve hesap ayarları"
      />
      <Pressable
        onPress={() => router.push("/(app)/account")}
        style={[styles.profile, { backgroundColor: t.colors.header }]}
      >
        <View style={styles.avatar}>
          <Text style={styles.initial}>
            {user?.name?.slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.mail}>{user?.email}</Text>
          <Text style={styles.company}>
            {user?.company?.name} · {user?.company_role}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#fff" />
      </Pressable>
      <SectionTitle title="Operasyon modülleri" />
      <View style={styles.list}>
        {items.map(([title, body, icon, path]) => (
          <Pressable
            key={title}
            onPress={() => router.push(path)}
            style={({ pressed }) => [
              styles.item,
              {
                backgroundColor: t.colors.surface,
                borderColor: t.colors.line,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <View
              style={[styles.itemIcon, { backgroundColor: t.colors.raised }]}
            >
              <Ionicons name={icon} size={22} color={t.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemTitle, { color: t.colors.text }]}>
                {title}
              </Text>
              <Text style={[styles.itemBody, { color: t.colors.muted }]}>
                {body}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={t.colors.muted} />
          </Pressable>
        ))}
      </View>
      {user?.platform_admin ? (
        <>
          <SectionTitle title="Platform yönetimi" />
          <Pressable
            onPress={() => router.push("/(app)/admin")}
            style={[
              styles.item,
              { backgroundColor: t.colors.surface, borderColor: t.colors.line },
            ]}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color={t.colors.primary}
            />
            <Text style={[styles.itemTitle, { color: t.colors.text, flex: 1 }]}>
              Admin Center
            </Text>
            <Ionicons name="chevron-forward" size={18} color={t.colors.muted} />
          </Pressable>
        </>
      ) : null}
    </Screen>
  );
}
const styles = StyleSheet.create({
  profile: {
    borderRadius: 20,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#2D6CDF",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: { color: "#fff", fontWeight: "900", fontSize: 21 },
  name: { color: "#fff", fontSize: 17, fontWeight: "900" },
  mail: { color: "#C9D8E1", fontSize: 12 },
  company: { color: "#8FB5FF", fontSize: 11, fontWeight: "800", marginTop: 3 },
  list: { gap: 9 },
  item: {
    minHeight: 72,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  itemTitle: { fontSize: 14, fontWeight: "900" },
  itemBody: { fontSize: 11, marginTop: 3 },
});
