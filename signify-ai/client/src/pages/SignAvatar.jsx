import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Volume2, Shield, Settings, Sliders, Play, Pause, RotateCcw,
  Sparkles, CheckCircle2, Languages, Activity, Eye, Accessibility,
  ChevronRight, ZoomIn, ZoomOut, Contrast, Gauge, Send,
  Layers, Cpu, BookOpen, Repeat
} from 'lucide-react';
import AvatarScene from '../components/avatar/AvatarScene';
import MediaPipeSkeletonViewer from '../components/avatar/MediaPipeSkeletonViewer';
import RyloAvatarViewer from '../components/avatar/RyloAvatarViewer';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

// Target Sign Languages supported
const SIGN_LANGUAGES = [
  { code: 'ASL', name: 'American Sign Language (ASL)', flag: 'US' },
  { code: 'ISL', name: 'Indian Sign Language (ISL)', flag: 'IN' },
  { code: 'BSL', name: 'British Sign Language (BSL)', flag: 'GB' },
  { code: 'IS', name: 'International Sign (IS)', flag: 'INT' }
];

// Spoken Source Languages supported
const SPOKEN_LANGUAGES = [
  { code: 'en', name: 'English', flag: 'US' },
  { code: 'ta', name: 'Tamil (தமிழ்)', flag: 'IN' },
  { code: 'es', name: 'Spanish (Español)', flag: 'ES' },
  { code: 'hi', name: 'Hindi (हिंदी)', flag: 'IN' },
  { code: 'fr', name: 'French (Français)', flag: 'FR' }
];

// Sample phrases for quick translation testing
const SAMPLE_PHRASES = [
  "Good morning students.",
  "Photosynthesis converts sunlight into energy.",
  "Water and carbon dioxide are essential for plants.",
  "Where is the chemistry laboratory?"
];

export default function SignAvatar() {
  // Translation state
  const [spokenLang, setSpokenLang] = useState('en');
  const [targetSignLang, setTargetSignLang] = useState('ASL');
  const [inputText, setInputText] = useState('');
  const [activeSentence, setActiveSentence] = useState('');
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [signTokens, setSignTokens] = useState([]);

  // Player controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signingSpeed, setSigningSpeed] = useState(1.0);
  const [avatarScale, setAvatarScale] = useState(1.0);
  const [viewMode, setViewMode] = useState('rylo'); // 'rylo', 'mediapipe', '3d', 'skeleton'
  const [isLooping, setIsLooping] = useState(false);
  const [confidence, setConfidence] = useState(98.6);
  
  // Speech & Demo state
  const [isListening, setIsListening] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const recognitionRef = useRef(null);
  const playbackTimerRef = useRef(null);
  const wordTimerRef = useRef(null);

  // Setup Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = spokenLang === 'ta' ? 'ta-IN' : spokenLang === 'es' ? 'es-ES' : 'en-US';

    rec.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
      }
      if (final || interim) {
        const text = (final || interim).trim();
        setInputText(text);
        if (final) {
          triggerSignTranslation(text);
        }
      }
    };

    rec.onend = () => {
      if (isListening && !isDemoMode) {
        try { rec.start(); } catch (_) {}
      }
    };

    recognitionRef.current = rec;
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [isListening, isDemoMode, spokenLang]);

  // Core function: Translate text to sign sequence & start player
  const triggerSignTranslation = (textToTranslate) => {
    const text = (textToTranslate || inputText).trim();
    if (!text) {
      toast.error('Please enter text or start speech input first');
      return;
    }

    setActiveSentence(text);
    const words = text.split(/\s+/).filter(Boolean);
    const tokens = words.map((w, idx) => ({
      id: idx,
      word: w.toUpperCase().replace(/[^A-Z]/g, ''),
      original: w,
      symbol: `[${w.toUpperCase().replace(/[^A-Z]/g, '')}]`
    }));

    setSignTokens(tokens);
    setIsPlaying(true);
    setIsSigning(true);
    setActiveWordIndex(0);
    setConfidence(parseFloat((97 + Math.random() * 2.8).toFixed(1)));

    // Playback loop stepping word by word
    if (wordTimerRef.current) clearInterval(wordTimerRef.current);
    let currentIdx = 0;
    const intervalMs = Math.max(600, 1200 / signingSpeed);

    wordTimerRef.current = setInterval(() => {
      if (currentIdx < words.length) {
        setActiveWordIndex(currentIdx);
        currentIdx++;
      } else {
        if (isLooping) {
          currentIdx = 0;
          setActiveWordIndex(0);
        } else {
          clearInterval(wordTimerRef.current);
          setIsSigning(false);
          setIsPlaying(false);
        }
      }
    }, intervalMs);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsSigning(false);
    setActiveWordIndex(-1);
    if (wordTimerRef.current) clearInterval(wordTimerRef.current);
  };

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
      if (recognitionRef.current) recognitionRef.current.stop();
      toast.success('Microphone stopped');
    } else {
      setIsListening(true);
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch (_) {}
      }
      toast.success('Listening for live speech...');
    }
  };

  // Preset phrase click
  const selectPreset = (phrase) => {
    setInputText(phrase);
    triggerSignTranslation(phrase);
  };

  useEffect(() => {
    return () => {
      if (wordTimerRef.current) clearInterval(wordTimerRef.current);
      if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 min-h-[calc(100vh-8rem)] pb-16 select-none">
      
      {/* 1. Header & Rylo Language Pair Switcher */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#2B124C] text-[#FBE4D8] border-2 border-[#522B5B] rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#DFB6B2]" />
              <span>RYLO AI SIGN ENGINE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-display text-[#FBE4D8]">
              Sign Language Avatar
            </h1>
            <p className="text-[#DFB6B2] text-xs sm:text-sm font-bold mt-1">
              Translate spoken classroom text into continuous sign language gestures in real time.
            </p>
          </div>
        </div>

        {/* Language Bar */}
        <div className="bg-[#2B124C] border-2 border-[#522B5B] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-[4px_4px_0px_#000000]">
          {/* Spoken Language Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-[#FBE4D8] tracking-wider">Spoken Input:</span>
            <select
              value={spokenLang}
              onChange={(e) => setSpokenLang(e.target.value)}
              className="bg-[#190019] border-2 border-[#522B5B] rounded-full px-3 py-1.5 text-xs font-black text-[#FBE4D8] shadow-[2px_2px_0px_#000000] focus:outline-none cursor-pointer"
            >
              {SPOKEN_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>[{l.flag}] {l.name}</option>
              ))}
            </select>
          </div>

          {/* Target Sign Language Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-[#FBE4D8] tracking-wider">Target Sign Language:</span>
            <div className="flex flex-wrap gap-1.5">
              {SIGN_LANGUAGES.map((sl) => (
                <button
                  key={sl.code}
                  onClick={() => setTargetSignLang(sl.code)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 transition-all shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 ${
                    targetSignLang === sl.code
                      ? 'bg-[#DFB6B2] text-[#190019] border-[#DFB6B2]'
                      : 'bg-[#522B5B] text-[#FBE4D8] border-[#854F6C] hover:bg-[#854F6C]'
                  }`}
                >
                  <span>[{sl.flag}] {sl.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Rylo Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (5 cols): Input Card & Sample Presets */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          
          {/* Main Translation Text Box */}
          <div className="bg-[#2B124C] border-2 border-[#522B5B] rounded-2xl p-6 space-y-4 shadow-[4px_4px_0px_#000000] flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b-2 border-[#522B5B]">
                <span className="text-xs font-black uppercase tracking-wider text-[#FBE4D8] flex items-center gap-2">
                  <Languages className="w-4 h-4 text-[#DFB6B2]" /> Spoken Text Input
                </span>
                <span className="text-xs font-bold text-[#DFB6B2]">{inputText.length} chars</span>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste lecture text here (e.g. 'Photosynthesis converts sunlight into energy')..."
                className="w-full h-36 bg-[#190019] border-2 border-[#522B5B] rounded-xl p-3 text-sm font-bold text-[#FBE4D8] placeholder:text-[#DFB6B2]/60 focus:outline-none resize-none transition-colors"
              />

              {/* Active Sentence & Word-by-Word Highlight Display */}
              {activeSentence && (
                <div className="bg-[#522B5B] p-3 rounded-xl border-2 border-[#854F6C] shadow-[2px_2px_0px_#000000] space-y-1">
                  <span className="text-[10px] uppercase font-black text-[#DFB6B2] tracking-wider block">Active Sign Playback</span>
                  <div className="flex flex-wrap gap-1.5 text-xs font-black">
                    {activeSentence.split(/\s+/).map((w, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded-full border-2 transition-all ${
                          idx === activeWordIndex
                            ? 'bg-[#DFB6B2] text-[#190019] border-[#DFB6B2] scale-105 shadow-[2px_2px_0px_#000000]'
                            : 'text-[#FBE4D8] bg-[#2B124C] border-[#522B5B]'
                        }`}
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-3 pt-3 border-t-2 border-[#522B5B]">
              <button
                onClick={() => triggerSignTranslation()}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#DFB6B2] text-[#190019] hover:bg-[#FBE4D8] border-2 border-[#DFB6B2] rounded-full px-5 py-2.5 font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Translate to Sign</span>
              </button>

              <button
                onClick={toggleMic}
                className={`p-2.5 rounded-full border-2 text-xs font-black transition-all shadow-[2px_2px_0px_#000000] ${
                  isListening
                    ? 'bg-[#6C151E] text-white border-[#6C151E]'
                    : 'bg-[#522B5B] text-[#FBE4D8] border-[#854F6C] hover:bg-[#854F6C]'
                }`}
                title="Voice Input Mic"
              >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => { setInputText(''); handleStop(); }}
                className="px-4 py-2 rounded-full bg-[#522B5B] hover:bg-[#854F6C] border-2 border-[#854F6C] text-[#FBE4D8] text-xs font-black uppercase shadow-[2px_2px_0px_#000000] transition-colors"
                title="Clear input"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Sample Phrases Preset Library */}
          <div className="bg-[#2B124C] border-2 border-[#522B5B] rounded-2xl p-5 space-y-3 shadow-[4px_4px_0px_#000000]">
            <span className="text-xs font-black uppercase tracking-wider text-[#FBE4D8] block">
              Quick Test Phrases (Click to Sign)
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PHRASES.map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => selectPreset(phrase)}
                  className="px-3 py-1.5 rounded-full bg-[#190019] hover:bg-[#522B5B] border-2 border-[#522B5B] text-xs text-[#FBE4D8] font-bold transition-all shadow-[2px_2px_0px_#000000] text-left"
                >
                  "{phrase}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (7 cols): Rylo Sign Viewer & Player Controls */}
        <div className="lg:col-span-7 bg-[#2B124C] border-2 border-[#522B5B] rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-[4px_4px_0px_#000000] relative overflow-hidden">
          
          {/* Top Viewer Controls: Mode Switcher Tabs (Only Rylo Avatar) */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#522B5B] pb-4 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DFB6B2]" />
              <span className="font-black text-[#FBE4D8] text-sm uppercase tracking-wider font-display">
                {targetSignLang} Visual Output
              </span>
            </div>

            {/* Rylo View Mode Badge */}
            <div className="inline-flex items-center gap-2 bg-[#522B5B] text-[#FBE4D8] border-2 border-[#854F6C] rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000]">
              <span className="w-2 h-2 rounded-full bg-[#0F3D3A]" />
              <span>RYLO AVATAR</span>
            </div>
          </div>

          {/* Viewport Canvas (Dedicated Rylo Avatar Viewer) */}
          <div className="flex-1 min-h-[380px] rounded-2xl overflow-hidden relative border-2 border-[#522B5B] bg-neutral-950 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
            <RyloAvatarViewer
              isSigning={isSigning}
              currentWord={signTokens[activeWordIndex]?.word || ''}
              targetSignLang={targetSignLang}
            />

            {/* Overlay Active Word Badge */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
              <div className="bg-[#2B124C] border-2 border-[#522B5B] px-4 py-2 rounded-xl shadow-[3px_3px_0px_#000000]">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#DFB6B2] block">Active Gesture</span>
                <span className="text-base font-black text-[#FBE4D8] font-display uppercase">
                  {signTokens[activeWordIndex]?.symbol || (isSigning ? '[SIGNING...]' : '[READY]')}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Player Controls & Speed Slider */}
          <div className="space-y-4 pt-2 border-t-2 border-[#522B5B] z-10">
            
            {/* Playback Button Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {isPlaying ? (
                  <button 
                    onClick={handleStop}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#854F6C] bg-[#522B5B] text-[#FBE4D8] font-black text-xs uppercase shadow-[2px_2px_0px_#000000] hover:bg-[#854F6C] transition-colors"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => triggerSignTranslation()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[#DFB6B2] bg-[#DFB6B2] text-[#190019] font-black text-xs uppercase shadow-[3px_3px_0px_#000000] hover:bg-[#FBE4D8] transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play Sequence</span>
                  </button>
                )}

                <button
                  onClick={() => triggerSignTranslation()}
                  className="p-2.5 rounded-full border-2 border-[#854F6C] bg-[#522B5B] text-[#FBE4D8] hover:bg-[#854F6C] transition-all shadow-[2px_2px_0px_#000000]"
                  title="Replay"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsLooping(l => !l)}
                  className={`p-2.5 rounded-full border-2 transition-all shadow-[2px_2px_0px_#000000] ${
                    isLooping
                      ? 'bg-[#DFB6B2] text-[#190019] border-[#DFB6B2]'
                      : 'bg-[#522B5B] text-[#FBE4D8] border-[#854F6C] hover:bg-[#854F6C]'
                  }`}
                  title="Toggle Loop Playback"
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Slider */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#DFB6B2] uppercase tracking-wider">Speed: {signingSpeed.toFixed(1)}x</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.25"
                  value={signingSpeed}
                  onChange={(e) => setSigningSpeed(parseFloat(e.target.value))}
                  className="w-28 accent-[#DFB6B2] bg-[#190019] border border-[#522B5B] h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Sign Token Breakdown Sequence Bar */}
            {signTokens.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-[#DFB6B2] uppercase tracking-wider block">
                  Sign Sequence Breakdown ({targetSignLang}):
                </span>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1">
                  {signTokens.map((t, idx) => (
                    <button
                      key={t.id}
                      onClick={() => { setActiveWordIndex(idx); setIsSigning(true); }}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition-all ${
                        idx === activeWordIndex
                          ? 'bg-[#DFB6B2] text-[#190019] border-[#DFB6B2] shadow'
                          : 'bg-[#190019] text-[#DFB6B2] border-[#522B5B] hover:border-[#DFB6B2]'
                      }`}
                    >
                      {t.symbol}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
