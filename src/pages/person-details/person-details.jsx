import { useParams } from "react-router-dom";
import { usePersonDetails } from "../../hooks/usePersonDetails";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import MovieCard from "../../components/movie-card/movie-card";
import Carousel from "../../components/carousel/carousel";
import styles from "./person-details.module.css";

export default function PersonDetails() {
  const { id } = useParams();
  const { details, error } = usePersonDetails(id);

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
    profile_path,
    name,
    biography,
    birthday,
    deathday,
    gender,
    place_of_birth,
    movie_credits,
    tv_credits,
  } = details;

  const genderText = gender === 1 ? "Feminino" : "Masculino";
  const age = birthday
    ? new Date().getFullYear() - new Date(birthday).getFullYear()
    : null;

  return (
    <div>
      <Header />

      <div
        className={styles.background}
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${profile_path})`,
        }}
      ></div>

      <div className={styles.detailsContainer}>
        <div className={styles.overlay}>
          <img
            src={`https://image.tmdb.org/t/p/w300${profile_path}`}
            alt={name}
            className={styles.poster}
          />

          <div className={styles.info}>
            <h2>{name}</h2>
            <p>
              <strong>Biografia:</strong>{" "}
              {biography || "Biografia não disponível."}
            </p>
          </div>
          <div className={styles.meta}>
            <p>
              <strong>Idade:</strong> {age ? `${age} anos` : "N/D"}
            </p>
            <p>
              <strong>Gênero:</strong> {genderText}
            </p>
            <p>
              <strong>Aniversário:</strong> {birthday || "N/D"}
            </p>
            {deathday && (
              <p>
                <strong>Falecimento:</strong> {deathday}
              </p>
            )}
            <p>
              <strong>Local de Nascimento:</strong> {place_of_birth || "N/D"}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.creditsContainer}>
        {movie_credits?.cast?.length > 0 && (
          <div className={styles.movies}>
            <Carousel
              title="Filmes que participou"
              items={movie_credits.cast}
              component={MovieCard}
            />
          </div>
        )}
        {tv_credits?.cast?.length > 0 && (
          <div className={styles.tvShows}>
            <Carousel
              title="Séries que participou"
              items={tv_credits.cast}
              component={MovieCard}
            />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
