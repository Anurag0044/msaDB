import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import tmdbAPI, { getImagePath } from '../services/tmdb';

export default function Landing_Page() {
  const [email, setEmail] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingSeries, setTrendingSeries] = useState([]);
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const navigate = useNavigate();

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
    }, 3500);
    return () => clearInterval(interval);
  }, [carouselItems]);

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (email) {
      navigate('/sign_up', { state: { email } });
    } else {
      navigate('/sign_up');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-surface text-on-surface font-body overflow-x-hidden"
    >
      {/* Hero Section */}
      <div 
        className="relative min-h-[700px] md:min-h-[100vh] flex flex-col bg-cover bg-center border-b-8 border-surface-container-high"
        style={{
          backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.8) 100%), url("https://assets.nflxext.com/ffe/siteui/vlv3/a1dc92ca-091d-4ca9-a05b-8cd44bbfce6a/f9368347-e982-4856-a5a4-396796381f28/RS-en-20191230-popsignuptwoweeks-perspective_alpha_website_large.jpg")'
        }}
      >
        {/* Header */}
        <header className="flex justify-between items-center px-6 md:px-12 py-6 relative z-10">
          <div className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-violet-300 to-violet-500 tracking-tighter">
            msaDB
          </div>
          <Link to="/login" className="bg-gradient-to-br from-primary to-primary-dim text-on-primary shadow-lg shadow-primary/20 px-4 md:px-6 py-1 md:py-2 rounded-full flex items-center font-bold hover:scale-105 active:scale-95 transition-all">
            Sign In
          </Link>
        </header>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 md:px-0 relative z-10 max-w-4xl mx-auto mt-[-50px]">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Unlimited movies, TV shows, and more.</h1>
          <h2 className="text-xl md:text-2xl font-normal mb-8">Watch anywhere. Cancel anytime.</h2>
          <p className="text-lg md:text-xl mb-4">Ready to watch? Enter your email to create or access your account.</p>
          
          <form onSubmit={handleGetStarted} className="flex flex-col md:flex-row w-full max-w-2xl gap-2 md:gap-0">
            <input 
              type="email" 
              placeholder="Email address" 
              className="flex-1 p-4 text-on-surface bg-surface-container-lowest border-none outline-none rounded-full md:rounded-l-full md:rounded-r-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="bg-gradient-to-br from-primary to-primary-dim text-on-primary shadow-lg shadow-primary/20 text-xl md:text-2xl px-8 py-4 flex items-center justify-center font-bold rounded-full md:rounded-r-full md:rounded-l-none hover:opacity-90 transition-all">
              Get Started <span className="material-symbols-outlined ml-2">chevron_right</span>
            </button>
          </form>
        </div>
      </div>

      {/* Features Sections */}
      <div className="border-b-8 border-surface-container-high py-16 md:py-24 px-6 md:px-12 bg-surface flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        <div className="flex-1 text-center md:text-left max-w-xl">
          <h1 className="text-3xl md:text-5xl font-headline font-bold mb-4">Enjoy on your TV.</h1>
          <p className="text-lg md:text-2xl text-on-surface-variant">Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.</p>
        </div>
        <div className="flex-1 relative flex justify-center">
          <div className="relative w-full max-w-[500px]">
            <img src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/tv.png" alt="TV" className="w-full relative z-10" />
            <div className="absolute top-[20.5%] left-[13%] w-[74%] h-[54.5%] z-0 overflow-hidden bg-black">
               <AnimatePresence initial={false}>
                  {carouselItems.length > 0 && (
                     <motion.img
                        key={carouselItems[carouselIndex]?.id || carouselIndex}
                        src={getImagePath(carouselItems[carouselIndex]?.backdrop_path, 'w500')}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Trending"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                     />
                  )}
               </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b-8 border-surface-container-high py-16 md:py-24 px-6 md:px-12 bg-surface flex flex-col md:flex-row-reverse items-center justify-center gap-8 md:gap-16">
        <div className="flex-1 text-center md:text-left max-w-xl">
          <h1 className="text-3xl md:text-5xl font-headline font-bold mb-4">Download your shows to watch offline.</h1>
          <p className="text-lg md:text-2xl text-on-surface-variant">Save your favorites easily and always have something to watch.</p>
        </div>
        <div className="flex-1 relative flex justify-center">
           <div className="relative w-full max-w-[280px] rounded-[2rem] border-8 border-surface-container-highest overflow-hidden shadow-2xl aspect-[9/19]">
              {trendingSeries.length > 0 && (
                  <img src={getImagePath(trendingSeries[0].poster_path, 'w500')} className="w-full h-full object-cover" alt="Trending Series" />
               )}
           </div>
        </div>
      </div>

      <div className="border-b-8 border-surface-container-high py-16 md:py-24 px-6 md:px-12 bg-surface flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        <div className="flex-1 text-center md:text-left max-w-xl">
          <h1 className="text-3xl md:text-5xl font-headline font-bold mb-4">Watch everywhere.</h1>
          <p className="text-lg md:text-2xl text-on-surface-variant">Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV without paying more.</p>
        </div>
        <div className="flex-1 relative flex justify-center">
          <div className="relative w-full max-w-[500px]">
            <img src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/device-pile.png" alt="Device pile" className="w-full relative z-10 pointer-events-none" />
            <div className="absolute top-[10%] left-[18%] w-[61%] h-[47%] z-0 overflow-hidden bg-black">
               {trendingMovies.length > 1 && (
                  <img src={getImagePath(trendingMovies[1].backdrop_path, 'w500')} className="w-full h-full object-cover" alt="Trending Movie" />
               )}
            </div>
            <div className="absolute top-[41%] right-[17.5%] w-[15.5%] h-[40%] z-20 overflow-hidden bg-black rounded-sm">
               {trendingSeries.length > 1 && (
                  <img src={getImagePath(trendingSeries[1].poster_path, 'w500')} className="w-full h-full object-cover" alt="Trending Series" />
               )}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ & Final CTA */}
      <div className="border-b-8 border-surface-container-high py-16 md:py-24 px-6 md:px-12 bg-surface flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-5xl font-headline font-bold mb-12">Frequently Asked Questions</h1>
        
        <div className="w-full max-w-3xl flex flex-col gap-2 mb-12">
          {["What is msaDB?", "How much does msaDB cost?", "Where can I watch?", "How do I cancel?", "What can I watch on msaDB?"].map((q, idx) => (
            <div key={idx} className="bg-surface-container-low hover:bg-surface-container-high transition-colors p-6 flex justify-between items-center cursor-pointer text-left rounded-md border border-white/5">
              <span className="text-xl md:text-2xl font-medium">{q}</span>
              <span className="material-symbols-outlined text-3xl">add</span>
            </div>
          ))}
        </div>

        <p className="text-lg md:text-xl mb-4">Ready to watch? Enter your email to create or access your account.</p>
        <form onSubmit={handleGetStarted} className="flex flex-col md:flex-row w-full max-w-2xl gap-2 md:gap-0 mb-12">
          <input 
            type="email" 
            placeholder="Email address" 
            className="flex-1 p-4 text-black text-lg outline-none rounded-sm md:rounded-l-sm md:rounded-r-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="bg-[#e50914] hover:bg-[#f40612] text-white text-xl md:text-2xl px-8 py-4 flex items-center justify-center font-semibold rounded-sm md:rounded-r-sm md:rounded-l-none transition-colors">
            Get Started <span className="material-symbols-outlined ml-2">chevron_right</span>
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="py-12 md:py-16 px-6 md:px-12 bg-surface text-on-surface-variant max-w-5xl mx-auto border-t border-surface-container-high w-full">
        <p className="mb-8">Questions? Call 1-866-579-7172</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-8">
          <ul className="flex flex-col gap-3">
            <li><a href="#" className="hover:underline">FAQ</a></li>
            <li><a href="#" className="hover:underline">Investor Relations</a></li>
            <li><a href="#" className="hover:underline">Ways to Watch</a></li>
            <li><a href="#" className="hover:underline">Corporate Information</a></li>
            <li><a href="#" className="hover:underline">Only on msaDB</a></li>
          </ul>
          <ul className="flex flex-col gap-3">
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">Jobs</a></li>
            <li><a href="#" className="hover:underline">Terms of Use</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
          </ul>
          <ul className="flex flex-col gap-3">
            <li><a href="#" className="hover:underline">Account</a></li>
            <li><a href="#" className="hover:underline">Redeem Gift Cards</a></li>
            <li><a href="#" className="hover:underline">Privacy</a></li>
            <li><a href="#" className="hover:underline">Speed Test</a></li>
          </ul>
          <ul className="flex flex-col gap-3">
            <li><a href="#" className="hover:underline">Media Center</a></li>
            <li><a href="#" className="hover:underline">Buy Gift Cards</a></li>
            <li><a href="#" className="hover:underline">Cookie Preferences</a></li>
            <li><a href="#" className="hover:underline">Legal Notices</a></li>
          </ul>
        </div>
        <p className="text-sm">msaDB US</p>
      </footer>
    </motion.div>
  );
}
