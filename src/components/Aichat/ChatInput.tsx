
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
    <div className="relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.docx,.doc,.txt"
        onChange={handleFileSelect}
      />
      
      {/* Main input container */}
      <div className="relative bg-white border border-gray-200 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-200 focus-within:shadow-xl">
        {/* Input area */}
        <div className="flex items-end px-4 py-3 gap-3">
          {/* File upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Upload document"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Message ChatGPT..."
            className="flex-1 resize-none bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-base leading-6 py-2 max-h-[120px]"
            style={{ 
              minHeight: '28px',
              height: 'auto'
            }}
          />
          
          {/* Send button */}
          <button
            onClick={onSendMessage}
            disabled={!inputMessage.trim()}
            className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
              inputMessage.trim() 
                ? "bg-gray-800 hover:bg-gray-900 text-white shadow-sm hover:shadow-md" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
