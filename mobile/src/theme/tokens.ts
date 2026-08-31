import { useColorScheme } from "react-native";

export const palette = {
  navy: "#102838",
  navyRaised: "#17384D",
  blue: "#2D6CDF",
  blueDark: "#2058B7",
  sky: "#DCEAFE",
  orange: "#D97706",
  red: "#B64036",
  green: "#13815D",
  white: "#FFFFFF",
  black: "#17242E",
  lightBg: "#EEF3F6",
  lightSurface: "#FFFFFF",
  lightMuted: "#61727E",
  lightLine: "#D8E2E8",
  darkBg: "#091823",
  darkSurface: "#102838",
  darkRaised: "#17384D",
  darkText: "#F3F7F9",
  darkMuted: "#A9BBC6",
  darkLine: "#2A4658",
  cyan: "#1EA7A1",
  slate: "#435865",
};
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  section: 36,
};
export const radius = { sm: 10, md: 14, lg: 18, xl: 24, pill: 999 };
export const type = {
  caption: 11,
  small: 13,
  body: 15,
  title: 20,
  heading: 28,
  hero: 34,
};
export const typography = {
  hero: { fontSize: 32, lineHeight: 38, fontWeight: "900" as const },
  h1: { fontSize: 28, lineHeight: 34, fontWeight: "900" as const },
  h2: { fontSize: 20, lineHeight: 26, fontWeight: "900" as const },
  h3: { fontSize: 17, lineHeight: 23, fontWeight: "800" as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: "400" as const },
  bodyStrong: { fontSize: 14, lineHeight: 20, fontWeight: "800" as const },
  caption: { fontSize: 12, lineHeight: 17, fontWeight: "600" as const },
  overline: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "900" as const,
    letterSpacing: 1.2,
  },
};

export function themeFor(mode: "light" | "dark") {
  const dark = mode === "dark";
  return {
    dark,
    colors: {
      background: dark ? palette.darkBg : palette.lightBg,
      surface: dark ? palette.darkSurface : palette.lightSurface,
      raised: dark ? palette.darkRaised : "#F7F9FB",
      elevated: dark ? "#1C4055" : "#FFFFFF",
      text: dark ? palette.darkText : palette.black,
      muted: dark ? palette.darkMuted : palette.lightMuted,
      line: dark ? palette.darkLine : palette.lightLine,
      divider: dark ? "#203D4F" : "#E4EBEF",
      primary: palette.blue,
      primaryPressed: palette.blueDark,
      onPrimary: palette.white,
      secondary: palette.cyan,
      info: palette.blue,
      danger: palette.red,
      warning: palette.orange,
      success: palette.green,
      disabled: dark ? "#415866" : "#AAB7BE",
      scrim: "rgba(4, 15, 23, 0.58)",
      header: palette.navy,
    },
  };
}
export type AppTheme = ReturnType<typeof themeFor>;
export function useAppTheme() {
  return themeFor(useColorScheme() === "dark" ? "dark" : "light");
}
