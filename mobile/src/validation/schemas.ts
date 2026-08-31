import { z } from "zod";

const email = z.string().trim().email("Geçerli bir e-posta adresi girin");
export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Şifrenizi girin"),
});
export const registerSchema = z.object({
  name: z.string().trim().min(2, "Ad en az 2 karakter olmalı"),
  email,
  password: z
    .string()
    .min(10, "Şifre en az 10 karakter olmalı")
    .regex(/[A-ZÇĞİÖŞÜ]/, "En az bir büyük harf ekleyin")
    .regex(/[a-zçğıöşü]/, "En az bir küçük harf ekleyin")
    .regex(/[0-9]/, "En az bir rakam ekleyin"),
});
export const forgotSchema = z.object({ email });
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(10, "Şifre en az 10 karakter olmalı")
      .regex(/[A-ZÇĞİÖŞÜ]/, "En az bir büyük harf ekleyin")
      .regex(/[a-zçğıöşü]/, "En az bir küçük harf ekleyin")
      .regex(/[0-9]/, "En az bir rakam ekleyin"),
    confirmation: z.string(),
  })
  .refine((value) => value.password === value.confirmation, {
    path: ["confirmation"],
    message: "Şifreler aynı olmalı",
  });
export const mfaSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(
      /^\d{6}$|^[A-Z0-9-]{8,}$/,
      "6 haneli kodu veya kurtarma kodunu girin",
    ),
});
export const machineSchema = z.object({
  name: z.string().trim().min(2, "Makine adı gerekli"),
  manufacturer: z.string().trim(),
  model: z.string().trim(),
  serial_no: z.string().trim(),
  location: z.string().trim(),
  criticality: z.enum(["Düşük", "Normal", "Yüksek", "Kritik"]),
  note: z.string().trim(),
});
export const faultSchema = z.object({
  machine_id: z.string(),
  title: z.string().trim().min(3, "Arıza başlığı gerekli"),
  category: z.string().trim().min(1, "Kategori seçin"),
  system: z.string().trim(),
  symptom: z.string().trim().min(3, "Belirtiyi açıklayın"),
  severity: z.enum(["Düşük", "Orta", "Yüksek", "Kritik"]),
  assigned_user_id: z.string(),
  note: z.string().trim(),
});
export const workOrderSchema = z.object({
  machine_id: z.string(),
  title: z.string().trim().min(3, "Başlık gerekli"),
  description: z.string().trim(),
  priority: z.enum(["Düşük", "Normal", "Yüksek", "Kritik"]),
  assigned_user_id: z.string(),
  due_date: z.string(),
});
export const maintenanceSchema = z
  .object({
    machine_id: z.string().min(1, "Makine seçin"),
    task: z.string().trim().min(3, "Bakım görevini yazın"),
    due_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih YYYY-AA-GG biçiminde olmalı"),
    priority: z.enum(["Düşük", "Normal", "Yüksek", "Kritik"]),
    technician_user_id: z.string().min(1, "Teknisyen seçin"),
    recurrence_type: z.enum(["none", "calendar", "hours"]),
    interval_value: z.string(),
    note: z.string().trim(),
  })
  .superRefine((value, ctx) => {
    if (
      value.recurrence_type !== "none" &&
      (!(Number(value.interval_value) > 0) ||
        !Number.isFinite(Number(value.interval_value)))
    )
      ctx.addIssue({
        code: "custom",
        path: ["interval_value"],
        message: "Periyot 0’dan büyük olmalı",
      });
  });

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ForgotForm = z.infer<typeof forgotSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
export type MfaForm = z.infer<typeof mfaSchema>;
export type MachineForm = z.infer<typeof machineSchema>;
export type FaultForm = z.infer<typeof faultSchema>;
export type WorkOrderForm = z.infer<typeof workOrderSchema>;
export type MaintenanceForm = z.infer<typeof maintenanceSchema>;
