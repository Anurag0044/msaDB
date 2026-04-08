import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import tmdbAPI, { getImagePath } from '../services/tmdb';

export default function Show_Details() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      
      // Try fetching as movie first
      let data = await tmdbAPI.getMovieDetails(id);
      
      // If the API returns success === false, it means the ID wasn't found under movies, so try TV series.
      if (!data || data.success === false) {
        data = await tmdbAPI.getSeriesDetails(id);
      }

      if (data && data.success !== false && (data.title || data.name)) {
        setDetails(data);
      } else {
        setError('Failed to load details.');
      }
      
      setLoading(false);
    };

    if (id) {
       fetchDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="pt-32 min-h-screen flex items-center justify-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error || !details) {
    return (
      <Layout>
        <div className="pt-32 min-h-screen flex flex-col items-center justify-center text-white">
          <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
          <h2 className="text-2xl font-bold mb-4">Could not load details</h2>
          <p className="text-on-surface-variant mb-4">The ID {id} was not found.</p>
          <Link to="/" className="text-primary hover:underline">Return to Home</Link>
        </div>
      </Layout>
    );
  }

  const title = details.title || details.name;
  const year = (details.release_date || details.first_air_date || '').split('-')[0];
  const duration = details.runtime ? `${details.runtime} mins` : (details.episode_run_time && details.episode_run_time.length > 0 ? `${details.episode_run_time[0]} mins/ep` : 'N/A');
  const genres = details.genres?.slice(0,2) || [];
  const backgroundUrl = getImagePath(details.backdrop_path, 'original');
  const posterUrl = getImagePath(details.poster_path);
  const cast = details.credits?.cast?.slice(0, 4) || [];

  const videos = details.videos?.results || [];
  const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos.find(v => v.site === 'YouTube');

  const handleWatchTrailer = () => {
    if (trailer) {
      window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
    } else {
      alert('Sorry, no YouTube trailer found for this title.');
    }
  };

  return (
    <Layout>
      <motion.main className="pt-24 pb-20" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}} transition={{duration: 0.5}}>

        <section className="relative min-h-[819px] flex items-center px-8 md:px-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover opacity-30 blur-sm" alt={title} src={backgroundUrl}/>
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-end md:items-center">
            <div className="w-full md:w-[400px] flex-shrink-0">
              <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-[1.02] transition-transform duration-500">
                <img className="w-full h-full object-cover" alt={title} src={posterUrl}/>
              </div>
            </div>

            <div className="flex-grow space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-3">
                  {genres.map(g => (
                    <span key={g.id} className="px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-semibold rounded-full tracking-wider uppercase">
                      {g.name}
                    </span>
                  ))}
                  {year && (
                    <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-xs font-semibold rounded-full tracking-wider">
                      {year}
                    </span>
                  )}
                </div>
                <h1 className="text-5xl md:text-8xl font-headline font-extrabold tracking-tighter text-on-surface leading-tight">
                  {title}
                </h1>
                {details.tagline && (
                  <p className="text-xl text-outline italic mt-2">{details.tagline}</p>
                )}
              </div>
              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-tertiary font-headline text-5xl font-black">{details.vote_average?.toFixed(1) || '0.0'}</span>
                  <span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">User Score</span>
                </div>
                <div className="h-12 w-[1px] bg-outline-variant/30"></div>
                <div className="flex gap-4">
                  <button onClick={handleWatchTrailer} className="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(189,157,255,0.4)] transition-all">
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
                    Watch Trailer
                  </button>
                  <button className="bg-surface-variant/60 backdrop-blur-md text-on-surface px-8 py-4 rounded-full font-bold border border-white/10 hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined">add</span>
                    Add to List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-surface-container-low p-8 md:p-12 rounded-lg">
              <h2 className="text-2xl font-headline font-bold mb-6 text-primary flex items-center gap-3">
                <span className="material-symbols-outlined">auto_stories</span>
                The Synopsis
              </h2>
              <p className="text-on-surface/80 text-lg leading-relaxed font-light">
                {details.overview || 'No synopsis available.'}
              </p>
            </div>

            {cast.length > 0 && (
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <h2 className="text-2xl font-headline font-bold text-primary">Featured Cast</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {cast.map(person => (
                    <div key={person.id} className="group cursor-pointer">
                      <div className="aspect-square rounded-lg overflow-hidden mb-3 grayscale group-hover:grayscale-0 transition-all duration-500 bg-surface-container-high">
                        <img className="w-full h-full object-cover" alt={person.name} src={getImagePath(person.profile_path)}/>
                      </div>
                      <p className="font-bold text-on-surface line-clamp-1">{person.name}</p>
                      <p className="text-on-surface-variant text-sm line-clamp-1">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-surface-container rounded-lg p-8 space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-outline">Production Info</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant">Status</span>
                  <span className="text-on-surface font-semibold">{details.status || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant">Runtime</span>
                  <span className="text-on-surface font-semibold">{duration}</span>
                </div>
                {details.budget > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant">Budget</span>
                    <span className="text-on-surface font-semibold">${(details.budget / 1000000).toFixed(1)}M</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-on-surface-variant">Studios</span>
                  <span className="text-on-surface font-semibold line-clamp-1 text-right max-w-[150px]">
                    {details.production_companies?.map(c => c.name).join(', ') || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </motion.main>
    </Layout>
  );
}
