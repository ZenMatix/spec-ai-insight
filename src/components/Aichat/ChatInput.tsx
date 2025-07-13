
import React, { useRef, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";

interface ChatInputProps {
  inputMessage: string;
  onInputChange: (msg: string) => void;
  onSendMessage: () => void;
  onFileUpload: (file: File) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  onInputChange,
  onSendMessage,
  onFileUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate the new height based on content
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 150; // Maximum height in pixels
      const minHeight = 44; // Minimum height in pixels
      
      // Set the height, but cap it at maxHeight
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
      
      // Show scrollbar if content exceeds max height
      textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [inputMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key === "Enter" || e.key === "NumpadEnter") && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value);
  };

  return (
    <div className="flex items-end gap-2 sm:gap-3 max-w-4xl mx-auto px-2 sm:px-0">
      {/* File upload button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex-shrink-0 p-2 sm:p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
        title="Upload document"
      >
        <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.docx,.doc,.txt"
        onChange={handleFileSelect}
      />
      
      {/* Message input container */}
      <div className="flex-1 flex items-end gap-2 sm:gap-3 bg-white border border-gray-300 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 min-h-[44px]">
        <textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Message ChatGPT..."
          className="flex-1 resize-none bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm sm:text-base leading-5 sm:leading-6 py-1"
          style={{ 
            minHeight: '24px',
            maxHeight: '150px',
            height: 'auto'
          }}
        />
        
        {/* Send button */}
        <button
          onClick={onSendMessage}
          disabled={!inputMessage.trim()}
          className="flex-shrink-0 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-600 p-2 rounded-lg transition-colors touch-manipulation"
        >
          <Send className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
