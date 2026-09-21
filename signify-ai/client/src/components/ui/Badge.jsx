import React from 'react';

export default function Badge({
  children,
  variant = 'language', // live | language | count
  className = ''
}) {
  const baseStyles = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2 border-[#522B5B]';
  
  const variants = {
    live: 'bg-[#2B124C] text-[#FBE4D8] shadow-[2px_2px_0px_#000000]',
    language: 'bg-[#522B5B] text-[#FBE4D8] border-[#854F6C] shadow-[2px_2px_0px_#000000]',
    count: 'bg-[#522B5B] text-[#FBE4D8] border-[#854F6C] shadow-[2px_2px_0px_#000000]',
    yellow: 'bg-[#DFB6B2] text-[#190019] border-[#DFB6B2] shadow-[2px_2px_0px_#000000]',
    white: 'bg-[#2B124C] text-[#FBE4D8] border-[#522B5B] shadow-[2px_2px_0px_#000000]',
    black: 'bg-[#190019] text-[#FBE4D8] border-[#522B5B] shadow-[2px_2px_0px_#000000]',
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.white} ${className}`}>
      {variant === 'live' && (
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6C151E]"></span>
        </span>
      )}
      {children}
    </span>
  );
}
