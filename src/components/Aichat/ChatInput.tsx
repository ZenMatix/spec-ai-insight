
import React, { useRef } from "react";
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

  return (
    <div className="flex items-end gap-3 max-w-4xl mx-auto">
      {/* File upload button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex-shrink-0 p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        title="Upload document"
      >
        <Paperclip className="w-5 h-5" />
      </button>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.docx,.doc,.txt"
        onChange={handleFileSelect}
      />
      
      {/* Message input */}
      <div className="flex-1 flex items-end gap-3 bg-white border border-gray-300 rounded-2xl px-4 py-3 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <textarea
          value={inputMessage}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message ChatGPT..."
          rows={1}
          className="flex-1 resize-none bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none min-h-[24px] max-h-[200px] text-base"
          style={{ 
            overflowY: inputMessage.split('\n').length > 3 ? 'auto' : 'hidden'
          }}
        />
        
        {/* Send button */}
        <button
          onClick={onSendMessage}
          disabled={!inputMessage.trim()}
          className="flex-shrink-0 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-600 p-2 rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
