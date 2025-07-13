
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
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} w-full group`}>
      <div className="max-w-[80%] lg:max-w-3xl">
        {/* Avatar and content container */}
        <div className={`flex items-start gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          {/* Modern Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-sm ${
            isUser 
              ? "bg-gradient-to-br from-blue-500 to-blue-600" 
              : "bg-gradient-to-br from-gray-800 to-gray-900"
          }`}>
            {isUser ? "Y" : "AI"}
          </div>
          
          <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} flex-1`}>
            {/* Document attachment */}
            {message.document && (
              <div 
                className="mb-3 p-4 bg-white border border-gray-200 rounded-xl max-w-sm cursor-pointer hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 group/doc"
                onClick={handleDocumentClick}
                title="Click to preview document"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {message.document.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(message.document.size)}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover/doc:opacity-100 transition-opacity">
                    <button 
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                      title="Preview document"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDocumentClick();
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all"
                      title="Download"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Message content */}
            <div className={`relative rounded-2xl px-4 py-3 max-w-full ${
              isUser 
                ? "bg-blue-600 text-white" 
                : "bg-white border border-gray-200 text-gray-900 shadow-sm"
            }`}>
              <div className="text-sm leading-relaxed whitespace-pre-line break-words">
                {message.content}
              </div>
              
              {/* Message actions - shown on hover */}
              <div className={`flex items-center justify-between mt-2 pt-2 border-t ${
                isUser ? "border-blue-500/30" : "border-gray-100"
              } opacity-0 group-hover:opacity-100 transition-opacity`}>
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
                  className={`p-1.5 rounded-md transition-all ${
                    copied 
                      ? "opacity-100" 
                      : "opacity-60 hover:opacity-100"
                  } ${
                    isUser 
                      ? "hover:bg-blue-700 text-blue-100" 
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                  title="Copy message"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
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
