import { useState, useEffect } from "react";
import styles from "./search-bar.module.css";
import { FaSearch, FaTimes } from "react-icons/fa";
import MovieCard from "../movie-card/movie-card";
import ActorCard from "../actor-card/actor-card";
import CreatorCard from "../creator-card/creator-card";
import { searchMulti } from "../../services/api";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [noResultsMessage, setNoResultsMessage] = useState(false);

  const handleSearch = async (searchQuery) => {
    try {
      const data = await searchMulti(searchQuery);
      setResults(data.results);
      setSuggestions([]);
      setNoResultsMessage(data.results.length === 0);
    } catch (error) {
      console.error("Erro ao buscar resultados:", error);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        try {
          const data = await searchMulti(query);
          const suggestionsResults = data.results.slice(0, 20);
          setSuggestions(suggestionsResults);
          setNoResultsMessage(suggestionsResults.length === 0);
        } catch (error) {
          console.error("Erro ao buscar sugestões:", error);
        }
      } else {
        setSuggestions([]);
        setNoResultsMessage(false);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setQuery("");
    setResults([]);
    setSuggestions([]);
    setNoResultsMessage(false);
  };

  const handleSuggestionClick = (suggestion) => {
    const searchQuery = suggestion.title || suggestion.name;
    setQuery(searchQuery);
    handleSearch(searchQuery);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div id="search-bar" className={styles.searchContainer}>
      <form onSubmit={handleSubmit} className={styles.searchBar}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          className={styles.searchInput}
          placeholder="Buscar filmes, séries, atores..."
        />
        {query && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClearSearch}
          >
            <FaTimes />
          </button>
        )}
        <button type="submit" className={styles.searchButton}>
          <FaSearch />
        </button>
      </form>

      {suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className={styles.suggestionItem}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.title || suggestion.name}
            </li>
          ))}
        </ul>
      )}

      {results.length > 0 ? (
        <div className={styles.results}>
          {results.map((result) => {
            if (result.media_type === "movie" || result.media_type === "tv") {
              return (
                <MovieCard
                  key={result.id}
                  movieId={result.id}
                  mediaType={result.media_type}
                />
              );
            } else if (result.media_type === "person") {
              const isDirector = result.known_for_department === "Directing";
              return isDirector ? (
                <CreatorCard key={result.id} person={result} />
              ) : (
                <ActorCard key={result.id} actor={result} />
              );
            }
            return null;
          })}
        </div>
      ) : (
        query &&
        noResultsMessage && (
          <p className={styles.results}>
            Nenhum resultado encontrado no catálogo
          </p>
        )
      )}
    </div>
  );
}
