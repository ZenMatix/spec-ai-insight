
import React, { useRef, useState, useEffect } from "react";
import { FileText, Upload, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, X } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface DocumentPreviewProps {
  selectedFile: File | null;
  zoomLevel: number;
  currentPage: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  onFileUpload: (file: File) => void;
  onClose?: () => void; // Optional close handler for modal mode
}

function useFileUrl(file: File | null): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return url;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  selectedFile,
  zoomLevel,
  currentPage,
  onZoomIn,
  onZoomOut,
  onNextPage,
  onPrevPage,
  onFileUpload,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // For PDF viewing
  const pdfUrl = useFileUrl(
    selectedFile && selectedFile.type === "application/pdf" ? selectedFile : null
  );

  const [pdfPageCount, setPdfPageCount] = useState<number>(0);
  const [viewerPage, setViewerPage] = useState<number>(currentPage);

  useEffect(() => {
    setViewerPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setPdfPageCount(0);
    setViewerPage(1);
  }, [pdfUrl]);

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            onFileUpload(file);
          }, 400);
          return 100;
        }
        return prev + 17;
      });
    }, 100);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) simulateUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) simulateUpload(file);
  };

  // Calculate scale for zooming (react-pdf uses 1 as 100%)
  const scale = zoomLevel / 100;

  return (
    <div className={`w-full bg-white rounded-2xl overflow-hidden flex flex-col h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'h-full'}`}>
      {/* Header with all controls aligned */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 bg-white border-b border-gray-100">
        <div className="flex gap-2 items-center">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg shadow">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-sm font-bold text-gray-800">Document</h2>
        </div>
        
        {selectedFile && (
          <div className="flex items-center gap-1">
            {/* Zoom controls */}
            <button
              onClick={onZoomOut}
              className="p-1.5 rounded hover:bg-blue-50 transition"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4 text-blue-500" />
            </button>
            <span className="font-medium text-gray-700 w-12 text-center text-xs select-none bg-blue-50 rounded px-2 py-1">{zoomLevel}%</span>
            <button
              onClick={onZoomIn}
              className="p-1.5 rounded hover:bg-blue-50 transition"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4 text-blue-500" />
            </button>
            
            {/* Page navigation for PDFs */}
            {pdfUrl && (
              <div className="ml-3 flex items-center border rounded bg-blue-50 px-2 text-xs">
                <button
                  onClick={() => {
                    onPrevPage();
                    setViewerPage((v) => Math.max(v - 1, 1));
                  }}
                  className="p-1 hover:bg-blue-100 rounded"
                  title="Previous page"
                  disabled={viewerPage <= 1}
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <span className="mx-2 min-w-[50px] text-center">
                  {viewerPage}
                  {pdfPageCount > 0 && ` / ${pdfPageCount}`}
                </span>
                <button
                  onClick={() => {
                    onNextPage();
                    setViewerPage((v) => Math.min(v + 1, pdfPageCount));
                  }}
                  className="p-1 hover:bg-blue-100 rounded"
                  title="Next page"
                  disabled={pdfPageCount > 0 && viewerPage >= pdfPageCount}
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded hover:bg-blue-50 transition ml-2"
              title="Toggle fullscreen"
            >
              <Maximize className="w-4 h-4 text-blue-500" />
            </button>

            {/* Close button - aligned with other controls */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded hover:bg-red-50 transition ml-2"
                title="Close preview"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Main preview area */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="h-full flex items-start justify-center p-4">
          {isUploading ? (
            <div className="w-full text-center space-y-4 mt-20">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow animate-pulse">
                <Upload className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-base text-blue-700">Uploading…</h3>
              <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-blue-700 text-xs">{uploadProgress}% complete</p>
            </div>
          ) : selectedFile && pdfUrl && selectedFile.type === "application/pdf" ? (
            <div className="w-full max-w-4xl">
              <Document
                file={pdfUrl}
                onLoadSuccess={({ numPages }) => setPdfPageCount(numPages)}
                loading={
                  <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500 text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                      Loading PDF…
                    </div>
                  </div>
                }
                error={
                  <div className="text-red-500 text-center p-8">
                    <div className="bg-red-50 rounded-lg p-4">
                      Could not load PDF. Please try another document.
                    </div>
                  </div>
                }
                className="flex justify-center"
              >
                <Page 
                  pageNumber={viewerPage} 
                  scale={scale}
                  renderTextLayer={true} 
                  renderAnnotationLayer={true}
                  className="shadow-lg border border-gray-200 rounded bg-white transition-transform duration-200"
                  width={Math.min(window.innerWidth * 0.5, 800)}
                />
              </Document>
            </div>
          ) : selectedFile ? (
            <div className="w-full max-w-2xl mt-20">
              <div style={{ transform: `scale(${scale})` }} className="transition-transform duration-300 w-full">
                <div className="rounded-2xl bg-gradient-to-br from-slate-100 to-blue-50 shadow p-8 space-y-4 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <span className="font-semibold text-lg text-gray-800 truncate">{selectedFile.name}</span>
                  </div>
                  <p className="text-gray-500 text-sm">Type: {selectedFile.type || "unknown"}</p>
                  <p className="text-gray-700 text-sm">Size: {(selectedFile.size / 1024).toFixed(1)} KB</p>
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 mt-4 text-gray-500 text-sm border border-blue-50">
                    File preview not supported for this file type. PDF files will display with full preview capabilities.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`
                flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition bg-gradient-to-br from-white/80 via-blue-50 to-blue-100 min-h-[400px]
                ${isDragOver ? "border-blue-500 bg-blue-50 scale-105" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}
              `}
              onDrop={handleDrop}
              onDragOver={(e) => {e.preventDefault(); setIsDragOver(true);}}
              onDragLeave={() => setIsDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              tabIndex={0}
              role="button"
              aria-label="Upload document"
            >
              <Upload className="w-12 h-12 text-blue-500 mb-4" />
              <div className="text-lg font-semibold text-gray-800 mb-2">Upload or Drag & Drop</div>
              <div className="text-sm text-gray-500 mb-3">PDF, DOCX, DOC, TXT up to 10MB</div>
              <div className="text-xs text-gray-400 bg-white/60 rounded-lg px-3 py-2">
                PDFs will display with full preview and zoom capabilities
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileSelect}
              />
            </div>
          )}
        </div>
      </div>
      
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition z-10"
        >
          Exit Fullscreen
        </button>
      )}
    </div>
  );
};

export default DocumentPreview;
