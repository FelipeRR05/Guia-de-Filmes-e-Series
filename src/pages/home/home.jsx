import styles from "./home.module.css";
import Carousel from "../../components/carousel/carousel";
import { useFetchMedia } from "../../hooks/useFetchMedia";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import MovieCard from "../../components/movie-card/movie-card";

export default function Home() {
  const { movies, tvShows } = useFetchMedia();

  return (
    <div>
      <Header />
      <div id="catalog" className={styles.catalog}>
        <h2>Catálogo de Filmes</h2>
        <Carousel
          title="Top 10 Filmes"
          items={movies.topRated}
          component={MovieCard}
        />
        <Carousel
          title="Filmes em Alta"
          items={movies.popular}
          component={MovieCard}
        />

        <h2>Catálogo de Séries</h2>
        <Carousel
          title="Top 10 Séries"
          items={tvShows.topRated}
          component={MovieCard}
        />
        <Carousel
          title="Séries em Alta"
          items={tvShows.popular}
          component={MovieCard}
        />
      </div>
      <Footer />
    </div>
  );
}
