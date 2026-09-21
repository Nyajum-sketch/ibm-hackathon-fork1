import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  LayoutDashboard, 
  Mic, 
  Languages, 
  BrainCircuit, 
  ShieldCheck, 
  HardDrive,
  Accessibility,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Volume2,
  CheckCircle2,
  Cpu,
  Radio
} from 'lucide-react';
import InteractiveMayaHero from '../components/avatar/InteractiveMayaHero';
import Button from '../components/ui/Button';
import LottieWaveform from '../components/ui/LottieWaveform';
import TicketCard from '../components/ui/TicketCard';
import Floating3DParticles from '../components/ui/Floating3DParticles';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { 
      icon: Mic, 
      type: 'VOICE AI',
      title: 'Real-Time Voice-To-Text', 
      desc: 'Streams teacher speech word-by-word with sub-second latency and 99.4% benchmark accuracy.',
      code: 'SIG-VOX-994',
      admit: '01',
      details: [
        { label: 'ACCURACY', value: '99.4%' },
        { label: 'LATENCY', value: '<120MS' },
        { label: 'ENGINE', value: 'WHISPER' },
        { label: 'STATUS', value: 'ACTIVE' }
      ]
    },
    { 
      icon: Languages, 
      type: 'TRANSLATION',
      title: '50+ Global Languages', 
      desc: 'Instant multilingual auto-translation displayed as high-contrast subtitles beneath each line.',
      code: 'SIG-LNG-050',
      admit: '02',
      details: [
        { label: 'LANGUAGES', value: '50+' },
        { label: 'LATENCY', value: 'REALTIME' },
        { label: 'DETECTION', value: 'AUTO' },
        { label: 'DISPLAY', value: 'DUAL SUB' }
      ]
    },
    { 
      icon: BrainCircuit, 
      type: 'INTELLIGENCE',
      title: 'AI Lecture Tutor & Notes', 
      desc: 'Automatic concise summaries, exam alerts, and interactive AI Q&A for every completed lecture.',
      code: 'SIG-LLM-401',
      admit: '03',
      details: [
        { label: 'MODEL', value: 'LLAMA-3' },
        { label: 'OUTPUT', value: 'STUDY NOTES' },
        { label: 'EXAM DETECT', value: 'ENABLED' },
        { label: 'PRIVACY', value: 'LOCAL' }
      ]
    },
    { 
      icon: Accessibility, 
      type: 'AVATAR GESTURE',
      title: '3D Sign Language Avatar', 
      desc: 'Transforms spoken words into fluid ASL & ISL hand gestures with real-time grammar synthesis.',
      code: 'SIG-ASL-060',
      admit: '04',
      details: [
        { label: 'SYNTAX', value: 'TOPIC-OSV' },
        { label: 'FRAME RATE', value: '60 FPS' },
        { label: 'SYSTEM', value: 'RYLO 3D' },
        { label: 'STANDARD', value: 'ASL / ISL' }
      ]
    },
    { 
      icon: HardDrive, 
      type: 'OFFLINE ARCHIVE',
      title: 'Offline-First Archive', 
      desc: 'All lecture sessions and notes are saved securely in your browser — fully readable without internet.',
      code: 'SIG-DB-LOCAL',
      admit: '05',
      details: [
        { label: 'STORAGE', value: 'LOCAL DB' },
        { label: 'ENCRYPTION', value: 'AES-256' },
        { label: 'EXPORT', value: '.TXT / PDF' },
        { label: 'OFFLINE', value: '100% READY' }
      ]
    },
    { 
      icon: ShieldCheck, 
      type: 'WCAG AAA',
      title: 'Accessible Neobrutalism', 
      desc: 'High-contrast professional palette with plum, rose, cream, and deep tones engineered for deaf students.',
      code: 'SIG-ACC-AAA',
      admit: '06',
      details: [
        { label: 'CONTRAST', value: 'AAA TARGET' },
        { label: 'HAPTIC', value: 'VIBRATION' },
        { label: 'FATIGUE', value: 'ZERO' },
        { label: 'WCAG', value: '2.1 READY' }
      ]
    }
  ];

  const steps = [
    { num: '01', title: 'Capture', desc: 'High-fidelity microphone captures classroom audio frequencies.' },
    { num: '02', title: 'Transcribe', desc: 'Whisper AI transcribes speech into large, legible captions.' },
    { num: '03', title: 'Translate', desc: 'Sentences are converted into 50+ languages simultaneously.' },
    { num: '04', title: 'Synthesize', desc: 'Sign avatar gestures and AI summaries generate in real time.' },
    { num: '05', title: 'Review', desc: 'Search and study your complete private lecture library anytime.' }
  ];

  return (
    <div className="min-h-screen bg-[#190019] text-[#FBE4D8] select-none">
      
      {/* 1. CENTERPIECE: INTERACTIVE MAYA HERO WITH ZERO OVERLAPS */}
      <InteractiveMayaHero onNavigate={navigate} />

      {/* 2. CORE FEATURES GRID - 3D INTERACTIVE TICKETS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#2B124C] text-[#FBE4D8] border-2 border-[#522B5B] rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000] mb-4">
            <Sparkles className="w-4 h-4 text-[#DFB6B2]" />
            <span>ENGINEERED FOR ACCESSIBLE CLASSROOMS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight font-display leading-tight text-[#FBE4D8]">
            EVERY LECTURE. CAPTIONED. TRANSLATED. SIGNED.
          </h2>
          <p className="mt-3 text-base sm:text-lg font-bold text-[#DFB6B2]">
            Eliminating educational barriers for deaf and hard-of-hearing students with real-time AI assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {features.map((feat, idx) => (
            <motion.div 
              key={feat.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.08, ease: 'easeOut' }}
              className="flex justify-center"
            >
              <TicketCard
                icon={feat.icon}
                type={feat.type}
                title={feat.title}
                subtitle={feat.desc}
                details={feat.details}
                barcodeId={feat.code}
                admitNum={feat.admit}
                onClick={() => {
                  if (feat.type === 'AVATAR GESTURE') navigate('/avatar');
                  else if (feat.type === 'OFFLINE ARCHIVE') navigate('/history');
                  else navigate('/classroom');
                }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS: 5 STEP PROCESS */}
      <section className="bg-[#190019]/80 border-t-2 border-b-2 border-[#522B5B] py-16 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="bg-[#2B124C] text-[#FBE4D8] border-2 border-[#522B5B] rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000] inline-block mb-3">
              SIMPLE 5-STEP PIPELINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-display text-[#FBE4D8]">
              HOW SIGNIFY AI EMPOWERS STUDENTS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((step, idx) => (
              <motion.div 
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.35, delay: idx * 0.1, ease: 'easeOut' }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-[#2B124C] border-2 border-[#522B5B] rounded-2xl p-5 shadow-[4px_4px_0px_#000000] hover:border-[#DFB6B2] transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block bg-[#522B5B] text-[#FBE4D8] border-2 border-[#854F6C] font-black text-xs px-3 py-1 rounded-full mb-3 shadow-[2px_2px_0px_#000000]">
                    STEP {step.num}
                  </span>
                  <h4 className="text-base font-black uppercase tracking-tight font-display mb-2 text-[#FBE4D8]">
                    {step.title}
                  </h4>
                  <p className="text-xs font-bold text-[#DFB6B2] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LIVE CLASSROOM PREVIEW STAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#2B124C] border-2 border-[#522B5B] rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#000000]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#522B5B] text-[#FBE4D8] border-2 border-[#854F6C] rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000]">
                <Radio className="w-3.5 h-3.5 text-[#DFB6B2]" />
                <span>ACTIVE SIMULATOR READY</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-display leading-tight text-[#FBE4D8]">
                EXPERIENCE LIVE LECTURE CAPTIONING NOW
              </h3>
              <p className="text-sm sm:text-base font-bold text-[#DFB6B2] leading-relaxed">
                Click Launch to open the Classroom view with real-time speech recognition, instant sentence translations, AI study notes, and sign language avatar gestures.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/classroom')}
                  className="inline-flex items-center gap-2 bg-[#DFB6B2] text-[#190019] hover:bg-[#FBE4D8] border-2 border-[#DFB6B2] rounded-full px-6 py-3 text-sm font-black uppercase tracking-wider shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>START CLASSROOM SESSION</span>
                </button>

                <button
                  onClick={() => navigate('/avatar')}
                  className="inline-flex items-center gap-2 bg-[#522B5B] text-[#FBE4D8] hover:bg-[#854F6C] border-2 border-[#854F6C] rounded-full px-6 py-3 text-sm font-black uppercase tracking-wider shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-colors"
                >
                  <Accessibility className="w-4 h-4" />
                  <span>OPEN AI AVATAR</span>
                </button>
              </div>
            </div>

            {/* Simulated Live Caption Card */}
            <div className="lg:col-span-6">
              <div className="bg-[#190019] border-2 border-[#522B5B] rounded-2xl p-5 shadow-[4px_4px_0px_#000000] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[#522B5B] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6C151E]" />
                    <span className="text-xs font-black uppercase tracking-wider text-[#FBE4D8]">BIOLOGY 101: CELLULAR RESPIRATION</span>
                  </div>
                  <LottieWaveform className="w-14 h-7" isPlaying={true} />
                </div>

                <div className="bg-[#2B124C] border-2 border-[#522B5B] rounded-xl p-4 space-y-2 min-h-[120px]">
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Previous context...</p>
                  <p className="text-base font-black text-[#FBE4D8] leading-snug">
                    The mitochondria is often called the powerhouse of the cell because it synthesizes ATP through oxidative phosphorylation.
                  </p>
                  <p className="text-xs font-bold text-[#DFB6B2] border-t border-[#522B5B] pt-2">
                    Subtitles (Spanish): La mitocondria a menudo se llama el centro neurálgico de la célula...
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider">
                  <span className="bg-[#522B5B] text-[#FBE4D8] px-3 py-1 rounded-full border-2 border-[#854F6C]">
                    ACCURACY: 99.4%
                  </span>
                  <span className="bg-[#2B124C] text-[#DFB6B2] px-3 py-1 rounded-full border-2 border-[#522B5B]">
                    LATENCY: 95MS
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. STATS BANNER */}
      <section className="bg-[#190019] text-[#FBE4D8] py-12 border-t-2 border-b-2 border-[#522B5B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black font-display text-[#DFB6B2]">99.4%</div>
              <div className="text-xs font-black uppercase tracking-wider text-neutral-300">Speech Precision</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black font-display text-[#DFB6B2]">50+</div>
              <div className="text-xs font-black uppercase tracking-wider text-neutral-300">Global Languages</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black font-display text-[#DFB6B2]">&lt;120ms</div>
              <div className="text-xs font-black uppercase tracking-wider text-neutral-300">Caption Latency</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black font-display text-[#DFB6B2]">100%</div>
              <div className="text-xs font-black uppercase tracking-wider text-neutral-300">Offline &amp; Private</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION WITH FLOATING 3D PARTICLES */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <div className="relative flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-3xl border-2 border-[#522B5B] bg-[#2B124C] shadow-[8px_8px_0px_#000000]">
          {/* Pseudo-3D particle background with continuous rotation and buoyant drift */}
          <Floating3DParticles color="#DFB6B2" quantity={350} size={4.5} opacity={0.35} drift={0.8} depth={0.6} />

          {/* Ambient Lighting Gradients */}
          <div className="absolute w-96 h-96 bg-[#854F6C]/20 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
          <div className="absolute w-96 h-96 bg-[#522B5B]/30 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

          <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-12 text-center max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#190019] text-[#FBE4D8] border-2 border-[#522B5B] rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000]">
              <Sparkles className="w-4 h-4 text-[#DFB6B2]" />
              <span>EXPERIENCE ACCESSIBLE EDUCATION</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-display text-[#FBE4D8] leading-tight">
              BUILD SOMETHING MAGICAL FOR EVERY STUDENT
            </h2>

            <p className="text-base sm:text-lg font-bold text-[#DFB6B2] leading-relaxed">
              A pseudo-3D particle background that stays behind your content with continuous rotation and buoyant drift. Eliminating classroom barriers with real-time AI assistance.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/classroom')}
                className="inline-flex h-12 items-center gap-2 bg-[#DFB6B2] text-[#190019] hover:bg-[#FBE4D8] border-2 border-[#DFB6B2] rounded-full px-8 font-black uppercase tracking-wider shadow-[4px_4px_0px_#000000] transition-all active:translate-x-0.5 active:translate-y-0.5"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="inline-flex h-12 items-center gap-2 bg-[#522B5B] text-[#FBE4D8] hover:bg-[#854F6C] border-2 border-[#854F6C] rounded-full px-8 font-black uppercase tracking-wider shadow-[4px_4px_0px_#000000] transition-all active:translate-x-0.5 active:translate-y-0.5"
              >
                <span>VIEW DASHBOARD</span>
                <LayoutDashboard className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
