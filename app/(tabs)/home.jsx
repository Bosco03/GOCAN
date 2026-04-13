import { useFavorites } from "@/context/FavoritesContext";
import { useTheme } from "@/context/ThemeContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Camera,
  FillExtrusionLayer,
  MapView,
  MarkerView,
} from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// bright = clean colours, good road detail, no heavy green fill
const STYLE_URL = "https://tiles.openfreemap.org/styles/bright";

// Centre of Thinkers Corner neighbourhood
const THINKERS_CORNER = [7.5278, 6.4683];
const UNIVERSITY    = [7.526507, 6.468656];

const LANDMARKS = [
  {
    id: "university",
    name: "Godfrey Okoye University",
    coordinate: [7.526507, 6.468656],
    icon: "school",
    color: "#1565C0",
  },
  {
    id: "jideofor",
    name: "Jideofor Street",
    coordinate: [7.5287, 6.4680],
    icon: "add-road",
    color: "#2E7D32",
  },
  {
    id: "agana",
    name: "Agana Street",
    coordinate: [7.5265, 6.4672],
    icon: "add-road",
    color: "#E65100",
  },
  {
    id: "thinkers",
    name: "Thinkers Corner",
    coordinate: [7.5278, 6.4695],
    icon: "location-city",
    color: "#6A1B9A",
  },
];

export default function Home() {
  const { colors } = useTheme();
  const { addFavorite } = useFavorites();
  const cameraRef = useRef(null);

  const [mapCenter, setMapCenter] = useState(THINKERS_CORNER);
  const [modalVisible, setModalVisible] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [selectedLandmark, setSelectedLandmark] = useState(null);

  // Snap camera back to Thinkers Corner
  const resetCamera = () => {
    cameraRef.current?.setCamera({
      centerCoordinate: THINKERS_CORNER,
      zoomLevel: 15.5,
      pitch: 60,
      heading: 0,
      animationDuration: 800,
    });
  };

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
        attributionEnabled={false}
        // ── Google Maps-like gestures ──
        scrollEnabled={true}
        zoomEnabled={true}
        rotateEnabled={true}
        pitchEnabled={true}
        compassEnabled={true}
        onCameraChanged={(state) => {
          const { center } = state.properties;
          setMapCenter([center[0], center[1]]);
        }}
      >
        <Camera
          ref={cameraRef}
          zoomLevel={15.5}
          centerCoordinate={THINKERS_CORNER}
          pitch={60}       // strong tilt → buildings clearly 3D
          heading={0}
          animationDuration={1200}
          minZoomLevel={13} // don't zoom out past neighbourhood level
          maxZoomLevel={20}
        />

        {/*
          3D Buildings layer — pulled directly from the openmaptiles
          vector source that the bright style already loads.
          render_height / render_min_height come from the tile data.
          Buildings appear from zoom 14 upward.
        */}
        <FillExtrusionLayer
          id="custom-3d-buildings"
          sourceID="openmaptiles"
          sourceLayerID="building"
          minZoomLevel={14}
          style={{
            fillExtrusionColor: [
              "interpolate",
              ["linear"],
              ["zoom"],
              14, "#d6d0cb",
              17, "#c9c2ba",
            ],
            fillExtrusionHeight: [
              "interpolate",
              ["linear"],
              ["zoom"],
              14, 0,
              14.5, ["get", "render_height"],
            ],
            fillExtrusionBase: [
              "interpolate",
              ["linear"],
              ["zoom"],
              14, 0,
              14.5, ["get", "render_min_height"],
            ],
            fillExtrusionOpacity: 0.9,
          }}
        />

        {/* Landmark pins */}
        {LANDMARKS.map((lm) => (
          <MarkerView key={lm.id} coordinate={lm.coordinate}>
            <TouchableOpacity
              onPress={() => setSelectedLandmark(lm)}
              activeOpacity={0.85}
            >
              <View style={[styles.pin, { backgroundColor: lm.color }]}>
                <MaterialIcons name={lm.icon} size={15} color="#fff" />
              </View>
              {lm.id === "university" && (
                <View style={[styles.pinTail, { borderTopColor: lm.color }]} />
              )}
            </TouchableOpacity>
          </MarkerView>
        ))}
      </MapView>

      {/* ── Top label ── */}
      <View
        style={[styles.labelBanner, { backgroundColor: colors.primary + "EE" }]}
      >
        <MaterialIcons name="location-city" size={14} color="#fff" />
        <Text style={styles.labelText}>Thinkers Corner, Enugu</Text>
      </View>

      {/* ── Landmark popup ── */}
      {selectedLandmark && (
        <View style={[styles.popup, { backgroundColor: colors.card }]}>
          <View
            style={[styles.popupAccent, { backgroundColor: selectedLandmark.color }]}
          />
          <View style={styles.popupContent}>
            <MaterialIcons
              name={selectedLandmark.icon}
              size={18}
              color={selectedLandmark.color}
            />
            <Text style={[styles.popupText, { color: colors.text }]}>
              {selectedLandmark.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setSelectedLandmark(null)}
            style={styles.popupClose}
          >
            <MaterialIcons name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}

      {/* ── Reset / re-centre button ── */}
      <TouchableOpacity
        style={[styles.resetBtn, { backgroundColor: colors.card }]}
        onPress={resetCamera}
        activeOpacity={0.85}
      >
        <MaterialIcons name="my-location" size={22} color={colors.primary} />
      </TouchableOpacity>

      {/* ── Save location FAB ── */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <MaterialIcons name="bookmark-add" size={26} color="#fff" />
      </TouchableOpacity>

      {/* ── Save location modal ── */}
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

  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 5,
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 9,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  labelText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  popup: {
    position: "absolute",
    bottom: 110,
    left: 16,
    right: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  popupAccent: { width: 5, alignSelf: "stretch" },
  popupContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
  },
  popupText: { fontSize: 15, fontWeight: "600", flex: 1 },
  popupClose: { padding: 14 },

  resetBtn: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  fab: {
    position: "absolute",
    bottom: 40,
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
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  modalCoords: { fontSize: 12, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  modalButtons: { flexDirection: "row", gap: 12 },
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