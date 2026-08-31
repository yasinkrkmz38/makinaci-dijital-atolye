export type CalculatorKey =
  | "cutting_speed"
  | "spindle_speed"
  | "feed_rate"
  | "drill_time"
  | "hydraulic_force"
  | "hydraulic_power"
  | "motor_current"
  | "fit_clearance"
  | "belt_speed"
  | "bearing_life";
export type CalculatorDefinition = {
  key: CalculatorKey;
  title: string;
  description: string;
  fields: Array<{
    key: string;
    label: string;
    unit: string;
    defaultValue?: number;
  }>;
  resultUnit: string;
  calculate: (v: Record<string, number | undefined>) => number;
};
const positive = (value: number | undefined, label: string) => {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0)
    throw new Error(`${label} 0'dan büyük sonlu bir sayı olmalı`);
  return value;
};
const finite = (value: number | undefined, label: string) => {
  if (typeof value !== "number" || !Number.isFinite(value))
    throw new Error(`${label} geçerli bir sayı olmalı`);
  return value;
};
export const calculators: CalculatorDefinition[] = [
  {
    key: "cutting_speed",
    title: "Kesme hızı",
    description: "Çap ve devirden kesme hızını hesaplar.",
    fields: [
      { key: "diameter", label: "Çap", unit: "mm" },
      { key: "rpm", label: "Devir", unit: "dev/dk" },
    ],
    resultUnit: "m/dk",
    calculate: (v) =>
      (Math.PI * positive(v.diameter, "Çap") * positive(v.rpm, "Devir")) / 1000,
  },
  {
    key: "spindle_speed",
    title: "İş mili devri",
    description: "Kesme hızı ve çaptan gerekli devri bulur.",
    fields: [
      { key: "speed", label: "Kesme hızı", unit: "m/dk" },
      { key: "diameter", label: "Çap", unit: "mm" },
    ],
    resultUnit: "dev/dk",
    calculate: (v) =>
      (1000 * positive(v.speed, "Kesme hızı")) /
      (Math.PI * positive(v.diameter, "Çap")),
  },
  {
    key: "feed_rate",
    title: "Freze ilerleme",
    description: "Devir, diş sayısı ve diş başı ilerleme.",
    fields: [
      { key: "rpm", label: "Devir", unit: "dev/dk" },
      { key: "teeth", label: "Diş sayısı", unit: "adet" },
      { key: "feed", label: "Diş başı ilerleme", unit: "mm/diş" },
    ],
    resultUnit: "mm/dk",
    calculate: (v) =>
      positive(v.rpm, "Devir") *
      positive(v.teeth, "Diş sayısı") *
      positive(v.feed, "İlerleme"),
  },
  {
    key: "drill_time",
    title: "Delme süresi",
    description: "Delme boyu ve ilerlemeden işlem süresi.",
    fields: [
      { key: "length", label: "Delme boyu", unit: "mm" },
      { key: "rpm", label: "Devir", unit: "dev/dk" },
      { key: "feed", label: "Devir başı ilerleme", unit: "mm/dev" },
    ],
    resultUnit: "dk",
    calculate: (v) =>
      positive(v.length, "Boy") /
      (positive(v.rpm, "Devir") * positive(v.feed, "İlerleme")),
  },
  {
    key: "hydraulic_force",
    title: "Hidrolik silindir kuvveti",
    description: "Basınç ve piston çapından teorik kuvvet.",
    fields: [
      { key: "pressure", label: "Basınç", unit: "bar" },
      { key: "diameter", label: "Piston çapı", unit: "mm" },
    ],
    resultUnit: "kN",
    calculate: (v) =>
      (positive(v.pressure, "Basınç") *
        0.1 *
        ((Math.PI * positive(v.diameter, "Çap") ** 2) / 4)) /
      1000,
  },
  {
    key: "hydraulic_power",
    title: "Hidrolik güç",
    description: "Basınç ve debiden teorik hidrolik güç.",
    fields: [
      { key: "pressure", label: "Basınç", unit: "bar" },
      { key: "flow", label: "Debi", unit: "L/dk" },
    ],
    resultUnit: "kW",
    calculate: (v) =>
      (positive(v.pressure, "Basınç") * positive(v.flow, "Debi")) / 600,
  },
  {
    key: "motor_current",
    title: "Üç faz motor akımı",
    description: "Güç, gerilim, verim ve güç faktörü.",
    fields: [
      { key: "power", label: "Motor gücü", unit: "kW" },
      { key: "voltage", label: "Hat gerilimi", unit: "V", defaultValue: 400 },
      { key: "efficiency", label: "Verim", unit: "0–1", defaultValue: 0.9 },
      { key: "pf", label: "Güç faktörü", unit: "0–1", defaultValue: 0.85 },
    ],
    resultUnit: "A",
    calculate: (v) =>
      (positive(v.power, "Güç") * 1000) /
      (Math.sqrt(3) *
        positive(v.voltage, "Gerilim") *
        positive(v.efficiency, "Verim") *
        positive(v.pf, "Güç faktörü")),
  },
  {
    key: "fit_clearance",
    title: "Mil–delik boşluğu",
    description: "Sınır ölçülerinden min/max boşluk veya sıkılık.",
    fields: [
      { key: "hole_min", label: "Delik min.", unit: "mm" },
      { key: "hole_max", label: "Delik max.", unit: "mm" },
      { key: "shaft_min", label: "Mil min.", unit: "mm" },
      { key: "shaft_max", label: "Mil max.", unit: "mm" },
    ],
    resultUnit: "mm min. boşluk",
    calculate: (v) =>
      finite(v.hole_min, "Delik min.") - finite(v.shaft_max, "Mil max."),
  },
  {
    key: "belt_speed",
    title: "Kayış-kasnak devri",
    description: "Kasnak çap oranından çıkış devri.",
    fields: [
      { key: "input_rpm", label: "Giriş devri", unit: "dev/dk" },
      { key: "drive_diameter", label: "Tahrik kasnağı", unit: "mm" },
      { key: "driven_diameter", label: "Tahrik edilen", unit: "mm" },
    ],
    resultUnit: "dev/dk",
    calculate: (v) =>
      (positive(v.input_rpm, "Giriş devri") *
        positive(v.drive_diameter, "Tahrik çapı")) /
      positive(v.driven_diameter, "Çıkış çapı"),
  },
  {
    key: "bearing_life",
    title: "Rulman L10 ömrü",
    description: "Dinamik yük oranından bilyalı rulman ömrü.",
    fields: [
      { key: "capacity", label: "Dinamik kapasite C", unit: "kN" },
      { key: "load", label: "Eşdeğer yük P", unit: "kN" },
      { key: "rpm", label: "Devir", unit: "dev/dk" },
    ],
    resultUnit: "saat",
    calculate: (v) =>
      ((positive(v.capacity, "Kapasite") / positive(v.load, "Yük")) ** 3 *
        1_000_000) /
      (60 * positive(v.rpm, "Devir")),
  },
];
export function calculate(key: CalculatorKey, values: Record<string, number>) {
  const definition = calculators.find((item) => item.key === key);
  if (!definition) throw new Error("Hesaplayıcı bulunamadı");
  const value = definition.calculate(values);
  if (!Number.isFinite(value))
    throw new Error("Sonuç sonlu değil; girişleri kontrol edin");
  return value;
}
