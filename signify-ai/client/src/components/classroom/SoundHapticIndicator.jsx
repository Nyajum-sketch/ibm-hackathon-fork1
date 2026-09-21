import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Volume2, ShieldAlert, Sparkles, X, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SoundHapticIndicator({ isListening }) {
  const [activeAlert, setActiveAlert] = useState(null);
  const [hapticCount, setHapticCount] = useState(0);

  // Simulated ambient acoustic detection for live classroom
  useEffect(() => {
    if (!isListening) return;

    // Trigger random acoustic events (Teacher calls name, door knock, bell)
    const interval = setInterval(() => {
      const chance = Math.random();
      if (chance > 0.75) {
        let alertObj = null;
        if (chance > 0.92) {
          alertObj = {
            id: Date.now(),
            type: 'NAME_CALLED',
            title: 'Your Name Called!',
            desc: 'Professor mentioned: "Alex, what do you think?"',
            intensity: 'HIGH',
            color: 'text-[#DFB6B2] bg-[#6C151E] border-2 border-[#DFB6B2]'
          };
        } else if (chance > 0.83) {
          alertObj = {
            id: Date.now(),
            type: 'LAUGHTER',
            title: 'Classroom Laughter Detected',
            desc: 'Auditory cue: Class is reacting to a joke.',
            intensity: 'MEDIUM',
            color: 'text-[#FBE4D8] bg-[#522B5B] border-2 border-[#854F6C]'
          };
        } else {
          alertObj = {
            id: Date.now(),
            type: 'BELL',
            title: 'Classroom Bell / Door Knock',
            desc: 'Auditory cue: Environmental sound detected.',
            intensity: 'LOW',
            color: 'text-[#FBE4D8] bg-[#2B124C] border-2 border-[#522B5B]'
          };
        }

        setActiveAlert(alertObj);
        setHapticCount(c => c + 1);

        // Trigger browser haptic vibration API if supported on device!
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }

        // Auto dismiss after 5s
        setTimeout(() => {
          setActiveAlert(prev => prev?.id === alertObj.id ? null : prev);
        }, 5000);
      }
    }, 9000);

    return () => clearInterval(interval);
  }, [isListening]);

  return (
    <AnimatePresence>
      {activeAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className={`p-3.5 rounded-xl border-2 shadow-2xl flex items-start justify-between gap-3 ${activeAlert.color}`}
        >
          <div className="flex gap-3 items-center">
            <div className="p-2 rounded-lg bg-neutral-100 border border-[#190019]/10 shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold font-display uppercase tracking-wider">{activeAlert.title}</h4>
                <span className="px-1.5 py-0.2 text-[9px] font-black uppercase rounded bg-[#190019]/10 border border-[#190019]/10">
                  {activeAlert.intensity} HAPTIC
                </span>
              </div>
              <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{activeAlert.desc}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveAlert(null)}
            className="p-1 rounded-md hover:bg-black/20 text-[#DFB6B2] hover:text-[#FBE4D8] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
