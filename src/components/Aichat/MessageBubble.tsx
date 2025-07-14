
import React, { useState } from "react";
import { Copy, Check, FileText, Download, Eye } from "lucide-react";

interface MessageBubbleProps {
  message: { 
    content: string; 
    role: string; 
    timestamp: number;
    document?: File;
  };
  isUser: boolean;
  onDocumentClick?: (document: File) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser, onDocumentClick }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDocumentClick = () => {
    if (message.document && onDocumentClick) {
      onDocumentClick(message.document);
    }
  };

  return (
    <div className="w-full">
      {/* Avatar and message layout */}
      <div className={`flex items-start gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${
          isUser 
            ? "bg-gradient-to-br from-blue-500 to-blue-600" 
            : "bg-gray-800"
        }`}>
          {isUser ? "Y" : "AI"}
        </div>
        
        {/* Message content area */}
        <div className={`flex-1 max-w-none ${isUser ? "flex flex-col items-end" : ""}`}>
          {/* User name/label */}
          <div className={`text-sm font-medium mb-2 ${
            isUser ? "text-gray-700 text-right" : "text-gray-700"
          }`}>
            {isUser ? "You" : "ChatGPT"}
          </div>
          
          {/* Document attachment */}
          {message.document && (
            <div className={`mb-4 ${isUser ? "flex justify-end" : ""}`}>
              <div 
                className="inline-block p-3 bg-gray-50 border border-gray-200 rounded-xl max-w-sm cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 group"
                onClick={handleDocumentClick}
                title="Click to preview document"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {message.document.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(message.document.size)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      className="text-gray-400 hover:text-blue-600 transition-colors group-hover:text-blue-600"
                      title="Preview document"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDocumentClick();
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Download"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Message content */}
          <div className={`group relative ${isUser ? "flex justify-end" : ""}`}>
            <div className={`prose max-w-none ${
              isUser 
                ? "text-gray-800" 
                : "text-gray-800"
            }`}>
              <div className="text-[15px] leading-7 whitespace-pre-line">{message.content}</div>
            </div>
            
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className={`absolute -right-8 top-0 p-1.5 rounded-md transition-all duration-200 ${
                copied 
                  ? "opacity-100 bg-gray-100" 
                  : "opacity-0 group-hover:opacity-100 hover:bg-gray-100"
              }`}
              title="Copy"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs text-gray-400 mt-2 ${isUser ? "text-right" : ""}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: "2-digit", 
              minute: "2-digit" 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
