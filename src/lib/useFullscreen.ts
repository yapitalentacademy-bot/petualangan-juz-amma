import { useState, useEffect } from 'react';

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        Boolean(
          document.fullscreenElement ||
            // @ts-expect-error - vendor prefixes
            document.webkitFullscreenElement ||
            // @ts-expect-error - vendor prefixes
            document.mozFullScreenElement ||
            // @ts-expect-error - vendor prefixes
            document.msFullscreenElement
        )
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
          // @ts-expect-error - vendor prefixes
        } else if (elem.webkitRequestFullscreen) {
          // @ts-expect-error - vendor prefixes
          await elem.webkitRequestFullscreen();
          // @ts-expect-error - vendor prefixes
        } else if (elem.msRequestFullscreen) {
          // @ts-expect-error - vendor prefixes
          await elem.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          // @ts-expect-error - vendor prefixes
        } else if (document.webkitExitFullscreen) {
          // @ts-expect-error - vendor prefixes
          await document.webkitExitFullscreen();
          // @ts-expect-error - vendor prefixes
        } else if (document.msExitFullscreen) {
          // @ts-expect-error - vendor prefixes
          await document.msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  return { isFullscreen, toggleFullscreen };
}
