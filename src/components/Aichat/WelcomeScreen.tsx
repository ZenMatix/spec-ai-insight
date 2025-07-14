
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] px-6 py-8">
      <div className="w-full max-w-4xl mx-auto text-center">
        {/* Welcome Header */}
        <div className="mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            ChatGPT
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            How can I help you today?
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-6 border border-gray-200 transition-colors cursor-pointer group">
              <div className="flex flex-col items-start text-left">
                <feature.icon className={`w-6 h-6 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call-to-Action */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleUploadClick}
              variant="default"
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transition-all"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Document
            </Button>
            <Button
              onClick={onStartChat}
              variant="outline"
              size="lg"
              className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-2xl font-semibold text-base"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chatting
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
