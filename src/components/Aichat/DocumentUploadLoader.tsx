
import React from 'react';
import { Loader2, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface DocumentUploadLoaderProps {
  fileName: string;
  progress: number;
}

const DocumentUploadLoader: React.FC<DocumentUploadLoaderProps> = ({ fileName, progress }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center border border-white/30 shadow-2xl">
        <div className="mb-6">
          <div className="relative">
            <FileText className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin absolute -top-1 -right-1" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Analyzing your document
        </h3>
        
        <p className="text-gray-700 mb-6">
          {fileName}
        </p>
        
        <div className="space-y-3">
          <Progress value={progress} className="w-full h-2" />
          <p className="text-sm text-gray-600">
            {progress < 30 && "Uploading document..."}
            {progress >= 30 && progress < 70 && "Processing content..."}
            {progress >= 70 && progress < 100 && "Almost ready..."}
            {progress === 100 && "Complete!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadLoader;
