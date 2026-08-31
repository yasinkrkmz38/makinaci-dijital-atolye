import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/theme/tokens";

const icon =
  (
    active: keyof typeof Ionicons.glyphMap,
    inactive: keyof typeof Ionicons.glyphMap,
  ) =>
  (props: { color: ColorValue; size: number; focused: boolean }) => (
    <Ionicons name={props.focused ? active : inactive} {...props} />
  );
export default function TabLayout() {
  const t = useAppTheme(),
    insets = useSafeAreaInsets(),
    bottom = Math.max(insets.bottom, 8);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.colors.primary,
        tabBarInactiveTintColor: t.colors.muted,
        tabBarStyle: {
          backgroundColor: t.colors.surface,
          borderTopColor: t.colors.line,
          height: 60 + bottom,
          paddingTop: 6,
          paddingBottom: bottom,
        },
        tabBarItemStyle: { minHeight: 48 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "800" },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ana Sayfa",
          tabBarAccessibilityLabel: "Ana sayfa",
          tabBarIcon: icon("grid", "grid-outline"),
        }}
      />
      <Tabs.Screen
        name="machines"
        options={{
          title: "Makineler",
          tabBarAccessibilityLabel: "Makineler",
          tabBarIcon: icon("construct", "construct-outline"),
        }}
      />
      <Tabs.Screen
        name="work-orders"
        options={{
          title: "İş Emirleri",
          tabBarAccessibilityLabel: "İş emirleri",
          tabBarIcon: icon("clipboard", "clipboard-outline"),
        }}
      />
      <Tabs.Screen
        name="faults"
        options={{
          title: "Arızalar",
          tabBarAccessibilityLabel: "Arızalar",
          tabBarIcon: icon("warning", "warning-outline"),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "Daha Fazla",
          tabBarAccessibilityLabel: "Daha fazla",
          tabBarIcon: icon("apps", "apps-outline"),
        }}
      />
    </Tabs>
  );
}
