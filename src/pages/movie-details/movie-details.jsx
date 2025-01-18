import { useParams } from "react-router-dom";
import { useMovieDetails } from "../../hooks/useMovieDetails";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import ActorCard from "../../components/actor-card/actor-card";
import CreatorCard from "../../components/creator-card/creator-card";
import MovieCard from "../../components/movie-card/movie-card";
import Carousel from "../../components/carousel/carousel";
import styles from "./movie-details.module.css";

export default function MovieDetails() {
  const { id, mediaType } = useParams();
  const { details, error } = useMovieDetails(id, mediaType);

  if (error) return <div>{error}</div>;
  if (!details)
    return (
      <div>
        <Header />
        <h3>Carregando...</h3>
        <Footer />
      </div>
    );

  const {
    poster_path,
    backdrop_path,
    title,
    name,
    overview,
    vote_average,
    genres,
    release_date,
    first_air_date,
    runtime,
    number_of_seasons,
    number_of_episodes,
    credits,
    recommendations,
    created_by,
    adult,
    videos,
  } = details;

  const mediaTitle = title || name;
  const releaseYear = new Date(release_date || first_air_date).getFullYear();
  const genreNames = genres?.map((genre) => genre.name).join(", ") || "N/A";
  const synopsis = overview || "Sinopse não disponível.";
  const trailer = videos?.results?.find((vid) => vid.type === "Trailer");

  const streamingProviders =
    details["watch/providers"]?.results?.BR?.flatrate || [];

  const ageRating =
    mediaType === "tv"
      ? details.content_ratings?.results?.find(
          (rating) => rating.iso_3166_1 === "BR"
        )?.rating || "L"
      : details.release_dates?.results
          ?.find((release) => release.iso_3166_1 === "BR")
          ?.release_dates?.find((release) => release.certification)
          ?.certification || (adult ? "18" : "L");

  const creatorOrDirector =
    mediaType === "tv"
      ? { ...created_by?.[0], job: "Creator" }
      : credits?.crew?.find((person) => person.job === "Director");

  return (
    <div>
      <Header />

      <div
        className={styles.background}
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop_path})`,
        }}
      ></div>

      <div className={styles.detailsContainer}>
        <div className={styles.overlay}>
          <img
            src={`https://image.tmdb.org/t/p/w300${poster_path}`}
            alt={mediaTitle}
            className={styles.poster}
          />

          <div className={styles.info}>
            <div className={styles.title}>
              <h2>
                {mediaTitle}{" "}
                <span className={styles.year}>({releaseYear})</span>
              </h2>
            </div>

            <p className={styles.meta}>
              <span className={styles.ageRating}>{ageRating}</span> •{" "}
              {mediaType === "movie"
                ? `${runtime} min`
                : `${number_of_seasons} temporadas, ${number_of_episodes} episódios`}
            </p>

            {genreNames && (
              <p className={styles.genre}>
                <strong>Gêneros:</strong> {genreNames}
              </p>
            )}
            <p>
              <strong>Sinopse:</strong> {synopsis}
            </p>

            <div className={styles.actions}>
              <div className={styles.rating}>
                <p className={styles.userRatingText}>
                  <strong>Avaliação dos usuários:</strong>
                </p>
                <div className={styles.ratingCircle}>
                  {Math.round(vote_average * 10)}%
                </div>
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            {streamingProviders.length > 0 ? (
              <div className={styles.streamingProviders}>
                <strong>Disponível em:</strong>
                <div className={styles.providers}>
                  {streamingProviders.map((provider) => (
                    <div key={provider.provider_id} className={styles.provider}>
                      <img
                        src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                        alt={provider.provider_name}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className={styles.streamingProviders}>
                Não disponível em streaming.
              </p>
            )}

            {creatorOrDirector && <CreatorCard person={creatorOrDirector} />}
          </div>
        </div>
      </div>

      <div className={styles.infosContainer}>
        <div className={styles.castContainer}>
          {credits?.cast?.length > 0 ? (
            <Carousel
              title="Elenco"
              items={credits.cast}
              component={ActorCard}
            />
          ) : (
            <p>Nenhum ator encontrado.</p>
          )}
        </div>

        {trailer && trailer.key && (
          <div>
            <h3 className={styles.trailerTitle}>Trailer</h3>

            <div className={styles.trailer}>
              <div className={styles.videoWrapper}>
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}

        <div className={styles.similarContainer}>
          {recommendations?.results?.length > 0 ? (
            <Carousel
              title="Títulos semelhantes"
              items={recommendations.results}
              component={MovieCard}
            />
          ) : (
            <p>Nenhum título recomendado encontrado.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
