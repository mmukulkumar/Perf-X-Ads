import React, { useState } from 'react';
import { X, Mail, Github, Chrome } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, loginWithSocial } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await login(email);
    setLoading(false);
    onClose();
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    await loginWithSocial(provider);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-brand-surface rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-brand-medium/20 relative">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-brand-dark/40 hover:text-brand-dark hover:bg-brand-light rounded-full transition-colors z-10"
        >
            <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
               <span className="font-serif text-3xl font-black tracking-tighter text-brand-dark">
                Perfxads
               </span>
            </div>
            <h2 className="text-xl font-bold text-brand-dark mb-2">Welcome Back</h2>
            <p className="text-brand-dark/60 text-sm">Sign in to access your dashboard and tools</p>
          </div>

          <div className="space-y-3 mb-8">
            <button 
                onClick={() => handleSocialLogin('google')}
                className="w-full py-2.5 px-4 bg-white dark:bg-brand-surface border border-brand-medium/30 rounded-xl text-brand-dark font-bold text-sm hover:bg-brand-light transition-colors flex items-center justify-center gap-3 relative group"
            >
                <Chrome className="w-5 h-5 text-blue-600" />
                Continue with Google
            </button>
            <button 
                onClick={() => handleSocialLogin('github')}
                className="w-full py-2.5 px-4 bg-brand-dark text-white rounded-xl font-bold text-sm hover:bg-brand-dark/90 transition-colors flex items-center justify-center gap-3"
            >
                <Github className="w-5 h-5" />
                Continue with GitHub
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-medium/20"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-brand-surface px-2 text-brand-dark/40 font-bold">Or with email</span></div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5 ml-1">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-brand-dark/40" />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full pl-10 pr-4 py-3 bg-brand-light/30 border border-brand-medium/30 rounded-xl text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder-brand-dark/30"
                        required
                    />
                </div>
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-brand-primary text-white font-bold rounded-xl shadow-md hover:bg-brand-primary/90 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? 'Sending Magic Link...' : 'Send Magic Link'}
            </button>
          </form>
        </div>
        
        <div className="p-4 bg-brand-light/30 border-t border-brand-medium/20 text-center">
            <p className="text-xs text-brand-dark/50">
                By continuing, you agree to our <button className="underline hover:text-brand-dark">Terms</button> and <button className="underline hover:text-brand-dark">Privacy Policy</button>.
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;