
import React, { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

interface ChatInterfaceProps {
  messages: Array<{ 
    content: string; 
    role: string; 
    timestamp: number;
    document?: File;
  }>;
  inputMessage: string;
  onInputChange: (msg: string) => void;
  onSendMessage: () => void;
  onFileUpload: (file: File) => void;
  onDocumentClick?: (document: File) => void;
  isTyping: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  inputMessage,
  onInputChange,
  onSendMessage,
  onFileUpload,
  onDocumentClick,
  isTyping,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Skip auto-scroll on initial render/page load
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      return;
    }

    // Only auto-scroll for non-document messages and AI responses
    const lastMessage = messages[messages.length - 1];
    const shouldScroll = !lastMessage?.document || lastMessage?.role === "assistant";
    
    if (shouldScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((message, idx) => (
          <MessageBubble 
            key={idx} 
            message={message} 
            isUser={message.role === "user"} 
            onDocumentClick={onDocumentClick}
          />
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat input */}
      <div className="border-t border-gray-200 p-4">
        <ChatInput
          inputMessage={inputMessage}
          onInputChange={onInputChange}
          onSendMessage={onSendMessage}
          onFileUpload={onFileUpload}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
