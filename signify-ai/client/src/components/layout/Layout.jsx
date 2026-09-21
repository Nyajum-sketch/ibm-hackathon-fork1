import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import ParallaxBackground from './ParallaxBackground';
import { useSettingsStore } from '../../store/useSettingsStore';

export default function Layout() {
  const location = useLocation();
  const { reduceMotion } = useSettingsStore();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#190019] text-[#FBE4D8] flex flex-col relative selection:bg-[#DFB6B2]/20 selection:text-[#FBE4D8]">
      {/* Global Dynamic Parallax Background for all pages */}
      <ParallaxBackground />

      {/* Top Navbar */}
      <div className="relative z-30">
        <Navbar />
      </div>

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col relative z-10 w-full">
        {/* Main section */}
        <main className="flex-1 min-w-0 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
