import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import BanterLoader from '../ui/BanterLoader';

export default function RyloAvatarViewer({ isSigning, targetSignLang = 'ASL' }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  return (
    <div className="w-full h-full min-h-[380px] relative overflow-hidden rounded-xl bg-[#190019] flex flex-col justify-between border border-[#522B5B] select-none">
      
      {/* Background/Embedded Rylo Webpage with CSS Crop (focuses solely on the avatar character) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#190019]">
        <iframe
          src="https://rylo.com/sign/translate/"
          title="Rylo Sign Avatar Engine"
          onLoad={() => setIframeLoaded(true)}
          onError={() => setIframeError(true)}
          className="absolute border-0 pointer-events-auto transition-opacity duration-500"
          style={{
            width: '185%',
            height: '145%',
            top: '-15%',
            left: '-46%',
            opacity: iframeLoaded ? 1 : 0.4,
          }}
          allow="camera; microphone; autoplay; clipboard-write; encrypted-media"
        />
      </div>

      {/* Top Banner Overlay Badge */}
      <div className="relative z-20 p-3.5 flex items-center justify-between bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
          <span className={`w-2.5 h-2.5 rounded-full ${isSigning ? 'bg-[#0F3D3A]' : 'bg-[#DFB6B2]'}`} />
          <span className="text-[11px] font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DFB6B2]" />
            Rylo Sign Engine ({targetSignLang})
          </span>
        </div>
      </div>

      {/* Center Loading Indicator */}
      {!iframeLoaded && !iframeError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm text-center p-6 space-y-4 pointer-events-none">
          <BanterLoader boxColor="#DFB6B2" />
          <p className="text-xs font-bold text-white tracking-wide">Initializing Rylo Avatar Engine...</p>
          <p className="text-[10px] text-[#DFB6B2]">Rendering sign language visualizer</p>
        </div>
      )}

    </div>
  );
}
