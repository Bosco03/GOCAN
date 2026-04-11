import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface FavoriteLocation {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  savedAt: string;
}

interface FavoritesContextType {
  favorites: FavoriteLocation[];
  addFavorite: (location: Omit<FavoriteLocation, "id" | "savedAt">) => void;
  removeFavorite: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const STORAGE_KEY = "@gocan_favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) setFavorites(JSON.parse(data));
    });
  }, []);

  const persist = (list: FavoriteLocation[]) => {
    setFavorites(list);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const addFavorite = (
    location: Omit<FavoriteLocation, "id" | "savedAt">
  ) => {
    const newFav: FavoriteLocation = {
      ...location,
      id: Date.now().toString(),
      savedAt: new Date().toISOString(),
    };
    persist([...favorites, newFav]);
  };

  const removeFavorite = (id: string) => {
    persist(favorites.filter((f) => f.id !== id));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
