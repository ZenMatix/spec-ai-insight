// import React, { useState } from 'react';
// import ChatInterface from "@/components/Aichat/ChatInterface";
// import WelcomeScreen from "@/components/Aichat/WelcomeScreen";
// import DocumentUploadLoader from "@/components/Aichat/DocumentUploadLoader";
// import DocumentPreviewModal from "@/components/Aichat/DocumentPreviewModal";
// import GetStartedFooter from "@/components/GetStartedFooter";
// import LoadingScreen from '@/components/LoadingScreen';
// import { useAppLoading } from '@/hooks/useAppLoading';

// // Main Aichat Component with welcome screen and chat interface
// const Aichat = () => {
//   const { isLoading } = useAppLoading();
//   const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploadingFileName, setUploadingFileName] = useState('');

//   // Main Aichat Component with ChatGPT-like interface
//   const [messages, setMessages] = useState<Array<{
//     role: string;
//     content: string;
//     timestamp: number;
//     document?: File;
//   }>>([
//     {
//       role: "assistant",
//       content: "👋 Hello! Upload a document and ask me anything about it. I'll help analyze, summarize, and answer your questions.",
//       timestamp: Date.now(),
//     },
//   ]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
  
//   // Document preview modal state
//   const [previewDocument, setPreviewDocument] = useState<File | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [zoomLevel, setZoomLevel] = useState(100);
//   const [currentPage, setCurrentPage] = useState(1);

//   const handleWelcomeFileUpload = (file: File) => {
//     setUploadingFileName(file.name);
//     setIsUploading(true);
//     setUploadProgress(0);

//     // Simulate upload progress
//     const progressInterval = setInterval(() => {
//       setUploadProgress(prev => {
//         if (prev >= 100) {
//           clearInterval(progressInterval);
//           setTimeout(() => {
//             setIsUploading(false);
//             setShowWelcomeScreen(false);
//             handleFileUpload(file);
//           }, 500);
//           return 100;
//         }
//         return prev + Math.random() * 15 + 5;
//       });
//     }, 200);
//   };

//   const handleStartChat = () => {
//     setShowWelcomeScreen(false);
//   };

//   const handleFileUpload = (file: File) => {
//     const fileMessage = {
//       role: "user",
//       content: `Uploaded document: ${file.name}`,
//       timestamp: Date.now(),
//       document: file,
//     };
//     setMessages((prev) => [...prev, fileMessage]);
    
//     // Add AI response about the uploaded file
//     setTimeout(() => {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: `✅ I've received your document "${file.name}". You can now ask me questions about it or request an analysis!`,
//           timestamp: Date.now(),
//         },
//       ]);
//     }, 1000);
//   };

//   const handleSendMessage = () => {
//     if (!inputMessage.trim()) return;
    
//     const userMessage = {
//       role: "user",
//       content: inputMessage,
//       timestamp: Date.now(),
//     };
//     setMessages((prev) => [...prev, userMessage]);
//     setInputMessage("");
//     setIsTyping(true);

//     setTimeout(() => {
//       setIsTyping(false);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: `Here's an AI-generated response to: "${userMessage.content}"`,
//           timestamp: Date.now(),
//         },
//       ]);
//     }, Math.random() * 1200 + 1000);
//   };

//   const handleDocumentClick = (document: File) => {
//     setPreviewDocument(document);
//     setIsModalOpen(true);
//     setZoomLevel(100);
//     setCurrentPage(1);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setPreviewDocument(null);
//   };

//   const handleZoomIn = () => {
//     setZoomLevel(prev => Math.min(prev + 25, 200));
//   };

//   const handleZoomOut = () => {
//     setZoomLevel(prev => Math.max(prev - 25, 50));
//   };

//   const handleNextPage = () => {
//     setCurrentPage(prev => prev + 1);
//   };

//   const handlePrevPage = () => {
//     setCurrentPage(prev => Math.max(prev - 1, 1));
//   };

//   if (isLoading) {
//     return <LoadingScreen />;
//   }

//   return (
//     <div 
//       className="min-h-screen flex flex-col relative"
//       style={{
//         backgroundImage: 'url(/Header.jpg)',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat',
//         backgroundAttachment: 'fixed'
//       }}
//     >
//       {/* Main content area */}
//       <div className="relative z-10 pt-24 sm:pt-32 flex-1 flex flex-col">
//         <div className="flex-1 flex justify-center">
//           <div className="w-full max-w-4xl mx-auto px-4">
//             {isUploading ? (
//               <DocumentUploadLoader fileName={uploadingFileName} progress={uploadProgress} />
//             ) : showWelcomeScreen ? (
//               <WelcomeScreen 
//                 onFileUpload={handleWelcomeFileUpload} 
//                 onStartChat={handleStartChat}
//               />
//             ) : (
//               <ChatInterface
//                 messages={messages}
//                 inputMessage={inputMessage}
//                 onInputChange={setInputMessage}
//                 onSendMessage={handleSendMessage}
//                 onFileUpload={handleFileUpload}
//                 onDocumentClick={handleDocumentClick}
//                 isTyping={isTyping}
//               />
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* Document Preview Modal */}
//       <DocumentPreviewModal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         selectedFile={previewDocument}
//         zoomLevel={zoomLevel}
//         currentPage={currentPage}
//         onZoomIn={handleZoomIn}
//         onZoomOut={handleZoomOut}
//         onNextPage={handleNextPage}
//         onPrevPage={handlePrevPage}
//       />
      
//       {/* Footer with proper spacing */}
//       <div className="relative z-10 mt-16">
//         <GetStartedFooter />
//       </div>
//     </div>
//   );
// };

// export default Aichat;






import React, { useState } from 'react';
import ChatInterface from "@/components/Aichat/ChatInterface";
import WelcomeScreen from "@/components/Aichat/WelcomeScreen";
import DocumentUploadLoader from "@/components/Aichat/DocumentUploadLoader";
import DocumentPreviewModal from "@/components/Aichat/DocumentPreviewModal";
import GetStartedFooter from "@/components/GetStartedFooter";
import LoadingScreen from '@/components/LoadingScreen';
import { useAppLoading } from '@/hooks/useAppLoading';

// Backend API base URL - adjust this to match your backend
const API_BASE_URL =  'http://localhost:3001';

// Main Aichat Component with welcome screen and chat interface
const Aichat = () => {
  const { isLoading } = useAppLoading();
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFileName, setUploadingFileName] = useState('');

  // Store the current document ID for context
  const [currentDocumentId, setCurrentDocumentId] = useState(null);

  // Main Aichat Component with ChatGPT-like interface
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
      // Simulate progress while uploading
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10 + 5;
        });
      }, 200);

      // Actually upload the file
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
      
      // Add error message to chat
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
    
    // If no upload result provided, upload the file
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

    // Store the document ID for future messages
    setCurrentDocumentId(result.fileId);

    const fileMessage = {
      role: "user",
      content: `Uploaded document: ${file.name}`,
      timestamp: Date.now(),
      document: file,
    };
    setMessages((prev) => [...prev, fileMessage]);
    
    // Add AI response about the uploaded file
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
      
      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // Add initial assistant message
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
        
        // Update the message with accumulated content
        setMessages((prev) => 
          prev.map((msg) => 
            msg.timestamp === assistantMessageId
              ? { ...msg, content: accumulatedContent, isStreaming: true }
              : msg
          )
        );
      }
      
      // Mark streaming as complete
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
    <div 
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundImage: 'url(/Header.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Main content area */}
      <div className="relative z-10 pt-24 sm:pt-32 flex-1 flex flex-col">
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-4xl mx-auto px-4">
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
        </div>
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
      
      {/* Footer with proper spacing */}
      <div className="relative z-10 mt-16">
        <GetStartedFooter />
      </div>
    </div>
  );
};

export default Aichat;