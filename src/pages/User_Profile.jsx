import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { updateProfile } from 'firebase/auth';
import { getWatchlist, removeFromWatchlist } from '../utils/watchlist';
import { getImagePath } from '../services/tmdb';

export default function User_Profile() {
  const [user, setUser] = useState(auth.currentUser);
  const [watchlistItems, setWatchlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((usr) => setUser(usr));
    setWatchlistItems(getWatchlist());
    return unsub;
  }, []);

  const displayName = user?.displayName || 'Cinephile';
  const photoURL = user?.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuANEgdH3Nkuzuvsri2GM5E8BlyYg957FJt_Tgwhvu-tA22S25RsrobbVNJEJf6PPtTqaxu0iYexMaRHcRCK632GTS0AAKTTxAn9ldpUOIftMyztbrXCQJeIpNOBuQYqPy8SmPY3TDd9KVA3m4jajQpVoXHnZBOPVMBW15NQMN7thgWjOjRRKc1ji7CDItnlLG0ofJCDfHqiNqTK5o-zRBdcinod6KZdfQzy7V3ml2yDs14KaDXi6fpVfS9tJHYqB2-L0P6USjvvGvk';

  const movieCount = watchlistItems.filter(i => i.media_type === 'movie' || !i.media_type).length;
  const seriesCount = watchlistItems.filter(i => i.media_type === 'tv').length;
  const totalHours = Math.round((movieCount * 2) + (seriesCount * 10));

  const handleEditProfile = async () => {
    if (!user) return;
    const newName = prompt("Enter your new Profile Name:", displayName);
    if (newName && newName !== displayName) {
      await updateProfile(user, { displayName: newName });
      setUser({ ...user, displayName: newName });
    }
  };

  const handleEditImage = async () => {
    if (!user) return;
    const newImage = prompt("Enter image URL for new Profile Picture:", photoURL);
    if (newImage && newImage !== photoURL) {
      await updateProfile(user, { photoURL: newImage });
      setUser({ ...user, photoURL: newImage });
    }
  };

  const handleRemoveFromWatchlist = (id) => {
    removeFromWatchlist(id);
    setWatchlistItems(getWatchlist());
  };

  return (
    <Layout>

<motion.main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}} transition={{duration: 0.5}}>

<section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

<div className="lg:col-span-8 flex flex-col md:flex-row gap-8 items-center md:items-end bg-surface-container-low p-8 md:p-12 rounded-lg relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-40"></div>
<div onClick={handleEditImage} className="relative w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-lg overflow-hidden shadow-2xl bg-surface-container-high cursor-pointer group">
<img className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" data-alt={displayName} src={photoURL}/>
<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
   <span className="material-symbols-outlined text-white text-4xl drop-shadow-lg">photo_camera</span>
</div>
</div>
<div className="relative text-center md:text-left space-y-4">
<div className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-full uppercase tracking-widest">Premium Member</div>
<h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter text-on-surface">{displayName}</h1>
<p className="text-on-surface-variant max-w-md text-lg leading-relaxed">
                        Curating the finest pixels of Japanese animation and neo-noir cinema. Part-time film critic, full-time dreamer.
                    </p>
<div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
<button onClick={handleEditProfile} className="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                            Edit Profile
                        </button>
<button onClick={() => navigate('/settings')} className="bg-surface-variant/60 backdrop-blur-xl text-on-surface px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-all">
                            Settings
                        </button>
</div>
</div>
</div>

<div className="lg:col-span-4 grid grid-cols-2 gap-4">
<div className="col-span-2 bg-surface-container-high p-6 rounded-lg flex flex-col justify-between border-t border-white/5">
<span className="text-on-surface-variant text-sm font-medium">Total Runtime</span>
<div className="flex items-baseline gap-2">
<span className="text-4xl font-headline font-bold text-secondary">{totalHours}</span>
<span className="text-on-surface-variant">Hours</span>
</div>
</div>
<div className="bg-surface-container-high p-6 rounded-lg flex flex-col justify-between border-t border-white/5">
<span className="text-tertiary material-symbols-outlined text-3xl" data-icon="movie">movie</span>
<div>
<span className="block text-2xl font-bold">{movieCount}</span>
<span className="text-xs text-on-surface-variant">Movies</span>
</div>
</div>
<div className="bg-surface-container-high p-6 rounded-lg flex flex-col justify-between border-t border-white/5">
<span className="text-primary material-symbols-outlined text-3xl" data-icon="tv_gen">tv_gen</span>
<div>
<span className="block text-2xl font-bold">{seriesCount}</span>
<span className="text-xs text-on-surface-variant">Series</span>
</div>
</div>
<div className="col-span-2 bg-gradient-to-br from-surface-container-highest to-surface-container-high p-6 rounded-lg border-t border-white/5">
<div className="flex justify-between items-center mb-4">
<span className="text-sm font-medium text-on-surface-variant">Reviews Written</span>
<span className="text-tertiary-fixed-dim font-bold">0</span>
</div>
<div className="h-2 w-full bg-surface-container-lowest rounded-full overflow-hidden">
<div className="h-full bg-tertiary w-[72%] rounded-full shadow-[0_0_15px_rgba(255,151,178,0.4)]"></div>
</div>
</div>
</div>
</section>

<section className="space-y-6">
<div className="flex justify-between items-end">
<div className="space-y-1">
<h2 className="text-3xl font-headline font-extrabold tracking-tight">My Watchlist</h2>
<p className="text-on-surface-variant text-sm">{watchlistItems.length} items currently queued for projection</p>
</div>
<Link to="/watchlist" className="text-secondary hover:underline font-semibold flex items-center gap-1 group">
                    View all <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
</Link>
</div>
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

  {watchlistItems.length > 0 ? watchlistItems.slice(0, 6).map(item => (
     <div key={item.id} className="group relative space-y-3">
         <div className="aspect-[2/3] rounded-lg overflow-hidden relative shadow-lg bg-surface-container-high transition-transform duration-500 group-hover:scale-105 group-hover:shadow-primary/20">
            <img className="w-full h-full object-cover" alt={item.title || item.name} src={getImagePath(item.poster_path)}/>
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-4 gap-2">
               <Link to={`/show/${item.id}`} className="w-full bg-primary text-on-primary py-2 rounded-full font-bold text-xs text-center hover:bg-primary-dim transition-colors">View Details</Link>
               <button onClick={() => handleRemoveFromWatchlist(item.id)} className="w-full bg-error/20 text-error py-2 rounded-full font-bold text-xs hover:bg-error/30 transition-colors">Remove</button>
            </div>
         </div>
         <div>
            <h3 className="font-bold text-sm line-clamp-1">{item.title || item.name}</h3>
            <p className="text-xs text-on-surface-variant capitalize">{item.media_type || 'Movie'} • {(item.release_date || item.first_air_date || '').split('-')[0]}</p>
         </div>
     </div>
  )) : (
     <div className="col-span-full py-12 text-center text-on-surface-variant bg-surface-container-low rounded-lg">Your watchlist is empty. Explore titles to add some!</div>
  )}

</div>
</section>

<section className="space-y-6">
<div className="flex justify-between items-end">
<h2 className="text-3xl font-headline font-extrabold tracking-tight">Latest Reviews</h2>
</div>
<div className="space-y-4">
    <div className="bg-surface-container-high/40 backdrop-blur-md p-8 rounded-lg text-center text-on-surface-variant glass-gradient-top">
        No reviews written yet. Start watching to share your thoughts!
    </div>
</div>
</section>
</motion.main>

    </Layout>
  );
}
