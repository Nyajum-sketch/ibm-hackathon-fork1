import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ParallaxBackground from '../components/layout/ParallaxBackground';

export default function JoinSession() {
  const { sessionId } = useParams();
  const [lines, setLines] = useState([]);
  const [status, setStatus] = useState('connecting'); // 'connecting' | 'live' | 'error'
  const [fontSize, setFontSize] = useState(22); // cycles: 22 -> 28 -> 36 -> 22
  const [elapsed, setElapsed] = useState(0);
  const eventSourceRef = useRef(null);
  const scrollRef = useRef(null);
  const retryTimerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Attempt SSE connection
    const es = new EventSource(`/api/sessions/${sessionId}/stream`);
    eventSourceRef.current = es;

    es.onopen = () => {
      setStatus('live');
    };

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setLines(prev => [...prev, data]);
        setStatus('live');
      } catch (_) {}
    };

    es.onerror = () => {
      es.close();
      eventSourceRef.current = null;
      
      // Fallback to HTTP Polling if SSE fails (e.g. on Vercel Serverless)
      console.log('SSE failed. Falling back to HTTP polling...');
      pollTranscript();
    };
  }, [sessionId]);

  const pollTranscript = useCallback(async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}/stream`);
      if (res.ok) {
        const data = await res.json();
        if (data.transcript) {
          setLines(data.transcript);
          setStatus('live');
        }
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
    // Poll every 2 seconds
    retryTimerRef.current = setTimeout(pollTranscript, 2000);
  }, [sessionId]);

  useEffect(() => {
    connect();
    startTimeRef.current = Date.now();

    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => {
      clearInterval(timer);
      if (eventSourceRef.current) eventSourceRef.current.close();
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, [connect, pollTranscript]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const cycleFontSize = () => {
    setFontSize(prev => prev === 22 ? 28 : prev === 28 ? 36 : 22);
  };

  const formatTimer = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div
      onClick={cycleFontSize}
      className="min-h-screen bg-[#190019] text-[#FBE4D8] flex flex-col select-none relative"
      style={{ fontFamily: '"DM Sans", sans-serif' }}
    >
      <ParallaxBackground />

      {/* Hide scrollbars globally on this page */}
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#2B124C] border-b-2 border-[#522B5B] flex-shrink-0 shadow-[0_2px_0_#000000]">
        <div className="flex items-center gap-2 bg-[#190019] text-[#FBE4D8] px-3 py-1 rounded-full border-2 border-[#522B5B] shadow-[2px_2px_0px_#000000]">
          <span className="font-black text-sm uppercase tracking-wider font-display">
            SIGNIFY<span className="text-[#DFB6B2]">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {status === 'live' && (
            <div className="flex items-center gap-2 px-3 py-1 bg-[#190019] text-[#FBE4D8] rounded-full border-2 border-[#522B5B] shadow-[2px_2px_0px_#000000]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F3D3A]" />
              <span className="text-xs font-black uppercase tracking-wider">Live Stream</span>
            </div>
          )}
          {status === 'error' && (
            <span className="text-xs font-black text-[#FBE4D8] bg-[#6C151E] px-3 py-1 rounded-full border-2 border-[#854F6C]">Reconnecting...</span>
          )}
          {status === 'connecting' && (
            <span className="text-xs font-black text-[#FBE4D8] bg-[#522B5B] px-3 py-1 rounded-full border-2 border-[#854F6C]">Connecting...</span>
          )}
        </div>
      </div>

      {/* Caption stream */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-end gap-5 max-w-4xl w-full mx-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        {lines.length === 0 && (
          <div className="text-center bg-[#2B124C] border-2 border-[#522B5B] rounded-2xl p-8 shadow-[4px_4px_0px_#000000] my-auto">
            <p className="text-[#FBE4D8] text-lg font-black uppercase font-display">Waiting for teacher to speak...</p>
            <p className="text-[#DFB6B2] text-xs font-bold mt-2">Tap anywhere on screen to cycle caption font size</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {lines.map((lineObj, idx) => {
            const age = lines.length - 1 - idx;
            const isLatest = age === 0;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-5 rounded-2xl border-2 transition-all ${
                  isLatest
                    ? 'bg-[#2B124C] text-[#FBE4D8] border-[#DFB6B2] shadow-[4px_4px_0px_#000000]'
                    : 'bg-[#2B124C]/80 text-[#DFB6B2] border-[#522B5B] shadow-[2px_2px_0px_#000000]'
                }`}
              >
                <p style={{ fontSize: `${fontSize}px`, lineHeight: 1.5, fontWeight: isLatest ? 800 : 700 }}>
                  {lineObj.line}
                </p>
                {lineObj.translated && lineObj.translated !== lineObj.line && (
                  <p 
                    className="border-t-2 border-[#522B5B] pt-2 mt-2 font-bold text-[#DFB6B2]"
                    style={{ fontSize: `${Math.max(14, fontSize - 6)}px`, lineHeight: 1.4 }}
                  >
                    Subtitles: {lineObj.translated}
                  </p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#2B124C] border-t-2 border-[#522B5B] flex-shrink-0">
        <span className="text-xs font-black uppercase text-[#DFB6B2]">
          POWERED BY SIGNIFY AI
        </span>
        <span className="text-xs font-mono font-black text-[#FBE4D8] bg-[#522B5B] border-2 border-[#854F6C] px-3 py-1 rounded-full shadow-[2px_2px_0px_#000000]">
          {formatTimer(elapsed)}
        </span>
      </div>
    </div>
  );
}
