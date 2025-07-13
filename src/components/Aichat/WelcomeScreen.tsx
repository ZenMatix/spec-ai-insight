
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { FileText, MessageCircle, FileSearch, Lightbulb, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onFileUpload: (file: File) => void;
  onStartChat: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFileUpload, onStartChat }) => {
  const { user } = useUser();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const features = [
    {
      icon: FileText,
      title: "Document Analysis",
      description: "Upload PDF, Word, or text files for comprehensive analysis",
      color: "text-purple-600"
    },
    {
      icon: MessageCircle,
      title: "Smart Q&A",
      description: "Ask specific questions about your document content",
      color: "text-blue-600"
    },
    {
      icon: FileSearch,
      title: "Summarization",
      description: "Get quick summaries of lengthy documents",
      color: "text-green-600"
    },
    {
      icon: Lightbulb,
      title: "Key Insights",
      description: "Extract important information and insights",
      color: "text-orange-600"
    }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-8">
      <div className="w-full max-w-4xl mx-auto text-center">
        {/* Welcome Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to AI Chat
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload a document and ask me anything about it. I can help you analyze, summarize, and answer questions about your files.
          </p>
        </div>

        {/* 2x2 Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex flex-col items-center text-center">
                <feature.icon className={`w-8 h-8 ${feature.color} mb-3`} />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call-to-Action with Buttons */}
        <div className="text-center">
          <p className="text-gray-700 text-lg mb-4 font-medium">
            Get started by choosing an option below:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleUploadClick}
              variant="default"
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload a Document
            </Button>
            <Button
              onClick={onStartChat}
              variant="outline"
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Ask me a Question
            </Button>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
};

export default WelcomeScreen;
