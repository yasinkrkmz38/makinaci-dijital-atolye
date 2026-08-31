import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { ColorValue } from "react-native";
import { useAppTheme } from "@/theme/tokens";

const icon =
  (name: keyof typeof Ionicons.glyphMap) =>
  (props: { color: ColorValue; size: number }) => (
    <Ionicons name={name} {...props} />
  );
export default function TabLayout() {
  const t = useAppTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.colors.primary,
        tabBarInactiveTintColor: t.colors.muted,
        tabBarStyle: {
          backgroundColor: t.colors.surface,
          borderTopColor: t.colors.line,
          height: 68,
          paddingTop: 7,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "800" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Ana Sayfa", tabBarIcon: icon("grid-outline") }}
      />
      <Tabs.Screen
        name="machines"
        options={{ title: "Makineler", tabBarIcon: icon("construct-outline") }}
      />
      <Tabs.Screen
        name="work-orders"
        options={{
          title: "İş Emirleri",
          tabBarIcon: icon("clipboard-outline"),
        }}
      />
      <Tabs.Screen
        name="faults"
        options={{ title: "Arızalar", tabBarIcon: icon("warning-outline") }}
      />
      <Tabs.Screen
        name="more"
        options={{ title: "Daha Fazla", tabBarIcon: icon("apps-outline") }}
      />
    </Tabs>
  );
}
