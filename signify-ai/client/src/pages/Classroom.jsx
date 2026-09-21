import React, { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTranslation } from '../hooks/useTranslation';
import { useCaptionStore } from '../store/useCaptionStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useLectureStore } from '../store/useLectureStore';
import { saveLecture } from '../lib/db';
import { SUPPORTED_LANGUAGES } from '../lib/translate';

import LiveCaptionPanel from '../components/classroom/LiveCaptionPanel';
import HeatmapTimeline from '../components/classroom/HeatmapTimeline';
import QRJoinPanel from '../components/classroom/QRJoinPanel';
import LectureSummarizer from '../components/ai/LectureSummarizer';
import AskAI from '../components/ai/AskAI';
import { useGroqAI } from '../hooks/useGroqAI';
import SoundHapticIndicator from '../components/classroom/SoundHapticIndicator';
import AslGrammarBridge from '../components/classroom/AslGrammarBridge';
import { StudentSessionBanner } from '../addons';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

import { 
  Mic, 
  MicOff, 
  Save, 
  Download, 
  Languages, 
  BrainCircuit, 
  MessageSquare,
  Clock,
  Sparkles,
  BookOpen,
  Accessibility
} from 'lucide-react';

export default function Classroom() {
  const { isListening, isDemoMode, toggleListening, toggleDemo } = useSpeechRecognition();
  const { translateLine } = useTranslation();
  
  const { 
    finalTranscript, 
    interimText, 
    wordCount, 
    startTime, 
    sessionId,
    actions: captionActions
  } = useCaptionStore();

  const {
    targetLanguage,
    autoTranslate,
    autoSummarize,
    actions: settingsActions
  } = useSettingsStore();

  const { actions: lectureActions } = useLectureStore();

  const [activeRightTab, setActiveRightTab] = useState('summary');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const { generateSummary } = useGroqAI();
  const prevIsListening = useRef(isListening);

  // Save session modal state
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('');

  // Auto-Summarize on session end
  useEffect(() => {
    if (prevIsListening.current === true && isListening === false) {
      if (autoSummarize) {
        const fullText = [...finalTranscript, interimText].filter(Boolean).join(' ');
        if (fullText.length >= 50 && !useLectureStore.getState().currentSummary) {
          generateSummary(fullText);
        }
      }
    }
    prevIsListening.current = isListening;
  }, [isListening, autoSummarize, finalTranscript, interimText, generateSummary]);

  // Live session timer
  useEffect(() => {
    let interval = null;
    if (isListening && startTime) {
      interval = setInterval(() => {
        const diff = Math.round((new Date() - new Date(startTime)) / 1000);
        setElapsedSeconds(diff);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening, startTime]);

  // Auto-translate each new sentence
  useEffect(() => {
    if (finalTranscript.length > 0) {
      const lastIdx = finalTranscript.length - 1;
      const lastLine = finalTranscript[lastIdx];
      translateLine(lastLine, lastIdx);
    }
  }, [finalTranscript.length, autoTranslate, targetLanguage, translateLine]);

  const formatTimer = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return [
      h > 0 ? String(h).padStart(2, '0') : null,
      String(m).padStart(2, '0'),
      String(s).padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  const estimatedReadingTime = Math.ceil(wordCount / 200) || 1;

  // Export transcript as .txt file
  const handleExportTxt = () => {
    if (finalTranscript.length === 0) {
      toast.error('No transcript yet. Start recording or try the demo first.');
      return;
    }

    const titleStr = `SIGNIFY AI — Session Notes (${new Date().toLocaleDateString()})`;
    const dateStr = `Date: ${new Date().toLocaleString()}`;
    const transcriptHeader = '\n--- CAPTION TRANSCRIPT ---\n';
    const transcriptBody = finalTranscript.join('\n');
    
    let content = `${titleStr}\n${dateStr}\n${transcriptHeader}${transcriptBody}`;

    if (autoTranslate) {
      const activeLanguage = SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)?.name || targetLanguage;
      const translationLines = useCaptionStore.getState().translatedLines;
      const translationHeader = `\n\n--- TRANSLATIONS (${activeLanguage.toUpperCase()}) ---\n`;
      const translationBody = translationLines.filter(Boolean).join('\n');
      content += `${translationHeader}${translationBody}`;
    }

    const currentSummary = useLectureStore.getState().currentSummary;
    if (currentSummary) {
      content += `\n\n--- AI STUDY NOTES ---\n${currentSummary}`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signify-session-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Transcript downloaded!');
  };

  // Open save modal
  const handleOpenSaveModal = () => {
    if (finalTranscript.length === 0) {
      toast.error('No content to save. Start recording or run the demo first.');
      return;
    }
    setSessionTitle(`Session — ${new Date().toLocaleDateString()}`);
    setSaveModalOpen(true);
  };

  // Confirm save to local storage
  const handleConfirmSave = async () => {
    const title = sessionTitle.trim() || `Session — ${new Date().toLocaleDateString()}`;

    const lectureData = {
      title,
      transcript: finalTranscript.join(' '),
      translatedTranscript: useCaptionStore.getState().translatedLines.filter(Boolean).join(' '),
      targetLanguage,
      summary: useLectureStore.getState().currentSummary || '',
      keyPoints: useLectureStore.getState().keyPoints || [],
      examQuestions: useLectureStore.getState().examQuestions || [],
      wordCount,
      duration: elapsedSeconds || 1,
      createdAt: new Date().toISOString(),
      sessionId
    };

    try {
      await saveLecture(lectureData);
      toast.success('Session saved to history!');
      setSaveModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save session. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 min-h-[calc(100vh-8rem)] pb-16 select-none bg-[#190019] text-[#FBE4D8]">
      
      {/* Student Session Access & Join Code space */}
      <StudentSessionBanner />

      {/* Acoustic Sound & Haptic Notification Bar */}
      <SoundHapticIndicator isListening={isListening} />

      {/* Main split panels */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        
        {/* Left: Live Caption Panel + ASL Grammar Bridge */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          <div className="flex-1 min-h-[420px] flex flex-col bg-[#2B124C] border-2 border-[#522B5B] rounded-2xl shadow-[4px_4px_0px_#000000] overflow-hidden">
            <LiveCaptionPanel />
          </div>

          {/* Real-time ASL Grammar Syntax Transformer */}
          <div className="bg-[#2B124C] border-2 border-[#522B5B] rounded-2xl shadow-[4px_4px_0px_#000000] p-4">
            <AslGrammarBridge currentTranscript={[...finalTranscript, interimText].filter(Boolean).slice(-1)[0]} />
          </div>
        </div>

        {/* Right: AI Panel */}
        <div className="lg:col-span-4 flex flex-col bg-[#2B124C] border-2 border-[#522B5B] rounded-2xl shadow-[4px_4px_0px_#000000] overflow-hidden min-h-[500px]">
          
          {/* Tab Header */}
          <div className="flex border-b-2 border-[#522B5B] bg-[#190019]">
            <button
              onClick={() => setActiveRightTab('summary')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-wider transition-colors border-r-2 border-[#522B5B] ${
                activeRightTab === 'summary'
                  ? 'bg-[#DFB6B2] text-[#190019]'
                  : 'bg-[#2B124C] text-[#FBE4D8] hover:bg-[#522B5B]'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              AI Notes
            </button>
            <button
              onClick={() => setActiveRightTab('ask_tutor')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-wider transition-colors ${
                activeRightTab === 'ask_tutor'
                  ? 'bg-[#DFB6B2] text-[#190019]'
                  : 'bg-[#2B124C] text-[#FBE4D8] hover:bg-[#522B5B]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Ask AI
            </button>
          </div>

          {/* Controls strip */}
          <div className="px-4 py-3 border-b-2 border-[#522B5B] bg-[#522B5B] flex flex-wrap gap-3 items-center justify-between">
            {/* Language selector */}
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-[#DFB6B2]" />
              <select
                value={targetLanguage}
                onChange={(e) => settingsActions.setTargetLanguage(e.target.value)}
                className="bg-[#190019] border-2 border-[#854F6C] rounded-full px-3 py-1 text-xs font-black text-[#FBE4D8] shadow-[2px_2px_0px_#000000] focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    [{lang.flag}] {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoTranslate}
                  onChange={settingsActions.toggleAutoTranslate}
                  className="rounded border-2 border-[#DFB6B2] text-[#DFB6B2] focus:ring-0 cursor-pointer w-4 h-4"
                />
                <span className="text-[11px] uppercase font-black tracking-wider text-[#FBE4D8]">Translate</span>
              </label>
              
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSummarize}
                  onChange={settingsActions.toggleAutoSummarize}
                  className="rounded border-2 border-[#DFB6B2] text-[#DFB6B2] focus:ring-0 cursor-pointer w-4 h-4"
                />
                <span className="text-[11px] uppercase font-black tracking-wider text-[#FBE4D8]">Auto-Notes</span>
              </label>
            </div>
          </div>

          {/* QR Share Panel */}
          <div className="px-4 py-2 bg-[#190019] border-b-2 border-[#522B5B]">
            <QRJoinPanel />
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#2B124C]">
            {activeRightTab === 'summary' ? (
              <LectureSummarizer />
            ) : (
              <AskAI />
            )}
          </div>
        </div>
      </div>

      <HeatmapTimeline />

      {/* Bottom Control Bar */}
      <div className="bg-[#2B124C] border-2 border-[#522B5B] rounded-2xl p-4 md:px-6 flex flex-wrap gap-4 items-center justify-between shrink-0 shadow-[5px_5px_0px_#000000]">
        
        {/* Recording controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={toggleListening}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all ${
              isListening && !isDemoMode 
                ? 'bg-[#6C151E] text-white border-[#6C151E]' 
                : 'bg-[#DFB6B2] text-[#190019] border-[#DFB6B2] hover:bg-[#FBE4D8]'
            }`}
          >
            {isListening && !isDemoMode ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening && !isDemoMode ? 'Stop Recording' : 'Begin Recording'}</span>
          </button>

          <button
            onClick={toggleDemo}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-[#854F6C] bg-[#522B5B] text-[#FBE4D8] font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000000] hover:bg-[#854F6C] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#DFB6B2]" />
            <span>{isListening && isDemoMode ? 'Stop Demo' : 'Try Demo'}</span>
          </button>
        </div>

        {/* Session stats */}
        {isListening && (
          <div className="flex flex-wrap items-center gap-3 text-xs font-black text-[#FBE4D8] bg-[#522B5B] px-4 py-1.5 rounded-full border-2 border-[#854F6C] shadow-[2px_2px_0px_#000000]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#DFB6B2]" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>
            <span>•</span>
            <div>
              <span>{wordCount} words</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#DFB6B2]" />
              <span>{estimatedReadingTime} min read</span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.open('/avatar', '_blank')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border-2 border-[#DFB6B2] bg-[#DFB6B2] text-[#190019] font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000000] hover:bg-[#FBE4D8]"
          >
            <Accessibility className="w-3.5 h-3.5" />
            <span>Sign Avatar</span>
          </button>
          <button
            onClick={handleOpenSaveModal}
            disabled={finalTranscript.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border-2 border-[#854F6C] bg-[#522B5B] text-[#FBE4D8] font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000000] hover:bg-[#854F6C] disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5 text-[#DFB6B2]" />
            <span>Save</span>
          </button>
          <button
            onClick={handleExportTxt}
            disabled={finalTranscript.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border-2 border-[#854F6C] bg-[#522B5B] text-[#FBE4D8] font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000000] hover:bg-[#854F6C] disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-[#DFB6B2]" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Save Session Modal — replaces browser prompt() */}
      <Modal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Save Session"
      >
        <div className="space-y-5">
          <p className="text-sm text-text-secondary">
            Give this session a name so you can find it easily in your history.
          </p>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Session Name</label>
            <input
              type="text"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmSave()}
              autoFocus
              placeholder="e.g. Biology Lecture — Week 3"
              className="w-full bg-bg-elevated border border-border-subtle hover:border-accent-coral/30 focus:border-accent-coral focus:ring-1 focus:ring-accent-coral/20 rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-colors"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-1">
            <Button onClick={() => setSaveModalOpen(false)} variant="ghost" size="sm">
              Cancel
            </Button>
            <Button onClick={handleConfirmSave} variant="primary" size="sm" icon={Save}>
              Save Session
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
