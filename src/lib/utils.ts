import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isFullscreen = () => {
  return !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
};

export const toggleFullscreen = async () => {
  try {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = ('standalone' in window.navigator) && (window.navigator as any).standalone;

    if (!isFullscreen()) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      }
      return true;
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      }
      return false;
    }
  } catch (e) {
    console.error("Fullscreen toggle failed", e);
    return false;
  }
};
