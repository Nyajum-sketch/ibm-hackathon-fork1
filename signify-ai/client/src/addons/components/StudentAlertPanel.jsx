import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Volume2, ShieldAlert, CheckCircle, Smartphone, Vibrate, X } from 'lucide-react';
import { useAddons } from '../context/AddonsContext';

const VIBRATION_PATTERNS = {
  NAME_CALLED: [200, 100, 200],
  QUESTION_ASKED: [100, 50, 100],
  NEW_TOPIC: [150],
  EMERGENCY: [500, 200, 500, 200, 500]
};

export default function StudentAlertPanel() {
  const { activeAlerts, emergencyAlert, acknowledgeAlert, alertPreferences, activeSession } = useAddons();
  const [vibrationSupported, setVibrationSupported] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [screenFlash, setScreenFlash] = useState(false);
  const audioRef = useRef(null);
  const emergencyIntervalRef = useRef(null);

  // Check navigator.vibrate support & initialize sound
  useEffect(() => {
    setVibrationSupported('vibrate' in navigator);
    audioRef.current = new Audio('/notification.wav');
  }, []);

  // Screen Wake Lock API during active session
  useEffect(() => {
    let wakeLock = null;
    if (activeSession && 'wakeLock' in navigator && alertsEnabled) {
      navigator.wakeLock.request('screen')
        .then(wl => {
          wakeLock = wl;
          setWakeLockActive(true);
        })
        .catch(() => setWakeLockActive(false));
    }
    return () => {
      if (wakeLock) {
        wakeLock.release().catch(() => {});
        setWakeLockActive(false);
      }
    };
  }, [activeSession, alertsEnabled]);

  // Trigger vibration, sound & visual flash when alert arrives
  const triggerAlertFeedback = (type) => {
    const pattern = VIBRATION_PATTERNS[type] || [200];

    // 1. Vibration
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }

    // 2. Audio Notification Sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    // 3. Screen Flash (Respects prefers-reduced-motion)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      setScreenFlash(true);
      setTimeout(() => setScreenFlash(false), 300);
    }
  };

  // Process incoming non-emergency alerts
  useEffect(() => {
    if (activeAlerts.length > 0) {
      const latest = activeAlerts[0];
      if (alertPreferences[latest.type] !== false) {
        triggerAlertFeedback(latest.type);
      }
    }
  }, [activeAlerts]);

  // Process Emergency Alert (repeats feedback until acknowledged)
  useEffect(() => {
    if (emergencyAlert) {
      triggerAlertFeedback('EMERGENCY');
      emergencyIntervalRef.current = setInterval(() => {
        triggerAlertFeedback('EMERGENCY');
      }, 3000);
    } else {
      if (emergencyIntervalRef.current) {
        clearInterval(emergencyIntervalRef.current);
        emergencyIntervalRef.current = null;
      }
    }
    return () => {
      if (emergencyIntervalRef.current) {
        clearInterval(emergencyIntervalRef.current);
      }
    };
  }, [emergencyAlert]);

  const enableAlertsHandler = () => {
    setAlertsEnabled(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  // Cap floating alerts feed to max 2 recent items to prevent upward clipping
  const visibleAlerts = activeAlerts.slice(0, 2);

  const alertPanelJSX = (
    <>
      {/* Gentle Screen Flash overlay */}
      <AnimatePresence>
        {screenFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[9998] pointer-events-none bg-accent-coral/30"
          />
        )}
      </AnimatePresence>

      {/* Emergency Full-Screen Banner Overlay via Portal */}
      <AnimatePresence>
        {emergencyAlert && (
          <div className="fixed inset-0 z-[9999] overflow-y-auto bg-red-950/95 backdrop-blur-xl">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-[#2B124C] border-4 border-[#6C151E] p-6 sm:p-8 text-left align-middle shadow-2xl transition-all my-8 text-[#FBE4D8] text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-[#6C151E]/20 text-[#DFB6B2] mx-auto flex items-center justify-center border-2 border-[#6C151E]/60">
                  <ShieldAlert className="w-12 h-12" />
                </div>

                <div>
                  <span className="px-3.5 py-1 rounded-full bg-[#6C151E] text-white font-mono text-xs font-black uppercase tracking-widest">
                    CRITICAL EMERGENCY ALERT
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-display text-[#DFB6B2] mt-3 leading-tight">
                    {emergencyAlert.message || 'EMERGENCY IN CLASSROOM'}
                  </h2>
                  <p className="text-xs text-[#DFB6B2] mt-2 font-bold">
                    Issued by instructor • Follow classroom emergency instructions immediately
                  </p>
                </div>

                {/* Acknowledge Button */}
                <button
                  onClick={() => acknowledgeAlert(emergencyAlert.id)}
                  className="w-full py-4 px-6 bg-[#6C151E] hover:bg-[#854F6C] text-white font-black text-base rounded-2xl shadow-xl shadow-[#6C151E]/40 flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle className="w-6 h-6" />
                  <span>ACKNOWLEDGE EMERGENCY</span>
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Active Alerts & Enable Banner */}
      <div className="fixed bottom-4 right-4 z-[9990] max-w-sm sm:max-w-md w-full px-4 space-y-2 pointer-events-none max-h-[50vh] overflow-hidden">
        
        {/* Session Join Enable Alerts Card */}
        {activeSession && !alertsEnabled && (
          <div className="pointer-events-auto p-3.5 rounded-2xl bg-[#2B124C] border-2 border-[#522B5B] shadow-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#522B5B] text-[#FBE4D8] border border-[#854F6C] shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-black text-[#FBE4D8]">Enable Haptic & Audio Alerts</h4>
                <p className="text-[10px] text-[#DFB6B2] font-bold">
                  {vibrationSupported ? 'Vibration & sound ready' : 'Fallback visual flash & sound active'}
                </p>
              </div>
            </div>
            <button
              onClick={enableAlertsHandler}
              className="px-3 py-1.5 bg-[#522B5B] text-[#FBE4D8] font-black rounded-xl text-xs hover:bg-[#854F6C] border border-[#854F6C] transition-colors shrink-0"
            >
              Enable
            </button>
          </div>
        )}

        {/* Regular Alerts Feed (Capped to max 2 visible) */}
        <AnimatePresence>
          {visibleAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="pointer-events-auto p-3.5 rounded-2xl bg-[#2B124C] border-2 border-[#522B5B] shadow-2xl text-[#FBE4D8] space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#522B5B] text-[#FBE4D8] border border-[#854F6C] shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-black uppercase tracking-wider text-[#DFB6B2]">
                      {alert.type.replace('_', ' ')}
                    </span>
                    <h4 className="text-xs font-black text-[#FBE4D8] leading-snug">{alert.message}</h4>
                  </div>
                </div>

                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-elevated shrink-0"
                  aria-label="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-text-secondary border-t border-border-subtle">
                <span className="flex items-center gap-1 font-mono">
                  {vibrationSupported ? <Vibrate className="w-3 h-3 text-accent-teal" /> : <Volume2 className="w-3 h-3 text-accent-coral" />}
                  <span>{vibrationSupported ? 'Vibrated' : 'Sound & Flash'}</span>
                </span>
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="px-2.5 py-0.5 bg-accent-teal/20 hover:bg-accent-teal/30 text-accent-teal font-bold rounded-lg transition-colors"
                >
                  Acknowledge
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );

  return ReactDOM.createPortal(alertPanelJSX, document.body);
}
