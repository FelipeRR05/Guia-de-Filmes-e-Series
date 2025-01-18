import { render, screen } from "@testing-library/react";
import MovieDetails from "../components/movie-details/movie-details";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { BrowserRouter } from "react-router-dom";

jest.mock("../hooks/useMovieDetails", () => ({
  useMovieDetails: jest.fn(),
}));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("MovieDetails Component", () => {
  it("deve exibir 'Carregando...' enquanto os detalhes não estão disponíveis", () => {
    useMovieDetails.mockReturnValue({ details: null, error: null });

    renderWithRouter(<MovieDetails />);

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("deve exibir uma mensagem de erro se os dados falharem ao carregar", () => {
    useMovieDetails.mockReturnValue({
      details: null,
      error: "Erro ao carregar dados",
    });

    renderWithRouter(<MovieDetails />);

    expect(screen.getByText("Erro ao carregar dados")).toBeInTheDocument();
  });

  it("deve renderizar os detalhes do filme corretamente", () => {
    useMovieDetails.mockReturnValue({
      details: {
        poster_path: "/poster.jpg",
        title: "Filme de Teste",
        release_date: "2023-01-01",
        genres: [{ name: "Ação" }],
        overview: "Sinopse de teste",
        vote_average: 8.5,
        runtime: 120,
        credits: { cast: [] },
        recommendations: { results: [] },
      },
      error: null,
    });

    renderWithRouter(<MovieDetails />);

    expect(screen.getByText("Filme de Teste")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("Gêneros: Ação")).toBeInTheDocument();
    expect(screen.getByText("Sinopse: Sinopse de teste")).toBeInTheDocument();
    expect(screen.getByText("120 min")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
  });

  it("deve exibir 'Não disponível em streaming' quando não houver provedores", () => {
    useMovieDetails.mockReturnValue({
      details: {
        "watch/providers": { results: { BR: { flatrate: [] } } },
      },
      error: null,
    });

    renderWithRouter(<MovieDetails />);

    expect(
      screen.getByText("Não disponível em streaming.")
    ).toBeInTheDocument();
  });

  it("deve renderizar o elenco corretamente", () => {
    useMovieDetails.mockReturnValue({
      details: {
        credits: {
          cast: [
            { id: 1, name: "Ator 1" },
            { id: 2, name: "Ator 2" },
          ],
        },
      },
      error: null,
    });

    renderWithRouter(<MovieDetails />);

    expect(screen.getByText("Elenco")).toBeInTheDocument();
    expect(screen.getByText("Ator 1")).toBeInTheDocument();
    expect(screen.getByText("Ator 2")).toBeInTheDocument();
  });

  it("deve renderizar recomendações corretamente", () => {
    useMovieDetails.mockReturnValue({
      details: {
        recommendations: {
          results: [
            { id: 1, title: "Recomendado 1" },
            { id: 2, title: "Recomendado 2" },
          ],
        },
      },
      error: null,
    });

    renderWithRouter(<MovieDetails />);

    expect(screen.getByText("Títulos semelhantes")).toBeInTheDocument();
    expect(screen.getByText("Recomendado 1")).toBeInTheDocument();
    expect(screen.getByText("Recomendado 2")).toBeInTheDocument();
  });
});
