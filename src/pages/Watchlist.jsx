import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImagePath } from '../services/tmdb';
import { getWatchlist, removeFromWatchlist } from '../utils/watchlist';

export default function Watchlist() {
  const [savedShows, setSavedShows] = useState([]);

  useEffect(() => {
    setSavedShows(getWatchlist());
  }, []);

  const handleRemove = (e, id) => {
    e.preventDefault();
    removeFromWatchlist(id);
    setSavedShows(getWatchlist());
  };

  return (
    <Layout>
      <motion.main className="pt-32 min-h-screen px-4 md:px-8 pb-20" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}} transition={{duration: 0.5}}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 border-b border-white/10 pb-6">
            <h1 className="text-5xl font-headline font-extrabold text-white mb-2">My Watchlist</h1>
            <p className="text-outline text-lg">Shows and movies you want to watch later.</p>
          </div>

          {savedShows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-surface-container-low rounded-lg border border-white/5">
                <span className="material-symbols-outlined text-outline text-6xl mb-4">folder_open</span>
                <h3 className="text-2xl font-bold text-white mb-2">Your watchlist is empty</h3>
                <p className="text-on-surface-variant mb-6">Explore trending series and movies to build your collection.</p>
                <Link to="/browse" className="primary-gradient text-on-primary-container px-8 py-3 rounded-full font-bold transition-transform hover:scale-105">
                    Explore Titles
                </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedShows.map((item) => (
                <Link to={`/show/${item.id}`} key={item.id} className="group relative bg-surface-container rounded-lg overflow-hidden transition-all duration-500 hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(6,14,32,0.6)]">
                  <div className="aspect-[2/3] overflow-hidden">
                    <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title || item.name} src={getImagePath(item.poster_path)}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80"></div>
                  </div>
                  
                  <div className="absolute top-4 left-4 z-20">
                    <div className="bg-tertiary-container/90 backdrop-blur-md text-on-tertiary-container px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-lg">
                      <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      {item.vote_average?.toFixed(1) || '0.0'}
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button onClick={(e) => handleRemove(e, item.id)} className="bg-error/80 p-2 rounded-full hover:bg-error transition-colors text-white shadow-lg" title="Remove from Watchlist">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>

                  <div className="absolute bottom-0 p-4 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 pointer-events-none z-10">
                    <div className="text-secondary text-[10px] font-bold tracking-widest uppercase mb-1 flex justify-between items-center">
                        <span>{item.media_type === 'tv' || item.first_air_date ? 'Series' : 'Movie'}</span>
                    </div>
                    <h4 className="font-headline font-bold text-lg leading-tight text-white mb-1 line-clamp-1">
                      {item.title || item.name}
                    </h4>
                    <div className="text-[11px] font-medium text-tertiary font-mono tracking-wider bg-black/40 inline-block px-2 py-1 rounded mt-1">
                        /show/{item.id} - TMDB Number: {item.id}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </motion.main>
    </Layout>
  );
}
