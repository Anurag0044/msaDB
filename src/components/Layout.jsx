import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((usr) => setUser(usr));
    return unsub;
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('query');
    if (query) {
      navigate(`/browse?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/browse');
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-2xl px-8 py-4 shadow-[0_20px_40px_rgba(6,14,32,0.4)] font-['Plus_Jakarta_Sans'] tracking-tight">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-violet-300 to-violet-500">msaDB</Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/browse" className="text-violet-300 border-b-2 border-violet-500 pb-1 hover:bg-white/5 transition-all duration-300">Browse</Link>
          <Link to="/browse?filter=movie" className="text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300">Movies</Link>
          <Link to="/browse?filter=tv" className="text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300">Series</Link>
          <Link to="/browse?filter=anime" className="text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300">Anime</Link>
          <Link to="/watchlist" className="text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300">Watchlist</Link>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {/* Search bar */}
          <div className="relative group hidden lg:flex items-center">
            <form onSubmit={handleSearch} className="flex items-center bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all focus-within:bg-white/10 focus-within:border-violet-500/50">
              <span className="material-symbols-outlined text-slate-400 mr-2 text-xl">search</span>
              <input name="query" className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder-slate-400 w-48" placeholder="Search titles..." type="text"/>
            </form>
          </div>
          
          <button className="hidden md:block scale-95 active:scale-90 transition-transform text-slate-300 hover:text-white">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          
          {user ? (
            <Link to="/user_profile" className="hidden md:flex items-center gap-3 hover:opacity-80 transition-opacity">
              <span className="text-slate-300 font-bold text-sm tracking-wide truncate max-w-[120px]">{user.displayName || 'Cinephile'}</span>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-violet-500/30 hover:border-violet-500 transition-colors">
                <img className="w-full h-full object-cover" alt="User profile" src={user.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuA2FZaWA3ddVLF37gwNQqPWftzQ-4YEvV7FFvcbuk8BDtUVxIGQvMXAkdk3voDpvZNv412UtUZupFGs34oxHKGw4mKk8HE1LMhiWzAUeGd0lGmeUKDmUW6ayGohqKjFfVBh5LyKv_3pA5Dg6WsNc47vFXLAkrictyqR_UW9Otk86TMYDiuL5NuL9tmNe83Kgf3WZrUKMasxF99D8ioFo2O-a-DZ7W0_u_UiDSWXyQA3w9lKNgZcu2D2rfAvPdbxTrA4EIbywJRLRt4"}/>
              </div>
            </Link>
          ) : (
            <Link to="/login" className="hidden md:block text-slate-300 hover:text-white font-bold text-sm">Login</Link>
          )}

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-slate-300 hover:text-white">
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 mt-4 bg-slate-900 border border-white/10 p-4 rounded-xl shadow-2xl">
          <form onSubmit={handleSearch} className="flex items-center bg-white/5 px-4 py-2 rounded-full border border-white/10 mb-2">
            <span className="material-symbols-outlined text-slate-400 mr-2 text-xl">search</span>
            <input name="query" className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder-slate-400 w-full" placeholder="Search titles..." type="text"/>
          </form>
          <Link to="/browse" onClick={() => setMobileMenuOpen(false)} className="text-violet-300 font-bold">Browse</Link>
          <Link to="/browse?filter=movie" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white">Movies</Link>
          <Link to="/browse?filter=tv" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white">Series</Link>
          <Link to="/browse?filter=anime" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white">Anime</Link>
          <Link to="/watchlist" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white">Watchlist</Link>
          {user ? (
            <>
              <Link to="/user_profile" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white">My Profile</Link>
              <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white">Settings</Link>
              <button onClick={() => { auth.signOut(); setMobileMenuOpen(false); }} className="text-error hover:text-error/80 text-left font-bold py-2">Sign Out</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-primary hover:text-primary-dim font-bold">Login / Sign Up</Link>
          )}
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 w-full py-12 px-8 border-t border-white/5 font-['Inter'] text-sm tracking-wide">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
        <div className="text-lg font-bold text-slate-100">msaDB</div>
        <div className="flex flex-wrap justify-center gap-8">
          <Link to="/" className="text-slate-400 hover:text-slate-100 hover:underline decoration-violet-500 underline-offset-4 transition-opacity opacity-80 hover:opacity-100">About Us</Link>
          <Link to="/" className="text-slate-400 hover:text-slate-100 hover:underline decoration-violet-500 underline-offset-4 transition-opacity opacity-80 hover:opacity-100">Terms of Service</Link>
          <Link to="/" className="text-slate-400 hover:text-slate-100 hover:underline decoration-violet-500 underline-offset-4 transition-opacity opacity-80 hover:opacity-100">Privacy Policy</Link>
        </div>
        <div className="text-slate-500 font-['Inter']">© 2024 msaDB. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default function Layout({ children }) {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary selection:text-on-primary min-h-screen pt-20">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
