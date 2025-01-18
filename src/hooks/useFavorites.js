import { useState, useEffect } from "react";

export function useFavorites(id, mediaType) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : { movies: [], tvShows: [] };
  });

  useEffect(() => {
    const type = mediaType === "movie" ? "movies" : "tvShows";
    const exists = favorites[type].some((item) => item.id === id);
    setIsFavorite(exists);
  }, [favorites, id, mediaType]);

  const updateFavorites = (newFavorites) => {
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  const toggleFavorite = () => {
    const type = mediaType === "movie" ? "movies" : "tvShows";
    const updatedFavorites = { ...favorites };

    if (isFavorite) {
      updatedFavorites[type] = updatedFavorites[type].filter(
        (item) => item.id !== id
      );
    } else {
      updatedFavorites[type].push({ id, media_type: mediaType });
    }

    updateFavorites(updatedFavorites);
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    const handleFavoritesUpdated = () => {
      const stored = localStorage.getItem("favorites");
      setFavorites(stored ? JSON.parse(stored) : { movies: [], tvShows: [] });
    };

    window.addEventListener("favoritesUpdated", handleFavoritesUpdated);
    return () =>
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdated);
  }, []);

  return { isFavorite, toggleFavorite };
}
