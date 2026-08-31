import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import type { AuthTokens } from "@/types";

const ACCESS = "dm_mobile_access";
const REFRESH = "dm_mobile_refresh";
let accessCache: string | null = null;
const setStored = (key: string, value: string) =>
  Platform.OS === "web"
    ? AsyncStorage.setItem(key, value)
    : SecureStore.setItemAsync(key, value);
const getStored = (key: string) =>
  Platform.OS === "web"
    ? AsyncStorage.getItem(key)
    : SecureStore.getItemAsync(key);
const deleteStored = (key: string) =>
  Platform.OS === "web"
    ? AsyncStorage.removeItem(key)
    : SecureStore.deleteItemAsync(key);

export async function saveTokens(tokens: AuthTokens) {
  accessCache = tokens.access_token;
  await Promise.all([
    setStored(ACCESS, tokens.access_token),
    setStored(REFRESH, tokens.refresh_token),
  ]);
}
export async function getAccessToken() {
  if (accessCache) return accessCache;
  accessCache = await getStored(ACCESS);
  return accessCache;
}
export function setAccessToken(value: string) {
  accessCache = value;
  return setStored(ACCESS, value);
}
export function getRefreshToken() {
  return getStored(REFRESH);
}
export async function clearTokens() {
  accessCache = null;
  await Promise.all([
    deleteStored(ACCESS),
    deleteStored(REFRESH),
  ]);
}
export async function hasStoredSession() {
  return !!(await getStored(REFRESH));
}
