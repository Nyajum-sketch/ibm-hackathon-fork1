import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * EyeTrackingBot Component
 * - The bot image is completely static (does not move, tilt, or bob)
 * - Only the bot's eyes move to follow the user's cursor
 * - The 'Signify Bob' speech bubble reveals when Bob is clicked and automatically disappears after 2 seconds
 */
export default function EyeTrackingBot({ className = '' }) {
  const [currentFrame, setCurrentFrame] = useState('/bot-frames/up_left.png');
  const [isRevealed, setIsRevealed] = useState(false);
  const botRef = useRef(null);
  const timerRef = useRef(null);

  // Preload all 4 cutout frames on mount for instant zero-lag switching
  useEffect(() => {
    const frames = [
      '/bot-frames/up_left.png',
      '/bot-frames/up_right.png',
      '/bot-frames/left.png',
      '/bot-frames/right.png'
    ];
    frames.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!botRef.current) return;
      const rect = botRef.current.getBoundingClientRect();
      const botCenterX = rect.left + rect.width / 2;
      const botCenterY = rect.top + rect.height * 0.45; // eye height

      const deltaX = e.clientX - botCenterX;
      const deltaY = e.clientY - botCenterY;

      if (deltaX < 0) {
        // Left side of the bot
        if (deltaY < -15) {
          setCurrentFrame('/bot-frames/up_left.png');
        } else {
          setCurrentFrame('/bot-frames/left.png');
        }
      } else {
        // Right side of the bot
        if (deltaY < -15) {
          setCurrentFrame('/bot-frames/up_right.png');
        } else {
          setCurrentFrame('/bot-frames/right.png');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleClick = (e) => {
    if (e) e.stopPropagation();

    // 1. Reveal the 'Signify Bob' text bubble
    setIsRevealed(true);

    // 2. Disappear after 2 seconds
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsRevealed(false);
    }, 2000);
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble: reveals on click and disappears after 2 seconds */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 10 }}
            transition={{ type: 'spring', stiffness: 450, damping: 24 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 pointer-events-auto"
          >
            <button
              type="button"
              onClick={handleClick}
              className="beautiful-button flex items-center justify-center gap-2"
              title="Signify Bob"
            >
              <span>Signify Bob</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bot Robot: Completely stationary, does NOT move, only eyes follow cursor */}
      <div 
        ref={botRef}
        onClick={handleClick}
        className="cursor-pointer relative pointer-events-auto"
        title="Click me: Signify Bob!"
      >
        <img
          src={currentFrame}
          alt="Signify Bob"
          className="w-20 sm:w-24 md:w-28 lg:w-32 h-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
          draggable={false}
        />
      </div>
    </div>
  );
}
