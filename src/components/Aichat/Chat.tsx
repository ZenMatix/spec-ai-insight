
import React, { useRef, useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { Send } from "lucide-react";

interface ChatProps {
  messages: Array<{ content: string; role: string; timestamp: number }>;
  inputMessage: string;
  onInputChange: (msg: string) => void;
  onSendMessage: () => void;
  isTyping: boolean;
}

const Chat: React.FC<ChatProps> = ({
  messages,
  inputMessage,
  onInputChange,
  onSendMessage,
  isTyping,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key === "Enter" || e.key === "NumpadEnter") && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto px-3 py-4 bg-gradient-to-br from-white/60 to-blue-50 rounded-b-none rounded-t-2xl space-y-4 custom-scrollbar">
        {messages.map((m, idx) => (
          <MessageBubble key={idx} message={m} isUser={m.role === "user"} />
        ))}
        {isTyping && (
          <div className="flex justify-start mt-1">
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 bg-white/85 rounded-b-2xl flex items-center gap-3 border-t">
        <textarea
          value={inputMessage}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question…"
          rows={1}
          className="flex-1 resize-none rounded-xl px-4 py-3 bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 placeholder-gray-400 min-h-[44px] max-h-[120px] text-sm border border-blue-100 shadow"
          aria-label="Type your message"
        />
        <button
          type="button"
          onClick={onSendMessage}
          disabled={!inputMessage.trim()}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-400 border-0 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition hover:scale-105"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
