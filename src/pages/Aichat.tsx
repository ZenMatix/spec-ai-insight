import React, { useState } from 'react';
import ChatInterface from "@/components/Aichat/ChatInterface";
import WelcomeScreen from "@/components/Aichat/WelcomeScreen";
import DocumentUploadLoader from "@/components/Aichat/DocumentUploadLoader";
import DocumentPreviewModal from "@/components/Aichat/DocumentPreviewModal";
import LoadingScreen from '@/components/LoadingScreen';
import { useAppLoading } from '@/hooks/useAppLoading';

// Backend API base URL - adjust this to match your backend
const API_BASE_URL = 'http://localhost:3001';

const Aichat = () => {
  const { isLoading } = useAppLoading();
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFileName, setUploadingFileName] = useState('');

  // Store the current document ID for context
  const [currentDocumentId, setCurrentDocumentId] = useState(null);

  // Chat state
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hello! Upload a document and ask me anything about it. I'll help analyze, summarize, and answer your questions.",
      timestamp: Date.now(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Document preview modal state
  const [previewDocument, setPreviewDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);

  // Function to upload file to backend
  const uploadFileToBackend = async (file) => {
    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  // Function to send message to backend with streaming response
  const sendMessageToBackend = async (message, documentId = null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          documentId: documentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      return response;
    } catch (error) {
      console.error('Message error:', error);
      throw error;
    }
  };

  const handleWelcomeFileUpload = async (file) => {
    setUploadingFileName(file.name);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10 + 5;
        });
      }, 200);

      const uploadResult = await uploadFileToBackend(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setShowWelcomeScreen(false);
        handleFileUpload(file, uploadResult);
      }, 500);

    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Failed to upload document: ${error.message}`,
          timestamp: Date.now(),
        },
      ]);
      
      setShowWelcomeScreen(false);
    }
  };

  const handleStartChat = () => {
    setShowWelcomeScreen(false);
  };

  const handleFileUpload = async (file, uploadResult = null) => {
    let result = uploadResult;
    
    if (!result) {
      try {
        result = await uploadFileToBackend(file);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `❌ Failed to upload document: ${error.message}`,
            timestamp: Date.now(),
          },
        ]);
        return;
      }
    }

    setCurrentDocumentId(result.fileId);

    const fileMessage = {
      role: "user",
      content: `Uploaded document: ${file.name}`,
      timestamp: Date.now(),
      document: file,
    };
    setMessages((prev) => [...prev, fileMessage]);
    
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `✅ I've received and processed your document "${file.name}". You can now ask me questions about it or request an analysis!`,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await sendMessageToBackend(inputMessage, currentDocumentId);
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      const assistantMessageId = Date.now();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          timestamp: assistantMessageId,
          isStreaming: true,
        },
      ]);
      
      setIsTyping(false);
      
      let accumulatedContent = "";
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;
        
        setMessages((prev) => 
          prev.map((msg) => 
            msg.timestamp === assistantMessageId
              ? { ...msg, content: accumulatedContent, isStreaming: true }
              : msg
          )
        );
      }
      
      setMessages((prev) => 
        prev.map((msg) => 
          msg.timestamp === assistantMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
      
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Error: ${error.message}`,
          timestamp: Date.now(),
        },
      ]);
    }
  };

  const handleDocumentClick = (document) => {
    setPreviewDocument(document);
    setIsModalOpen(true);
    setZoomLevel(100);
    setCurrentPage(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPreviewDocument(null);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Modern header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">AI Chat</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {isUploading ? (
          <DocumentUploadLoader fileName={uploadingFileName} progress={uploadProgress} />
        ) : showWelcomeScreen ? (
          <WelcomeScreen 
            onFileUpload={handleWelcomeFileUpload} 
            onStartChat={handleStartChat}
          />
        ) : (
          <ChatInterface
            messages={messages}
            inputMessage={inputMessage}
            onInputChange={setInputMessage}
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            onDocumentClick={handleDocumentClick}
            isTyping={isTyping}
          />
        )}
      </div>
      
      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedFile={previewDocument}
        zoomLevel={zoomLevel}
        currentPage={currentPage}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />
    </div>
  );
};

export default Aichat;
