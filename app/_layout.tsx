import { FavoritesProvider } from "@/context/FavoritesContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
