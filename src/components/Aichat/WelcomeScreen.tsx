
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { FileText, MessageCircle, FileSearch, Lightbulb, Upload, Sparkles } from 'lucide-react';
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
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: MessageCircle,
      title: "Smart Q&A",
      description: "Ask specific questions about your document content",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: FileSearch,
      title: "Summarization",
      description: "Get quick summaries of lengthy documents",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Lightbulb,
      title: "Key Insights",
      description: "Extract important information and insights",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
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
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12">
      <div className="w-full max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Document Assistant
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Chat with your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> documents</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload any document and have natural conversations about its content. Get summaries, ask questions, and extract insights instantly.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 ${feature.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get started in seconds</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleUploadClick}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Document
            </Button>
            <div className="text-gray-400 font-medium">or</div>
            <Button
              onClick={onStartChat}
              variant="outline"
              size="lg"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-base font-medium"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chatting
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Supports PDF, Word, and text files up to 10MB
          </p>
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
