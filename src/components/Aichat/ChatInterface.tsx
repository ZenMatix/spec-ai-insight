
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
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      return;
    }

    const lastMessage = messages[messages.length - 1];
    const shouldScroll = !lastMessage?.document || lastMessage?.role === "assistant";
    
    if (shouldScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scroll-smooth">
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
      
      {/* Chat input - sticky at bottom */}
      <div className="sticky bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-6 pb-4">
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
