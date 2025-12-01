
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
    <section className="mb-8 scroll-mt-24 bg-transparent" id={platform.id}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex flex-col md:flex-row md:items-center justify-between p-6 text-left bg-brand-surface rounded-2xl border border-brand-medium/20 shadow-sm hover:shadow-md hover:border-brand-primary/20 transition-all duration-300 group cursor-pointer outline-none select-none relative overflow-hidden"
        aria-expanded={isExpanded}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex-1 pr-4 relative z-10">
          <div className="flex items-center gap-3 mb-2">
             <h2 className="text-2xl font-bold text-brand-dark tracking-tight group-hover:text-brand-primary transition-colors">{platform.name}</h2>
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-light text-brand-dark/70 border border-brand-medium/20">
               {platform.specs.length} Formats
             </span>
          </div>
          <p className="text-brand-dark/60 text-sm leading-relaxed max-w-3xl line-clamp-1 md:line-clamp-none">{platform.description}</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0 shrink-0 relative z-10">
          <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/30">
            Updated: {platform.lastUpdated}
          </span>
          <div className={`p-2 rounded-full bg-brand-light border border-brand-medium/20 text-brand-dark/60 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </button>
      
      <div className={`transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pt-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
