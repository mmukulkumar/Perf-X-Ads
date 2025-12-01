
import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

interface CookieConsentProps {
  onOpenPrivacy: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('perfx_cookie_consent');
    if (!consent) {
        // Delay slightly for animation effect
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('perfx_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('perfx_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] p-4 md:p-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="max-w-5xl mx-auto bg-brand-surface dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-brand-medium/20 p-6 md:p-5 flex flex-col md:flex-row items-center gap-6 relative">
        <button 
            onClick={handleDecline} 
            className="absolute top-2 right-2 p-1 text-brand-dark/40 hover:text-brand-dark md:hidden"
        >
            <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4 flex-1">
            <div className="p-3 bg-brand-light dark:bg-brand-dark/20 rounded-xl shrink-0">
                <Cookie className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
                <h3 className="font-bold text-brand-dark mb-1">We value your privacy</h3>
                <p className="text-sm text-brand-dark/70 leading-relaxed">
                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our <button onClick={onOpenPrivacy} className="text-brand-primary underline hover:text-brand-dark font-medium">Privacy Policy</button>.
                </p>
            </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
            <button 
                onClick={handleDecline}
                className="flex-1 md:flex-none px-5 py-2.5 rounded-xl border border-brand-medium/30 text-sm font-bold text-brand-dark hover:bg-brand-light transition-colors"
            >
                Decline
            </button>
            <button 
                onClick={handleAccept}
                className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-brand-dark text-white text-sm font-bold shadow-md hover:bg-brand-dark/90 transition-transform active:scale-95 whitespace-nowrap"
            >
                Accept All
            </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
