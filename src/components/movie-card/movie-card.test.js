import { render, screen, fireEvent } from "@testing-library/react";
import MovieCard from "../components/movie-card/movie-card";
import { useFavorites } from "../hooks/useFavorites";
import { BrowserRouter } from "react-router-dom";

jest.mock("../hooks/useFavorites", () => ({
  useFavorites: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("MovieCard Component", () => {
  const mockToggleFavorite = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    useFavorites.mockReturnValue({
      isFavorite: false,
      toggleFavorite: mockToggleFavorite,
    });
  });

  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it("deve renderizar o componente com os dados do filme", () => {
    const movieDetails = {
      movieId: 1,
      mediaType: "movie",
      poster_path: "/poster.jpg",
      title: "Filme de Teste",
      vote_average: 8.5,
      release_date: "2023-01-01",
      genres: [{ name: "Ação" }],
    };

    renderWithRouter(<MovieCard {...movieDetails} />);

    expect(screen.getByText("Filme de Teste")).toBeInTheDocument();
    expect(screen.getByText("Ação - 2023")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByAltText("Filme de Teste")).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w200/poster.jpg"
    );
  });

  it("deve exibir 'Carregando...' enquanto os detalhes não estão disponíveis", () => {
    renderWithRouter(<MovieCard movieId={1} mediaType="movie" />);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("deve chamar a função de favoritos ao clicar no botão de favorito", () => {
    const movieDetails = {
      movieId: 1,
      mediaType: "movie",
    };

    renderWithRouter(<MovieCard {...movieDetails} />);

    const favoriteButton = screen.getByRole("button");
    fireEvent.click(favoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalled();
  });

  it("deve navegar para os detalhes do filme ao clicar no card", () => {
    const movieDetails = {
      movieId: 1,
      mediaType: "movie",
      title: "Filme de Teste",
    };

    renderWithRouter(<MovieCard {...movieDetails} />);

    const card = screen.getByText("Filme de Teste");
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith("/details/movie/1");
  });
});
