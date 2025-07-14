
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
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}>
      <div className="max-w-3xl">
        {/* Avatar */}
        <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
            isUser 
              ? "bg-green-600" 
              : "bg-black"
          }`}>
            {isUser ? "U" : "AI"}
          </div>
          
          <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
            {/* Document attachment */}
            {message.document && (
              <div 
                className="mb-2 p-3 bg-gray-50 border border-gray-200 rounded-lg max-w-sm cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 group"
                onClick={handleDocumentClick}
                title="Click to preview document"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0" />
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
            )}
            
            {/* Message content with group hover for copy button */}
            <div className={`group rounded-lg px-4 py-3 ${
              isUser 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 text-gray-900"
            }`}>
              <div className="text-sm whitespace-pre-line">{message.content}</div>
              
              {/* Message actions */}
              <div className="flex mt-2 items-center justify-between">
                <span className={`text-xs ${
                  isUser ? "text-blue-100" : "text-gray-500"
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: "2-digit", 
                    minute: "2-digit" 
                  })}
                </span>
                <button
                  onClick={handleCopy}
                  className={`ml-3 p-1 rounded transition-all duration-200 ${
                    copied 
                      ? "opacity-100" 
                      : "opacity-0 group-hover:opacity-100"
                  } ${
                    isUser ? "hover:bg-blue-700" : "hover:bg-gray-200"
                  }`}
                  title="Copy"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
