import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, ApiError } from "./api";
import { cleanupOfflineAsset, uploadAsset } from "./media";
import type { QueueItem } from "@/types";

const key = (userId: number) => `dm_offline_queue_${userId}`;
export const createRequestId = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16),
      value = character === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
export async function getQueue(userId: number): Promise<QueueItem[]> {
  try {
    return JSON.parse((await AsyncStorage.getItem(key(userId))) || "[]");
  } catch {
    return [];
  }
}
async function setQueue(userId: number, items: QueueItem[]) {
  await AsyncStorage.setItem(key(userId), JSON.stringify(items.slice(-100)));
}
export async function enqueue(
  userId: number,
  item: Omit<QueueItem, "id" | "createdAt" | "attempts">,
) {
  const queue = await getQueue(userId),
    queued: { id: string; createdAt: string; attempts: number } & typeof item =
      {
        ...item,
        id: createRequestId(),
        createdAt: new Date().toISOString(),
        attempts: 0,
      };
  await setQueue(userId, [...queue, queued]);
  return queued;
}
export async function removeQueued(userId: number, id: string) {
  await setQueue(
    userId,
    (await getQueue(userId)).filter((item) => item.id !== id),
  );
}
export async function clearQueue(userId: number) {
  await AsyncStorage.removeItem(key(userId));
}
export async function syncQueue(userId: number) {
  const queue = await getQueue(userId),
    remaining: QueueItem[] = [];
  let synced = 0;
  for (const item of queue) {
    let recordCreated = false;
    try {
      const result = await api<{ id?: number }>(item.path, {
        method: item.method,
        headers: { "X-Idempotency-Key": item.id },
        body: JSON.stringify(item.body),
      });
      recordCreated = true;
      if (item.attachments?.length) {
        if (!result.id) throw new Error("Dosyanın bağlanacağı kayıt bulunamadı");
        const uploadPath =
          item.kind === "fault"
            ? `/api/faults/${result.id}/attachments`
            : item.kind === "work-order"
              ? `/api/work-orders/${result.id}/attachments`
              : null;
        if (!uploadPath)
          throw new Error("Bu kayıt türünde çevrimdışı dosya desteği yok");
        for (const attachment of item.attachments)
          await uploadAsset(uploadPath, attachment, "", attachment.id);
        await Promise.all(item.attachments.map(cleanupOfflineAsset));
      }
      synced++;
    } catch (error) {
      const permanent =
        error instanceof ApiError &&
        error.status >= 400 &&
        error.status < 500 &&
        error.status !== 408 &&
        error.status !== 429;
      if (!permanent || recordCreated)
        remaining.push({
          ...item,
          attempts: item.attempts + 1,
          lastError: (error as Error).message,
        });
    }
  }
  await setQueue(userId, remaining);
  return { synced, pending: remaining.length };
}
