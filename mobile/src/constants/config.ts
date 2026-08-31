import Constants from "expo-constants";

const configured =
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  "https://dijitalmakinaci.pro";
export const API_URL = String(configured).replace(/\/$/, "");
if (!/^https:\/\//.test(API_URL) && !__DEV__)
  throw new Error("Production API adresi HTTPS olmalı");
export const EAS_PROJECT_ID =
  process.env.EXPO_PUBLIC_EAS_PROJECT_ID ||
  Constants.expoConfig?.extra?.eas?.projectId ||
  "";
export const APP_NAME = "Dijital Makinacı";
export const REQUEST_TIMEOUT = 20_000;
export const LIST_PAGE_SIZE = 25;
