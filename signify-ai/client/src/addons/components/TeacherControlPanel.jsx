import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Shield, AlertTriangle, Tag, Plus, Trash2, Radio, Check, Copy, BellRing, Sparkles } from 'lucide-react';
import { useAddons } from '../context/AddonsContext';

export default function TeacherControlPanel() {
  const { role, activeSession, sessionTags, createClassSession, endClassSession, addManualTag, removeTag, triggerManualAlert, emergencySuggestion, setEmergencySuggestion } = useAddons();
  const [showConfirmEmergency, setShowConfirmEmergency] = useState(false);
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [manualText, setManualText] = useState('');
  const [manualType, setManualType] = useState('EXAM_POINT');
  const [copiedCode, setCopiedCode] = useState(false);

  if (role !== 'teacher') return null;

  const copyCode = () => {
    if (!activeSession) return;
    navigator.clipboard.writeText(activeSession.joinCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    addManualTag({
      type: manualType,
      text: manualText.trim(),
      label: `Teacher manual ${manualType}`
    });
    setManualText('');
    setShowAddTagModal(false);
  };

  return (
    <div className="w-full bg-[#190019] border-b-2 border-[#522B5B] py-2.5 px-4 sm:px-6 text-[#FBE4D8] select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Session Status & Join Code */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#522B5B] border-2 border-[#854F6C] text-[#FBE4D8] font-black uppercase shadow-[2px_2px_0px_#000000]">
            <Shield className="w-3.5 h-3.5" />
            <span>Teacher Workspace</span>
          </div>

          {activeSession ? (
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#DFB6B2] uppercase tracking-wider text-[11px]">Session Code:</span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#2B124C] hover:bg-[#522B5B] border-2 border-[#522B5B] rounded-full font-mono text-xs font-black text-[#FBE4D8] shadow-[2px_2px_0px_#000000] transition-all"
              >
                <span>{activeSession.joinCode}</span>
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#DFB6B2]" />}
              </button>
            </div>
          ) : (
            <button
              onClick={createClassSession}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#522B5B] text-[#FBE4D8] hover:bg-[#854F6C] border-2 border-[#854F6C] font-black text-xs uppercase shadow-[2px_2px_0px_#000000] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Session for Students</span>
            </button>
          )}
        </div>

        {/* Right: Quick Controls */}
        {activeSession && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Add Tag button */}
            <button
              onClick={() => setShowAddTagModal(true)}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#522B5B] hover:bg-[#854F6C] border-2 border-[#854F6C] text-[#FBE4D8] font-black text-xs uppercase shadow-[2px_2px_0px_#000000] transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tag</span>
            </button>

            {/* Trigger New Topic Alert */}
            <button
              onClick={() => triggerManualAlert('NEW_TOPIC', 'Teacher introduced a new topic')}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#522B5B] hover:bg-[#854F6C] border-2 border-[#854F6C] text-[#FBE4D8] font-black text-xs uppercase shadow-[2px_2px_0px_#000000] transition-all"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>New Topic</span>
            </button>

            {/* Emergency Trigger Button */}
            <button
              onClick={() => setShowConfirmEmergency(true)}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#6C151E] hover:bg-[#854F6C] text-white border-2 border-[#6C151E] font-black text-xs uppercase shadow-[2px_2px_0px_#000000] transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>EMERGENCY ALERT</span>
            </button>

            {/* End Session */}
            <button
              onClick={endClassSession}
              className="px-3 py-1 rounded-full bg-[#2B124C] hover:bg-[#522B5B] border-2 border-[#522B5B] text-[#FBE4D8] font-black text-xs uppercase shadow-[2px_2px_0px_#000000] transition-colors"
            >
              End Session
            </button>
          </div>
        )}
      </div>

      {/* Emergency Keyword Suggestion Banner (Teacher view only) */}
      {emergencySuggestion && (
        <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between gap-3 text-xs animate-bounce">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>
              Keyword <strong>"{emergencySuggestion.keyword}"</strong> detected in speech. Would you like to issue an Emergency Alert to student devices?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerManualAlert('EMERGENCY', `Emergency Keyword Detected: ${emergencySuggestion.keyword}`);
                setEmergencySuggestion(null);
              }}
              className="px-3 py-1 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
            >
              Send Emergency Alert
            </button>
            <button
              onClick={() => setEmergencySuggestion(null)}
              className="px-2.5 py-1 text-text-secondary hover:text-text-primary"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Manual Tag Override Modal via Portal */}
      {showAddTagModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/80 backdrop-blur-md">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-bg-surface border border-border-subtle p-6 text-left align-middle shadow-2xl transition-all my-8 text-text-primary space-y-4">
              <h3 className="text-base font-bold font-display flex items-center gap-2">
                <Tag className="w-4 h-4 text-accent-coral" />
                <span>Teacher Tag Override</span>
              </h3>
              <form onSubmit={handleManualAdd} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Tag Type</label>
                  <select
                    value={manualType}
                    onChange={e => setManualType(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-elevated border border-border-subtle rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent-coral"
                  >
                    <option value="EXAM_POINT">[EXAM] EXAM_POINT (Exam Question)</option>
                    <option value="EMPHASIS">[NOTE] EMPHASIS (Key Note)</option>
                    <option value="DEFINITION">[DEF] DEFINITION (Concept)</option>
                    <option value="QUESTION">[Q] QUESTION (Discussion)</option>
                    <option value="NEW_TOPIC">[TOPIC] NEW_TOPIC (Section)</option>
                    <option value="HOMEWORK">[HW] HOMEWORK (Assignment)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Text / Caption Context</label>
                  <input
                    type="text"
                    required
                    value={manualText}
                    onChange={e => setManualText(e.target.value)}
                    placeholder="e.g. Remember that React useState causes re-renders"
                    className="w-full px-3 py-2 bg-bg-elevated border border-border-subtle rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent-coral"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTagModal(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-accent-coral text-bg-base font-bold text-xs rounded-xl hover:opacity-90"
                  >
                    Save Tag
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Emergency Confirmation Modal via Portal */}
      {showConfirmEmergency && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/80 backdrop-blur-md">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-[#2B124C] border-2 border-[#6C151E] p-6 text-center align-middle shadow-2xl transition-all my-8 text-[#FBE4D8] space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#6C151E]/20 text-[#DFB6B2] mx-auto flex items-center justify-center border border-[#6C151E]/60">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#DFB6B2]">Confirm Emergency Broadcast</h3>
              <p className="text-xs text-[#DFB6B2]">
                This will trigger a repeating full-screen flash, sound, and continuous vibration on ALL connected student devices until manually acknowledged.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmEmergency(false)}
                  className="px-4 py-2 text-xs font-bold bg-[#522B5B] rounded-xl text-[#FBE4D8] hover:bg-[#854F6C] border border-[#854F6C]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    triggerManualAlert('EMERGENCY', 'CRITICAL EMERGENCY: EVACUATE / LISTEN TO INSTRUCTOR');
                    setShowConfirmEmergency(false);
                  }}
                  className="px-5 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-600/30"
                >
                  BROADCAST EMERGENCY
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
