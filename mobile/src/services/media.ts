import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { apiUpload } from "./api";

export type UploadAsset = { uri: string; name: string; mimeType: string };
export async function pickPhoto(camera = false): Promise<UploadAsset | null> {
  if (camera) {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted)
      throw new Error("Fotoğraf çekmek için kamera izni gerekli");
  }
  const result = camera
    ? await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.82,
        allowsEditing: false,
      })
    : await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.82,
        allowsMultipleSelection: false,
      });
  if (result.canceled) return null;
  const asset = result.assets[0];
  if (!asset) return null;
  return {
    uri: asset.uri,
    name: asset.fileName || `saha-${Date.now()}.jpg`,
    mimeType: asset.mimeType || "image/jpeg",
  };
}
export async function pickDocument(): Promise<UploadAsset | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (result.canceled) return null;
  const asset = result.assets[0];
  if (!asset) return null;
  return {
    uri: asset.uri,
    name: asset.name,
    mimeType: asset.mimeType || "application/octet-stream",
  };
}
export async function uploadAsset(
  path: string,
  asset: UploadAsset,
  caption = "",
  idempotencyKey?: string,
) {
  const form = new FormData();
  form.append("file", {
    uri: asset.uri,
    name: asset.name,
    type: asset.mimeType,
  } as unknown as Blob);
  form.append("caption", caption);
  return apiUpload(path, form, true, idempotencyKey);
}

const offlineDirectory = FileSystem.documentDirectory
  ? `${FileSystem.documentDirectory}offline-media/`
  : null;
export async function persistOfflineAsset(asset: UploadAsset) {
  if (!offlineDirectory)
    throw new Error("Bu cihaz çevrimdışı dosya saklamayı desteklemiyor");
  await FileSystem.makeDirectoryAsync(offlineDirectory, {
    intermediates: true,
  });
  const safeName = asset.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120),
    uri = `${offlineDirectory}${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`;
  await FileSystem.copyAsync({ from: asset.uri, to: uri });
  return { ...asset, uri };
}
export async function cleanupOfflineAsset(asset: UploadAsset) {
  if (offlineDirectory && asset.uri.startsWith(offlineDirectory))
    await FileSystem.deleteAsync(asset.uri, { idempotent: true });
}
