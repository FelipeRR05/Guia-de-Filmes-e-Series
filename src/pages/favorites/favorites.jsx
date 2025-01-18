import { useState, useEffect } from "react";
import styles from "./favorites.module.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Carousel from "../../components/carousel/carousel";
import MovieCard from "../../components/movie-card/movie-card";

const getStoredFavorites = () => {
  return (
    JSON.parse(localStorage.getItem("favorites")) || {
      movies: [],
      tvShows: [],
    }
  );
};

export default function Favorites() {
  const [favorites, setFavorites] = useState({
    movies: [],
    tvShows: [],
  });

  const updateFavorites = () => {
    const storedFavorites = getStoredFavorites();
    setFavorites(storedFavorites);
  };

  useEffect(() => {
    updateFavorites();

    const handleFavoritesUpdated = () => {
      updateFavorites();
    };

    window.addEventListener("favoritesUpdated", handleFavoritesUpdated);

    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdated);
    };
  }, []);

  return (
    <div>
      <Header />
      <div id="favorites" className={styles.favorites}>
        <h2>Meus Favoritos</h2>

        <Carousel
          title="Filmes Favoritos"
          items={favorites.movies}
          emptyMessage="Nenhum filme favorito."
          onFavoriteChange={updateFavorites}
          component={MovieCard}
        />

        <Carousel
          title="Séries Favoritas"
          items={favorites.tvShows}
          emptyMessage="Nenhuma série favorita."
          onFavoriteChange={updateFavorites}
          component={MovieCard}
        />
      </div>
      <Footer />
    </div>
  );
}
