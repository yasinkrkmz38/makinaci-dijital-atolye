import { useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ViewToken,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppButton } from "@/components/ui";
import { useAuth } from "@/providers/auth-provider";
import { useAppTheme } from "@/theme/tokens";

const slides = [
  {
    icon: "construct-outline" as const,
    title: "Makine parkınız cebinizde",
    body: "Makineleri, arızaları, bakım geçmişini ve QR kimliklerini sahada tek ekrandan yönetin.",
  },
  {
    icon: "clipboard-outline" as const,
    title: "Ekibiniz aynı iş akışında",
    body: "Gerçek teknisyen ataması, iş emri zamanı, checklist, parça ve olay geçmişi birlikte çalışır.",
  },
  {
    icon: "cloud-offline-outline" as const,
    title: "Bağlantı kesilse de iş durmaz",
    body: "Arıza, bakım, iş emri ve saha fotoğrafları güvenle bekler; internet geldiğinde tekilleştirilerek gönderilir.",
  },
];

export default function Onboarding() {
  const t = useAppTheme(),
    router = useRouter(),
    { user } = useAuth(),
    { width } = useWindowDimensions(),
    list = useRef<FlatList<(typeof slides)[number]>>(null),
    [index, setIndex] = useState(0);
  const finish = async () => {
    await AsyncStorage.setItem("dm_onboarding_v1", "done");
    router.replace(user ? "/(app)/(tabs)" : "/(auth)/login");
  };
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.colors.background }]}>
      <View style={styles.top}>
        <View style={[styles.brand, { backgroundColor: t.colors.header }]}>
          <Ionicons name="construct" size={24} color="#fff" />
        </View>
        <Text style={[styles.brandText, { color: t.colors.text }]}>Dijital Makinacı</Text>
        <Pressable accessibilityRole="button" onPress={finish} style={styles.skip}>
          <Text style={{ color: t.colors.primary, fontWeight: "800" }}>Geç</Text>
        </Pressable>
      </View>
      <FlatList
        ref={list}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        onViewableItemsChanged={({ viewableItems }: { viewableItems: ViewToken[] }) => {
          if (viewableItems[0]?.index !== null && viewableItems[0]?.index !== undefined)
            setIndex(viewableItems[0].index);
        }}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.illustration, { backgroundColor: t.colors.raised, borderColor: t.colors.line }]}>
              <Ionicons name={item.icon} size={78} color={t.colors.primary} />
            </View>
            <Text style={[styles.title, { color: t.colors.text }]}>{item.title}</Text>
            <Text style={[styles.body, { color: t.colors.muted }]}>{item.body}</Text>
          </View>
        )}
      />
      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((slide, dot) => (
            <View key={slide.title} style={[styles.dot, { backgroundColor: dot === index ? t.colors.primary : t.colors.line, width: dot === index ? 24 : 8 }]} />
          ))}
        </View>
        <AppButton
          label={index === slides.length - 1 ? "Dijital Makinacı'yı aç" : "Devam et"}
          onPress={() => {
            if (index === slides.length - 1) finish();
            else list.current?.scrollToIndex({ index: index + 1, animated: true });
          }}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1 },
  top: { minHeight: 66, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", gap: 10 },
  brand: { width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  brandText: { flex: 1, fontSize: 17, fontWeight: "900" },
  skip: { minWidth: 48, minHeight: 44, alignItems: "center", justifyContent: "center" },
  slide: { flex: 1, paddingHorizontal: 24, alignItems: "center", justifyContent: "center", gap: 18 },
  illustration: { width: "100%", maxWidth: 390, aspectRatio: 1.25, borderWidth: 1, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  title: { maxWidth: 380, fontSize: 30, lineHeight: 36, fontWeight: "900", textAlign: "center", letterSpacing: -0.7 },
  body: { maxWidth: 380, fontSize: 15, lineHeight: 23, textAlign: "center" },
  footer: { padding: 20, paddingBottom: 26, gap: 18 },
  dots: { height: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  dot: { height: 8, borderRadius: 8 },
});
