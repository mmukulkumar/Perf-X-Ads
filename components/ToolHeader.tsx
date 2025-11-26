
import React from 'react';
import { CheckCircle, LucideIcon } from 'lucide-react';

interface ToolHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  category?: string;
  features?: readonly string[];
}

const ToolHeader: React.FC<ToolHeaderProps> = ({ title, description, icon: Icon, category, features }) => {
  return (
    <div className="relative bg-brand-light border-b border-brand-medium/20 mb-8 overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-5"></div>
      <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
         <Icon className="w-64 h-64 text-brand-dark" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="max-w-3xl">
              {category && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface text-brand-dark text-xs font-semibold mb-4 border border-brand-medium/30 shadow-sm">
                  <Icon className="w-3 h-3" />
                  {category}
                </div>
              )}
              <h1 className="text-3xl md:text-5xl font-extrabold text-brand-dark tracking-tight mb-4 leading-tight">
                {title}
              </h1>
              <p className="text-lg text-brand-dark/70 leading-relaxed mb-6">
                {description}
              </p>
              
              {features && features.length > 0 && (
                <div className="flex flex-wrap gap-4 text-sm text-brand-dark/60">
                   {features.map((feature, idx) => (
                     <div key={idx} className="flex items-center gap-1.5">
                       <CheckCircle className="w-4 h-4 text-brand-medium" />
                       {feature}
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ToolHeader;
