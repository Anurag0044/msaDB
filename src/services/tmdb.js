const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`
  }
};

// Helper function to get full image paths
export const getImagePath = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Generic internal fetch wrapper
const fetchTMDB = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
  // Add common parameters
  url.searchParams.append('language', 'en-US');
  
  for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value);
  }

  try {
    const response = await fetch(url.toString(), fetchOptions);
    if (!response.ok) {
      throw new Error(`TMDB Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching TMDB endpoint ${endpoint}:`, error);
    return null;
  }
};

export const tmdbAPI = {
  // --- TRENDING ---

  // Get trending movies (timeWindow can be 'day' or 'week')
  getTrendingMovies: async (timeWindow = 'day') => {
    return await fetchTMDB(`/trending/movie/${timeWindow}`);
  },

  // Get trending TV series
  getTrendingSeries: async (timeWindow = 'day') => {
    return await fetchTMDB(`/trending/tv/${timeWindow}`);
  },

  // Get trending Anime 
  // TMDB doesn't have an explicit 'anime' endpoint, so we use discover TV with Japanese + Animation (genre 16)
  getTrendingAnime: async () => {
    return await fetchTMDB('/discover/tv', {
      with_genres: '16',
      with_original_language: 'ja',
      sort_by: 'popularity.desc',
      include_adult: 'false'
    });
  },

  // --- SEARCH ---

  // Search across Movies, TV Series, and People
  searchMulti: async (query, page = 1) => {
    return await fetchTMDB('/search/multi', {
      query,
      page
    });
  },

  // Search strictly for Movies
  searchMovies: async (query, page = 1) => {
    return await fetchTMDB('/search/movie', {
      query,
      page
    });
  },

  // Search strictly for TV Series / Anime
  searchSeries: async (query, page = 1) => {
    return await fetchTMDB('/search/tv', {
      query,
      page
    });
  },

  // --- DETAILS ---

  // Get details for a Movie (includes ratings in 'vote_average', posters, etc.)
  getMovieDetails: async (movieId) => {
    return await fetchTMDB(`/movie/${movieId}`, {
      append_to_response: 'videos,credits,images'
    });
  },

  // Get details for a TV Show
  getSeriesDetails: async (seriesId) => {
    return await fetchTMDB(`/tv/${seriesId}`, {
      append_to_response: 'videos,credits,images'
    });
  }
};

export default tmdbAPI;
