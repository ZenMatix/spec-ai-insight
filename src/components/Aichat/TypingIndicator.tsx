
import React from "react";

const TypingIndicator = () => (
  <div className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/90 text-gray-700 shadow min-w-[105px]">
    <div className="flex space-x-1">
      <span className="block w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
      <span className="block w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "120ms" }}></span>
      <span className="block w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "240ms" }}></span>
    </div>
    <span className="text-xs ml-2">AI is typing…</span>
  </div>
);

export default TypingIndicator;
