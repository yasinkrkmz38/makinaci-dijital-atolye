import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, BackHandler, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "@/providers/app-provider";
import { useAppTheme } from "@/theme/tokens";

function Navigator() {
  const theme = useAppTheme(),
    router = useRouter(),
    pathname = usePathname();
  useEffect(() => {
    if (Platform.OS !== "android" || pathname !== "/") return;
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        Alert.alert("Uygulamadan çık", "Dijital Makinacı kapatılsın mı?", [
          { text: "Vazgeç", style: "cancel" },
          {
            text: "Çık",
            style: "destructive",
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      },
    );
    return () => subscription.remove();
  }, [pathname]);
  useEffect(() => {
    const openNotification = (response: Notifications.NotificationResponse) => {
        const url = String(response.notification.request.content.data?.url || ""),
          section = new URL(url, "https://local").searchParams.get("section"),
          routes: Record<string, string> = {
            dashboard: "/(app)/(tabs)",
            maintenance: "/(app)/maintenance",
            workorders: "/(app)/(tabs)/work-orders",
            parts: "/(app)/parts",
            diagnosis: "/(app)/diagnosis",
          };
        router.push(routes[section || ""] || "/(app)/notifications");
      },
      subscription = Notifications.addNotificationResponseReceivedListener(openNotification);
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) openNotification(response);
    });
    return () => subscription.remove();
  }, [router]);
  return (
    <>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: "slide_from_right",
        }}
      />
    </>
  );
}
export default function RootLayout() {
  return (
    <AppProvider>
      <Navigator />
    </AppProvider>
  );
}
