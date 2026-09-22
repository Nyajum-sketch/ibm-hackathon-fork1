import React, { useEffect, useState } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { getStorageStats, clearAllLectures } from '../lib/db';
import { SUPPORTED_LANGUAGES } from '../lib/translate';

import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

import {
  Sliders,
  Eye,
  Cpu,
  Trash2,
  AlertTriangle,
  Moon,
  Sun,
  HardDrive,
  Volume2,
  VolumeX,
  Contrast,
  Zap,
  Bell,
  Gauge,
  Languages,
  CheckCircle2
} from 'lucide-react';

// Reusable toggle component
function SettingToggle({ checked, onChange, id }) {
  return (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-12 h-6 bg-[#190019] peer-focus:outline-none rounded-full peer peer-checked:bg-[#522B5B] border-2 border-[#522B5B] peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#DFB6B2] after:border-2 after:border-[#190019] after:rounded-full after:h-4 after:w-4 after:transition-all shadow-[2px_2px_0px_#000000]" />
    </label>
  );
}

// Section wrapper
function SettingSection({ icon: Icon, title, children }) {
  return (
    <div className="bg-[#2B124C] border-2 border-[#522B5B] rounded-2xl p-6 space-y-5 shadow-[4px_4px_0px_#000000]">
      <div className="flex items-center gap-2.5 border-b-2 border-[#522B5B] pb-4">
        <div className="p-2 bg-[#522B5B] border-2 border-[#854F6C] rounded-xl shadow-[2px_2px_0px_#000000]">
          <Icon className="w-4 h-4 text-[#FBE4D8]" />
        </div>
        <h2 className="font-black text-[#FBE4D8] text-sm uppercase tracking-wider font-display">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// Row inside a section
function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="min-w-0">
        <p className="text-xs font-black text-[#FBE4D8]">{label}</p>
        {description && <p className="text-xs text-[#DFB6B2] mt-0.5 leading-relaxed font-semibold">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function Settings() {
  const {
    targetLanguage,
    autoTranslate,
    autoSummarize,
    captionFontSize,
    reduceMotion,
    groqApiKey,
    captionStyle,
    bgOpacity,
    lineSpacing,
    theme,
    notificationSounds,
    highContrast,
    captionSpeed,
    actions
  } = useSettingsStore();

  const [dbStats, setDbStats] = useState({ count: 0, estimatedSizeKB: 0 });
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [localApiKey, setLocalApiKey] = useState(groqApiKey);
  const [keySaved, setKeySaved] = useState(false);

  const loadDbStats = async () => {
    try {
      const stats = await getStorageStats();
      setDbStats(stats);
    } catch (e) {
      console.error('Failed to retrieve storage stats:', e);
    }
  };

  useEffect(() => {
    loadDbStats();
  }, []);

  const handleSaveApiKey = () => {
    actions.setApiKey(localApiKey.trim());
    setKeySaved(true);
    toast.success('AI key saved successfully!');
    setTimeout(() => setKeySaved(false), 2000);
  };

  const handleClearDatabase = async () => {
    try {
      await clearAllLectures();
      setDbStats({ count: 0, estimatedSizeKB: 0 });
      setConfirmClearOpen(false);
      toast.success('All saved sessions deleted successfully.');
    } catch (err) {
      toast.error('Failed to clear saved data.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 min-h-[calc(100vh-8rem)] pb-16 select-none">

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#2B124C] text-[#FBE4D8] border-2 border-[#522B5B] rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000] mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>APP CONFIGURATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-display text-[#FBE4D8]">
            Preferences
          </h1>
          <p className="text-sm font-bold text-[#DFB6B2] mt-1">
            Customize captions, translations, appearance, and accessibility settings
          </p>
        </div>
      </div>

      {/* Grid: 2 columns on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ---- SECTION 1: APPEARANCE ---- */}
        <SettingSection icon={Eye} title="Caption Appearance">
          {/* Font Size */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-[#DFB6B2] uppercase tracking-wider">Caption Font Size</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { key: 'md', label: 'Medium' },
                { key: 'lg', label: 'Large' },
                { key: 'xl', label: 'X-Large' },
                { key: '2xl', label: 'Display' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => actions.setCaptionFontSize(key)}
                  className={`py-2 px-1 rounded-full text-xs font-black uppercase border-2 transition-all shadow-[2px_2px_0px_#000000] ${
                    captionFontSize === key
                      ? 'bg-[#DFB6B2] text-[#190019] border-[#DFB6B2]'
                      : 'bg-[#522B5B] text-[#FBE4D8] border-[#854F6C] hover:bg-[#854F6C]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Caption Style */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-[#DFB6B2] uppercase tracking-wider">Caption Contrast Style</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'standard', label: 'Standard' },
                { key: 'contrast', label: 'High Contrast' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => actions.setCaptionStyle(key)}
                  className={`py-2 px-3 rounded-full text-xs font-black uppercase border-2 transition-all shadow-[2px_2px_0px_#000000] ${
                    captionStyle === key
                      ? 'bg-[#DFB6B2] text-[#190019] border-[#DFB6B2]'
                      : 'bg-[#522B5B] text-[#FBE4D8] border-[#854F6C] hover:bg-[#854F6C]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Line Spacing */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-[#DFB6B2] uppercase tracking-wider">Caption Line Spacing</p>
            <div className="grid grid-cols-4 gap-2">
              {['tight', 'normal', 'relaxed', 'loose'].map((spacing) => (
                <button
                  key={spacing}
                  onClick={() => actions.setLineSpacing(spacing)}
                  className={`py-2 px-2 rounded-full text-xs font-black uppercase border-2 transition-all shadow-[2px_2px_0px_#000000] ${
                    lineSpacing === spacing
                      ? 'bg-[#DFB6B2] text-[#190019] border-[#DFB6B2]'
                      : 'bg-[#522B5B] text-[#FBE4D8] border-[#854F6C] hover:bg-[#854F6C]'
                  }`}
                >
                  {spacing}
                </button>
              ))}
            </div>
          </div>


          {/* Background Opacity Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Caption Background Opacity</p>
              <span className="text-[10px] font-bold text-accent-coral">{bgOpacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={bgOpacity}
              onChange={(e) => actions.setBgOpacity(Number(e.target.value))}
              className="w-full accent-accent-coral h-1.5 rounded-lg cursor-pointer bg-bg-elevated"
            />
            <div className="flex justify-between text-[9px] text-text-muted font-medium">
              <span>Transparent</span><span>Opaque</span>
            </div>
          </div>
        </SettingSection>

        {/* ---- SECTION 2: THEME & INTERFACE ---- */}
        <SettingSection icon={Contrast} title="Theme & Interface">
          <SettingRow label="Dark / Light Mode" description="Switch between dark and light interface themes">
            <button
              onClick={actions.toggleTheme}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 text-xs font-black uppercase tracking-wider transition-all shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 ${
                theme === 'light'
                  ? 'bg-amber-100 border-amber-400 text-amber-900 hover:bg-amber-200'
                  : 'bg-[#522B5B] border-[#854F6C] text-[#FBE4D8] hover:bg-[#854F6C]'
              }`}
            >
              {theme === 'light' ? <Sun className="w-4 h-4 text-amber-600" /> : <Moon className="w-4 h-4 text-[#DFB6B2]" />}
              <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </SettingRow>

          <SettingRow label="Reduce Animations" description="Disable intensive page transitions and animated elements">
            <SettingToggle
              id="reduce-motion"
              checked={reduceMotion}
              onChange={actions.toggleReduceMotion}
            />
          </SettingRow>

          <SettingRow label="High Contrast Mode" description="Maximise text contrast for low-vision users">
            <SettingToggle
              id="high-contrast"
              checked={highContrast}
              onChange={actions.toggleHighContrast}
            />
          </SettingRow>

          {/* Caption Speed */}
          <div className="space-y-2 pt-1">
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5" /> Caption Speed
            </p>
            <p className="text-[10px] text-text-secondary">Controls how quickly new caption lines appear and scroll</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'slow', label: 'Slow' },
                { key: 'normal', label: 'Normal' },
                { key: 'fast', label: 'Fast' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => actions.setCaptionSpeed(key)}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                    captionSpeed === key
                      ? 'bg-accent-coral/15 text-accent-coral border-accent-coral/30'
                      : 'bg-bg-elevated text-text-secondary border-border-subtle hover:text-text-primary'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </SettingSection>

        {/* ---- SECTION 3: TRANSLATION & AI ---- */}
        <SettingSection icon={Languages} title="Translation & AI">
          {/* Default Language Selector */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Default Translation Language</p>
            <p className="text-[10px] text-text-secondary">Captions and summaries translate into this language when enabled</p>
            <select
              value={targetLanguage}
              onChange={(e) => actions.setTargetLanguage(e.target.value)}
              className="w-full bg-[#190019] border-2 border-[#522B5B] rounded-full px-4 py-2.5 text-xs font-black text-[#FBE4D8] shadow-[2px_2px_0px_#000000] focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  [{lang.flag}] {lang.name}
                </option>
              ))}
            </select>
          </div>

          <SettingRow label="Auto-Translate Captions" description="Automatically translate each completed sentence during live sessions">
            <SettingToggle
              id="auto-translate"
              checked={autoTranslate}
              onChange={actions.toggleAutoTranslate}
            />
          </SettingRow>

          <SettingRow label="Auto-Generate Study Notes" description="Automatically create AI study notes when a session ends">
            <SettingToggle
              id="auto-summarize"
              checked={autoSummarize}
              onChange={actions.toggleAutoSummarize}
            />
          </SettingRow>

          {/* AI Key Input */}
          <div className="space-y-2 pt-2 border-t-2 border-[#522B5B]">
            <p className="text-[10px] font-black text-[#DFB6B2] uppercase tracking-wider">Custom AI Key (Optional)</p>
            <div className="flex gap-2">
              <input
                type="password"
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder="Enter custom key (optional)..."
                className="flex-1 bg-[#190019] border-2 border-[#522B5B] rounded-full px-4 py-2 text-xs font-bold text-[#FBE4D8] placeholder:text-neutral-500 focus:outline-none transition-colors"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 rounded-full border-2 border-[#854F6C] bg-[#522B5B] text-[#FBE4D8] text-xs font-black uppercase shadow-[2px_2px_0px_#000000] transition-all hover:bg-[#854F6C]"
              >
                {keySaved ? 'Saved!' : 'Save Key'}
              </button>
            </div>
            <p className="text-[10px] font-bold text-[#DFB6B2]">If empty, the app uses the built-in shared AI service.</p>
          </div>
        </SettingSection>

        {/* ---- SECTION 4: NOTIFICATIONS & ACCESSIBILITY ---- */}
        <SettingSection icon={Bell} title="Notifications & Alerts">
          <SettingRow label="Sound Notifications" description="Play audio alerts for classroom events like name calls and alarms">
            <SettingToggle
              id="notification-sounds"
              checked={notificationSounds}
              onChange={actions.toggleNotificationSounds}
            />
          </SettingRow>

          <SettingRow label="Haptic Feedback Indicator" description="Show the acoustic awareness bar at the top of the classroom (visual vibration indicator)">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#522B5B] border-2 border-[#854F6C] rounded-full shadow-[2px_2px_0px_#000000]">
              <Zap className="w-3.5 h-3.5 text-[#FBE4D8]" />
              <span className="text-[10px] font-black text-[#FBE4D8] uppercase">Always On</span>
            </div>
          </SettingRow>

          <div className="pt-2 p-3 bg-[#190019] rounded-xl border-2 border-[#522B5B] space-y-2">
            <p className="text-[10px] font-black text-[#DFB6B2] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> WCAG Accessibility
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#FBE4D8]">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#0F3D3A]" />
                High Contrast
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#0F3D3A]" />
                Keyboard Navigation
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#0F3D3A]" />
                Screen Reader Ready
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#0F3D3A]" />
                WCAG 2.1 AA Target
              </div>
            </div>
          </div>
        </SettingSection>

        {/* ---- SECTION 5: STORAGE ---- */}
        <div className="lg:col-span-2">
          <SettingSection icon={HardDrive} title="Storage & Session Data">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Stats */}
              <div className="bg-[#190019] border-2 border-[#522B5B] rounded-2xl p-4 text-center shadow-[2px_2px_0px_#000000]">
                <div className="text-3xl font-black text-[#FBE4D8] font-display">{dbStats.count}</div>
                <div className="text-[10px] font-black text-[#DFB6B2] uppercase tracking-wider mt-1">Saved Sessions</div>
              </div>
              <div className="bg-[#190019] border-2 border-[#522B5B] rounded-2xl p-4 text-center shadow-[2px_2px_0px_#000000]">
                <div className="text-3xl font-black text-[#FBE4D8] font-display">{dbStats.estimatedSizeKB.toFixed(1)}</div>
                <div className="text-[10px] font-black text-[#DFB6B2] uppercase tracking-wider mt-1">Kilobytes Used</div>
              </div>
              <div className="bg-[#190019] border-2 border-[#522B5B] rounded-2xl p-4 text-center shadow-[2px_2px_0px_#000000]">
                <div className="text-3xl font-black text-[#DFB6B2] font-display">Unlimited</div>
                <div className="text-[10px] font-black text-[#DFB6B2] uppercase tracking-wider mt-1">Storage Quota</div>
              </div>

              {/* Clear Data */}
              <div className="sm:col-span-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t-2 border-[#522B5B]">
                <div>
                  <h4 className="text-xs font-black text-[#FBE4D8] uppercase">Delete All Saved Data</h4>
                  <p className="text-xs font-bold text-[#DFB6B2] mt-0.5">
                    Permanently removes all session archives, AI summaries, and notes from this device
                  </p>
                </div>
                <button
                  onClick={() => setConfirmClearOpen(true)}
                  disabled={dbStats.count === 0}
                  className="px-5 py-2.5 rounded-full border-2 border-[#6C151E] bg-[#6C151E] hover:bg-[#854F6C] text-[#FBE4D8] font-black text-xs uppercase shadow-[2px_2px_0px_#000000] disabled:opacity-40"
                >
                  Delete All Data
                </button>
              </div>
            </div>
          </SettingSection>
        </div>

      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={confirmClearOpen} onClose={() => setConfirmClearOpen(false)} title="Delete All Saved Data?">
        <div className="space-y-4">
          <div className="flex gap-3 items-start p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Caution: Destructive Action</p>
              <p className="text-[10px] leading-relaxed mt-0.5">
                Deleting saved data removes all recorded sessions, translations, and summaries from this device. This cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button onClick={() => setConfirmClearOpen(false)} variant="ghost" size="sm">
              Cancel
            </Button>
            <Button onClick={handleClearDatabase} variant="danger" size="sm">
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
