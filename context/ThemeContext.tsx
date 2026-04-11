import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const lightColors = {
  background: "#FFFFFF",
  surface: "#F5F5F5",
  card: "#FFFFFF",
  text: "#000000",
  textSecondary: "#666666",
  border: "#E0E0E0",
  primary: "#1DCD9F",
  primaryDark: "#169976",
  tabBar: "#FFFFFF",
  tabBarBorder: "#E0E0E0",
  danger: "#FF3B30",
  icon: "#444444",
};

const darkColors = {
  background: "#121212",
  surface: "#1E1E1E",
  card: "#2C2C2C",
  text: "#FFFFFF",
  textSecondary: "#AAAAAA",
  border: "#333333",
  primary: "#1DCD9F",
  primaryDark: "#169976",
  tabBar: "#1A1A1A",
  tabBarBorder: "#333333",
  danger: "#FF453A",
  icon: "#CCCCCC",
};

export type ThemeColors = typeof lightColors;

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    AsyncStorage.getItem("@gocan_theme").then((saved) => {
      if (saved === "dark" || saved === "light") setTheme(saved);
    });
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    AsyncStorage.setItem("@gocan_theme", next);
  };

  const colors = theme === "dark" ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, isDark: theme === "dark", colors }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
