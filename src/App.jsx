import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';

import Browse_Search from './pages/Browse_Search';
import Home_Page from './pages/Home_Page';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Show_Details from './pages/Show_Details';
import Sign_Up from './pages/Sign_Up';
import User_Profile from './pages/User_Profile';
import Watchlist from './pages/Watchlist';

function AnimatedRoutes({ user }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes - Auto redirect to home if already logged in */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/sign_up" element={!user ? <Sign_Up /> : <Navigate to="/" replace />} />
        
        {/* Protected Routes - Auto redirect to login if not authenticated */}
        <Route path="/" element={user ? <Home_Page /> : <Navigate to="/login" replace />} />
        <Route path="/browse" element={user ? <Browse_Search /> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" replace />} />
        <Route path="/show/:id" element={user ? <Show_Details /> : <Navigate to="/login" replace />} />
        <Route path="/user_profile" element={user ? <User_Profile /> : <Navigate to="/login" replace />} />
        <Route path="/watchlist" element={user ? <Watchlist /> : <Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <AnimatedRoutes user={user} />
    </Router>
  );
}

export default App;
