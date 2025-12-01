
import React, { useState } from 'react';
import { Copy, Sparkles, Check, Info } from 'lucide-react';
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
    <div className="glass-card rounded-2xl hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden hover:border-brand-primary/30 group">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-brand-dark leading-tight group-hover:text-brand-primary transition-colors">{spec.title}</h3>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-brand-light border border-brand-border p-2.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-brand-dark/50 block mb-1">Dimensions</span>
            <span className="text-sm font-bold text-brand-dark font-mono">{spec.dimensions}</span>
          </div>
          <div className="bg-brand-light border border-brand-border p-2.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-brand-dark/50 block mb-1">Ratio</span>
            <span className="text-sm font-bold text-brand-dark">{spec.aspectRatio}</span>
          </div>
          <div className="bg-brand-light border border-brand-border p-2.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-brand-dark/50 block mb-1">Format</span>
            <span className="text-sm font-bold text-brand-dark">{spec.fileType.join(', ')}</span>
          </div>
          <div className="bg-brand-light border border-brand-border p-2.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-brand-dark/50 block mb-1">Max Size</span>
            <span className="text-sm font-bold text-brand-dark">{spec.maxFileSize}</span>
          </div>
        </div>
        
        {/* Notes Section */}
        <div className="mt-auto">
          <div className="flex gap-2 items-start p-3 bg-brand-light/30 rounded-xl border border-brand-border">
            <Info className="w-3.5 h-3.5 text-brand-primary mt-0.5 shrink-0" />
            <p className="text-xs text-brand-dark/80 leading-relaxed font-medium">
              {spec.notes}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-brand-light/30 border-t border-brand-border grid grid-cols-2 gap-3">
        <button 
          onClick={handleCopy}
          className="magic-btn w-full group/copy"
        >
          <div className={`magic-btn-content transition-all duration-300 ${isCopied ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'bg-brand-surface border border-brand-border text-brand-dark hover:bg-brand-light'}`}>
            {isCopied ? <Check className="w-4 h-4 scale-110" /> : <Copy className="w-4 h-4 opacity-70 group-hover/copy:opacity-100 transition-opacity" />}
            <span className="font-bold">{isCopied ? 'Copied!' : 'Copy'}</span>
          </div>
        </button>
        <button 
          onClick={() => onPreview(spec)}
          className="group/test relative w-full overflow-hidden rounded-xl bg-slate-900 shadow-md transition-all duration-300 hover:shadow-blue-500/25 active:scale-[0.98]"
        >
          {/* Base Background */}
          <div className="absolute inset-0 bg-slate-900"></div>
          
          {/* Blue Overlay/Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 opacity-0 transition-opacity duration-300 group-hover/test:opacity-100"></div>
          
          {/* Border Gradient */}
          <div className="absolute inset-0 rounded-xl border border-slate-700 transition-colors duration-300 group-hover/test:border-blue-500/50"></div>

          <div className="relative flex items-center justify-center gap-2 py-3 px-4">
            <Sparkles className="w-4 h-4 text-blue-400 transition-transform duration-300 group-hover/test:scale-110 group-hover/test:text-blue-300" />
            <span className="font-bold text-white text-sm">Test Creative</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SpecCard;
