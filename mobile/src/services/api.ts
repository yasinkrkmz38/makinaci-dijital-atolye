import { Platform } from "react-native";
import * as Application from "expo-application";
import { API_URL, REQUEST_TIMEOUT } from "@/constants/config";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "./token-store";
import type { ApiErrorPayload, AuthTokens } from "@/types";

export class ApiError extends Error {
  constructor(
    message: string,
    public status = 0,
    public code = "API_ERROR",
  ) {
    super(message);
  }
}
let refreshPromise: Promise<boolean> | null = null;
let authExpiredHandler: (() => void) | null = null;
export const setAuthExpiredHandler = (handler: (() => void) | null) => {
  authExpiredHandler = handler;
};
// OkHttp rejects non-ASCII HTTP header values before a request reaches the network.
// Keep the human-readable Turkish product name in the UI, but use a strictly
// printable ASCII identifier in request headers.
const deviceName =
  `Dijital Makinaci ${Platform.OS === "android" ? "Android" : "iOS"} ${String(Platform.Version)}`.replace(
    /[^\x20-\x7e]/g,
    "",
  );

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let data: unknown = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: "Sunucu yanıtı okunamadı" };
  }
  if (!response.ok) {
    const payload = data as ApiErrorPayload;
    throw new ApiError(
      payload.error ||
        payload.message ||
        `İstek başarısız (${response.status})`,
      response.status,
      payload.code || "API_ERROR",
    );
  }
  return data as T;
}
async function refreshSession() {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    const refresh_token = await getRefreshToken();
    if (!refresh_token) return false;
    try {
      const controller = new AbortController(),
        timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
      const response = await fetch(`${API_URL}/api/auth/mobile/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-DM-Client": "mobile",
          "X-Device-Name": deviceName,
        },
        body: JSON.stringify({ refresh_token, client: "mobile" }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const tokens = await parseResponse<AuthTokens>(response);
      await saveTokens(tokens);
      return true;
    } catch (error) {
      if (
        error instanceof ApiError &&
        (error.status === 401 || error.status === 403)
      ) {
        await clearTokens();
        authExpiredHandler?.();
      }
      return false;
    }
  })().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}
export async function api<T>(
  path: string,
  options: RequestInit & { auth?: boolean; retry?: boolean } = {},
): Promise<T> {
  const { auth = true, retry = true, ...request } = options,
    controller = new AbortController(),
    timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  const token = auth ? await getAccessToken() : null;
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...request,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-DM-Client": "mobile",
        "X-Device-Name": deviceName,
        "X-App-Version": Application.nativeApplicationVersion || "1.0.0",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(request.headers || {}),
      },
    });
    clearTimeout(timer);
    if (response.status === 401 && auth && retry && (await refreshSession()))
      return api<T>(path, { ...options, retry: false });
    return await parseResponse<T>(response);
  } catch (error) {
    clearTimeout(timer);
    if (error instanceof ApiError) throw error;
    if ((error as Error).name === "AbortError")
      throw new ApiError(
        "Sunucu beklenenden uzun sürdü. Render uyanıyor olabilir; tekrar deneyin.",
        0,
        "TIMEOUT",
      );
    throw new ApiError(
      "İnternet bağlantısı kurulamadı. Çevrimdışı taslak kullanabilirsiniz.",
      0,
      "NETWORK_ERROR",
    );
  }
}
export async function apiUpload<T>(
  path: string,
  form: FormData,
  retry = true,
  idempotencyKey?: string,
): Promise<T> {
  const token = await getAccessToken(),
    controller = new AbortController(),
    timer = setTimeout(() => controller.abort(), 60_000);
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "X-DM-Client": "mobile",
        "X-Device-Name": deviceName,
        ...(idempotencyKey ? { "X-Idempotency-Key": idempotencyKey } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: form,
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (response.status === 401 && retry && (await refreshSession()))
      return apiUpload<T>(path, form, false, idempotencyKey);
    return parseResponse<T>(response);
  } catch (error) {
    clearTimeout(timer);
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      "Dosya yüklenemedi. Bağlantıyı ve dosya boyutunu kontrol edin.",
      0,
      "UPLOAD_FAILED",
    );
  }
}
