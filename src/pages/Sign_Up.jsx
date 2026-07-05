import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function Sign_Up() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (username) {
        await updateProfile(result.user, { displayName: username });
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
      const provider = new GoogleAuthProvider();
      try {
          const result = await signInWithPopup(auth, provider);
          const customName = prompt("Welcome! Please confirm or enter your Profile Name:", result.user.displayName || '');
          if (customName && customName !== result.user.displayName) {
             await updateProfile(result.user, { displayName: customName });
          }
          navigate('/');
      } catch (err) {
          setError(err.message);
      }
  };

  return (
    <Layout>
      
<div className="fixed inset-0 z-0">
<div className="absolute inset-0 bg-[url('image-hero-bg')] bg-cover bg-center opacity-40 mix-blend-overlay" data-alt="dramatic cinematic atmosphere with deep purple and blue light rays filtering through a dark theater space with subtle dust motes"></div>
<div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
<div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background"></div>
</div>
<motion.main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12 md:py-24" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}} transition={{duration: 0.5}}>
<div className="w-full max-w-lg">
<div className="mb-12 text-center">
<h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter mb-4">
<span className="text-gradient">msaDB</span>
</h1>
<p className="font-label text-on-surface-variant text-lg tracking-wide uppercase">Join the curation</p>
</div>
<div className="glass-panel rounded-lg p-8 md:p-12 shadow-[0_20px_40px_rgba(6,14,32,0.4)]">
{error && <p className="text-error text-sm mb-4">{error}</p>}
<form onSubmit={handleSignUp} className="space-y-6">
<div className="space-y-2">
<label className="block text-sm font-medium text-on-surface-variant ml-1 font-label">Username</label>
<div className="relative group">
<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
<span className="material-symbols-outlined text-[20px]">person</span>
</div>
<input value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full bg-surface-container-lowest border-none rounded-full py-4 pl-12 pr-6 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all font-body" placeholder="cinephile_01" type="text"/>
</div>
</div>
<div className="space-y-2">
<label className="block text-sm font-medium text-on-surface-variant ml-1 font-label">Email Address</label>
<div className="relative group">
<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
<span className="material-symbols-outlined text-[20px]">mail</span>
</div>
<input value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-surface-container-lowest border-none rounded-full py-4 pl-12 pr-6 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all font-body" placeholder="viewer@aether.com" type="email"/>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="block text-sm font-medium text-on-surface-variant ml-1 font-label">Password</label>
<div className="relative group">
<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
<span className="material-symbols-outlined text-[20px]">lock</span>
</div>
<input value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-surface-container-lowest border-none rounded-full py-4 pl-12 pr-6 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all font-body" placeholder="••••••••" type="password"/>
</div>
</div>
<div className="space-y-2">
<label className="block text-sm font-medium text-on-surface-variant ml-1 font-label">Confirm Password</label>
<div className="relative group">
<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
<span className="material-symbols-outlined text-[20px]">verified_user</span>
</div>
<input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-surface-container-lowest border-none rounded-full py-4 pl-12 pr-6 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all font-body" placeholder="••••••••" type="password"/>
</div>
</div>
</div>
<div className="pt-4">
<button className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary-container font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20" type="submit">
                            Create Account
                        </button>
</div>
<div className="flex items-center gap-4 py-2">
<div className="h-px flex-grow bg-outline-variant/30"></div>
<span className="text-xs font-label text-outline uppercase tracking-widest">or continue with</span>
<div className="h-px flex-grow bg-outline-variant/30"></div>
</div>
<div className="flex gap-4">
<button className="flex-1 flex items-center justify-center gap-2 py-3 bg-surface-container-high rounded-full hover:bg-surface-container-highest transition-colors" type="button">
<span className="material-symbols-outlined text-[18px]">movie_filter</span>
<span className="text-sm font-medium">Apple</span>
</button>
<button onClick={handleGoogleSignUp} className="flex-1 flex items-center justify-center gap-2 py-3 bg-surface-container-high rounded-full hover:bg-surface-container-highest transition-colors" type="button">
<span className="material-symbols-outlined text-[18px]">stars</span>
<span className="text-sm font-medium">Google</span>
</button>
</div>
</form>
</div>
<div className="mt-8 text-center">
<p className="text-on-surface-variant font-label">
                    Already have an account? 
                    <Link className="text-secondary hover:text-secondary-dim underline underline-offset-4 decoration-secondary/30 ml-1 transition-colors" to="/login">Log In</Link>
</p>
</div>
</div>
</motion.main>

    </Layout>
  );
}
