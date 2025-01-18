const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_TOKEN = process.env.REACT_APP_PRIVATE_API_TOKEN;

export const fetchFromApi = async (endpoint) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro na requisição à API:", error);
    throw error;
  }
};

export const getDetails = async (id, type = "movie") => {
  const endpoint = `/${type}/${id}?language=pt-BR&append_to_response=credits,videos,recommendations,watch/providers,release_dates,content_ratings,translations`;
  return await fetchFromApi(endpoint);
};

export const searchMulti = async (query) => {
  const endpoint = `/search/multi?language=pt-BR&query=${query}&include_adult=false`;
  return await fetchFromApi(endpoint);
};
