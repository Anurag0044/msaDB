import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import tmdbAPI, { getImagePath } from '../services/tmdb';
import { addToWatchlist } from '../utils/watchlist';

export default function Browse_Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const urlFilter = searchParams.get('filter') || 'all';
  
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState(initialSearch);
  const [mediaType, setMediaType] = useState(urlFilter);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMediaType(urlFilter);
    setQuery(initialSearch);
    if (initialSearch) {
      handleSearch(null, initialSearch, urlFilter);
    } else {
      fetchInitialData(urlFilter);
    }
  }, [initialSearch, urlFilter]);

  const fetchInitialData = async (filterType) => {
    setLoading(true);
    let data;
    if (filterType === 'movie') {
      data = await tmdbAPI.getTrendingMovies('week');
    } else if (filterType === 'tv') {
      data = await tmdbAPI.getTrendingSeries('week');
    } else if (filterType === 'anime') {
      data = await tmdbAPI.getTrendingAnime();
    } else {
      data = await tmdbAPI.getTrendingMovies('week'); // default
    }
    
    if (data?.results) {
      setResults(data.results.filter(r => r.media_type !== 'person'));
    }
    setLoading(false);
  };

  const handleSearch = async (e, forcedQuery = null, forcedFilter = null) => {
    e?.preventDefault();
    const activeQuery = forcedQuery !== null ? forcedQuery : query;
    const activeFilter = forcedFilter !== null ? forcedFilter : mediaType;
    
    if (e && !forcedQuery) {
       // Manual form submit
       if (query) {
         setSearchParams({ search: query, filter: activeFilter });
       } else {
         setSearchParams({ filter: activeFilter });
       }
       return; 
    }

    if (!activeQuery.trim()) {
      fetchInitialData(activeFilter);
      return;
    }

    setLoading(true);
    let data;
    if (activeFilter === 'movie') {
      data = await tmdbAPI.searchMovies(activeQuery);
    } else if (activeFilter === 'tv' || activeFilter === 'anime') {
      data = await tmdbAPI.searchSeries(activeQuery);
    } else {
      data = await tmdbAPI.searchMulti(activeQuery);
    }

    const validResults = data?.results?.filter(r => r.media_type !== 'person') || [];
    setResults(validResults);
    setLoading(false);
  };

  const handleFilterChange = (type) => {
    setMediaType(type);
    if (query) {
       setSearchParams({ search: query, filter: type });
    } else {
       setSearchParams({ filter: type });
    }
  };

  const handleAddToWatchlist = (e, item) => {
    e.preventDefault();
    const added = addToWatchlist(item);
    if(added) {
        alert('Added to Watchlist!');
    }
  };

  const handleReview = (e) => {
      e.preventDefault();
      alert('Review feature coming soon!');
  };

  return (
    <Layout>
      <motion.main className="pt-24 min-h-screen px-4 md:px-8 pb-20" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}} transition={{duration: 0.5}}>

        <div className="max-w-7xl mx-auto mb-12">
          <div className="relative overflow-hidden rounded-lg bg-surface-container-low p-8 md:p-12 mb-8">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
              <img className="w-full h-full object-cover" alt="abstract background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCO1aPx3pJ8GQTOF0ls_F7wNKK2Qjda_l2WrA4rATTRaO32RcazTrfrRxUZaagbXJa9PfHEj6boWrVAqvRb-8IxhI5P0ObMFRkI0Ev6tzlC7aOR8aOgQutFvdCpTO4Nx7CzRmo0QH2FG8lNzhW__2ttS4Gk43FOpMkcybmbMUEpgLKvL9J0y99rC8qZmxcl5G31k8jd14ECSvcZcjmErPxC-YmYXqku7MbzzFC2xmu6axNfM72MGtdoC7S-gbQMexnMU6vdt6dOISQ"/>
            </div>
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface mb-6">Discover Your Next <span className="text-secondary">Obsession.</span></h1>
              <form onSubmit={handleSearch} className="flex items-center bg-surface-container-highest rounded-full p-2 pl-6 shadow-2xl border border-outline-variant/10">
                <span className="material-symbols-outlined text-outline">search</span>
                <input 
                  className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-outline px-4 font-body" 
                  placeholder="Search movies, anime, or series..." 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="primary-gradient text-on-primary-container px-8 py-3 rounded-full font-bold transition-transform hover:scale-105 active:scale-95">
                  Search
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-72 shrink-0">
              <div className="sticky top-28 space-y-8">
                <section>
                  <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">filter_list</span>
                    Refine Results
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-outline block mb-3">Media Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleFilterChange('all')} className={`${mediaType === 'all' ? 'bg-primary border text-on-primary border-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'} py-2 rounded-lg text-sm transition-colors`}>All</button>
                        <button onClick={() => handleFilterChange('movie')} className={`${mediaType === 'movie' ? 'bg-primary border text-on-primary border-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'} py-2 rounded-lg text-sm transition-colors`}>Movies</button>
                        <button onClick={() => handleFilterChange('tv')} className={`${mediaType === 'tv' ? 'bg-primary border text-on-primary border-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'} py-2 rounded-lg text-sm transition-colors`}>Series</button>
                        <button onClick={() => handleFilterChange('anime')} className={`${mediaType === 'anime' ? 'bg-primary border text-on-primary border-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'} py-2 rounded-lg text-sm transition-colors`}>Anime</button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex justify-between items-end mb-8">
                <div>
                  {query && <p className="text-outline text-sm mb-1 font-body">Showing results for "{query}"</p>}
                  {!query && <p className="text-outline text-sm mb-1 font-body">Currently Trending ({mediaType})</p>}
                  <h2 className="text-2xl font-headline font-bold text-on-surface">{results.length} Titles Found</h2>
                </div>
              </div>

              {loading ? (
                 <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                 </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.map((item) => (
                    <Link to={`/show/${item.id}`} key={item.id} className="group relative bg-surface-container rounded-lg overflow-hidden transition-all duration-500 hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(6,14,32,0.6)]">
                      <div className="aspect-[2/3] overflow-hidden">
                        <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title || item.name} src={getImagePath(item.poster_path)}/>
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80"></div>
                      </div>
                      
                      <div className="absolute top-4 left-4">
                        <div className="bg-tertiary-container/90 backdrop-blur-md text-on-tertiary-container px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                          {item.vote_average?.toFixed(1)}
                        </div>
                      </div>

                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => handleAddToWatchlist(e, item)} className="bg-surface/80 p-2 rounded-full hover:bg-primary transition-colors text-white" title="Add to Watchlist">
                          <span className="material-symbols-outlined text-sm">bookmark_add</span>
                        </button>
                        <button onClick={handleReview} className="bg-surface/80 p-2 rounded-full hover:bg-secondary transition-colors text-white" title="Review">
                          <span className="material-symbols-outlined text-sm">rate_review</span>
                        </button>
                      </div>

                      <div className="absolute bottom-0 p-4 w-full bg-gradient-to-t from-black/80 to-transparent pt-10">
                        <div className="text-secondary text-[10px] font-bold tracking-widest uppercase mb-1">
                          {item.media_type === 'tv' || item.first_air_date ? 'Series' : 'Movie'}
                        </div>
                        <h4 className="font-headline font-bold text-lg leading-tight group-hover:text-primary transition-colors text-white line-clamp-2">
                          {item.title || item.name}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.main>
    </Layout>
  );
}
