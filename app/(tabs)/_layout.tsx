import { useTheme } from "@/context/ThemeContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.icon,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
        },
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Map",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="map" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Favorites"
        options={{
          title: "Favorites",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="favorite" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="setting"
        options={{
          title: "Settings",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
