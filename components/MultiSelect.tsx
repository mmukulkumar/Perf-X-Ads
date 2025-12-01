
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

interface MultiSelectProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ 
  label, 
  options, 
  selectedValues, 
  onChange,
  placeholder = "Select..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(v => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const isAllSelected = selectedValues.length === 0;

  return (
    <div className="space-y-2" ref={containerRef}>
      <label className="text-xs font-bold text-brand-dark/50 ml-1 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative w-full text-left glossy-input rounded-2xl py-3 pl-4 pr-10 text-sm font-bold transition-all duration-200
            ${isOpen ? 'ring-2 ring-brand-primary/20 border-brand-primary' : ''}
          `}
        >
          <span className={`block truncate ${isAllSelected ? 'text-brand-dark/40 font-medium' : 'text-brand-dark'}`}>
            {isAllSelected 
              ? placeholder 
              : `${selectedValues.length} selected`}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className={`h-4 w-4 text-brand-medium transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </span>
          
          {!isAllSelected && (
            <div 
              onClick={clearAll}
              className="absolute inset-y-0 right-9 flex items-center pr-1 cursor-pointer hover:text-brand-primary group z-10"
            >
               <X className="h-3.5 w-3.5 text-brand-medium group-hover:text-brand-primary" />
            </div>
          )}
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-brand-surface rounded-2xl shadow-xl shadow-black/10 border border-brand-border max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-200 p-1">
            <div 
              onClick={() => onChange([])}
              className={`
                flex items-center px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-colors mb-1 font-medium
                ${isAllSelected ? 'bg-brand-primary/10 text-brand-primary font-bold' : 'text-brand-dark hover:bg-brand-light'}
              `}
            >
              <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center transition-colors ${isAllSelected ? 'bg-brand-primary border-brand-primary' : 'border-brand-medium'}`}>
                {isAllSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              All
            </div>
            
            <div className="my-1 border-t border-brand-border"></div>

            {options.map((option) => {
              const isSelected = selectedValues.includes(option);
              return (
                <div
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={`
                    flex items-center px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-colors font-medium
                    ${isSelected ? 'bg-brand-primary/5 text-brand-dark font-bold' : 'text-brand-dark hover:bg-brand-light'}
                  `}
                >
                  <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center transition-colors ${isSelected ? 'bg-brand-primary border-brand-primary' : 'border-brand-medium'}`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  {option}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Selected pills preview */}
      {!isAllSelected && (
         <div className="flex flex-wrap gap-1.5 mt-2">
             {selectedValues.slice(0, 3).map(val => (
                 <span key={val} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-light border border-brand-border text-brand-dark/70">
                     {val}
                     <button onClick={() => toggleOption(val)} className="ml-1 hover:text-red-500"><X className="w-3 h-3" /></button>
                 </span>
             ))}
             {selectedValues.length > 3 && (
                 <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-light border border-brand-border text-brand-dark/50">
                     +{selectedValues.length - 3} more
                 </span>
             )}
         </div>
      )}
    </div>
  );
};

export default MultiSelect;
