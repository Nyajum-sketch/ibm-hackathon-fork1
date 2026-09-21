import React from 'react';
import { Lottie } from 'lottie-react';
import waveformAnimation from '../../assets/waveform-lottie.json';

export default function LottieWaveform({ className = 'w-16 h-8', isPlaying = true }) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <Lottie
        animationData={waveformAnimation}
        loop={isPlaying}
        autoplay={isPlaying}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
