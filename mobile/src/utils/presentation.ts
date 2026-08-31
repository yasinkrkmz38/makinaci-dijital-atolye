export type SemanticTone =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "neutral";

export type Presentation = {
  label: string;
  tone: SemanticTone;
  icon: string;
};

const normalize = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/[\s-]+/g, "_");

const statusMap: Record<string, Presentation> = {
  open: { label: "Açık", tone: "danger", icon: "alert-circle-outline" },
  new: { label: "Yeni", tone: "info", icon: "sparkles-outline" },
  pending: { label: "Bekliyor", tone: "warning", icon: "time-outline" },
  waiting: { label: "Bekliyor", tone: "warning", icon: "time-outline" },
  reviewing: { label: "İnceleniyor", tone: "info", icon: "search-outline" },
  assigned: { label: "Atandı", tone: "info", icon: "person-outline" },
  in_progress: { label: "Devam Ediyor", tone: "warning", icon: "play-outline" },
  processing: { label: "İşlemde", tone: "warning", icon: "sync-outline" },
  waiting_part: { label: "Parça Bekliyor", tone: "warning", icon: "cube-outline" },
  paused: { label: "Duraklatıldı", tone: "neutral", icon: "pause-outline" },
  on_hold: { label: "Beklemeye Alındı", tone: "neutral", icon: "pause-outline" },
  completed: { label: "Tamamlandı", tone: "success", icon: "checkmark-circle-outline" },
  complete: { label: "Tamamlandı", tone: "success", icon: "checkmark-circle-outline" },
  done: { label: "Tamamlandı", tone: "success", icon: "checkmark-circle-outline" },
  resolved: { label: "Çözüldü", tone: "success", icon: "checkmark-circle-outline" },
  closed: { label: "Kapatıldı", tone: "success", icon: "lock-closed-outline" },
  cancelled: { label: "İptal Edildi", tone: "neutral", icon: "close-circle-outline" },
  canceled: { label: "İptal Edildi", tone: "neutral", icon: "close-circle-outline" },
  archived: { label: "Arşivlendi", tone: "neutral", icon: "archive-outline" },
  active: { label: "Aktif", tone: "success", icon: "checkmark-circle-outline" },
  inactive: { label: "Pasif", tone: "neutral", icon: "remove-circle-outline" },
  çalışıyor: { label: "Çalışıyor", tone: "success", icon: "checkmark-circle-outline" },
  calisiyor: { label: "Çalışıyor", tone: "success", icon: "checkmark-circle-outline" },
  bakımda: { label: "Bakımda", tone: "warning", icon: "build-outline" },
  arızalı: { label: "Arızalı", tone: "danger", icon: "warning-outline" },
  arizali: { label: "Arızalı", tone: "danger", icon: "warning-outline" },
  devre_dışı: { label: "Devre Dışı", tone: "neutral", icon: "power-outline" },
  ok: { label: "Uygun", tone: "success", icon: "checkmark-circle-outline" },
  not_ok: { label: "Uygunsuz", tone: "danger", icon: "close-circle-outline" },
  finding: { label: "Bulgu", tone: "warning", icon: "search-outline" },
  machine: { label: "Makine", tone: "info", icon: "construct-outline" },
  maintenance: { label: "Bakım", tone: "info", icon: "calendar-outline" },
  work_order: { label: "İş Emri", tone: "info", icon: "clipboard-outline" },
  fault: { label: "Arıza", tone: "danger", icon: "warning-outline" },
  part: { label: "Parça", tone: "neutral", icon: "cube-outline" },
  article: { label: "Makale", tone: "neutral", icon: "book-outline" },
  status_changed: { label: "Durum Değişti", tone: "info", icon: "swap-horizontal-outline" },
  comment_added: { label: "Yorum Eklendi", tone: "neutral", icon: "chatbubble-outline" },
  timer_started: { label: "Çalışma Başladı", tone: "success", icon: "play-outline" },
  timer_stopped: { label: "Çalışma Durdu", tone: "neutral", icon: "stop-outline" },
  created: { label: "Oluşturuldu", tone: "info", icon: "add-circle-outline" },
  updated: { label: "Güncellendi", tone: "info", icon: "create-outline" },
};

const priorityMap: Record<string, Presentation> = {
  low: { label: "Düşük", tone: "neutral", icon: "arrow-down-outline" },
  düşük: { label: "Düşük", tone: "neutral", icon: "arrow-down-outline" },
  dusuk: { label: "Düşük", tone: "neutral", icon: "arrow-down-outline" },
  normal: { label: "Normal", tone: "info", icon: "remove-outline" },
  medium: { label: "Orta", tone: "info", icon: "remove-outline" },
  orta: { label: "Orta", tone: "info", icon: "remove-outline" },
  high: { label: "Yüksek", tone: "warning", icon: "arrow-up-outline" },
  yüksek: { label: "Yüksek", tone: "warning", icon: "arrow-up-outline" },
  yuksek: { label: "Yüksek", tone: "warning", icon: "arrow-up-outline" },
  critical: { label: "Kritik", tone: "danger", icon: "warning-outline" },
  kritik: { label: "Kritik", tone: "danger", icon: "warning-outline" },
};

const roleMap: Record<string, string> = {
  owner: "Firma Sahibi",
  manager: "Yönetici",
  maintenance_manager: "Bakım Yöneticisi",
  technician: "Teknisyen",
  operator: "Operatör",
  warehouse_manager: "Depo Yöneticisi",
  viewer: "Görüntüleyici",
  admin: "Platform Yöneticisi",
};

export function humanizeEnum(value: unknown) {
  const raw = String(value ?? "").trim();
  if (!raw) return "Belirtilmedi";
  const spaced = raw.replace(/[_-]+/g, " ");
  return spaced.charAt(0).toLocaleUpperCase("tr-TR") + spaced.slice(1);
}

export function statusPresentation(value: unknown): Presentation {
  const key = normalize(value);
  return (
    statusMap[key] || {
      label: humanizeEnum(value),
      tone: /kritik|arız|gecik|error|fail/i.test(key)
        ? "danger"
        : /bakım|bekle|progress|işlem/i.test(key)
          ? "warning"
          : /tamam|çalış|active|ok/i.test(key)
            ? "success"
            : "neutral",
      icon: "ellipse-outline",
    }
  );
}

export function priorityPresentation(value: unknown): Presentation {
  return (
    priorityMap[normalize(value)] || {
      label: humanizeEnum(value),
      tone: "neutral",
      icon: "flag-outline",
    }
  );
}

export function roleLabel(value: unknown) {
  return roleMap[normalize(value)] || humanizeEnum(value);
}

function dateFrom(value: unknown) {
  if (!value) return null;
  const raw = String(value).trim();
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: unknown, fallback = "Tarih belirtilmedi") {
  const date = dateFrom(value);
  return date
    ? new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(date)
    : fallback;
}

export function formatDateTime(value: unknown, fallback = "Tarih belirtilmedi") {
  const date = dateFrom(value);
  return date
    ? new Intl.DateTimeFormat("tr-TR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date)
    : fallback;
}

export function formatPossibleDate(value: unknown) {
  const raw = String(value ?? "");
  return /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(raw) ? formatDate(raw, raw) : raw;
}

export function isOverdue(value: unknown, status?: unknown) {
  const date = dateFrom(value);
  if (!date || ["completed", "done", "closed", "cancelled"].includes(normalize(status)))
    return false;
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  return date.getTime() < end.getTime();
}
