import { useFavorites } from "@/context/FavoritesContext";
import { useTheme } from "@/context/ThemeContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Camera,
  MapView,
  MarkerView,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
// Godfrey Okoye University — [longitude, latitude]
const UNIVERSITY = [7.526507, 6.468656];

export default function Home() {
  const { colors } = useTheme();
  const { addFavorite } = useFavorites();

  const [mapCenter, setMapCenter] = useState(UNIVERSITY);
  const [modalVisible, setModalVisible] = useState(false);
  const [locationName, setLocationName] = useState("");

  const handleSave = () => {
    const trimmed = locationName.trim();
    if (!trimmed) {
      Alert.alert("Name required", "Please enter a name for this location.");
      return;
    }
    addFavorite({
      name: trimmed,
      longitude: mapCenter[0],
      latitude: mapCenter[1],
    });
    setLocationName("");
    setModalVisible(false);
    Alert.alert("Saved!", `"${trimmed}" added to your favorites.`);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        styleURL={STYLE_URL}
        logoEnabled={false}
        attributionEnabled={true}
        onCameraChanged={(state) => {
          const { center } = state.properties;
          setMapCenter([center[0], center[1]]);
        }}
      >
        <Camera zoomLevel={16} centerCoordinate={UNIVERSITY} />

        {/* University marker */}
        <MarkerView coordinate={UNIVERSITY}>
          <View
            style={[styles.markerBubble, { backgroundColor: colors.primary }]}
          >
            <MaterialIcons name="school" size={18} color="#fff" />
          </View>
          <View
            style={[styles.markerPin, { borderTopColor: colors.primary }]}
          />
        </MarkerView>
      </MapView>

      {/* University label */}
      <View
        style={[styles.labelBanner, { backgroundColor: colors.primary + "EE" }]}
      >
        <MaterialIcons name="school" size={14} color="#fff" />
        <Text style={styles.labelText}>Godfrey Okoye University</Text>
      </View>

      {/* Crosshair at map center */}
      <View style={styles.crosshair} pointerEvents="none">
        <MaterialIcons name="add" size={36} color={colors.primary} />
      </View>

      {/* Save location FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <MaterialIcons name="bookmark-add" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Save location modal */}
      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Save Location
            </Text>
            <Text style={[styles.modalCoords, { color: colors.textSecondary }]}>
              {mapCenter[1].toFixed(5)}, {mapCenter[0].toFixed(5)}
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Enter location name..."
              placeholderTextColor={colors.textSecondary}
              value={locationName}
              onChangeText={setLocationName}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btnCancel, { borderColor: colors.border }]}
                onPress={() => {
                  setLocationName("");
                  setModalVisible(false);
                }}
              >
                <Text style={[styles.btnCancelText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnSave, { backgroundColor: colors.primary }]}
                onPress={handleSave}
              >
                <Text style={styles.btnSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  markerBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  markerPin: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    alignSelf: "center",
    marginTop: -1,
  },

  labelBanner: {
    position: "absolute",
    top: 14,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  labelText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  crosshair: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -18,
    marginLeft: -18,
  },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  modalCoords: {
    fontSize: 12,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  btnCancel: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  btnCancelText: { fontSize: 15, fontWeight: "600" },
  btnSave: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  btnSaveText: { fontSize: 15, fontWeight: "700", color: "#fff" },
});
