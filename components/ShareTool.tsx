
import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check, Mail, Link as LinkIcon } from 'lucide-react';

interface ShareToolProps {
  title: string;
  url?: string;
}

const ShareTool: React.FC<ShareToolProps> = ({ title, url }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [isSharedCopied, setIsSharedCopied] = useState(false);
  const [isWeChatCopied, setIsWeChatCopied] = useState(false);

  useEffect(() => {
    if (url) {
      setShareUrl(url);
    } else {
      const currentUrl = window.location.href;
      // Handle blob/preview URLs or localhost specific cases if needed
      if (currentUrl.startsWith('blob:') || currentUrl.startsWith('about:')) {
          setShareUrl('https://perfxads.com');
      } else {
          setShareUrl(currentUrl);
      }
    }
  }, [url]);

  const handleShareCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsSharedCopied(true);
    setTimeout(() => setIsSharedCopied(false), 2000);
  };

  const handleWeChatCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsWeChatCopied(true);
    setTimeout(() => setIsWeChatCopied(false), 2000);
  };

  const shareText = `Check out this ${title} on Perf X Ads`;

  return (
    <div className="max-w-3xl mx-auto mt-20 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 px-4 md:px-0">
       <div className="bg-brand-surface p-6 md:p-10 rounded-3xl border border-brand-medium/20 shadow-xl shadow-brand-primary/5 relative overflow-hidden group">
          {/* Decorative background gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-primary/5 to-transparent rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-brand-light rounded-full mb-4 ring-4 ring-brand-surface">
                    <Share2 className="w-6 h-6 text-brand-primary" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-2">Share this Tool</h2>
                <p className="text-brand-dark/60 text-sm max-w-md mx-auto">Found {title} helpful? Share it with your network to help them optimize their campaigns.</p>
            </div>

            {/* Copy Link Section */}
            <div className="mb-8 relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 top-3.5 sm:top-0 flex items-start sm:items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-brand-medium group-focus-within/input:text-brand-primary transition-colors" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                        type="text" 
                        readOnly 
                        value={shareUrl} 
                        className="flex-1 pl-10 pr-4 py-3.5 bg-brand-light/30 border border-brand-medium/30 rounded-xl text-sm text-brand-dark font-medium outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all truncate"
                        aria-label="Link to share"
                    />
                    <button 
                        onClick={handleShareCopy}
                        className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 border w-full sm:w-auto ${isSharedCopied ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-brand-dark text-brand-light border-brand-dark hover:bg-brand-dark/90'}`}
                        aria-label="Copy link to clipboard"
                    >
                        {isSharedCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {isSharedCopied ? 'Copied' : 'Copy'}
                    </button>
                </div>
            </div>

            {/* Social Grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 mb-6">
                {/* X (Twitter) */}
                <a 
                   href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   aria-label="Share on X (formerly Twitter)"
                   className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-brand-medium/20 hover:border-black/30 bg-white dark:bg-brand-surface hover:bg-black/5 transition-all duration-300 group/item"
                >
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover/item:scale-110 transition-transform shadow-md">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </div>
                    <span className="text-[10px] font-bold text-brand-dark">X</span>
                </a>

                {/* Facebook */}
                <a 
                   href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   aria-label="Share on Facebook"
                   className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-brand-medium/20 hover:border-blue-600/30 bg-white dark:bg-brand-surface hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group/item"
                >
                   <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center group-hover/item:scale-110 transition-transform shadow-md shadow-blue-500/20">
                       <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                   </div>
                   <span className="text-[10px] font-bold text-brand-dark group-hover/item:text-[#1877F2] transition-colors">Facebook</span>
                </a>

                {/* LinkedIn */}
                <a 
                   href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   aria-label="Share on LinkedIn"
                   className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-brand-medium/20 hover:border-blue-700/30 bg-white dark:bg-brand-surface hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group/item"
                >
                   <div className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center group-hover/item:scale-110 transition-transform shadow-md shadow-blue-600/20">
                       <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                   </div>
                   <span className="text-[10px] font-bold text-brand-dark group-hover/item:text-[#0A66C2] transition-colors">LinkedIn</span>
                </a>

                {/* WhatsApp */}
                <a 
                   href={`https://wa.me/?text=${encodeURIComponent(`${shareText}: ${shareUrl}`)}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   aria-label="Share on WhatsApp"
                   className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-brand-medium/20 hover:border-green-500/30 bg-white dark:bg-brand-surface hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group/item"
                >
                   <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center group-hover/item:scale-110 transition-transform shadow-md shadow-green-500/20">
                       <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                   </div>
                   <span className="text-[10px] font-bold text-brand-dark group-hover/item:text-[#25D366] transition-colors">WhatsApp</span>
                </a>

                {/* Telegram */}
                <a 
                   href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   aria-label="Share on Telegram"
                   className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-brand-medium/20 hover:border-blue-400/30 bg-white dark:bg-brand-surface hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group/item"
                >
                   <div className="w-8 h-8 rounded-full bg-[#0088cc] text-white flex items-center justify-center group-hover/item:scale-110 transition-transform shadow-md shadow-blue-400/20">
                       <svg className="w-4 h-4 ml-[-1px] mt-[1px]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.432z"/></svg>
                   </div>
                   <span className="text-[10px] font-bold text-brand-dark group-hover/item:text-[#0088cc] transition-colors">Telegram</span>
                </a>

                {/* WeChat */}
                <button 
                   onClick={handleWeChatCopy}
                   aria-label="Copy link for WeChat"
                   className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-brand-medium/20 hover:border-green-600/30 bg-white dark:bg-brand-surface hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group/item"
                >
                   <div className="w-8 h-8 rounded-full bg-[#07C160] text-white flex items-center justify-center group-hover/item:scale-110 transition-transform shadow-md shadow-green-600/20">
                       {isWeChatCopied ? <Check className="w-4 h-4" /> : (
                           <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.067 5.552-.13.856-.593 2.327-.677 2.643-.092.348.125.485.33.253.692-.782 2.766-2.823 3.197-3.218a10.01 10.01 0 0 0 2.774.397c.17 0 .337-.006.503-.016-.145-.528-.223-1.077-.223-1.642 0-3.953 3.52-7.159 7.863-7.159.208 0 .414.01.618.028a8.91 8.91 0 0 0-3.76-4.18zM6.027 6.353a.855.855 0 1 1 0 1.711.855.855 0 0 1 0-1.711zm4.717 0a.855.855 0 1 1 0 1.711.855.855 0 0 1 0-1.711zm5.353 3.25c-3.967 0-7.182 2.92-7.182 6.52 0 3.602 3.215 6.521 7.182 6.521 1.07 0 2.091-.252 2.998-.692.394.36 2.291 2.222 2.922 2.933.187.211.385.086.301-.23-.077-.288-.5-1.628-.619-2.408 1.733-1.228 2.802-3.044 2.802-5.06 0-3.6-3.216-6.52-7.183-6.52zm-2.52 4.19c-.53 0-.96-.431-.96-.962 0-.532.43-.963.96-.963s.96.431.96.963c0 .531-.43.962-.96.962zm5.038 0c-.53 0-.96-.431-.96-.962 0-.532.43-.963.96-.963s.96.431.96.963c0 .531-.43.962-.96.962z"/></svg>
                       )}
                   </div>
                   <span className="text-[10px] font-bold text-brand-dark group-hover/item:text-[#07C160] transition-colors">
                       {isWeChatCopied ? 'Link Copied' : 'WeChat'}
                   </span>
                </button>
            </div>
            
            {/* Additional Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
               <a 
                  href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`}
                  aria-label="Share via Email"
                  className="flex-1 flex items-center justify-center gap-2 py-3 border border-brand-medium/30 rounded-xl hover:bg-brand-light transition-colors text-brand-dark group"
               >
                  <Mail className="w-4 h-4 text-brand-medium group-hover:text-brand-dark transition-colors" />
                  <span className="text-sm font-bold">Email</span>
               </a>

               {typeof navigator !== 'undefined' && navigator.share && (
                   <button 
                      onClick={() => {
                          navigator.share({
                              title: title,
                              text: shareText,
                              url: shareUrl,
                          }).catch(console.error);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-light/50 border border-brand-medium/30 rounded-xl hover:bg-brand-light transition-colors text-brand-dark group"
                      aria-label="More share options"
                   >
                      <Share2 className="w-4 h-4 text-brand-medium group-hover:text-brand-dark transition-colors" />
                      <span className="text-sm font-bold">More</span>
                   </button>
               )}
            </div>
          </div>
       </div>
    </div>
  );
};

export default ShareTool;
