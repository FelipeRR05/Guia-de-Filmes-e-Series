import { useState, useEffect } from "react";
import { getDetails } from "../services/api";

export function useMovieDetails(id, mediaType) {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getDetails(id, mediaType);
        console.log("Detalhes recebidos:", data);
        setDetails(data);
      } catch (err) {
        console.error("Erro ao buscar detalhes:", err);
        setError("Erro ao carregar os detalhes.");
      }
    };

    fetchDetails();
  }, [id, mediaType]);

  return { details, error };
}
