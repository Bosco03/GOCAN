import { useTheme } from "@/context/ThemeContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

function SectionHeader({ label, colors }) {
  return (
    <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
      {label}
    </Text>
  );
}

function SettingRow({ icon, label, colors, right, onPress, danger }) {
  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={[styles.rowIcon, { backgroundColor: (danger ? colors.danger : colors.primary) + "22" }]}>
        <MaterialIcons name={icon} size={20} color={danger ? colors.danger : colors.primary} />
      </View>
      <Text style={[styles.rowLabel, { color: danger ? colors.danger : colors.text }]}>
        {label}
      </Text>
      <View style={styles.rowRight}>{right}</View>
    </TouchableOpacity>
  );
}

export default function Settings() {
  const { colors, isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => Alert.alert("Logged out", "You have been logged out."),
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Profile card */}
      <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <MaterialIcons name="person" size={40} color="#fff" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.text }]}>Guest User</Text>
          <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
            guest@gocan.app
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => Alert.alert("Edit Profile", "Profile editing coming soon.")}
        >
          <MaterialIcons name="edit" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Appearance */}
      <SectionHeader label="APPEARANCE" colors={colors} />
      <SettingRow
        icon={isDark ? "dark-mode" : "light-mode"}
        label={isDark ? "Dark Mode" : "Light Mode"}
        colors={colors}
        right={
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        }
      />

      {/* Account */}
      <SectionHeader label="ACCOUNT" colors={colors} />
      <SettingRow
        icon="notifications"
        label="Notifications"
        colors={colors}
        onPress={() => Alert.alert("Notifications", "Notification settings coming soon.")}
        right={<MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />}
      />
      <SettingRow
        icon="privacy-tip"
        label="Privacy Policy"
        colors={colors}
        onPress={() => Alert.alert("Privacy", "Privacy policy coming soon.")}
        right={<MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />}
      />
      <SettingRow
        icon="info"
        label="About GOCAN"
        colors={colors}
        onPress={() =>
          Alert.alert("GOCAN", "Campus navigation app for Godfrey Okoye University.\n\nVersion 1.0.0")
        }
        right={<MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />}
      />

      {/* Logout */}
      <SectionHeader label="" colors={colors} />
      <SettingRow
        icon="logout"
        label="Log Out"
        colors={colors}
        onPress={handleLogout}
        danger
        right={null}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: "700" },
  profileEmail: { fontSize: 13, marginTop: 2 },

  sectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 4,
    paddingLeft: 4,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: "500" },
  rowRight: { marginLeft: "auto" },
});
