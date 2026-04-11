import { FavoriteLocation, useFavorites } from "@/context/FavoritesContext";
import { useTheme } from "@/context/ThemeContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function FavoriteCard({
  item,
  onDelete,
}: {
  item: FavoriteLocation;
  onDelete: () => void;
}) {
  const { colors } = useTheme();
  const date = new Date(item.savedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.primary + "22" }]}>
        <MaterialIcons name="place" size={24} color={colors.primary} />
      </View>

      <View style={styles.cardBody}>
        <Text style={[styles.cardName, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.cardCoords, { color: colors.textSecondary }]}>
          {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
        </Text>
        <Text style={[styles.cardDate, { color: colors.textSecondary }]}>
          Saved {date}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={onDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialIcons name="delete-outline" size={22} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );
}

export default function Favorites() {
  const { colors } = useTheme();
  const { favorites, removeFavorite } = useFavorites();

  const confirmDelete = (item: FavoriteLocation) => {
    Alert.alert(
      "Remove Favorite",
      `Remove "${item.name}" from your favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFavorite(item.id),
        },
      ]
    );
  };

  if (favorites.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background }]}>
        <MaterialIcons name="bookmark-border" size={64} color={colors.border} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          No favorites yet
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Move the map crosshair to a location and tap{" "}
          <MaterialIcons name="bookmark-add" size={14} color={colors.textSecondary} />{" "}
          to save it.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <FavoriteCard item={item} onDelete={() => confirmDelete(item)} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, paddingBottom: 30 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: "700", marginBottom: 2 },
  cardCoords: { fontSize: 12, marginBottom: 2 },
  cardDate: { fontSize: 11 },
  deleteBtn: { padding: 4 },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 12,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptySubtitle: { fontSize: 14, textAlign: "center", lineHeight: 20 },
});
