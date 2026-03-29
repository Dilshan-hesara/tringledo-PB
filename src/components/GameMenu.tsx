import React, { useState } from 'react';
import { isFullscreen, toggleFullscreen } from '@/lib/utils';

interface GameMenuProps {
  onExit: () => void;
}

export default function GameMenu({ onExit }: GameMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-[50] flex flex-col items-end gap-2">
      {/* 3 Dots Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex flex-col items-center justify-center gap-1 bg-black/40 border border-[#00ccff]/30 rounded backdrop-blur-sm transition-all hover:bg-[#00ccff]/10"
        style={{ boxShadow: '0 0 10px rgba(0,204,255,0.1)' }}
      >
        <div className="w-1 h-1 bg-[#00ccff] rounded-full" />
        <div className="w-1 h-1 bg-[#00ccff] rounded-full" />
        <div className="w-1 h-1 bg-[#00ccff] rounded-full" />
      </button>

      {/* Menu Box */}
      {isOpen && (
        <div 
          className="flex flex-col gap-1 p-1 bg-black/80 border border-[#00ccff]/40 rounded animate-fade-in min-w-[140px] shadow-2xl backdrop-blur-md"
          onMouseLeave={() => setIsOpen(false)}
        >
          <button
            onClick={async () => {
              await toggleFullscreen();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left font-display text-[10px] tracking-widest text-[#00ccff] hover:bg-[#00ccff]/10 transition-colors flex items-center gap-2"
          >
            <span>⛶</span> FULLSCREEN
          </button>
          
          <div className="h-px bg-[#00ccff]/10 mx-1" />
          
          <button
            onClick={() => {
              setIsOpen(false);
              onExit();
            }}
            className="w-full px-4 py-2 text-left font-display text-[10px] tracking-widest text-[#ff2233] hover:bg-[#ff2233]/10 transition-colors flex items-center gap-2"
          >
            <span>🚪</span> EXIT GAME
          </button>
        </div>
      )}
    </div>
  );
}
