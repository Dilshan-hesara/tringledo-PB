import React, { useState, useEffect } from 'react';
import { isFullscreen, toggleFullscreen } from '@/lib/utils';

export default function OrientationPrompt() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Check if it's a mobile device (rough check)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (!isMobile) {
        setIsPortrait(false);
        return;
      }
      
      // If height > width, it's portrait
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const handleRotateAndFullscreen = async () => {
    try {
      if (!isFullscreen()) {
        await toggleFullscreen();
      }
      
      if (screen.orientation && (screen.orientation as any).lock) {
        await (screen.orientation as any).lock('landscape').catch((e: any) => {
          console.warn("Orientation lock failed:", e);
        });
      }
    } catch (err) {
      console.error("Fullscreen/Rotation error:", err);
    }
  };

  if (!isPortrait) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/95 scanlines p-8 text-center animate-fade-in">
      <div className="mb-6 animate-bounce">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#00ccff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" transform="rotate(90 12 12)" />
          <path d="M12 15l-3-3 3-3" />
          <path d="M15 12H9" />
        </svg>
      </div>
      <h2 className="font-display text-2xl tracking-widest text-[#00ccff] mb-4" style={{ textShadow: '0 0 10px #00ccff' }}>
        PLEASE ROTATE
      </h2>
      <p className="font-mono-game text-sm text-white/70 max-w-xs leading-relaxed">
        Pansil Breaker is designed for <span className="text-[#00ff88]">LANDSCAPE MODE</span>. 
        Please turn your device sideways to play.
      </p>

      <button 
        onClick={handleRotateAndFullscreen}
        className="mt-8 group relative px-8 py-3 bg-[#00ccff] hover:bg-[#00eeff] text-black font-display font-bold tracking-widest text-sm transition-all active:scale-95 overflow-hidden shadow-[0_0_15px_rgba(0,204,255,0.4)]"
      >
        <span className="relative z-10 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          FORCE ROTATION
        </span>
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[-20deg]" />
      </button>
      
      <p className="mt-4 font-mono-game text-[10px] text-white/30 italic">
        *Full screen requested automatically on click
      </p>
    </div>
  );
}
