import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Application from "expo-application";
import { EAS_PROJECT_ID } from "@/constants/config";
import { api } from "./api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
export async function registerPushNotifications() {
  if (!Device.isDevice)
    throw new Error("Push bildirimleri fiziksel cihazda etkinleştirilebilir");
  if (!EAS_PROJECT_ID)
    throw new Error("EXPO_PUBLIC_EAS_PROJECT_ID henüz yapılandırılmamış");
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("operations", {
      name: "Operasyon bildirimleri",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
    });
    await Notifications.setNotificationChannelAsync("critical", {
      name: "Kritik saha uyarıları",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 300, 150, 300],
    });
  }
  let permission = await Notifications.getPermissionsAsync();
  if (permission.status !== "granted")
    permission = await Notifications.requestPermissionsAsync();
  if (permission.status !== "granted")
    throw new Error("Bildirim izni verilmedi");
  const token = (
    await Notifications.getExpoPushTokenAsync({ projectId: EAS_PROJECT_ID })
  ).data;
  await api("/api/mobile/push/register", {
    method: "POST",
    body: JSON.stringify({
      expo_push_token: token,
      platform: Platform.OS,
      device_name: Device.deviceName || Device.modelName || Platform.OS,
      app_version: Application.nativeApplicationVersion || "1.0.0",
    }),
  });
  return token;
}
