import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCaptionStore } from '../../store/useCaptionStore';

const COLOR_MAP = {
  exam: 'bg-[#6C151E]',
  concept: 'bg-[#854F6C]',
  formula: 'bg-[#DFB6B2]',
  example: 'bg-[#0F3D3A]',
  story: 'bg-[#2B124C]',
  normal: 'bg-neutral-400'
};

const LEGEND_ITEMS = [
  { type: 'exam', label: 'Exam', color: 'bg-[#6C151E]' },
  { type: 'concept', label: 'Concept', color: 'bg-[#854F6C]' },
  { type: 'formula', label: 'Formula', color: 'bg-[#DFB6B2]' },
  { type: 'example', label: 'Example', color: 'bg-[#0F3D3A]' },
  { type: 'story', label: 'Story', color: 'bg-[#2B124C]' },
];

export default function HeatmapTimeline() {
  const { isListening, heatmapMarkers, startTime } = useCaptionStore();
  const [elapsed, setElapsed] = useState(0);

  // Sync elapsed time for the timeline progression with high frequency (200ms) for smooth animation
  useEffect(() => {
    let interval;
    if (isListening) {
      const getStartTime = () => {
        if (startTime) {
          const t = new Date(startTime).getTime();
          if (!isNaN(t)) return t;
        }
        return Date.now();
      };
      const sessionStart = getStartTime();

      const updateElapsed = () => {
        const now = Date.now();
        setElapsed(Math.max(0, (now - sessionStart) / 1000));
      };

      updateElapsed();
      interval = setInterval(updateElapsed, 200);
    } else {
      if (!startTime) {
        setElapsed(0);
      }
    }
    return () => clearInterval(interval);
  }, [isListening, startTime]);

  const formatTime = (seconds) => {
    const sInt = Math.floor(seconds);
    const m = Math.floor(sInt / 60).toString().padStart(2, '0');
    const s = (sInt % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Adaptive timeline window (base: 120s, expands in 60s steps as lecture progresses)
  const maxMarkerTime = heatmapMarkers.length > 0 ? Math.max(...heatmapMarkers.map(m => m.timestamp)) : 0;
  const referenceTime = Math.max(elapsed, maxMarkerTime);
  const totalWindow = Math.max(120, Math.ceil((referenceTime + 30) / 60) * 60);
  const progressPercent = Math.min(100, Math.max(0, (elapsed / totalWindow) * 100));

  const isVisible = isListening || elapsed > 0 || heatmapMarkers.length > 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="w-full"
        >
          <div className="bg-[#2B124C] border-2 border-[#522B5B] p-2.5 md:p-3.5 rounded-2xl shadow-[4px_4px_0px_#000000] flex flex-wrap md:flex-nowrap items-center justify-between gap-3">
            {/* Time Stamp & Total Scale */}
            <div className="text-[#FBE4D8] font-black font-display text-xs md:text-sm whitespace-nowrap flex items-center gap-1.5 shrink-0 px-1">
              <span className="text-[#FBE4D8]">{formatTime(elapsed)}</span>
              <span className="text-[#DFB6B2]/50 text-[10px] font-mono">/ {formatTime(totalWindow)}</span>
            </div>

            {/* Timeline Progress Bar Track */}
            <div className="flex-1 relative h-3 bg-[#190019] border-2 border-[#522B5B] rounded-full mx-1 md:mx-3 min-w-[200px] flex items-center">
              {/* Animated Progress Fill */}
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#6C151E] via-[#854F6C] to-[#DFB6B2] transition-[width] duration-200 ease-linear shadow-[0_0_12px_rgba(223,182,178,0.4)] relative"
                style={{ width: `${progressPercent}%` }}
              >
                {/* Subtle pulse shimmer */}
                {isListening && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse" />
                )}
              </div>

              {/* Glowing Playhead Pin */}
              {isListening && (
                <div 
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-[left] duration-200 ease-linear z-20"
                  style={{ left: `${progressPercent}%` }}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-4 h-4 rounded-full bg-[#DFB6B2]/40 animate-ping" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FBE4D8] border-2 border-[#190019] shadow-[0_0_8px_#FBE4D8]" />
                  </div>
                </div>
              )}

              {/* Heatmap Markers */}
              {heatmapMarkers.map((marker) => {
                const leftPos = Math.min((marker.timestamp / totalWindow) * 100, 99);
                const colorClass = COLOR_MAP[marker.type] || COLOR_MAP.normal;
                const isPassed = elapsed >= marker.timestamp;
                
                return (
                  <div 
                    key={marker.id} 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group z-10" 
                    style={{ left: `${leftPos}%` }}
                  >
                    <motion.div 
                      initial={{ scale: 0, y: 8 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ type: 'spring', damping: 12 }}
                      className={`w-3.5 h-3.5 rounded-full cursor-pointer border-2 border-[#190019] transition-transform hover:scale-150 ${colorClass} ${
                        isPassed ? 'ring-2 ring-white/60 shadow-[0_0_8px_rgba(255,255,255,0.6)]' : 'opacity-80'
                      }`}
                    />
                  
                    {/* Tooltip Card */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:flex flex-col w-52 bg-[#190019] border-2 border-[#522B5B] rounded-xl p-3 shadow-[4px_4px_0px_#000000] z-50 pointer-events-none">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${colorClass} text-white`}>
                          {marker.type}
                        </span>
                        <span className="text-[10px] font-mono text-[#DFB6B2]">
                          {formatTime(marker.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-[#FBE4D8] font-bold mb-0.5 leading-tight">
                        {marker.label}
                      </p>
                      {marker.reason && (
                        <p className="text-[10px] text-[#DFB6B2]/80 leading-tight">
                          {marker.reason}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="hidden lg:flex gap-3 text-[10px] text-[#DFB6B2] font-black uppercase tracking-wider shrink-0">
              {LEGEND_ITEMS.map(item => (
                <div key={item.type} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color} border border-[#190019]`} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
