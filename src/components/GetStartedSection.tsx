
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileText, MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GetStartedSection = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setUploadedFile(files[0]);
      toast({
        title: "File uploaded successfully!",
        description: `${files[0].name} is ready for analysis.`,
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setUploadedFile(files[0]);
      toast({
        title: "File uploaded successfully!",
        description: `${files[0].name} is ready for analysis.`,
      });
    }
  };

  const handleAskQuestion = () => {
    if (!uploadedFile) {
      toast({
        title: "Please upload a document first",
        description: "You need to upload a specification document before asking questions.",
        variant: "destructive",
      });
      return;
    }
    
    if (!question.trim()) {
      toast({
        title: "Please enter a question",
        description: "Ask anything about your uploaded specification document.",
        variant: "destructive",
      });
      return;
    }

    // Simulate AI response
    toast({
      title: "AI is analyzing your question...",
      description: "This is a demo. In the real app, you'll get instant AI-powered answers!",
    });
  };

  return (
    <section id="get-started" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Get Started in Seconds
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Upload your specification document and start asking questions immediately. 
            Our AI understands technical jargon and provides precise answers.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Upload Section */}
          <Card className="p-8 bg-white shadow-xl border-0">
            <div className="text-center mb-6">
              <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Upload Document</h3>
              <p className="text-slate-600">Drag and drop or click to upload your specification files</p>
            </div>

            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : uploadedFile
                  ? 'border-green-500 bg-green-50'
                  : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {uploadedFile ? (
                <div className="flex items-center justify-center space-x-3">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">{uploadedFile.name}</p>
                    <p className="text-sm text-green-600">Ready for analysis</p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-700 mb-2">
                    Drop your files here, or click to browse
                  </p>
                  <p className="text-sm text-slate-500">
                    Supports PDF, DOCX, DOC, TXT files up to 10MB
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Chat Section */}
          <Card className="p-8 bg-white shadow-xl border-0">
            <div className="text-center mb-6">
              <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Ask Questions</h3>
              <p className="text-slate-600">Get instant answers about your specifications</p>
            </div>

            <div className="space-y-4">
              {/* Sample questions */}
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Try asking:</p>
                <div className="space-y-1 text-sm text-slate-600">
                  <p>• "What are the welding requirements for section 4.2?"</p>
                  <p>• "What material grade is specified for the main structure?"</p>
                  <p>• "What are the tolerance requirements?"</p>
                </div>
              </div>

              {/* Question input */}
              <div className="relative">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask anything about your specification document..."
                  className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <Button
                onClick={handleAskQuestion}
                className="w-full gradient-primary text-white py-3 text-lg font-semibold hover:scale-105 transition-transform duration-200"
              >
                <Send className="w-5 h-5 mr-2" />
                Ask AI Assistant
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GetStartedSection;
