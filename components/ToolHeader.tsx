
import React, { useState } from 'react';
import { CheckCircle, LucideIcon, Link as LinkIcon, Check } from 'lucide-react';

interface ToolHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  category?: string;
  features?: readonly string[];
}

const ToolHeader: React.FC<ToolHeaderProps> = ({ title, description, icon: Icon, category, features }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isWeChatCopied, setIsWeChatCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out this tool: ${title}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleWeChatCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setIsWeChatCopied(true);
    setTimeout(() => setIsWeChatCopied(false), 2000);
  };

  return (
    <div className="relative bg-brand-light border-b border-brand-medium/20 mb-8 overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-5"></div>
      <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
         <Icon className="w-64 h-64 text-brand-dark" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between animate-in fade-in slide-in-from-bottom-4 duration-700">
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

           {/* Hero Share Buttons */}
           <div className="flex flex-col gap-3 shrink-0 lg:mt-0 mt-4 bg-brand-surface/50 backdrop-blur-sm p-4 rounded-2xl border border-brand-medium/10">
              <span className="text-[10px] font-bold text-brand-dark/50 uppercase tracking-wider text-center lg:text-left">Share Tool</span>
              <div className="flex gap-2">
                 {/* X (Twitter) */}
                 <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-brand-surface border border-brand-medium/20 rounded-xl hover:bg-black hover:text-white hover:border-black text-brand-dark transition-all duration-200 group shadow-sm"
                    aria-label="Share on X"
                    title="Share on X"
                 >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                 </a>
                 {/* Facebook */}
                 <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-brand-surface border border-brand-medium/20 rounded-xl hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] text-brand-dark transition-all duration-200 shadow-sm"
                    aria-label="Share on Facebook"
                    title="Share on Facebook"
                 >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                 </a>
                 {/* LinkedIn */}
                 <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-brand-surface border border-brand-medium/20 rounded-xl hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] text-brand-dark transition-all duration-200 shadow-sm"
                    aria-label="Share on LinkedIn"
                    title="Share on LinkedIn"
                 >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                 </a>
                 {/* WhatsApp */}
                 <a 
                    href={`https://wa.me/?text=${encodeURIComponent(`${shareText}: ${currentUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-brand-surface border border-brand-medium/20 rounded-xl hover:bg-[#25D366] hover:text-white hover:border-[#25D366] text-brand-dark transition-all duration-200 shadow-sm"
                    aria-label="Share on WhatsApp"
                    title="Share on WhatsApp"
                 >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                 </a>
                 {/* Telegram */}
                 <a 
                    href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-brand-surface border border-brand-medium/20 rounded-xl hover:bg-[#0088cc] hover:text-white hover:border-[#0088cc] text-brand-dark transition-all duration-200 shadow-sm"
                    aria-label="Share on Telegram"
                    title="Share on Telegram"
                 >
                    <svg className="w-4 h-4 ml-[-1px] mt-[1px]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.432z"/></svg>
                 </a>
                 {/* WeChat */}
                 <button 
                    onClick={handleWeChatCopy}
                    className={`p-2.5 bg-brand-surface border border-brand-medium/20 rounded-xl text-brand-dark transition-all duration-200 shadow-sm ${isWeChatCopied ? 'bg-green-50 text-green-600 border-green-200' : 'hover:bg-[#07C160] hover:text-white hover:border-[#07C160]'}`}
                    aria-label="Copy link for WeChat"
                    title={isWeChatCopied ? 'Link Copied' : 'Share on WeChat'}
                 >
                    {isWeChatCopied ? <Check className="w-4 h-4" /> : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.067 5.552-.13.856-.593 2.327-.677 2.643-.092.348.125.485.33.253.692-.782 2.766-2.823 3.197-3.218a10.01 10.01 0 0 0 2.774.397c.17 0 .337-.006.503-.016-.145-.528-.223-1.077-.223-1.642 0-3.953 3.52-7.159 7.863-7.159.208 0 .414.01.618.028a8.91 8.91 0 0 0-3.76-4.18zM6.027 6.353a.855.855 0 1 1 0 1.711.855.855 0 0 1 0-1.711zm4.717 0a.855.855 0 1 1 0 1.711.855.855 0 0 1 0-1.711zm5.353 3.25c-3.967 0-7.182 2.92-7.182 6.52 0 3.602 3.215 6.521 7.182 6.521 1.07 0 2.091-.252 2.998-.692.394.36 2.291 2.222 2.922 2.933.187.211.385.086.301-.23-.077-.288-.5-1.628-.619-2.408 1.733-1.228 2.802-3.044 2.802-5.06 0-3.6-3.216-6.52-7.183-6.52zm-2.52 4.19c-.53 0-.96-.431-.96-.962 0-.532.43-.963.96-.963s.96.431.96.963c0 .531-.43.962-.96.962zm5.038 0c-.53 0-.96-.431-.96-.962 0-.532.43-.963.96-.963s.96.431.96.963c0 .531-.43.962-.96.962z"/></svg>
                    )}
                 </button>
                 {/* Copy Link */}
                 <button 
                    onClick={handleCopyLink}
                    className={`p-2.5 bg-brand-surface border border-brand-medium/20 rounded-xl text-brand-dark transition-all duration-200 shadow-sm ${isCopied ? 'bg-green-50 text-green-600 border-green-200' : 'hover:bg-brand-light'}`}
                    aria-label="Copy Link"
                    title="Copy Link"
                 >
                    {isCopied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ToolHeader;
