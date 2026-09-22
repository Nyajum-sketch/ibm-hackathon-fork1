import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AudioLines, 
  Menu, 
  X, 
  Radio, 
  Video, 
  Accessibility, 
  LayoutDashboard, 
  History, 
  Settings, 
  ArrowUpRight,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { useCaptionStore } from '../../store/useCaptionStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { AddonNavbarEntry } from '../../addons';

export default function Navbar() {
  const { isListening } = useCaptionStore();
  const { theme, actions: settingsActions } = useSettingsStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const subNavItems = [
    { name: 'CLASSROOM', path: '/classroom', icon: Video },
    { name: 'AI AVATAR', path: '/avatar', icon: Accessibility },
    { name: 'DASHBOARD', path: '/dashboard', icon: LayoutDashboard },
    { name: 'HISTORY', path: '/history', icon: History },
    { name: 'SETTINGS', path: '/settings', icon: Settings },
  ];

  return (
    <header className="w-full bg-[#190019] select-none z-40 relative">
      
      {/* TIER 1: BRAND LOGO & TOP ACTIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo & Hackathon Tag */}
          <div className="flex items-center gap-3">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="flex items-center gap-2 bg-[#2B124C] text-[#FBE4D8] px-3.5 py-1.5 rounded-full border-2 border-[#522B5B] shadow-[2px_2px_0px_#000000]">
                <AudioLines className="w-4 h-4 text-[#DFB6B2]" />
                <span className="font-display font-black text-lg tracking-tight uppercase">
                  SIGNIFY<span className="text-[#DFB6B2]">AI</span>
                </span>
              </div>
            </NavLink>

            <span className="hidden sm:inline-flex items-center bg-[#522B5B] text-[#FBE4D8] border-2 border-[#854F6C] rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000]">
              ( WE ARE SIGNIFY AI )
            </span>
          </div>

          {/* Right: Actions, Recording Indicator, Addons & Quick Launch */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Session Recording Indicator */}
            {isListening && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6C151E] text-[#FBE4D8] border-2 border-[#854F6C] text-xs font-black shadow-[2px_2px_0px_#000000]">
                <Radio className="w-3.5 h-3.5 text-[#DFB6B2]" />
                <span className="uppercase tracking-wider text-[10px]">LIVE RECORDING</span>
              </div>
            )}

            {/* Teacher / Student Addon Controls */}
            <AddonNavbarEntry />

            {/* Quick Theme Toggle */}
            <button 
              onClick={settingsActions.toggleTheme}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              className="p-2 rounded-full border-2 border-[#522B5B] bg-[#2B124C] text-[#FBE4D8] hover:border-[#DFB6B2] shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-[#DFB6B2]" />}
            </button>

            {/* Quick Launch CTA Button */}
            <button 
              onClick={() => navigate('/classroom')}
              className="flex items-center gap-1.5 bg-[#DFB6B2] text-[#190019] hover:bg-[#FBE4D8] border-2 border-[#DFB6B2] rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000000] transition-colors"
            >
              <span>LAUNCH CLASSROOM</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu trigger & Theme Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={settingsActions.toggleTheme}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              className="p-2 bg-[#2B124C] text-[#FBE4D8] border-2 border-[#522B5B] rounded-xl shadow-[2px_2px_0px_#000000]"
            >
              {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-[#DFB6B2]" />}
            </button>
            {isListening && (
              <span className="w-2.5 h-2.5 bg-[#6C151E] rounded-full" />
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-[#2B124C] text-[#FBE4D8] border-2 border-[#522B5B] rounded-xl shadow-[2px_2px_0px_#000000]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* TIER 2: SUBNAV PILL CARDS ROW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <nav className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
          {subNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={
                  `flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border-2 text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-150 ${
                    isActive
                      ? 'bg-[#DFB6B2] text-[#190019] border-[#DFB6B2] shadow-[3px_3px_0px_#000000] scale-[1.02]'
                      : 'bg-[#2B124C] text-[#FBE4D8] border-[#522B5B] hover:bg-[#522B5B] hover:border-[#DFB6B2] shadow-[3px_3px_0px_#190019] active:translate-x-[2px] active:translate-y-[2px]'
                  }`
                }
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#190019]' : 'text-[#DFB6B2]'}`} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* DIVIDER: THIN SOLID PLUM LINE */}
      <div className="w-full h-[2px] bg-[#522B5B] mt-3" />

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#2B124C] border-b-2 border-[#522B5B] px-4 py-4 space-y-2 shadow-[0_8px_0_#190019]"
          >
            {subNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-black text-sm uppercase ${
                    isActive ? 'bg-[#DFB6B2] text-[#190019] border-[#DFB6B2]' : 'bg-[#190019] text-[#FBE4D8] border-[#522B5B]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
            <div className="pt-2 border-t-2 border-[#522B5B]">
              <AddonNavbarEntry />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
