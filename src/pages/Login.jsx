import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
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

<div className="cinematic-bg" data-alt="high-quality cinematic still of a dark movie theater with soft atmospheric lighting, violet and navy blue color palette, and misty bokeh effects"></div>

<motion.main className="w-full max-w-md px-6 z-10" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}} transition={{duration: 0.5}}>

<div className="text-center mb-10">
<h1 className="font-headline text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-violet-300 to-violet-500">msaDB</h1>
<p className="font-label text-on-surface-variant mt-2 tracking-wide uppercase text-xs font-semibold">Your Portal to Cinematic Mastery</p>
</div>

<div className="glass-card rounded-lg p-8 shadow-[0_20px_40px_rgba(6,14,32,0.6)]">
<h2 className="font-headline text-2xl font-bold mb-8 text-on-surface">Welcome Back</h2>
{error && <p className="text-error text-sm mb-4">{error}</p>}
<form onSubmit={handleLogin} className="space-y-6">

<div className="space-y-2">
<label className="font-label text-sm font-medium text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
<div className="relative group">
<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
<span className="material-symbols-outlined text-lg">mail</span>
</div>
<input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-surface-container-lowest border-none rounded-full py-3.5 pl-12 pr-4 text-on-surface placeholder-outline focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-high transition-all outline-none" id="email" name="email" placeholder="name@example.com" required type="email"/>
</div>
</div>

<div className="space-y-2">
<div className="flex justify-between items-center ml-1">
<label className="font-label text-sm font-medium text-on-surface-variant" htmlFor="password">Password</label>
<Link className="text-secondary text-xs font-semibold hover:underline decoration-secondary underline-offset-4 transition-all" to="/">Forgot Password?</Link>
</div>
<div className="relative group">
<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
<span className="material-symbols-outlined text-lg">lock</span>
</div>
<input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-surface-container-lowest border-none rounded-full py-3.5 pl-12 pr-12 text-on-surface placeholder-outline focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-high transition-all outline-none" id="password" name="password" placeholder="••••••••" required type="password"/>
<button className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface-variant transition-colors" type="button">
<span className="material-symbols-outlined text-lg">visibility</span>
</button>
</div>
</div>

<div className="pt-2">
<button className="w-full py-4 bg-gradient-to-br from-primary to-primary-dim text-on-primary-container font-headline font-bold rounded-full shadow-[0_10px_20px_rgba(141,76,252,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300" type="submit">
                        Log In
                    </button>
</div>
</form>

<div className="flex items-center gap-4 py-6">
<div className="h-px flex-grow bg-outline-variant/30"></div>
<span className="text-xs font-label text-outline uppercase tracking-widest">or continue with</span>
<div className="h-px flex-grow bg-outline-variant/30"></div>
</div>
<div className="flex gap-4">
<button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 py-3 bg-surface-container-high rounded-full hover:bg-surface-container-highest transition-colors" type="button">
<span className="material-symbols-outlined text-[18px]">stars</span>
<span className="text-sm font-medium">Continue with Google</span>
</button>
</div>

<div className="mt-8 pt-8 border-t border-white/5 text-center">
<p className="font-label text-sm text-on-surface-variant">
                    Don't have an account? 
                    <Link className="text-primary font-bold hover:underline underline-offset-4 ml-1" to="/sign_up">Start your journey</Link>
</p>
</div>
</div>
</motion.main>

    </Layout>
  );
}
