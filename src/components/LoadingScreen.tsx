
import React, { useState, useEffect } from "react";

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeClass, setFadeClass] = useState("opacity-0");

  useEffect(() => {
    // Fade in animation
    const fadeInTimer = setTimeout(() => {
      setFadeClass("opacity-100");
    }, 50);

    return () => clearTimeout(fadeInTimer);
  }, []);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[9999] transition-opacity duration-500 ${fadeClass}`}
      style={{
        backgroundImage:
          "url(https://qicraxjvaycdzyntnxtz.supabase.co/storage/v1/object/public/vdospec/Header.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex flex-col items-center space-y-6 max-w-sm mx-auto px-6 text-center">
        {/* VdoSpec Logo/Brand */}
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg font-inter">
            VdoSpec
          </h1>
          <p className="text-white/90 text-base md:text-lg drop-shadow-md font-inter">
            AI Document Intelligence
          </p>
        </div>

        {/* Loading Animation - Spinning Dots */}
        <div className="flex space-x-2 mb-6">
          <div
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>

        {/* Loading Message */}
        <div className="text-center">
          <p className="text-white text-lg md:text-xl font-medium font-inter drop-shadow-md">
            Analyzing Specs with AI… Please wait.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
