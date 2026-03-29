import React, { useState, useEffect } from 'react';

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
    </div>
  );
}
