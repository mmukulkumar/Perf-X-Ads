
import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, loginWithSocial, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCaptchaVerified(false);
      
      const renderCaptcha = () => {
        if (window.grecaptcha && window.grecaptcha.render && captchaRef.current) {
          try {
            // Check if captcha is already rendered in this container to avoid error
            if (captchaRef.current.innerHTML === '') {
              widgetIdRef.current = window.grecaptcha.render(captchaRef.current, {
                'sitekey': '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Google Test Key
                'callback': () => setCaptchaVerified(true),
                'expired-callback': () => setCaptchaVerified(false),
                'theme': 'light'
              });
            }
          } catch (e) {
            console.error('reCAPTCHA render error:', e);
          }
        } else {
          // Retry if script hasn't loaded yet
          setTimeout(renderCaptcha, 100);
        }
      };

      // Slight delay to ensure DOM is ready
      setTimeout(renderCaptcha, 100);
    } else {
        // Reset state on close
        setCaptchaVerified(false);
        widgetIdRef.current = null;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!captchaVerified) {
        alert("Please complete the CAPTCHA check.");
        return;
    }
    await login(email);
    onClose();
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    await loginWithSocial(provider);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-brand-medium/20 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-brand-dark/40 hover:text-brand-dark hover:bg-brand-light rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
               <img src="https://i.ibb.co/7jRB122/Perf-X-Ads-3.png" alt="Perf X Ads" className="h-12 w-auto dark:hidden" />
               <img src="https://i.ibb.co/3ykJF5h/Perf-X-Ads-2.png" alt="Perf X Ads" className="h-12 w-auto hidden dark:block" />
            </div>
            <h2 className="text-2xl font-bold text-brand-dark mb-2">Welcome Back</h2>
            <p className="text-brand-dark/60 text-sm">Sign in to access your dashboard and tools</p>
          </div>

          <div className="space-y-3 mb-8">
            <button 
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-brand-surface border border-brand-medium/30 rounded-xl text-brand-dark font-medium hover:bg-brand-light transition-all shadow-sm hover:shadow active:scale-98"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.14-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
            <button 
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#24292F] text-white rounded-xl font-medium hover:bg-[#24292F]/90 transition-all shadow-sm hover:shadow active:scale-98"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Continue with GitHub
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-medium/20"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-[#0F172A] text-brand-dark/40">Or continue with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-brand-medium" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="w-full pl-12 pr-4 py-3 bg-brand-light/30 border border-brand-medium/30 rounded-xl text-brand-dark placeholder-brand-dark/30 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-brand-medium" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full pl-12 pr-4 py-3 bg-brand-light/30 border border-brand-medium/30 rounded-xl text-brand-dark placeholder-brand-dark/30 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  required={!isForgotPassword} // Not required if simulated forgot pass
                />
              </div>
            </div>

            {/* Google reCAPTCHA Container */}
            <div className="flex justify-center py-2">
                <div ref={captchaRef}></div>
            </div>

            <button 
              type="submit"
              disabled={isLoading || !captchaVerified}
              className={`w-full py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 ${
                  !captchaVerified 
                  ? 'bg-brand-medium/50 text-white/80 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
              }`}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 
               !captchaVerified ? <><ShieldCheck className="w-4 h-4" /> Verify Captcha</> : 
               <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-brand-dark/60">
            Don't have an account? <button onClick={() => {}} className="text-indigo-600 font-bold hover:underline">Sign up</button>
          </div>
          
          <div className="mt-4 p-3 bg-brand-light/50 rounded-lg text-xs text-center text-brand-dark/50">
             Tip: Use <strong>admin@perfxads.com</strong> to test Admin Dashboard.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
