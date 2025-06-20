
import { useState, useEffect } from 'react';

export const useAppLoading = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBackgroundImage = () => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Still resolve on error to not block the app
        img.src = '/Header.jpg';
      });
    };

    const loadFonts = () => {
      return new Promise<void>((resolve) => {
        // Check if Inter font is loaded
        if (document.fonts) {
          document.fonts.ready.then(() => resolve());
        } else {
          // Fallback for browsers that don't support document.fonts
          setTimeout(resolve, 100);
        }
      });
    };

    const loadApp = async () => {
      const startTime = Date.now();
      
      // Wait for all critical assets to load
      await Promise.all([
        loadBackgroundImage(),
        loadFonts()
      ]);
      
      // Ensure minimum loading time of 800ms for smooth UX
      const elapsedTime = Date.now() - startTime;
      const minLoadTime = 800;
      
      if (elapsedTime < minLoadTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsedTime));
      }
      
      setIsLoading(false);
    };

    loadApp();
  }, []);

  return { isLoading };
};
