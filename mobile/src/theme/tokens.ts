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

export function themeFor(mode: "light" | "dark") {
  const dark = mode === "dark";
  return {
    dark,
    colors: {
      background: dark ? palette.darkBg : palette.lightBg,
      surface: dark ? palette.darkSurface : palette.lightSurface,
      raised: dark ? palette.darkRaised : "#F7F9FB",
      text: dark ? palette.darkText : palette.black,
      muted: dark ? palette.darkMuted : palette.lightMuted,
      line: dark ? palette.darkLine : palette.lightLine,
      primary: palette.blue,
      onPrimary: palette.white,
      danger: palette.red,
      warning: palette.orange,
      success: palette.green,
      header: palette.navy,
    },
  };
}
export type AppTheme = ReturnType<typeof themeFor>;
export function useAppTheme() {
  return themeFor(useColorScheme() === "dark" ? "dark" : "light");
}
