import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, ApiError } from "./api";

type CacheEnvelope<T> = { savedAt: string; data: T };
const cacheKey = (userId: number, companyId: number, name: string) =>
  `dm_offline_cache_v1_${userId}_${companyId}_${name}`;

export async function getCached<T>(
  userId: number,
  companyId: number,
  name: string,
): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(cacheKey(userId, companyId, name));
    if (!value) return null;
    return (JSON.parse(value) as CacheEnvelope<T>).data;
  } catch {
    return null;
  }
}

export async function cacheData<T>(
  userId: number,
  companyId: number,
  name: string,
  data: T,
) {
  await AsyncStorage.setItem(
    cacheKey(userId, companyId, name),
    JSON.stringify({ savedAt: new Date().toISOString(), data }),
  );
  return data;
}

export async function apiWithOfflineCache<T>({
  userId,
  companyId,
  name,
  path,
}: {
  userId: number;
  companyId: number;
  name: string;
  path: string;
}): Promise<T> {
  try {
    const result = await api<T>(path);
    return cacheData(userId, companyId, name, result);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 0) throw error;
    const cached = await getCached<T>(userId, companyId, name);
    if (cached !== null) return cached;
    throw error;
  }
}
