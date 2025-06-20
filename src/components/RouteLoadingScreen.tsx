
import React, { useState, useEffect } from 'react';

const RouteLoadingScreen = () => {
  const [fadeClass, setFadeClass] = useState('opacity-0');

  useEffect(() => {
    const fadeInTimer = setTimeout(() => {
      setFadeClass('opacity-100');
    }, 50);

    return () => clearTimeout(fadeInTimer);
  }, []);

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-40 transition-opacity duration-300 ${fadeClass}`}
      style={{
        backgroundImage: 'url(/Header.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex flex-col items-center space-y-4 max-w-sm mx-auto px-6 text-center">
        {/* Loading Animation - Spinning Dots */}
        <div className="flex space-x-2 mb-4">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Loading Message */}
        <p className="text-white text-lg font-medium font-inter drop-shadow-md">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default RouteLoadingScreen;
