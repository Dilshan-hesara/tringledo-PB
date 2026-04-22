import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useViewport() {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    scale: 1,
    isMobile: window.innerWidth < MOBILE_BREAKPOINT,
    safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < MOBILE_BREAKPOINT;

      // Base logical resolution width parameter
      // Ensure the player sees enough of the game world regardless of device aspect ratio.
      // E.g., on mobile portrait, width is small so scale is reduced to show 800 logical pixels.
      const targetLogicalWidth = isMobile ? (height > width ? 800 : 1200) : 1600;
      let scale = width / targetLogicalWidth;
      
      // Keep scale in bounds to avoid distorted zoom levels
      scale = Math.max(0.4, Math.min(scale, 2.0));

      const rootStyle = getComputedStyle(document.documentElement);
      const top = parseInt(rootStyle.getPropertyValue('--sa-top')) || 0;
      const right = parseInt(rootStyle.getPropertyValue('--sa-right')) || 0;
      const bottom = parseInt(rootStyle.getPropertyValue('--sa-bottom')) || 0;
      const left = parseInt(rootStyle.getPropertyValue('--sa-left')) || 0;

      setViewport({
        width,
        height,
        scale,
        isMobile,
        safeAreaInsets: { top, right, bottom, left }
      });
    };

    window.addEventListener('resize', handleResize);
    // Timeout added to let CSS variables parse on initial load
    setTimeout(handleResize, 0);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
}

export function useIsMobile() {
  return useViewport().isMobile;
}
