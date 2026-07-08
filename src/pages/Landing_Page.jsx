import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import tmdbAPI, { getImagePath } from '../services/tmdb';

export default function Landing_Page() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingSeries, setTrendingSeries] = useState([]);
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Check session storage first to reduce API calls
      const cached = sessionStorage.getItem('landing_page_trending');
      if (cached) {
        const { movies, series, anime } = JSON.parse(cached);
        setTrendingMovies(movies);
        setTrendingSeries(series);
        setTrendingAnime(anime);
        return;
      }

      const movies = await tmdbAPI.getTrendingMovies();
      const series = await tmdbAPI.getTrendingSeries();
      const anime = await tmdbAPI.getTrendingAnime();
      
      if (movies?.results) setTrendingMovies(movies.results);
      if (series?.results) setTrendingSeries(series.results);
      if (anime?.results) setTrendingAnime(anime.results);

      // Save to cache
      if (movies?.results && series?.results && anime?.results) {
        sessionStorage.setItem('landing_page_trending', JSON.stringify({
          movies: movies.results,
          series: series.results,
          anime: anime.results
        }));
      }
    };
    fetchData();
  }, []);

  const carouselItems = React.useMemo(() => {
    return [
      trendingMovies[0],
      trendingSeries[0],
      trendingAnime[0],
      trendingMovies[1],
      trendingSeries[1],
      trendingAnime[1]
    ].filter(Boolean);
  }, [trendingMovies, trendingSeries, trendingAnime]);

  useEffect(() => {
    if (carouselItems.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [carouselItems]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeItem = carouselItems[carouselIndex] || {};

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-surface text-on-surface font-body overflow-x-hidden selection:bg-primary/30 selection:text-primary"
    >
      {/* Floating Glass Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-6'}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-8 md:gap-12">
            <Link to="/" onClick={() => window.scrollTo(0,0)} className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-fixed-dim tracking-tighter hover:opacity-80 transition-opacity">
              msaDB
            </Link>
            <div className="hidden md:flex gap-6 text-sm font-medium tracking-wide text-on-surface-variant">
              <span className="hover:text-primary cursor-pointer transition-colors">HOME</span>
              <span className="hover:text-primary cursor-pointer transition-colors">TV-SHOW</span>
              <span className="hover:text-primary cursor-pointer transition-colors">MOVIES</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="material-symbols-outlined text-2xl hidden md:block cursor-pointer hover:text-primary transition-colors">search</span>
            <Link to="/login" className="glass-button text-on-surface px-6 py-2.5 rounded-full flex items-center font-semibold text-sm tracking-wide">
              Sign In
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Cinematic Hero Section */}
      <div className="relative min-h-[100vh] flex flex-col justify-center overflow-hidden">
        {/* Dynamic Background */}
        <AnimatePresence mode="wait">
          {activeItem.backdrop_path && (
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 z-0"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center cinematic-vignette"
                style={{ 
                  backgroundImage: `url("${getImagePath(activeItem.backdrop_path, 'original')}")` 
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent w-full md:w-[70%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Content Overlay */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center pt-24 md:pt-0">
          
          {/* Left Side: Metadata & CTA */}
          <div className="flex-1 w-full flex flex-col items-start justify-center md:pr-12">
            <AnimatePresence mode="wait">
              <motion.h1 
                key={activeItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-5xl md:text-7xl lg:text-[6rem] font-black font-headline tracking-tighter leading-tight mb-4 max-w-2xl uppercase"
              >
                {activeItem.title || activeItem.name || 'Premium Streaming'}
              </motion.h1>
            </AnimatePresence>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 text-on-surface-variant text-sm font-medium mb-6 tracking-widest"
            >
              <span>{activeItem.media_type === 'movie' ? 'MOVIE' : 'SERIES'}</span>
              <span>•</span>
              <span>{activeItem.release_date ? activeItem.release_date.substring(0,4) : (activeItem.first_air_date ? activeItem.first_air_date.substring(0,4) : 'NEW')}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[1rem] text-primary">star</span> {activeItem.vote_average?.toFixed(1) || '8.5'}</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-3 mb-10"
            >
              <span className="glass-card px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider">ACTION</span>
              <span className="glass-card px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider">DRAMA</span>
              <span className="glass-card px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider">THRILLER</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full max-w-xl"
            >
              <h3 className="text-xl md:text-2xl font-light mb-6 text-on-surface-variant">
                Unlimited movies, TV shows, and more. <br className="hidden md:block"/>
                <span className="text-on-surface font-medium">Watch anywhere. Cancel anytime.</span>
              </h3>
              
              <div className="flex w-full mt-4">
                <Link to="/sign_up" className="bg-primary text-on-primary hover:bg-primary-dim px-8 py-4 flex items-center justify-center font-bold rounded-xl transition-all group overflow-hidden relative">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center gap-2 text-lg">
                    Get Started <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>


        </div>
      </div>

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-10" />

      {/* Feature Sections */}
      <div className="py-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-32">
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-headline font-bold mb-6 tracking-tight">Enjoy on your TV.</h1>
            <p className="text-lg md:text-xl text-on-surface-variant font-light leading-relaxed max-w-lg">
              Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.
            </p>
          </div>
          <div className="flex-1 relative flex justify-center w-full">
            <div className="relative w-full max-w-[500px] glass-card rounded-3xl p-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
              <img src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/tv.png" alt="TV" className="w-full relative z-10" />
              <div className="absolute top-[21%] left-[13.5%] w-[73%] h-[54%] z-0 bg-black overflow-hidden rounded">
                 <AnimatePresence initial={false}>
                    {carouselItems.length > 0 && (
                       <motion.img
                          key={carouselItems[carouselIndex]?.id || carouselIndex}
                          src={getImagePath(carouselItems[carouselIndex]?.backdrop_path, 'w500')}
                          className="absolute inset-0 w-full h-full object-cover opacity-80"
                          alt="Trending"
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 1.1, opacity: 0 }}
                          transition={{ duration: 1 }}
                       />
                    )}
                 </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-12 md:gap-20">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-headline font-bold mb-6 tracking-tight">Download your shows to watch offline.</h1>
            <p className="text-lg md:text-xl text-on-surface-variant font-light leading-relaxed max-w-lg">
              Save your favorites easily and always have something to watch.
            </p>
          </div>
          <div className="flex-1 relative flex justify-center">
             <div className="relative w-full max-w-[300px] glass-card rounded-[2.5rem] p-3 overflow-hidden shadow-2xl group hover:-translate-y-2 transition-transform duration-500">
                <div className="w-full aspect-[9/16] rounded-3xl overflow-hidden relative">
                  {trendingSeries.length > 0 && (
                      <img src={getImagePath(trendingSeries[0].poster_path, 'w500')} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Trending Series" />
                   )}
                   <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-card rounded-xl p-3 flex items-center gap-4 w-[80%] border border-white/20">
                      <img src={getImagePath(trendingSeries[0]?.poster_path, 'w200')} className="w-10 h-14 rounded object-cover" alt="mini-poster" />
                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-bold truncate w-24">{trendingSeries[0]?.name}</span>
                        <span className="text-xs text-primary font-medium">Downloading...</span>
                      </div>
                      <span className="material-symbols-outlined text-primary animate-bounce">download</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-headline font-bold mb-6 tracking-tight">Watch everywhere.</h1>
            <p className="text-lg md:text-xl text-on-surface-variant font-light leading-relaxed max-w-lg">
              Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV without paying more.
            </p>
          </div>
          <div className="flex-1 relative flex justify-center">
            <div className="relative w-full max-w-[550px]">
              <img src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/device-pile.png" alt="Device pile" className="w-full relative z-10 pointer-events-none drop-shadow-2xl" />
              <div className="absolute top-[10%] left-[18%] w-[61%] h-[47%] z-0 overflow-hidden bg-surface rounded">
                 {trendingMovies.length > 1 && (
                    <img src={getImagePath(trendingMovies[1].backdrop_path, 'w500')} className="w-full h-full object-cover opacity-70" alt="Trending Movie" />
                 )}
              </div>
              <div className="absolute top-[41%] right-[17.5%] w-[15.5%] h-[40%] z-20 overflow-hidden bg-surface rounded-md shadow-2xl border border-white/5">
                 {trendingSeries.length > 1 && (
                    <img src={getImagePath(trendingSeries[1].poster_path, 'w500')} className="w-full h-full object-cover" alt="Trending Series" />
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-10" />

      {/* FAQ & Final CTA */}
      <div className="py-20 px-6 md:px-12 flex flex-col items-center max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-headline font-bold mb-16 tracking-tight text-center">Frequently Asked Questions</h1>
        
        <div className="w-full flex flex-col gap-4 mb-16">
          {["What is msaDB?", "How much does msaDB cost?", "Where can I watch?", "How do I cancel?", "What can I watch on msaDB?"].map((q, idx) => (
            <div key={idx} className="glass-card hover:bg-white/5 transition-colors p-6 md:px-8 flex justify-between items-center cursor-pointer text-left rounded-2xl group">
              <span className="text-lg md:text-xl font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">{q}</span>
              <span className="material-symbols-outlined text-3xl text-primary group-hover:rotate-180 transition-transform duration-300">add</span>
            </div>
          ))}
        </div>

        <div className="text-center w-full max-w-2xl">
          <p className="text-lg md:text-xl mb-6 text-on-surface-variant font-light">Ready to watch? Create an account today.</p>
          <div className="flex justify-center w-full mt-4">
            <Link to="/sign_up" className="bg-primary text-on-primary hover:bg-primary-dim px-8 py-4 flex items-center justify-center font-bold rounded-xl transition-all group overflow-hidden relative">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-2 text-lg">
                Get Started <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-16 px-6 md:px-12 bg-surface text-on-surface-variant/60 max-w-7xl mx-auto w-full font-light border-t border-white/5">
        <p className="mb-10 text-on-surface-variant/80">Questions? Call 1-866-579-7172</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 text-sm mb-12">
          <ul className="flex flex-col gap-4">
            <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Investor Relations</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Ways to Watch</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Corporate Information</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Only on msaDB</a></li>
          </ul>
          <ul className="flex flex-col gap-4">
            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Jobs</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Terms of Use</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
          </ul>
          <ul className="flex flex-col gap-4">
            <li><a href="#" className="hover:text-primary transition-colors">Account</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Redeem Gift Cards</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Speed Test</a></li>
          </ul>
          <ul className="flex flex-col gap-4">
            <li><a href="#" className="hover:text-primary transition-colors">Media Center</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Buy Gift Cards</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Cookie Preferences</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Legal Notices</a></li>
          </ul>
        </div>
        <p className="text-sm">msaDB US</p>
      </footer>
    </motion.div>
  );
}
