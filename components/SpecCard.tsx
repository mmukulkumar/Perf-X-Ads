
import React, { useState } from 'react';
import { Copy, Download, ScanEye, Check } from 'lucide-react';
import { AdSpec } from '../types';

interface SpecCardProps {
  spec: AdSpec;
  onPreview: (spec: AdSpec) => void;
}

const SpecCard: React.FC<SpecCardProps> = ({ spec, onPreview }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const text = `
${spec.title} Specs:
Dimensions: ${spec.dimensions}
Ratio: ${spec.aspectRatio}
Format: ${spec.format}
Max Size: ${spec.maxFileSize}
Notes: ${spec.notes}
    `.trim();
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-brand-surface rounded-xl border border-brand-medium/30 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-brand-dark">{spec.title}</h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-brand-light">
            <span className="text-sm text-brand-dark/60">Dimensions</span>
            <span className="text-sm font-semibold text-brand-dark font-mono">{spec.dimensions}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-brand-light">
            <span className="text-sm text-brand-dark/60">Aspect Ratio</span>
            <span className="text-sm font-medium text-brand-dark">{spec.aspectRatio}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-brand-light">
            <span className="text-sm text-brand-dark/60">Format</span>
            <span className="text-sm font-medium text-brand-dark">{spec.format}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-brand-light">
            <span className="text-sm text-brand-dark/60">File Type</span>
            <span className="text-sm font-medium text-brand-dark">{spec.fileType.join(', ')}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-brand-light">
            <span className="text-sm text-brand-dark/60">File Size</span>
            <span className="text-sm font-medium text-brand-dark">Up to {spec.maxFileSize}</span>
          </div>
          
          <div className="mt-4 pt-2">
            <p className="text-xs text-brand-dark/70 leading-relaxed bg-brand-light p-3 rounded-lg border border-brand-medium/20">
              <span className="font-semibold text-brand-dark">Notes:</span> {spec.notes}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-brand-light/50 border-t border-brand-medium/20 grid grid-cols-3 gap-2">
        {/* Magic Download Button */}
        <button 
          onClick={() => {}} // Placeholder for download functionality
          className="magic-btn group"
        >
          <div className="magic-btn-content">
            <Download className="w-3.5 h-3.5" />
            Download
          </div>
        </button>

        <button 
          onClick={handleCopy}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
            isCopied 
              ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800' 
              : 'text-brand-dark bg-brand-surface border border-brand-medium/40 hover:bg-brand-light hover:text-brand-dark'
          }`}
        >
          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {isCopied ? 'Copied' : 'Copy'}
        </button>
        <button 
          onClick={() => onPreview(spec)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-brand-primary border border-brand-primary rounded-lg hover:opacity-90 transition-all shadow-sm"
        >
          <ScanEye className="w-3.5 h-3.5" />
          Test
        </button>
      </div>
    </div>
  );
};

export default SpecCard;
