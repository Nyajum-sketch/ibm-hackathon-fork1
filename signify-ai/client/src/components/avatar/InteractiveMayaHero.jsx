import React from 'react';
import { 
  Mic, 
  Languages, 
  Accessibility, 
  Sparkles, 
  Radio, 
  Play, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import Floating3DParticles from '../ui/Floating3DParticles';
import { useSettingsStore } from '../../store/useSettingsStore';
import EyeTrackingBot from './EyeTrackingBot';
import { TextAnimate } from '@/registry/magicui/text-animate';
import { Ripple } from '@/registry/magicui/ripple';

export default function InteractiveMayaHero({ onNavigate }) {
  const { reduceMotion } = useSettingsStore();

  return (
    <div 
      className="w-full bg-[#190019] text-[#FBE4D8] relative select-none overflow-hidden pt-8 pb-4"
    >
      {/* 1. Ambient Background: Pseudo-3D Floating Particles */}
      <Floating3DParticles color="#DFB6B2" quantity={280} size={3.8} opacity={0.28} drift={0.65} depth={0.55} />

      {/* Ambient Lighting Gradients */}
      <div className="absolute w-[500px] h-[500px] bg-[#522B5B]/25 rounded-full blur-3xl pointer-events-none -top-24 left-1/2 -translate-x-1/2" />
      <div className="absolute w-[400px] h-[400px] bg-[#2B124C]/35 rounded-full blur-3xl pointer-events-none bottom-0 left-1/2 -translate-x-1/2" />

      {/* 2. Static Top Badges Row */}
      <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-3 mb-6 relative z-20">
        <div className="inline-flex items-center gap-2 bg-[#522B5B] text-[#FBE4D8] border-2 border-[#854F6C] rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000]">
          <span className="w-2 h-2 rounded-full bg-[#DFB6B2]" />
          <span>WE ARE SIGNIFY AI</span>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-[#DFB6B2] text-[#190019] border-2 border-[#DFB6B2] rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000]">
          <span>ZERO BARRIERS FOR DEAF STUDENTS</span>
        </div>
      </div>

      {/* 3. CENTERPIECE: RIPPLE & TEXT ANIMATE WITH ISOLATED STATIONARY MASCOT */}
      <div className="relative max-w-6xl mx-auto px-4 py-4 flex flex-col items-center justify-center">
        
        {/* Ripple Background & Text Animate */}
        <div className="relative w-full flex items-center justify-center py-6 min-h-[220px] sm:min-h-[280px] lg:min-h-[340px]">
          {/* Animated Ripple Effect behind text */}
          <Ripple mainCircleSize={220} mainCircleOpacity={0.3} numCircles={8} />

          {/* Text Animate "SIGNIFY AI" - Blur in by character */}
          <div className="relative z-10 flex justify-center">
            <TextAnimate
              animation="blurInUp"
              by="character"
              once
              as="h1"
              className="text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] xl:text-[9.5rem] font-black uppercase font-display text-[#FBE4D8] leading-none select-none tracking-tight text-center"
              style={{
                textShadow: `
                  1px 1px 0px #DFB6B2,
                  2px 2px 0px #DFB6B2,
                  3px 3px 0px #854F6C,
                  4px 4px 0px #854F6C,
                  5px 5px 0px #522B5B,
                  6px 6px 0px #522B5B,
                  7px 7px 0px #2B124C,
                  8px 8px 0px #190019,
                  14px 18px 30px rgba(0, 0, 0, 0.85)
                `,
              }}
            >
              SIGNIFY AI
            </TextAnimate>
          </div>

          {/* Desktop Bob: completely isolated from text motion so text expansion does not affect placement */}
          <div className="hidden lg:block absolute right-2 xl:right-6 bottom-4 z-30 pointer-events-auto">
            <EyeTrackingBot />
          </div>
        </div>

        {/* Mobile/Tablet Bob below the text */}
        <div className="lg:hidden mt-2 mb-4 z-30 pointer-events-auto">
          <EyeTrackingBot />
        </div>

        {/* STATIC Subtitle, Pills, and Buttons below (DO NOT MOVE) */}
        <div className="mt-4 max-w-2xl px-4 space-y-4 text-center relative z-20">
          <p className="text-sm sm:text-base md:text-lg font-black uppercase tracking-wider text-[#DFB6B2] leading-relaxed">
            Real-Time Classroom Companion for Deaf &amp; Hard-of-Hearing Students
          </p>

          {/* Quick Interactive Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 bg-[#2B124C] text-[#FBE4D8] border-2 border-[#522B5B] rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000]">
              <Mic className="w-3.5 h-3.5 text-[#DFB6B2]" />
              <span>Voice-to-Text 99.4%</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#2B124C] text-[#FBE4D8] border-2 border-[#522B5B] rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000]">
              <Languages className="w-3.5 h-3.5 text-[#DFB6B2]" />
              <span>50+ Languages</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#2B124C] text-[#FBE4D8] border-2 border-[#522B5B] rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000]">
              <Accessibility className="w-3.5 h-3.5 text-[#DFB6B2]" />
              <span>3D Sign Avatar</span>
            </span>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => onNavigate('/classroom')}
              className="inline-flex items-center gap-2 bg-[#DFB6B2] text-[#190019] hover:bg-[#FBE4D8] border-2 border-[#DFB6B2] rounded-full px-6 py-3 text-xs sm:text-sm font-black uppercase tracking-wider shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START CLASSROOM SESSION</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/avatar')}
              className="inline-flex items-center gap-2 bg-[#522B5B] text-[#FBE4D8] hover:bg-[#854F6C] border-2 border-[#854F6C] rounded-full px-6 py-3 text-xs sm:text-sm font-black uppercase tracking-wider shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Accessibility className="w-4 h-4" />
              <span>OPEN AI AVATAR</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bottom Marquee Ticker */}
      <div className="w-full bg-[#2B124C] border-t-2 border-b-2 border-[#190019] py-2.5 overflow-hidden whitespace-nowrap relative z-20 mt-6">
        <div className="inline-flex gap-8 animate-marquee font-display font-black text-xs sm:text-sm uppercase tracking-widest text-[#FBE4D8]">
          <span>WE ARE SIGNIFY AI</span>
          <span className="text-[#DFB6B2]">&bull;</span>
          <span>BREAKING BARRIERS FOR DEAF STUDENTS</span>
          <span className="text-[#DFB6B2]">&bull;</span>
          <span>REAL-TIME CLASSROOM COMPANION</span>
          <span className="text-[#DFB6B2]">&bull;</span>
          <span>50+ LANGUAGES AUTO-TRANSLATION</span>
          <span className="text-[#DFB6B2]">&bull;</span>
          <span>OFFLINE PRIVATE ARCHIVE</span>
          <span className="text-[#DFB6B2]">&bull;</span>
          <span>AI LECTURE TUTOR &amp; SUMMARY</span>
          <span className="text-[#DFB6B2]">&bull;</span>
          <span>WE ARE SIGNIFY AI</span>
          <span className="text-[#DFB6B2]">&bull;</span>
          <span>BREAKING BARRIERS FOR DEAF STUDENTS</span>
          <span className="text-[#DFB6B2]">&bull;</span>
          <span>REAL-TIME CLASSROOM COMPANION</span>
          <span className="text-[#DFB6B2]">&bull;</span>
          <span>50+ LANGUAGES AUTO-TRANSLATION</span>
          <span className="text-[#DFB6B2]">&bull;</span>
          <span>OFFLINE PRIVATE ARCHIVE</span>
          <span className="text-[#DFB6B2]">&bull;</span>
          <span>AI LECTURE TUTOR &amp; SUMMARY</span>
        </div>
      </div>
    </div>
  );
}
