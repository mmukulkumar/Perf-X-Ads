import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, CheckCircle, AlertTriangle, XCircle, FileVideo, FileImage } from 'lucide-react';
import { AdSpec, ValidationResult } from '../types';
import { validateFile } from '../services/validationService';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  spec: AdSpec;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, spec }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state when opening
      setFile(null);
      setPreviewUrl(null);
      setResult(null);
    }
  }, [isOpen]);

  const handleFile = async (uploadedFile: File) => {
    setFile(uploadedFile);
    const objectUrl = URL.createObjectURL(uploadedFile);
    setPreviewUrl(objectUrl);
    
    const validationResult = await validateFile(uploadedFile, spec);
    setResult(validationResult);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-brand-surface rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-brand-medium/20">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-medium/20">
          <div>
            <h3 className="text-xl font-bold text-brand-dark">Ad Preview Validator</h3>
            <p className="text-sm text-brand-dark/60">Testing against: <span className="font-semibold text-brand-dark">{spec.title}</span> ({spec.dimensions})</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-light rounded-full transition-colors">
            <X className="w-6 h-6 text-brand-dark/50" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          
          {/* Left: Upload / Preview Area */}
          <div className="w-full md:w-1/2 p-6 bg-brand-light border-r border-brand-medium/20 flex flex-col items-center justify-center min-h-[400px]">
            {previewUrl ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                 <div className="relative max-w-full max-h-[350px] overflow-hidden rounded-lg shadow-md bg-brand-surface border border-brand-medium/30">
                    {file?.type.startsWith('video') ? (
                       <video src={previewUrl} controls className="max-w-full max-h-[350px] object-contain" />
                    ) : (
                       <img src={previewUrl} alt="Preview" className="max-w-full max-h-[350px] object-contain" />
                    )}
                 </div>
                 <button 
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                    setResult(null);
                  }}
                  className="mt-4 text-sm text-brand-dark/60 hover:text-red-600 underline"
                 >
                   Remove & Upload New
                 </button>
              </div>
            ) : (
              <div 
                className={`w-full h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                  isDragging 
                    ? 'border-brand-dark bg-brand-medium/10' 
                    : 'border-brand-medium/40 hover:border-brand-medium hover:bg-brand-surface'
                }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*,video/*"
                  onChange={onFileSelect}
                />
                <div className="w-16 h-16 bg-brand-light text-brand-dark rounded-full flex items-center justify-center mb-4 shadow-sm border border-brand-medium/20">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-lg font-medium text-brand-dark">Click or Drag file to upload</p>
                <p className="text-sm text-brand-dark/50 mt-2 text-center px-8">
                  Supports {spec.fileType.join(', ')} up to {spec.maxFileSize}
                </p>
              </div>
            )}
          </div>

          {/* Right: Validation Results */}
          <div className="w-full md:w-1/2 p-6 overflow-y-auto bg-brand-surface">
            <h4 className="text-sm font-semibold text-brand-dark/40 uppercase tracking-wider mb-4">Validation Report</h4>
            
            {!result ? (
              <div className="text-center py-12 text-brand-dark/40">
                <FileImage className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Upload a creative to see real-time validation against platform specs.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`p-4 rounded-lg border flex items-start gap-3 ${
                  result.isValid ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                  {result.isValid ? (
                     <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0" />
                  ) : (
                     <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />
                  )}
                  <div>
                    <h5 className={`font-bold ${result.isValid ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                      {result.isValid ? 'Creative Passed Checks' : 'Creative Requires Attention'}
                    </h5>
                    <p className={`text-sm mt-1 ${result.isValid ? 'text-green-700 dark:text-green-200' : 'text-red-700 dark:text-red-200'}`}>
                      {result.isValid 
                        ? 'This asset meets all technical requirements for this placement.'
                        : 'Please resolve the errors below before publishing.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {result.messages.map((msg, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-brand-surface border border-brand-medium/20 rounded-md shadow-sm">
                       {msg.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
                       {msg.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />}
                       {msg.type === 'error' && <XCircle className="w-5 h-5 text-red-500 mt-0.5" />}
                       <span className="text-sm text-brand-dark/80">{msg.text}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-brand-medium/20">
                   <h5 className="font-semibold text-brand-dark mb-3">Required Specs</h5>
                   <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                      <div>
                        <dt className="text-brand-dark/50">Dimensions</dt>
                        <dd className="font-medium text-brand-dark">{spec.dimensions}</dd>
                      </div>
                      <div>
                        <dt className="text-brand-dark/50">Aspect Ratio</dt>
                        <dd className="font-medium text-brand-dark">{spec.aspectRatio}</dd>
                      </div>
                      <div>
                        <dt className="text-brand-dark/50">Max Size</dt>
                        <dd className="font-medium text-brand-dark">{spec.maxFileSize}</dd>
                      </div>
                      <div>
                        <dt className="text-brand-dark/50">Format</dt>
                        <dd className="font-medium text-brand-dark">{spec.fileType.join(', ')}</dd>
                      </div>
                   </dl>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;