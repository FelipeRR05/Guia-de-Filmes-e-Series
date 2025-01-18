import { useEffect, useState } from "react";
import { getDetails } from "../../services/api";
import { useFavorites } from "../../hooks/useFavorites";
import { FaCheck, FaPlus, FaImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./movie-card.module.css";

export default function MovieCard({
  movieId,
  mediaType = "movie",
  onFavoriteChange,
}) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites(movieId, mediaType);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setError(null);
        const details = await getDetails(movieId, mediaType);
        setMovieDetails(details);
      } catch (error) {
        if (error.message.includes("404")) {
          const fallbackType = mediaType === "movie" ? "tv" : "movie";
          const details = await getDetails(movieId, fallbackType);
          setMovieDetails(details);
        } else {
          setError(error.message);
        }
      }
    };

    if (movieId) fetchMovieDetails();
  }, [movieId, mediaType]);

  if (!movieDetails) return <div>Carregando...</div>;

  const {
    poster_path,
    title,
    name,
    vote_average,
    release_date,
    first_air_date,
    genres,
  } = movieDetails;

  const mediaTitle = title || name;
  const releaseYear = new Date(release_date || first_air_date).getFullYear();
  const primaryGenre = genres?.length > 0 ? genres[0].name : "Sem gênero";
  const rating = Math.round(vote_average * 10);

  const handleCardClick = () => {
    navigate(`/details/${mediaType}/${movieId}`);
  };

  return (
    <div className={`${styles.card} ${styles.grow}`} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        {!poster_path ? (
          <div className={styles.placeholder}>
            <FaImage />
          </div>
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/w200${poster_path}`}
            alt={mediaTitle}
            className={styles.image}
          />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
          className={styles.favoriteButton}
        >
          {isFavorite ? <FaCheck /> : <FaPlus />}
        </button>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{mediaTitle}</h3>
        <p className={styles.genre}>
          {primaryGenre} - {releaseYear}
        </p>
        <div className={styles.rating}>{rating}%</div>
      </div>
    </div>
  );
}
