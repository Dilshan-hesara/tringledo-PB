import React, { useState, useEffect } from 'react';
import { Smartphone, RefreshCw } from 'lucide-react';

export default function OrientationPrompt() {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (!isMobile) {
        setIsLandscape(false);
        return;
      }
      
      // If width > height, it's landscape
      setIsLandscape(window.innerWidth > window.innerHeight);
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
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      
      if (screen.orientation && (screen.orientation as any).lock) {
        await (screen.orientation as any).lock('portrait').catch((e: any) => {
          console.warn("Orientation lock failed:", e);
        });
      }
    } catch (err) {
      console.error("Fullscreen/Rotation error:", err);
    }
  };

  if (!isLandscape) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center p-6 text-center scanlines"
         style={{ background: 'rgba(5, 0, 10, 0.95)', backdropFilter: 'blur(10px)' }}>
      
      <div className="relative mb-8 animate-pulse">
        <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full" />
        <Smartphone className="w-20 h-20 text-cyan-400 rotate-0" />
        <RefreshCw className="absolute -top-4 -right-4 w-10 h-10 text-pink-500 animate-spin-slow" />
      </div>

      <h2 className="font-display text-4xl mb-4 tracking-[0.2em] text-white" 
          style={{ textShadow: '0 0 20px rgba(0,204,255,0.5)' }}>
        PLEASE ROTATE
      </h2>
      
      <p className="font-mono-game text-cyan-300/80 mb-8 max-w-xs leading-relaxed">
        PANSIL BREAKER I IS OPTIMIZED FOR <span className="text-pink-400 font-bold">PORTRAIT</span> MODE.
      </p>

      <button
        onClick={handleRotateAndFullscreen}
        className="px-8 py-3 bg-cyan-500/10 border-2 border-cyan-500 text-cyan-400 font-display tracking-widest hover:bg-cyan-500/20 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,204,255,0.2)]"
      >
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[-20deg]" />
      </button>
      
      <p className="mt-4 font-mono-game text-[10px] text-white/30 italic">
        *Full screen requested automatically on click
      </p>
    </div>
  );
}
