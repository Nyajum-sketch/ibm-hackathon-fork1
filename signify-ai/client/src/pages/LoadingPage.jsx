import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Radio } from 'lucide-react';
import BanterLoader from '../components/ui/BanterLoader';

export default function LoadingPage({ message = 'INITIALIZING CLASSROOM ENGINE...', onLoaded }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(25);
  const [stepText, setStepText] = useState('Connecting to Speech-to-Text Pipeline...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(55);
      setStepText('Calibrating Rylo 3D Sign Language Avatar...');
    }, 1200);

    const timer2 = setTimeout(() => {
      setProgress(85);
      setStepText('Loading Offline Lecture Database & Models...');
    }, 2400);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStepText('Classroom Workspace Ready!');
      if (onLoaded) onLoaded();
    }, 3600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onLoaded]);

  return (
    <div className="min-h-screen bg-[#190019] text-[#FBE4D8] flex flex-col items-center justify-center relative px-4 overflow-hidden select-none">
      
      {/* Glow Backdrop */}
      <div className="absolute w-96 h-96 bg-[#522B5B]/30 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-[#2B124C]/40 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

      <div className="relative z-10 max-w-lg w-full text-center flex flex-col items-center">
        
        {/* Top Branding Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-[#2B124C] text-[#FBE4D8] border-2 border-[#522B5B] rounded-full px-4 py-1 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000000] mb-8"
        >
          <Radio className="w-3.5 h-3.5 text-[#DFB6B2] animate-pulse" />
          <span>SIGNIFY AI SYSTEM LOADER</span>
        </motion.div>

        {/* Banter Loader Animation Showcase */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-[#2B124C] border-2 border-[#522B5B] rounded-3xl p-10 shadow-[6px_6px_0px_#000000] w-full flex flex-col items-center relative overflow-hidden mb-6"
        >
          {/* Banter Loader Component */}
          <div className="py-12 w-full flex items-center justify-center">
            <BanterLoader boxColor="#DFB6B2" />
          </div>

          {/* Progress & Headline */}
          <div className="w-full space-y-3 mt-4">
            <h1 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-[#FBE4D8]">
              {message}
            </h1>
            <p className="text-xs font-bold text-[#DFB6B2] tracking-wide">
              {stepText}
            </p>

            {/* Custom Neobrutalist Progress Bar */}
            <div className="w-full bg-[#190019] border-2 border-[#522B5B] h-3.5 rounded-full overflow-hidden p-0.5 shadow-[2px_2px_0px_#000000] mt-3">
              <motion.div 
                className="bg-[#DFB6B2] h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="flex justify-between text-[10px] font-black text-neutral-400 uppercase tracking-wider pt-1">
              <span>INITIALIZING</span>
              <span>{progress}%</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Navigation Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={() => navigate('/classroom')}
            className="inline-flex items-center gap-2 bg-[#DFB6B2] text-[#190019] hover:bg-[#FBE4D8] border-2 border-[#DFB6B2] rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000000] transition-colors"
          >
            <span>GO TO CLASSROOM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-[#522B5B] text-[#FBE4D8] hover:bg-[#854F6C] border-2 border-[#854F6C] rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000000] transition-colors"
          >
            <span>HOME</span>
          </button>
        </motion.div>

      </div>
    </div>
  );
}
