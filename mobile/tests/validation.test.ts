import { describe, expect, it } from "vitest";
import {
  faultSchema,
  loginSchema,
  maintenanceSchema,
  mfaSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/validation/schemas";

describe("mobil form doğrulamaları", () => {
  it("geçersiz e-posta ile girişi reddeder", () => {
    expect(loginSchema.safeParse({ email: "yanlis", password: "x" }).success).toBe(false);
  });
  it("kayıtta güçlü parola politikasını uygular", () => {
    expect(registerSchema.safeParse({ name: "Ali", email: "ali@example.com", password: "zayif" }).success).toBe(false);
    expect(registerSchema.safeParse({ name: "Ali", email: "ali@example.com", password: "GucluSifre1" }).success).toBe(true);
  });
  it("şifre yenilemede eşleşmeyen parolaları reddeder", () => {
    expect(resetPasswordSchema.safeParse({ password: "GucluSifre1", confirmation: "BaskaSifre2" }).success).toBe(false);
  });
  it("MFA için altı haneli kod veya kurtarma kodu kabul eder", () => {
    expect(mfaSchema.safeParse({ code: "123456" }).success).toBe(true);
    expect(mfaSchema.safeParse({ code: "12" }).success).toBe(false);
  });
  it("bakım periyodunda sıfır, negatif, NaN ve Infinity değerlerini reddeder", () => {
    const base = { machine_id: "1", task: "Yağlama", due_date: "2026-09-01", priority: "Normal", technician_user_id: "2", recurrence_type: "hours", note: "" };
    for (const interval_value of ["0", "-1", "NaN", "Infinity"])
      expect(maintenanceSchema.safeParse({ ...base, interval_value }).success).toBe(false);
  });
  it("arıza için başlık, belirti ve kategori ister", () => {
    expect(faultSchema.safeParse({ machine_id: "1", title: "", category: "", system: "", symptom: "", severity: "Orta", assigned_user_id: "", note: "" }).success).toBe(false);
  });
});
