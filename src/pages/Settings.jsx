import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Settings() {
  return (
    <Layout>

<motion.main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}} transition={{duration: 0.5}}>
<aside className="w-full md:w-64 flex-shrink-0">
<div className="bg-surface-container-low rounded-lg p-4 space-y-2">
<Link className="flex items-center gap-3 px-4 py-3 rounded-full text-violet-300 bg-surface-container-highest transition-all duration-300 font-semibold group" to="/settings">
<span className="material-symbols-outlined" data-icon="person" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
                    Profile
                </Link>
<Link className="flex items-center gap-3 px-4 py-3 rounded-full text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-300" to="/settings">
<span className="material-symbols-outlined" data-icon="manage_accounts">manage_accounts</span>
                    Account
                </Link>
<Link className="flex items-center gap-3 px-4 py-3 rounded-full text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-300" to="/">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
                    Notifications
                </Link>
<Link className="flex items-center gap-3 px-4 py-3 rounded-full text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-300" to="/">
<span className="material-symbols-outlined" data-icon="shield">shield</span>
                    Privacy
                </Link>
</div>
</aside>
<section className="flex-1">
<div className="mb-8">
<h1 className="text-4xl font-extrabold tracking-tighter mb-2">Profile Settings</h1>
<p className="text-on-surface-variant">Manage your public presence and personal information on msaDB.</p>
</div>
<div className="space-y-8">
<div className="bg-surface-container rounded-lg overflow-hidden">
<div className="p-8">
<h2 className="text-xl font-bold mb-6 text-primary">Identity</h2>
<div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
<div className="relative group">
<div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-outline-variant transition-colors group-hover:border-primary">
<img alt="Profile photo" className="w-full h-full object-cover" data-alt="Close up of a professional male user profile photo with soft lighting and minimalist background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZyAi3Vs5euqOUWc6papZsG3bMuniu1F8QiWwrm4z_AJsd21-ajCarObuLXa3dZSSA90EW0qPe86hU4pLIVMoRMW7qW8Mgc-GiWxmroQ1SMndUsppAWH_QZRUvGT8K16hXjC8t9a1uTurEL7hNyigRdJ-QBqSxJ8Sa-QbPJ1ejZutpiONILWs-vSI8jLl4aEMSzyO0y61GokWG8tTnZi2Of5IsRi5FnFTvwokPnnwEvhx_Liez_nSwXnFbw2qHqBjfNS2jh6aR72c"/>
</div>
<button className="absolute -bottom-2 -right-2 bg-primary text-on-primary-container p-2 rounded-full shadow-lg scale-95 active:scale-90 transition-transform">
<span className="material-symbols-outlined" data-icon="photo_camera">photo_camera</span>
</button>
</div>
<div className="flex-1 w-full space-y-4">
<div>
<label className="block text-sm font-medium text-on-surface-variant mb-2 px-1">Manage your public presence and personal information on msaDB.</label>
<input className="w-full bg-surface-container-lowest border-none rounded-full px-6 py-3 focus:ring-2 focus:ring-primary/40 transition-all text-on-surface placeholder:text-outline" type="text" value="Julian Aether"/>
</div>
<div>
<label className="block text-sm font-medium text-on-surface-variant mb-2 px-1">Manage your public presence and personal information on msaDB.</label>
<textarea className="w-full bg-surface-container-lowest border-none rounded-lg px-6 py-3 focus:ring-2 focus:ring-primary/40 transition-all text-on-surface placeholder:text-outline" rows="3">Cinephile, anime enthusiast, and digital storyteller. Always looking for the next masterpiece.</textarea>
</div>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
<div>
<label className="block text-sm font-medium text-on-surface-variant mb-2 px-1">Manage your public presence and personal information on msaDB.</label>
<div className="relative">
<span className="absolute left-6 top-1/2 -translate-y-1/2 text-outline">@</span>
<input className="w-full bg-surface-container-lowest border-none rounded-full pl-10 pr-6 py-3 focus:ring-2 focus:ring-primary/40 transition-all text-on-surface" type="text" value="julianaether"/>
</div>
</div>
<div>
<label className="block text-sm font-medium text-on-surface-variant mb-2 px-1">Manage your public presence and personal information on msaDB.</label>
<input className="w-full bg-surface-container-lowest border-none rounded-full px-6 py-3 focus:ring-2 focus:ring-primary/40 transition-all text-on-surface" type="email" value="julian@aethercinema.io"/>
</div>
</div>
</div>
</div>
<div className="bg-surface-container rounded-lg p-8">
<h2 className="text-xl font-bold mb-6 text-secondary">Preferences</h2>
<div className="space-y-4">
<div className="flex items-center justify-between p-4 rounded-lg bg-surface-container-low">
<div>
<p className="font-semibold">Public Profile</p>
<p className="text-sm text-on-surface-variant">Manage your public presence and personal information on msaDB.</p>
</div>
<div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
<div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
</div>
</div>
<div className="flex items-center justify-between p-4 rounded-lg bg-surface-container-low">
<div>
<p className="font-semibold">Newsletter</p>
<p className="text-sm text-on-surface-variant">Manage your public presence and personal information on msaDB.</p>
</div>
<div className="w-12 h-6 bg-surface-container-highest rounded-full relative cursor-pointer">
<div className="absolute left-1 top-1 w-4 h-4 bg-outline rounded-full"></div>
</div>
</div>
</div>
</div>
<div className="flex justify-end gap-4">
<button className="px-8 py-3 rounded-full font-semibold text-slate-300 hover:bg-white/5 transition-all">
                        Cancel
                    </button>
<button className="px-10 py-3 rounded-full font-bold bg-gradient-to-br from-primary to-primary-dim text-on-primary-container shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        Save Changes
                    </button>
</div>
</div>
</section>
</motion.main>

    </Layout>
  );
}
