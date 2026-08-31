import * as SecureStore from "expo-secure-store";
import type { AuthTokens } from "@/types";

const ACCESS = "dm_mobile_access";
const REFRESH = "dm_mobile_refresh";
let accessCache: string | null = null;

export async function saveTokens(tokens: AuthTokens) {
  accessCache = tokens.access_token;
  await Promise.all([
    SecureStore.setItemAsync(ACCESS, tokens.access_token),
    SecureStore.setItemAsync(REFRESH, tokens.refresh_token),
  ]);
}
export async function getAccessToken() {
  if (accessCache) return accessCache;
  accessCache = await SecureStore.getItemAsync(ACCESS);
  return accessCache;
}
export function setAccessToken(value: string) {
  accessCache = value;
  return SecureStore.setItemAsync(ACCESS, value);
}
export function getRefreshToken() {
  return SecureStore.getItemAsync(REFRESH);
}
export async function clearTokens() {
  accessCache = null;
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS),
    SecureStore.deleteItemAsync(REFRESH),
  ]);
}
export async function hasStoredSession() {
  return !!(await SecureStore.getItemAsync(REFRESH));
}
