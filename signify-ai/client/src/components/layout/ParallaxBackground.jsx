import React, { useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useSettingsStore } from '../../store/useSettingsStore';

export default function ParallaxBackground() {
  const { reduceMotion } = useSettingsStore();

  // Scroll parallax tracking
  const { scrollY } = useScroll();

  // Mouse parallax tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for fluid mouse movement
  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (reduceMotion) return;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      // Normalize to [-1, 1]
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, reduceMotion]);

  // Layer 1 (Deep background): Slow scroll and gentle mouse sway
  const l1ScrollY = useTransform(scrollY, [0, 2000], [0, -150]);
  const l1MouseX = useTransform(smoothMouseX, [-1, 1], [-12, 12]);
  const l1MouseY = useTransform(smoothMouseY, [-1, 1], [-12, 12]);

  // Layer 2 (Mid background - Geometric shapes & wave contours): Medium parallax
  const l2ScrollY = useTransform(scrollY, [0, 2000], [0, -320]);
  const l2MouseX = useTransform(smoothMouseX, [-1, 1], [25, -25]);
  const l2MouseY = useTransform(smoothMouseY, [-1, 1], [25, -25]);

  // Layer 3 (Foreground accents - floating soundwave particles): Fast parallax
  const l3ScrollY = useTransform(scrollY, [0, 2000], [0, -500]);
  const l3MouseX = useTransform(smoothMouseX, [-1, 1], [-40, 40]);
  const l3MouseY = useTransform(smoothMouseY, [-1, 1], [-40, 40]);

  if (reduceMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#190019]">
        {/* Static ambient gradients for low-motion mode */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#2B124C]/40 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-[#522B5B]/30 blur-[100px]" />
        <div className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] rounded-full bg-[#2B124C]/35 blur-[140px]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#190019]">
      
      {/* LAYER 1: DEEP AMBIENT GLOW ORBS (Slow Parallax) */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ y: l1ScrollY, x: l1MouseX }}
      >
        {/* Top-left Royal Purple Glow */}
        <div className="absolute -top-48 -left-48 w-[650px] h-[650px] rounded-full bg-[#2B124C]/50 blur-[130px]" />

        {/* Top-right Velvet Plum Glow */}
        <div className="absolute top-12 -right-40 w-[550px] h-[550px] rounded-full bg-[#522B5B]/35 blur-[120px]" />

        {/* Mid-screen Subtle Bordo Glow */}
        <div className="absolute top-[45%] -left-32 w-[500px] h-[500px] rounded-full bg-[#6C151E]/20 blur-[140px]" />

        {/* Bottom-right Forest Green / Deep Teal Accent Glow */}
        <div className="absolute top-[65%] -right-20 w-[600px] h-[600px] rounded-full bg-[#0F3D3A]/25 blur-[130px]" />

        {/* Bottom-left Deep Purple Glow */}
        <div className="absolute -bottom-48 left-1/3 w-[700px] h-[700px] rounded-full bg-[#2B124C]/45 blur-[150px]" />
      </motion.div>

      {/* LAYER 2: MID-DEPTH SOUNDWAVE CONTOURS & ARCHITECTURAL GRID (Medium Parallax) */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ y: l2ScrollY, x: l2MouseX }}
      >
        {/* Subtle SVG Waveform Contour lines */}
        <svg
          className="absolute top-20 left-0 w-full h-[600px] opacity-[0.12]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 600"
          fill="none"
        >
          <path
            d="M-100 120 C 300 300, 600 -50, 1000 180 C 1250 320, 1400 100, 1600 220"
            stroke="#DFB6B2"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <path
            d="M-100 240 C 250 420, 680 80, 1100 280 C 1300 400, 1450 200, 1600 340"
            stroke="#854F6C"
            strokeWidth="1.5"
          />
          <path
            d="M-100 380 C 350 150, 750 480, 1050 200 C 1320 30, 1500 260, 1600 180"
            stroke="#522B5B"
            strokeWidth="2"
          />
        </svg>

        {/* Floating Architectural Diamond Accent (Top Left) */}
        <div className="absolute top-[18%] left-[8%] w-16 h-16 border border-[#522B5B]/40 rounded-2xl rotate-45" />

        {/* Floating Minimalist Concentric Rings (Top Right) */}
        <div className="absolute top-[28%] right-[10%] w-24 h-24 border border-[#854F6C]/30 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 border border-[#DFB6B2]/20 rounded-full" />
        </div>

        {/* Floating Geometric Pill (Mid Left) */}
        <div className="absolute top-[58%] left-[5%] w-32 h-12 border border-[#522B5B]/35 rounded-full rotate-12" />

        {/* Floating Sound Frequency Arcs (Bottom Right) */}
        <svg
          className="absolute bottom-10 right-4 w-72 h-72 opacity-[0.15]"
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle cx="100" cy="100" r="80" stroke="#DFB6B2" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="100" cy="100" r="60" stroke="#854F6C" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="40" stroke="#522B5B" strokeWidth="2" />
        </svg>
      </motion.div>

      {/* LAYER 3: FOREGROUND SUBTLE PARALLAX FLOATING SHAPES (Fast Parallax) */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ y: l3ScrollY, x: l3MouseX }}
      >
        {/* Soft blush rose micro-accent (Top Center) */}
        <div className="absolute top-[12%] left-[45%] w-2.5 h-2.5 rounded-full bg-[#DFB6B2]/25" />

        {/* Warm cream micro-accent (Mid Right) */}
        <div className="absolute top-[42%] right-[18%] w-3 h-3 rounded-full bg-[#FBE4D8]/20" />

        {/* Dusty mauve micro-accent (Lower Left) */}
        <div className="absolute top-[72%] left-[22%] w-3 h-3 rounded-full bg-[#854F6C]/30" />

        {/* Floating Minimalist Cross Hair (Lower Right) */}
        <div className="absolute top-[82%] right-[25%] w-6 h-6 flex items-center justify-center opacity-25">
          <div className="w-full h-px bg-[#DFB6B2]" />
          <div className="h-full w-px bg-[#DFB6B2] absolute" />
        </div>
      </motion.div>

      {/* Subtle Noise / Vignette Overlay for Depth */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(25, 0, 25, 0.7) 100%)'
        }}
      />
    </div>
  );
}
