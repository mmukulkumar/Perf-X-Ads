
import React from 'react';
import { X, Shield } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-brand-surface rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl border border-brand-medium/20 flex flex-col">
        <div className="p-6 border-b border-brand-medium/20 flex justify-between items-center bg-brand-light/30">
          <div className="flex items-center gap-2">
             <Shield className="w-5 h-5 text-brand-primary" />
             <h2 className="text-xl font-bold text-brand-dark">Privacy Policy</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-light rounded-full transition-colors"><X className="w-5 h-5 text-brand-dark" /></button>
        </div>
        
        <div className="p-8 overflow-y-auto text-sm text-brand-dark/80 leading-relaxed space-y-6">
            <p className="font-medium text-xs text-brand-dark/50 uppercase tracking-wide">Last Updated: October 28, 2025</p>
            
            <section>
                <h3 className="text-lg font-bold text-brand-dark mb-2">1. Introduction</h3>
                <p>Welcome to Perf X Ads. We value your privacy and are committed to protecting your personal data. This privacy policy explains how we look after your personal data when you visit our website and use our tools.</p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-brand-dark mb-2">2. Data We Collect</h3>
                <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 marker:text-brand-medium">
                    <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                    <li><strong>Contact Data:</strong> includes email address.</li>
                    <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
                    <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-bold text-brand-dark mb-2">3. How We Use Your Data</h3>
                <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 marker:text-brand-medium">
                    <li>To provide the tools and services you request.</li>
                    <li>To manage your account and subscription.</li>
                    <li>To improve our website and services based on usage patterns.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-bold text-brand-dark mb-2">4. Cookies</h3>
                <p>We use cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site. You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.</p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-brand-dark mb-2">5. Data Security</h3>
                <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-brand-dark mb-2">6. Contact Us</h3>
                <p>If you have any questions about this privacy policy or our privacy practices, please contact us at support@perfxads.com.</p>
            </section>
        </div>

        <div className="p-6 border-t border-brand-medium/20 bg-brand-light/30 flex justify-end">
            <button onClick={onClose} className="px-6 py-2.5 bg-brand-dark text-white font-bold rounded-xl shadow-sm hover:bg-brand-dark/90 transition-all active:scale-95">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
