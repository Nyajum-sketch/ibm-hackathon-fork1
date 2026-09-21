import React, { useState } from 'react';
import { Key, Shield, Radio, Check, Copy, LogOut, Sparkles, UserCheck } from 'lucide-react';
import { useAddons } from '../context/AddonsContext';

export default function StudentSessionBanner() {
  const { role, activeSession, joinClassSession, leaveClassSession } = useAddons();
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // If user is hosting as teacher, TeacherControlPanel already handles session creation & code display
  if (role === 'teacher' && activeSession) return null;

  const handleJoin = async (e) => {
    e.preventDefault();
    const cleanCode = joinCodeInput.trim().toUpperCase();
    if (!cleanCode) return;
    setLoading(true);
    try {
      await joinClassSession(cleanCode);
      setJoinCodeInput('');
    } catch (err) {
      // Error toasted in context
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!activeSession?.joinCode) return;
    navigator.clipboard.writeText(activeSession.joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full mb-4">
      {activeSession ? (
        /* Connected Session Status Banner */
        <div className="bg-[#2B124C] border-2 border-[#522B5B] rounded-2xl p-4 shadow-[4px_4px_0px_#000000] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#0F3D3A] text-[#FBE4D8] border-2 border-[#522B5B] shrink-0">
              <Radio className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#0F3D3A] rounded-full border-2 border-[#190019]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#FBE4D8]">Connected to Class Session</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-[#0F3D3A] text-[#FBE4D8] border border-[#522B5B]">
                  Live Syncing
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-[#DFB6B2] font-bold">Session Join Code:</span>
                <strong className="font-mono text-sm tracking-widest text-[#FBE4D8] uppercase font-black">
                  {activeSession.joinCode}
                </strong>
                <button
                  onClick={handleCopyCode}
                  title="Copy session code"
                  className="p-1 text-[#DFB6B2] hover:text-[#FBE4D8] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={leaveClassSession}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#522B5B] hover:bg-[#6C151E] border-2 border-[#854F6C] text-[#FBE4D8] text-xs font-black uppercase shadow-[2px_2px_0px_#000000] transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Leave Session</span>
            </button>
          </div>
        </div>
      ) : (
        /* Join Session Card for Student Access */
        <div className="bg-[#2B124C] border-2 border-[#522B5B] rounded-2xl p-5 shadow-[4px_4px_0px_#000000] transition-all relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
            {/* Title & Info */}
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#522B5B] text-[#FBE4D8] border-2 border-[#854F6C]">
                  <Key className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black font-display text-[#FBE4D8] tracking-wide uppercase">
                  Student Session Access
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#522B5B] text-[#FBE4D8] border border-[#854F6C]">
                  Join Teacher
                </span>
              </div>
              <p className="text-xs text-[#DFB6B2] font-bold leading-relaxed">
                Enter the 6-character classroom code provided by your instructor (e.g. <strong className="font-mono text-[#FBE4D8]">GJGY6F</strong>) to receive real-time captions, emphasis badges, and teacher alerts.
              </p>
            </div>

            {/* Code Input Form */}
            <form onSubmit={handleJoin} className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. GJGY6F"
                  className="w-36 text-center tracking-widest uppercase font-mono text-sm font-black py-2 px-3 bg-[#190019] border-2 border-[#522B5B] rounded-xl text-[#FBE4D8] focus:outline-none focus:border-[#DFB6B2] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !joinCodeInput.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#2B124C] hover:bg-[#190019] disabled:opacity-50 disabled:cursor-not-allowed text-[#FBE4D8] font-black text-xs uppercase rounded-full shadow-[2px_2px_0px_#190019] border-2 border-[#190019] transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loading ? 'Joining...' : 'Join Session'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
