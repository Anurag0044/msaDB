import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import tmdbAPI, { getImagePath } from '../services/tmdb';
import { addToWatchlist } from '../utils/watchlist';

export default function Home_Page() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingSeries, setTrendingSeries] = useState([]);
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const movies = await tmdbAPI.getTrendingMovies();
      const series = await tmdbAPI.getTrendingSeries();
      const anime = await tmdbAPI.getTrendingAnime();

      if (movies?.results) setTrendingMovies(movies.results);
      if (series?.results) setTrendingSeries(series.results);
      if (anime?.results) setTrendingAnime(anime.results);
    };
    fetchData();
  }, []);

  const heroItems = React.useMemo(() => {
     return [
       trendingMovies[0],
       trendingSeries[0],
       trendingAnime[0],
       trendingMovies[1],
       trendingSeries[1]
     ].filter(Boolean).slice(0, 5);
  }, [trendingMovies, trendingSeries, trendingAnime]);

  useEffect(() => {
    if (heroItems.length === 0) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroItems.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroItems]);

  const vaultMovies = trendingMovies.slice(1, 15);

  const seriesRef = useRef(null);
  const vaultRef = useRef(null);

  const scrollRow = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollAmount = clientWidth > 600 ? clientWidth * 0.75 : clientWidth;
      const target = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      ref.current.scrollTo({ left: target, behavior: 'smooth' });
    }
  };

  const handleAddToWatchlist = (e, item) => {
    e.preventDefault();
    const added = addToWatchlist(item);
    if(added) {
        alert('Added to Watchlist!');
    } else {
        alert('Already in Watchlist!');
    }
  };

  const handleReview = (e) => {
      e.preventDefault();
      alert('Review feature coming soon!');
  };

  return (
    <Layout>
      <motion.main initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}} transition={{duration: 0.5}}>

        {/* HERO SECTION */}
        {heroItems.length > 0 && (
          <section className="relative min-h-screen overflow-hidden">
            <div 
              className="flex h-full w-full absolute inset-0 transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${heroIndex * 100}%)` }}
            >
              {heroItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="w-full h-full flex-none relative flex items-end pb-24 px-8 md:px-16 overflow-hidden">
                  <div className="absolute inset-0 z-0">
                    <img className="w-full h-full object-cover" alt={item.title || item.name} src={getImagePath(item.backdrop_path || item.poster_path, 'original')}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent"></div>
                  </div>
                  <div className="relative z-10 max-w-4xl">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Now Trending</span>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-tertiary" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                        <span className="font-bold text-xl text-tertiary">{item.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-headline font-extrabold tracking-tighter mb-6 leading-none">
                      {item.title || item.name}
                    </h1>
                    <p className="text-lg md:text-xl text-on-surface-variant font-body max-w-2xl mb-10 leading-relaxed line-clamp-3">
                      {item.overview}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link to={`/show/${item.id}`} className="bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold py-4 px-10 rounded-full flex items-center gap-3 transition-all hover:scale-105 shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
                        View Details
                      </Link>
                      <button onClick={(e) => handleAddToWatchlist(e, item)} className="glass-card text-on-surface font-bold py-4 px-10 rounded-full transition-all hover:bg-white/10">
                        Add to Watchlist
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-30">
              {heroItems.map((_, idx) => (
                 <button 
                   key={idx} 
                   onClick={() => setHeroIndex(idx)}
                   className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === heroIndex ? 'bg-primary scale-125' : 'bg-white/30 hover:bg-white/50'}`}
                   aria-label={`Go to slide ${idx + 1}`}
                 />
              ))}
            </div>
          </section>
        )}

        {/* TOP 5 MARQUEE LOOP */}
        <section className="py-12 bg-surface overflow-hidden relative">
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                animation: marquee 25s linear infinite;
              }
              .animate-marquee:hover {
                animation-play-state: paused;
              }
            `}</style>
            <div className="px-8 md:px-16 mb-6">
               <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">Top 10 Trending Now</h2>
            </div>
            <div className="flex w-max animate-marquee pb-4">
               {/* Create the top 10 array safely */}
               {(() => {
                 const top10 = [
                     trendingMovies[0],
                     trendingSeries[0],
                     trendingAnime[0],
                     trendingMovies[1],
                     trendingSeries[1],
                     trendingAnime[1],
                     trendingMovies[2],
                     trendingSeries[2],
                     trendingAnime[2],
                     trendingMovies[3]
                 ].filter(Boolean).slice(0, 10);

                 // Repeat multiple times for a smooth continuous loop
                 const loopItems = [...top10, ...top10, ...top10, ...top10];
                 
                 return loopItems.map((item, i) => {
                   return (
                     <Link to={`/show/${item.id}`} key={`${item.id}-${i}`} className="flex-none mx-4 group relative block h-[200px] md:h-[250px] aspect-[2/3]">
                        {/* Poster */}
                        <div className="w-full h-full rounded-lg shadow-2xl overflow-hidden relative transition-transform duration-300 group-hover:scale-105 group-hover:ring-4 ring-primary/50">
                            <img className="w-full h-full object-cover" src={getImagePath(item.poster_path)} alt={item.title || item.name} />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-white">play_circle</span>
                            </div>
                        </div>
                     </Link>
                   );
                 });
               })()}
            </div>
        </section>

        {/* TRENDING SERIES */}
        <section className="py-24 bg-surface-container-low">
          <div className="px-8 md:px-16 mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">Trending Series</h2>
              <p className="text-on-surface-variant mt-2">The worlds that defined a generation of television.</p>
            </div>
            <Link to="/browse?filter=tv" className="text-secondary font-bold flex items-center gap-2 hover:underline decoration-2 underline-offset-8">
              Explore All <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="relative group">
            <button onClick={() => scrollRow(seriesRef, 'left')} className="absolute left-0 top-0 bottom-8 z-10 w-16 md:w-24 bg-gradient-to-r from-surface-container-low to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-start pl-2 md:pl-4">
                <span className="material-symbols-outlined text-5xl drop-shadow-2xl hover:scale-125 transition-transform">chevron_left</span>
            </button>
            <div ref={seriesRef} className="flex gap-8 overflow-x-auto no-scrollbar px-8 md:px-16 pb-8">
            {trendingSeries.map(series => (
              <Link to={`/show/${series.id}`} key={series.id} className="flex-none w-80 group cursor-pointer relative rounded-lg overflow-hidden transition-all duration-500 hover:scale-[1.02]">
                <div className="relative h-[480px]">
                  <img className="w-full h-full object-cover" alt={series.name} src={getImagePath(series.poster_path)}/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                </div>
                
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button onClick={(e) => handleAddToWatchlist(e, series)} className="bg-surface/80 p-2 rounded-full hover:bg-primary transition-colors text-white" title="Add to Watchlist">
                        <span className="material-symbols-outlined text-sm">bookmark_add</span>
                    </button>
                    <button onClick={handleReview} className="bg-surface/80 p-2 rounded-full hover:bg-secondary transition-colors text-white" title="Review">
                        <span className="material-symbols-outlined text-sm">rate_review</span>
                    </button>
                </div>

                <div className="absolute bottom-6 left-6 right-6 z-10 pointer-events-none">
                  <span className="text-secondary text-xs font-bold tracking-widest uppercase mb-2 block">Series</span>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-headline font-bold text-white line-clamp-1">{series.name}</h3>
                    <div className="bg-tertiary/20 backdrop-blur-md px-3 py-1 rounded-full text-tertiary font-bold">{series.vote_average?.toFixed(1)}</div>
                  </div>
                </div>
              </Link>
            ))}
            </div>
            <button onClick={() => scrollRow(seriesRef, 'right')} className="absolute right-0 top-0 bottom-8 z-10 w-16 md:w-24 bg-gradient-to-l from-surface-container-low to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end pr-2 md:pr-4">
                <span className="material-symbols-outlined text-5xl drop-shadow-2xl hover:scale-125 transition-transform">chevron_right</span>
            </button>
          </div>
        </section>

        {/* TRENDING ANIME */}
        <section className="py-24 px-8 md:px-16">
          <div className="flex justify-between items-end mb-12">
             <h2 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">Trending Anime</h2>
             <Link to="/browse?filter=anime" className="text-secondary font-bold flex items-center gap-2 hover:underline decoration-2 underline-offset-8">
                Explore All <span className="material-symbols-outlined">arrow_forward</span>
             </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[800px]">
            {trendingAnime.slice(0, 4).map((anime, index) => {
              const isLarge = index === 0;
              const isMedium = index === 1;
              return (
                <Link to={`/show/${anime.id}`} key={anime.id} className={`${isLarge ? 'md:col-span-2 md:row-span-2' : isMedium ? 'md:col-span-2' : ''} relative rounded-lg overflow-hidden group`}>
                  <img className="w-full h-full object-cover" alt={anime.name} src={getImagePath(anime.backdrop_path || anime.poster_path, 'original')}/>
                  <div className={`absolute inset-0 ${isLarge ? 'bg-gradient-to-t' : isMedium ? 'bg-gradient-to-l' : 'bg-surface-container-highest/40 group-hover:bg-transparent transition-colors'} from-surface-container-lowest via-transparent to-transparent`}></div>

                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button onClick={(e) => handleAddToWatchlist(e, anime)} className="bg-surface/80 p-2 rounded-full hover:bg-primary transition-colors text-white" title="Add to Watchlist">
                      <span className="material-symbols-outlined text-sm">bookmark_add</span>
                    </button>
                    <button onClick={handleReview} className="bg-surface/80 p-2 rounded-full hover:bg-secondary transition-colors text-white" title="Review">
                      <span className="material-symbols-outlined text-sm">rate_review</span>
                    </button>
                  </div>
                  
                  {isLarge && (
                    <div className="absolute bottom-8 left-8 right-8 pointer-events-none z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-[10px] font-bold uppercase">Must Watch</span>
                      </div>
                      <h3 className="text-4xl font-headline font-bold mb-4 text-white line-clamp-1">{anime.name}</h3>
                      <p className="text-on-surface-variant line-clamp-2 max-w-lg mb-6">{anime.overview}</p>
                      <div className="flex items-center gap-6">
                        <div className="flex gap-1 text-tertiary">
                          <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                          <span className="font-bold">{anime.vote_average?.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {isMedium && (
                    <div className="absolute inset-y-0 right-0 w-1/2 flex flex-col justify-center p-8 pointer-events-none text-right md:text-left z-10">
                      <h4 className="text-2xl font-headline font-bold mb-2 text-white line-clamp-2">{anime.name}</h4>
                      <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{anime.overview}</p>
                      <div className="text-tertiary font-bold">{anime.vote_average?.toFixed(1)} / 10</div>
                    </div>
                  )}

                  {!isLarge && !isMedium && (
                    <div className="absolute bottom-4 left-4 pointer-events-none z-10">
                      <h4 className="font-bold text-white line-clamp-1">{anime.name}</h4>
                      <span className="text-xs text-secondary font-bold">Anime</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        {/* THE VAULT */}
        <section className="py-24 bg-surface">
          <div className="px-8 md:px-16 mb-12 flex justify-between items-end">
            <div>
                <h2 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">The Vault</h2>
                <p className="text-on-surface-variant mt-2">Currently popular movies you shouldn't miss.</p>
            </div>
            <Link to="/browse?filter=movie" className="text-secondary font-bold flex items-center gap-2 hover:underline decoration-2 underline-offset-8">
              Explore All <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="relative group pb-8">
            <button onClick={() => scrollRow(vaultRef, 'left')} className="absolute left-0 top-0 bottom-8 z-10 w-16 md:w-24 bg-gradient-to-r from-surface to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-start pl-2 md:pl-4">
                <span className="material-symbols-outlined text-5xl drop-shadow-2xl hover:scale-125 transition-transform">chevron_left</span>
            </button>
            <div ref={vaultRef} className="flex gap-8 overflow-x-auto no-scrollbar px-8 md:px-16">
              {vaultMovies.map(movie => (
                <Link to={`/show/${movie.id}`} key={movie.id} className="flex-none w-[200px] md:w-[280px] flex flex-col gap-4 group relative transition-transform duration-300 hover:scale-[1.02]">
                <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl relative">
                  <img className="w-full h-full object-cover" alt={movie.title} src={getImagePath(movie.poster_path)}/>
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button onClick={(e) => handleAddToWatchlist(e, movie)} className="bg-surface/80 p-2 rounded-full hover:bg-primary transition-colors text-white" title="Add to Watchlist">
                      <span className="material-symbols-outlined text-sm">bookmark_add</span>
                    </button>
                    <button onClick={handleReview} className="bg-surface/80 p-2 rounded-full hover:bg-secondary transition-colors text-white" title="Review">
                      <span className="material-symbols-outlined text-sm">rate_review</span>
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <button className="w-16 h-16 rounded-full bg-white text-surface flex items-center justify-center scale-75 group-hover:scale-100 transition-transform">
                      <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xl font-headline font-bold line-clamp-1 group-hover:text-primary transition-colors">{movie.title}</h4>
                    <span className="text-tertiary font-extrabold">{movie.vote_average?.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-outline-variant font-label uppercase tracking-widest">
                    {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                  </p>
                </div>
              </Link>
            ))}
            </div>
            <button onClick={() => scrollRow(vaultRef, 'right')} className="absolute right-0 top-0 bottom-8 z-10 w-16 md:w-24 bg-gradient-to-l from-surface to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end pr-2 md:pr-4">
                <span className="material-symbols-outlined text-5xl drop-shadow-2xl hover:scale-125 transition-transform">chevron_right</span>
            </button>
          </div>
        </section>

        <section className="py-24 px-8 md:px-16 flex items-center justify-center">
          <div className="glass-card w-full max-w-5xl rounded-lg p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full -ml-32 -mb-32"></div>
            <h2 className="text-4xl font-headline font-extrabold mb-4 relative z-10">Curate Your Experience</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto mb-10 relative z-10">Join 50,000+ cinephiles and get weekly hand-picked recommendations, exclusive director interviews, and early review access.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative z-10">
              <input className="flex-grow bg-surface-container-lowest border-outline-variant/30 rounded-full py-4 px-6 focus:ring-primary focus:border-primary" placeholder="Enter your email" type="email"/>
              <button className="bg-primary text-on-primary font-bold py-4 px-8 rounded-full transition-transform hover:scale-105 active:scale-95">Subscribe</button>
            </div>
          </div>
        </section>
      </motion.main>
    </Layout>
  );
}
