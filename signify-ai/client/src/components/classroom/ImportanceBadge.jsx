import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useLectureStore } from '../../store/useLectureStore';
import { useCaptionStore } from '../../store/useCaptionStore';

import { MessageSquare, Target, AlertTriangle, HelpCircle, Sun } from 'lucide-react';

const TECHNICAL_WORDS = [
  'quantum', 'derivative', 'mitochondria', 'theorem', 'integral', 'entropy',
  'photosynthesis', 'chlorophyll', 'algorithm', 'nucleotide', 'equation'
];

export default function ImportanceBadge() {
  const { currentImportance } = useLectureStore();
  const { isListening } = useCaptionStore();
  const [badgeState, setBadgeState] = useState({
    type: 'NORMAL',
    text: 'Lecture in Progress',
    Icon: MessageSquare,
    style: {
      bg: '#2B124C',
      border: '2px solid #522B5B',
      color: '#FBE4D8'
    }
  });

  const lastUpdateRef = useRef(0);

  useEffect(() => {
    if (!currentImportance) return;

    const now = Date.now();
    // Debounce: minimum 8 seconds before changing state (unless first load)
    if (now - lastUpdateRef.current < 8000 && lastUpdateRef.current !== 0) return;

    const { type, importance, label = '' } = currentImportance;

    let nextState = {
      type: 'NORMAL',
      text: 'Lecture in Progress',
      Icon: MessageSquare,
      style: {
        bg: '#2B124C',
        border: '2px solid #522B5B',
        color: '#FBE4D8'
      }
    };

    const hasTechWord = TECHNICAL_WORDS.some(w => label.toLowerCase().includes(w));

    if (type === 'exam') {
      nextState = {
        type: 'HIGH_EXAM',
        text: 'EXAM ALERT',
        Icon: Target,
        style: {
          bg: '#6C151E',
          border: '2px solid #DFB6B2',
          color: '#FBE4D8'
        }
      };
      toast('Exam topic detected — saving to study notes', {
        position: 'bottom-right',
        style: {
          background: '#190019',
          color: '#DFB6B2',
          border: '2px solid #522B5B'
        }
      });
    } else if (importance === 'high' && type === 'concept' && hasTechWord) {
      nextState = {
        type: 'SIMPLIFIED_AVAILABLE',
        text: 'Complex Topic — Tap to Simplify',
        Icon: HelpCircle,
        style: {
          bg: '#522B5B',
          border: '2px solid #854F6C',
          color: '#FBE4D8'
        }
      };
    } else if (['concept', 'formula'].includes(type) && importance !== 'low') {
      nextState = {
        type: 'IMPORTANT_CONCEPT',
        text: 'Key Concept',
        Icon: Sun,
        style: {
          bg: '#522B5B',
          border: '2px solid #854F6C',
          color: '#FBE4D8'
        }
      };
    }

    if (nextState.type !== badgeState.type) {
      setBadgeState(nextState);
      lastUpdateRef.current = now;
    }
  }, [currentImportance, badgeState.type]);

  const handleSimplifyTap = () => {
    window.dispatchEvent(new CustomEvent('TRIGGER_SIMPLIFY', {
      detail: "The teacher just said a complex topic. Explain this simply for a student."
    }));
  };

  return (
    <div className="absolute top-4 right-4 z-10">
      {!isListening ? null : (
        <AnimatePresence mode="wait">
        <motion.button
          key={badgeState.type}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.25 }}
          onClick={badgeState.type === 'SIMPLIFIED_AVAILABLE' ? handleSimplifyTap : undefined}
          className={`flex items-center gap-2 px-4 h-9 rounded-full font-black text-xs whitespace-nowrap tracking-wider uppercase border-2 border-[#190019] shadow-[2px_2px_0px_#190019]
            ${badgeState.type === 'IMPORTANT_CONCEPT' ? 'bg-[#DFB6B2] text-[#190019]' : ''}
          `}
          style={{
            backgroundColor: badgeState.style.bg,
            color: badgeState.style.color,
            cursor: badgeState.type === 'SIMPLIFIED_AVAILABLE' ? 'pointer' : 'default',
          }}
        >
          {badgeState.Icon && <badgeState.Icon className="w-4 h-4" />}
          <span>{badgeState.text}</span>
        </motion.button>
        </AnimatePresence>
      )}
    </div>
  );
}
