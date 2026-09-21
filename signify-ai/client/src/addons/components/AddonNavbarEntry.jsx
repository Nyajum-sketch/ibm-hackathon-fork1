import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserCheck, Shield, LogOut, Key, Sparkles } from 'lucide-react';
import { useAddons } from '../context/AddonsContext';

export default function AddonNavbarEntry() {
  const { user, role, logout, isAuthModalOpen, setIsAuthModalOpen, activeSession, createClassSession, joinClassSession } = useAddons();
  const navigate = useNavigate();
  const [joinInput, setJoinInput] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleStartSession = async () => {
    try {
      await createClassSession();
      navigate('/classroom');
    } catch (e) {}
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinInput.trim()) return;
    try {
      await joinClassSession(joinInput.trim());
      setShowJoinModal(false);
      setJoinInput('');
      navigate('/classroom');
    } catch (err) {
      // Toast handles error message
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      {user ? (
        <div className="flex items-center gap-2">
          {/* Active Session Info */}
          {activeSession ? (
            <div
              onClick={() => navigate('/classroom')}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#522B5B] border-2 border-[#854F6C] text-[#FBE4D8] text-xs font-black shadow-[2px_2px_0px_#000000] cursor-pointer hover:bg-[#854F6C] transition-all"
            >
              <span>CODE: <strong className="font-mono text-xs tracking-wider text-[#DFB6B2]">{activeSession.joinCode}</strong></span>
            </div>
          ) : role === 'teacher' ? (
            <button
              onClick={handleStartSession}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#522B5B] hover:bg-[#854F6C] border-2 border-[#854F6C] text-[#FBE4D8] text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Session</span>
            </button>
          ) : (
            <button
              onClick={() => setShowJoinModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#522B5B] hover:bg-[#854F6C] border-2 border-[#854F6C] text-[#FBE4D8] text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000] transition-all"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Join Class</span>
            </button>
          )}

          {/* User Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#522B5B] border-2 border-[#854F6C] text-[#FBE4D8] text-xs font-black shadow-[2px_2px_0px_#000000]">
            {role === 'teacher' ? <Shield className="w-3.5 h-3.5 text-[#DFB6B2]" /> : <UserCheck className="w-3.5 h-3.5 text-[#DFB6B2]" />}
            <span className="max-w-[100px] truncate">{user.name}</span>
            <span className="uppercase text-[9px] px-2 py-0.5 rounded-full bg-[#2B124C] text-[#FBE4D8] font-black tracking-wider">
              {role}
            </span>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-1 rounded-full border-2 border-[#854F6C] bg-[#522B5B] text-[#FBE4D8] hover:bg-[#6C151E] shadow-[2px_2px_0px_#000000] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {!activeSession && (
            <button
              onClick={() => setShowJoinModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#522B5B] hover:bg-[#854F6C] border-2 border-[#854F6C] text-[#FBE4D8] text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000] transition-all"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Join Class</span>
            </button>
          )}

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#522B5B] hover:bg-[#854F6C] border-2 border-[#854F6C] text-[#FBE4D8] text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000] transition-all"
          >
            <LogIn className="w-3.5 h-3.5 text-[#DFB6B2]" />
            <span>Sign In</span>
          </button>
        </div>
      )}

      {/* Join Session Modal via Portal */}
      {showJoinModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-[#190019]/80 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-[#2B124C] border-2 border-[#522B5B] p-6 text-left align-middle shadow-[8px_8px_0px_#000000] transition-all my-8 text-[#FBE4D8] space-y-4">
              <h3 className="text-xl font-black font-display uppercase tracking-tight text-[#FBE4D8]">Join Class Session</h3>
              <p className="text-xs font-bold text-[#DFB6B2]">Enter the 6-character code provided by your teacher:</p>
              <form onSubmit={handleJoin} className="space-y-3">
                <input
                  type="text"
                  maxLength={6}
                  value={joinInput}
                  onChange={e => setJoinInput(e.target.value.toUpperCase())}
                  placeholder="e.g. ABC123"
                  className="w-full text-center tracking-widest uppercase font-mono text-xl font-black py-2.5 bg-[#190019] border-2 border-[#522B5B] rounded-xl text-[#FBE4D8] focus:outline-none focus:border-[#DFB6B2]"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(false)}
                    className="px-4 py-2 text-xs font-black uppercase rounded-full border-2 border-[#854F6C] bg-[#522B5B] hover:bg-[#854F6C] text-[#FBE4D8] shadow-[2px_2px_0px_#000000]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#DFB6B2] text-[#190019] hover:bg-[#FBE4D8] border-2 border-[#DFB6B2] font-black text-xs uppercase rounded-full shadow-[2px_2px_0px_#000000]"
                  >
                    Join Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
