import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { PlatformData, AdSpec } from '../types';
import SpecCard from './SpecCard';

interface PlatformSectionProps {
  platform: PlatformData;
  onPreview: (spec: AdSpec) => void;
  forceExpand?: boolean;
}

const PlatformSection: React.FC<PlatformSectionProps> = ({ platform, onPreview, forceExpand = false }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Automatically expand if the user is searching/filtering (forceExpand prop)
  useEffect(() => {
    if (forceExpand) {
      setIsExpanded(true);
    }
  }, [forceExpand]);

  if (platform.specs.length === 0) return null;

  return (
    <section className="mb-6 scroll-mt-24 bg-brand-surface rounded-2xl border border-brand-medium/20 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md" id={platform.id}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex flex-col md:flex-row md:items-center justify-between p-6 text-left bg-brand-surface hover:bg-brand-light/50 transition-colors group cursor-pointer outline-none select-none"
        aria-expanded={isExpanded}
      >
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-3 mb-2">
             <h2 className="text-xl md:text-2xl font-bold text-brand-dark tracking-tight group-hover:text-brand-primary transition-colors">{platform.name}</h2>
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-medium/10 text-brand-dark border border-brand-medium/20">
               {platform.specs.length} Specs
             </span>
          </div>
          <p className="text-brand-dark/60 text-sm leading-relaxed max-w-3xl line-clamp-1 md:line-clamp-none">{platform.description}</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0 shrink-0">
          <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-[10px] font-medium bg-brand-medium/10 text-brand-dark/60 border border-brand-medium/20">
            Updated: {platform.lastUpdated}
          </span>
          <div className={`p-2 rounded-full bg-brand-light border border-brand-medium/20 text-brand-dark/60 group-hover:text-brand-primary group-hover:border-brand-primary/30 transition-all duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </button>
      
      <div className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 pt-0 border-t border-brand-medium/10">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-6">
            {platform.specs.map(spec => (
              <SpecCard key={spec.id} spec={spec} onPreview={onPreview} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;