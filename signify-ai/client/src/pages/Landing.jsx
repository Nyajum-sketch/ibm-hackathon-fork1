import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  LayoutDashboard, 
  Mic, 
  Languages, 
  BookOpen, 
  BrainCircuit, 
  ShieldCheck, 
  HardDrive,
  Cpu,
  ChevronRight,
  Accessibility,
  Award,
  Zap,
  Users
} from 'lucide-react';
import AnimatedText from '../components/ui/AnimatedText';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StatsCard from '../components/ui/StatsCard';

export default function Landing() {
  const navigate = useNavigate();
  const [parallaxCoords, setParallaxCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x = (clientX - width / 2) / 40;
    const y = (clientY - height / 2) / 40;
    setParallaxCoords({ x, y });
  };

  const steps = [
    { num: '01', title: 'Capture', desc: 'Your microphone listens to the live classroom lecture in real time.' },
    { num: '02', title: 'Transcribe', desc: 'Speech is instantly converted into large, readable captions word by word.' },
    { num: '03', title: 'Translate', desc: 'Captions appear alongside subtitles in your chosen language instantly.' },
    { num: '04', title: 'Summarize', desc: 'AI analyzes the lecture and generates smart notes and study guides.' },
    { num: '05', title: 'Review', desc: 'Browse all saved sessions from your personal archive anytime, offline.' }
  ];

  const features = [
    { 
      icon: Mic, 
      title: 'Live Captions', 
      desc: 'Real-time word-by-word transcription displayed as large, highly readable captions — no delay.' 
    },
    { 
      icon: BrainCircuit, 
      title: 'AI Study Notes', 
      desc: 'Our AI instantly reads the lecture and produces concise summaries, bullet points and key takeaways.' 
    },
    { 
      icon: Languages, 
      title: '50+ Languages', 
      desc: 'Auto-translate every sentence into your native language and display it directly beneath the caption.' 
    },
    { 
      icon: LayoutDashboard, 
      title: 'Smart Dashboard', 
      desc: 'Track your learning sessions, word counts, and study trends with beautiful visual analytics.' 
    },
    { 
      icon: HardDrive, 
      title: 'Offline Archive', 
      desc: 'All lecture sessions are saved privately in your browser — searchable anytime, even without internet.' 
    },
    { 
      icon: ShieldCheck, 
      title: 'Accessibility First', 
      desc: 'Designed from the ground up for deaf and hard-of-hearing students with high-contrast and motion controls.' 
    }
  ];

  const marqueeTechnologies = [
    'Real-Time Captions', 'AI Study Notes', '50+ Languages', 'Offline Storage',
    'Sign Language Avatar', 'Lecture Analysis', 'Voice Capture', 'Smart Analytics',
    'Auto-Translation', 'Practice Questions', 'AI Assistant', 'Session History'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-bg-base bg-grid-pattern relative overflow-hidden noise-overlay select-none"
    >
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-coral/4 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-2/3 right-0 w-[400px] h-[400px] bg-accent-blue/4 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-7 text-center lg:text-left"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-accent-blue/30 bg-accent-blue/10 text-accent-blue-soft">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-blue-soft animate-pulse" />
                IBM Hackathon 2026 — Team Unstoppable
              </span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.08] font-display">
              <AnimatedText text="Breaking Barriers for" delay={0.05} />
              <span className="block mt-2 shimmer-text">Deaf Students.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Signify AI turns any spoken classroom lecture into real-time captions, instant translations,
              and AI-powered study notes — so every student can follow along and thrive.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Button 
                onClick={() => navigate('/classroom')} 
                variant="primary" 
                size="lg"
                icon={Play}
              >
                Start Live Session
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')} 
                variant="ghost" 
                size="lg"
                icon={LayoutDashboard}
              >
                View Dashboard
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 justify-center lg:justify-start pt-1">
              {['No setup needed', 'Works offline', 'Free to use'].map(text => (
                <span key={text} className="flex items-center gap-1.5 text-[11px] text-text-secondary font-medium">
                  <span className="w-1 h-1 rounded-full bg-success" />
                  {text}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Floating Mockup */}
          <motion.div 
            animate={{ x: parallaxCoords.x, y: parallaxCoords.y }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="lg:col-span-5 relative w-full max-w-md mx-auto"
          >
            <div className="w-full bg-bg-surface border border-border-subtle rounded-2xl shadow-2xl p-5 space-y-4 glass-panel animate-float">
              
              {/* Mock Header */}
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2">
                  <div className="relative w-2.5 h-2.5">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-red-400 opacity-75 animate-ping" />
                    <span className="relative block w-2.5 h-2.5 rounded-full bg-red-500" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-text-primary">Biology 101 — Live</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue-soft text-[9px] font-bold uppercase tracking-wider">Tamil</span>
              </div>

              {/* Mock Captions */}
              <div className="bg-black/30 rounded-xl p-4 space-y-3 min-h-[110px]">
                <p className="text-xs text-text-secondary/50">
                  In our last class we touched on ecosystems and food chains...
                </p>
                <p className="text-sm text-text-primary font-bold leading-snug">
                  The mitochondria is the powerhouse of the cell, producing energy through respiration...
                </p>
                <p className="text-xs text-accent-coral-soft italic">
                  மைட்டோகோன்ட்ரியா செல்லின் ஆற்றல் உற்பத்தி மையம்...
                </p>
              </div>

              {/* Mock AI panel */}
              <div className="bg-bg-elevated/80 border border-accent-coral/15 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-accent-coral">
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">AI Summary Ready</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 bg-text-muted/20 rounded-full w-full" />
                  <div className="h-1.5 bg-text-muted/20 rounded-full w-[88%]" />
                  <div className="h-1.5 bg-text-muted/20 rounded-full w-[72%]" />
                </div>
              </div>

              {/* Bottom stats */}
              <div className="flex items-center justify-between px-1 text-[10px] text-text-muted font-semibold">
                <span>247 words captured</span>
                <span>↳ 3 key points extracted</span>
              </div>
            </div>

            {/* Floating Orbs */}
            <div className="absolute -top-8 -right-8 w-20 h-20 bg-accent-coral/8 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-accent-blue/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          </motion.div>
        </div>
      </section>

      {/* Waveform SVG Divider */}
      <div className="w-full overflow-hidden shrink-0 pointer-events-none relative h-16 -mt-8">
        <svg className="w-full h-full text-accent-coral/10" viewBox="0 0 1440 100" fill="currentColor" preserveAspectRatio="none">
          <path d="M0,50 C120,80 240,20 360,50 C480,80 600,20 720,50 C840,80 960,20 1080,50 C1200,80 1320,20 1440,50 L1440,100 L0,100 Z" />
        </svg>
      </div>

      {/* Sign Language Avatar Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-border-subtle/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual avatar mockup */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative bg-gradient-to-br from-violet-900/25 to-indigo-900/25 border border-violet-500/20 rounded-2xl p-8 overflow-hidden flex flex-col items-center justify-center min-h-[300px] shadow-2xl"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-6 left-8 w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce" />
            <div className="absolute bottom-10 right-10 w-4 h-4 bg-indigo-400 rounded-full animate-pulse" />
            <div className="absolute top-1/3 right-6 w-2 h-2 bg-purple-300 rounded-full animate-ping opacity-60" />

            <div className="relative z-10 flex flex-col items-center gap-5">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border-2 border-violet-400/50 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Accessibility className="w-12 h-12 text-violet-300" />
              </div>
              <div className="text-center space-y-2">
                <span className="text-[10px] font-bold text-violet-300 uppercase tracking-widest bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
                  Real-Time Animation
                </span>
                <p className="text-sm font-bold text-white mt-1">Sign Language Avatar</p>
                <p className="text-[11px] text-violet-300/70">Synced with live captions</p>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest text-violet-300 bg-violet-400/10 border border-violet-400/20 uppercase rounded-full">
              Flagship Feature
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display leading-tight">
              Beyond Captions —<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Visual Sign Language.</span>
            </h2>
            <p className="text-text-secondary text-sm sm:text-base max-w-xl leading-relaxed mx-auto lg:mx-0">
              Our 3D sign language avatar watches the live transcript and animates natural, human-like 
              hand gestures in sync — giving deaf students a rich visual communication channel beyond text.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {['Synced with captions', 'Adjustable speed', 'High contrast mode'].map(feat => (
                <span key={feat} className="flex items-center gap-1.5 text-xs text-violet-300 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-full font-medium">
                  <Award className="w-3 h-3" /> {feat}
                </span>
              ))}
            </div>
            <div className="pt-2 flex justify-center lg:justify-start">
              <Button 
                onClick={() => navigate('/avatar')}
                variant="primary"
                size="md"
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-6 border-none shadow-lg shadow-violet-600/20"
              >
                Launch Sign Avatar
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 border-t border-border-subtle/40">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-text-primary">The Challenge We're Solving</h2>
          <p className="text-sm text-text-secondary mt-2">Understanding the barriers faced by the deaf and hard-of-hearing community in education</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard value={466} suffix="M+" label="People with Hearing Loss" icon={Users} />
          <StatsCard value={70} suffix="%" label="Miss Classroom Content" icon={Mic} />
          <StatsCard value={3} suffix="x" label="Higher Dropout Risk" icon={BookOpen} />
          <StatsCard value={50} suffix="+" label="Languages Supported" icon={Languages} />
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold font-display">How Signify AI Works</h2>
          <p className="text-sm text-text-secondary mt-2">A seamless five-step pipeline that bridges the sound gap in any classroom</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 relative">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="relative group"
            >
              <div className="glass-panel p-6 rounded-xl space-y-3 h-full relative z-10 bg-bg-surface/50 glass-card-hover border border-border-subtle">
                <span className="text-accent-coral font-bold font-display text-2xl">{step.num}</span>
                <h3 className="font-bold text-text-primary text-sm font-display">{step.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{step.desc}</p>
              </div>
              
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-3.5 z-0 text-accent-coral/40">
                  <ChevronRight className="w-5 h-5 animate-pulse" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-border-subtle/30">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold font-display">Everything a Student Needs</h2>
          <p className="text-sm text-text-secondary mt-2">A complete accessibility toolkit built for modern inclusive education</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="glass-panel p-6 rounded-xl glass-card-hover space-y-4 border border-border-subtle"
              >
                <div className="p-3 bg-accent-coral/10 text-accent-coral rounded-xl border border-accent-coral/20 w-fit">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-text-primary font-display">{feat.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Feature Marquee */}
      <section className="py-10 border-t border-b border-border-subtle bg-bg-surface overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg-surface to-transparent z-10 pointer-events-none" />
        
        <div className="flex w-[200%] gap-12 items-center animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {[...marqueeTechnologies, ...marqueeTechnologies].map((tech, idx) => (
            <div key={idx} className="flex items-center gap-3 text-text-secondary text-[11px] font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-accent-coral shrink-0" />
              <span>{tech}</span>
            </div>
          ))}
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}} />
      </section>

      {/* IBM Callout / Footer */}
      <footer className="relative z-10">
        {/* IBM callout banner */}
        <div className="bg-accent-blue/5 border-t border-accent-blue/10 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-accent-blue/10 border border-accent-blue/20">
                <Cpu className="w-6 h-6 text-accent-blue-soft" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">Built for IBM Hackathon 2026</p>
                <p className="text-xs text-text-secondary mt-0.5">Powered by AI for inclusive, accessible education</p>
              </div>
            </div>
            <Button onClick={() => navigate('/classroom')} variant="primary" size="sm" icon={Play}>
              Try It Now
            </Button>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-secondary">
          <div>
            Team <strong className="text-text-primary">Unstoppable</strong> &copy; {new Date().getFullYear()} — Signify AI
          </div>
          <div className="flex items-center gap-4">
            <span className="px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue-soft border border-accent-blue/20 text-[10px] font-bold uppercase tracking-wider">
              IBM Hackathon Finalist
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
