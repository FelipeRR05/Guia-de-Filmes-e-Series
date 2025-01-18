import { useState, useEffect } from "react";
import { fetchFromApi } from "../services/api";

export const useFetchMedia = () => {
  const [movies, setMovies] = useState({ topRated: [], popular: [] });
  const [tvShows, setTvShows] = useState({ topRated: [], popular: [] });

  const fetchMovies = async () => {
    try {
      const [topRatedData, popularData] = await Promise.all([
        fetchFromApi("/movie/top_rated?language=pt-BR"),
        fetchFromApi("/trending/movie/week?language=pt-BR"),
      ]);
      setMovies({
        topRated: topRatedData?.results?.slice(0, 10) || [],
        popular: popularData?.results?.slice(0, 30) || [],
      });
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    }
  };

  const fetchTvShows = async () => {
    try {
      const [topRatedData, popularData] = await Promise.all([
        fetchFromApi("/tv/top_rated?language=pt-BR"),
        fetchFromApi("/trending/tv/week?language=pt-BR"),
      ]);
      setTvShows({
        topRated: topRatedData?.results?.slice(0, 10) || [],
        popular: popularData?.results?.slice(0, 30) || [],
      });
    } catch (error) {
      console.error("Erro ao buscar séries:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchTvShows();

    const handleFavoritesUpdated = () => {
      fetchMovies();
      fetchTvShows();
    };

    window.addEventListener("favoritesUpdated", handleFavoritesUpdated);

    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdated);
    };
  }, []);

  return { movies, tvShows };
};
