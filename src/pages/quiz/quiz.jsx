import { useState, useEffect } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Carousel from "../../components/carousel/carousel";
import MovieCard from "../../components/movie-card/movie-card";
import styles from "./quiz.module.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_TOKEN = process.env.REACT_APP_PRIVATE_API_TOKEN;

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem("userPreferences");
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });
  const [movieRecommendations, setMovieRecommendations] = useState([]);
  const [tvRecommendations, setTvRecommendations] = useState([]);

  const questions = [
    {
      question: "Qual gênero você prefere?",
      options: [
        { label: "Ação", id: 28 },
        { label: "Comédia", id: 35 },
        { label: "Drama", id: 18 },
        { label: "Fantasia", id: 14 },
        { label: "Terror", id: 27 },
      ],
      key: "genre",
    },
    {
      question: "Qual época prefere?",
      options: [
        { label: "Anos 80", year: "1980" },
        { label: "Anos 90", year: "1990" },
        { label: "2000s", year: "2000" },
        { label: "Atual", year: new Date().getFullYear().toString() },
      ],
      key: "decade",
    },
    {
      question: "Qual tipo de enredo gosta?",
      options: ["Aventura", "Suspense", "Romance", "Biográfico"],
      key: "plot",
    },
    {
      question: "Qual o tempo de duração preferido?",
      options: [
        { label: "Curto (até 90 min)", maxRuntime: 90 },
        { label: "Médio (90-120 min)", minRuntime: 90, maxRuntime: 120 },
        { label: "Longo (mais de 120 min)", minRuntime: 120 },
      ],
      key: "runtime",
    },
    {
      question: "Prefere conteúdo para qual faixa etária?",
      options: ["Livre", "12+", "16+", "18+"],
      key: "ageRating",
    },
  ];

  const handleAnswer = (answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questions[step].key]: answer,
    }));
    setStep(step + 1);
  };

  const fetchRecommendations = async () => {
    const genreId = answers.genre?.id;
    const year = answers.decade?.year;
    const runtime = answers.runtime || {};
    const certification = answers.ageRating;

    const commonParams = `with_genres=${genreId}&primary_release_year=${year}&sort_by=popularity.desc&vote_average.gte=6`;
    const movieParams = `${commonParams}&with_runtime.gte=${
      runtime.minRuntime || ""
    }&with_runtime.lte=${runtime.maxRuntime || ""}`;
    const tvParams = `${commonParams}&first_air_date_year=${year}`;

    const fetchMovies = fetch(`${API_BASE_URL}/discover/movie?${movieParams}`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    const fetchTvShows = fetch(`${API_BASE_URL}/discover/tv?${tvParams}`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    try {
      const [movieResponse, tvResponse] = await Promise.all([
        fetchMovies,
        fetchTvShows,
      ]);
      const movieData = await movieResponse.json();
      const tvData = await tvResponse.json();

      setMovieRecommendations(movieData.results);
      setTvRecommendations(tvData.results);
    } catch (error) {
      console.error("Erro ao buscar recomendações:", error);
    }
  };

  useEffect(() => {
    if (step >= questions.length) {
      fetchRecommendations();
      localStorage.setItem("userPreferences", JSON.stringify(answers));
    }
  }, [step, answers]);

  if (step >= questions.length) {
    return (
      <div className={styles.fullContainer}>
        <Header />
        <div className={styles.recommendations}>
          <h2>Recomendações para você</h2>
          <Carousel
            title="Filmes recomendados para você"
            items={movieRecommendations}
            component={MovieCard}
            emptyMessage="Nenhum filme encontrado"
          />
          <Carousel
            title="Séries recomendadas para você"
            items={tvRecommendations}
            component={MovieCard}
            emptyMessage="Nenhuma série encontrada"
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.fullContainer}>
      <Header />
      <div className={styles.quizContainer}>
        <h2>Quiz de Preferências</h2>
        <div className={styles.question}>
          <h3>{questions[step].question}</h3>
          <div className={styles.options}>
            {questions[step].options.map((option) => (
              <button
                key={option.label || option}
                onClick={() => handleAnswer(option)}
                className={styles.optionButton}
              >
                {option.label || option}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
