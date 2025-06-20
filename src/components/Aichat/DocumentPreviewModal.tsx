
import React from "react";
import DocumentPreview from "./DocumentPreview";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFile: File | null;
  zoomLevel: number;
  currentPage: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  selectedFile,
  zoomLevel,
  currentPage,
  onZoomIn,
  onZoomOut,
  onNextPage,
  onPrevPage,
}) => {
  if (!isOpen || !selectedFile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full h-full max-w-6xl max-h-[90vh] m-4">
        {/* Document Preview with integrated close button */}
        <div className="w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden">
          <DocumentPreview
            selectedFile={selectedFile}
            zoomLevel={zoomLevel}
            currentPage={currentPage}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            onNextPage={onNextPage}
            onPrevPage={onPrevPage}
            onFileUpload={() => {}} // Not needed in modal
            onClose={onClose} // Pass close handler for integrated button
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
