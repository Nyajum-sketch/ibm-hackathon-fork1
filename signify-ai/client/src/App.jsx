import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Classroom from './pages/Classroom';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';
import JoinSession from './pages/JoinSession';
import SignAvatar from './pages/SignAvatar';
import LoadingPage from './pages/LoadingPage';
import BanterLoader from './components/ui/BanterLoader';
import { AddonsProvider, AddonsOverlay } from './addons';

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Show the banter loading animation on every page refresh/initial load
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AddonsProvider>
      {/* Global Refresh Loading Overlay with Banter Loader */}
      <AnimatePresence>
        {initialLoading && (
          <motion.div
            key="refresh-banter-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeInOut' } }}
            className="fixed inset-0 z-[9999] bg-[#190019] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
          >
            {/* Ambient Background Glows */}
            <div className="absolute w-96 h-96 bg-[#522B5B]/30 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
            <div className="absolute w-96 h-96 bg-[#2B124C]/40 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

            <div className="relative z-10 flex items-center justify-center">
              <BanterLoader boxColor="#DFB6B2" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BrowserRouter>
        {/* Toast notifications container */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1C1C1F',
              color: '#F5F0E8',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '12px',
              fontFamily: '"DM Sans", sans-serif',
              borderRadius: '8px'
            },
            success: {
              iconTheme: {
                primary: '#4ADE80',
                secondary: '#1C1C1F',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF4D4D',
                secondary: '#1C1C1F',
              },
            },
          }}
        />
        <AddonsOverlay />
        <Routes>
          <Route path="/join/:sessionId" element={<JoinSession />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="classroom" element={<Classroom />} />
            <Route path="avatar" element={<SignAvatar />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
            <Route path="loading" element={<LoadingPage />} />
            <Route path="*" element={<Landing />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AddonsProvider>
  );
}
