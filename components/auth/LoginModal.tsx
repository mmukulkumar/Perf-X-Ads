
import React, { useState } from 'react';
import { X, Mail, Github, Loader2, ArrowRight, Lock, User, ShieldCheck, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GoogleLogo = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, loginWithSocial, loginAsDemo } = useAuth();
  const [mode, setMode] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Only for admin simulation
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [adminError, setAdminError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await login(email);
    setLoading(false);
    onClose();
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setSocialLoading(provider);
    try {
      await loginWithSocial(provider);
    } catch (e) {
      setSocialLoading(null);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setLoading(true);

    // Simulated Admin Login Check
    if (email === 'admin@perfxads.com' && password === 'admin123') {
        await loginAsDemo(); // This sets the User context to the Admin Demo user
        setLoading(false);
        onClose();
    } else {
        await new Promise(resolve => setTimeout(resolve, 600)); // Fake network delay
        setAdminError('Invalid admin credentials.');
        setLoading(false);
    }
  };

  const switchMode = (newMode: 'user' | 'admin') => {
      setMode(newMode);
      setAdminError('');
      setEmail(newMode === 'admin' ? 'admin@perfxads.com' : '');
      setPassword('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-brand-surface rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-brand-medium/20 relative flex flex-col transition-all duration-300">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-brand-dark/40 hover:text-brand-dark hover:bg-brand-light rounded-full transition-colors z-10"
        >
            <X className="w-5 h-5" />
        </button>

        {mode === 'user' ? (
            <div className="p-8 animate-in fade-in slide-in-from-left-4 duration-300">
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
                        disabled={!!socialLoading || loading}
                        className="w-full py-3.5 px-4 bg-white dark:bg-white border border-brand-medium/30 rounded-xl text-gray-800 font-bold text-sm hover:bg-gray-50 hover:shadow-md transition-all flex items-center justify-center gap-3 relative group disabled:opacity-70 disabled:cursor-not-allowed shadow-sm active:scale-98"
                    >
                        {socialLoading === 'google' ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                        ) : (
                        <GoogleLogo />
                        )}
                        <span>Sign in with Google</span>
                    </button>
                    
                    <button 
                        onClick={() => handleSocialLogin('github')}
                        disabled={!!socialLoading || loading}
                        className="w-full py-3.5 px-4 bg-[#24292e] text-white rounded-xl font-bold text-sm hover:bg-[#2f363d] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm active:scale-98"
                    >
                        {socialLoading === 'github' ? (
                        <Loader2 className="w-5 h-5 animate-spin text-white/60" />
                        ) : (
                        <Github className="w-5 h-5" />
                        )}
                        <span>Continue with GitHub</span>
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
                        disabled={loading || !!socialLoading}
                        className="w-full py-3 bg-brand-primary text-white font-bold rounded-xl shadow-md hover:bg-brand-primary/90 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && !socialLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {loading ? 'Sending...' : 'Send Magic Link'}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-brand-medium/20 text-center">
                    <button 
                        onClick={() => switchMode('admin')} 
                        className="text-xs font-bold text-brand-dark/40 hover:text-brand-dark flex items-center justify-center gap-1 mx-auto transition-colors"
                    >
                        <Lock className="w-3 h-3" /> Admin Access
                    </button>
                </div>
            </div>
        ) : (
            <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="mb-6">
                    <button 
                        onClick={() => switchMode('user')}
                        className="text-xs font-bold text-brand-dark/60 hover:text-brand-dark flex items-center gap-1 transition-colors mb-4"
                    >
                        <ChevronLeft className="w-3 h-3" /> Back to Login
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-brand-dark text-brand-light rounded-lg">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-brand-dark">Admin Portal</h2>
                    </div>
                    <p className="text-brand-dark/60 text-sm">Enter administrator credentials to access the backend dashboard.</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                    {adminError && (
                        <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg font-medium border border-red-100 flex items-center gap-2">
                            <ArrowRight className="w-3 h-3" /> {adminError}
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5 ml-1">Admin ID</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 w-4 h-4 text-brand-dark/40" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@perfxads.com"
                                className="w-full pl-10 pr-4 py-3 bg-brand-light/30 border border-brand-medium/30 rounded-xl text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder-brand-dark/30"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-4 h-4 text-brand-dark/40" />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 bg-brand-light/30 border border-brand-medium/30 rounded-xl text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder-brand-dark/30"
                                required
                            />
                        </div>
                        <p className="text-[10px] text-brand-dark/40 mt-1.5 ml-1">
                            Demo Credentials: <strong>admin123</strong>
                        </p>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-brand-dark text-white font-bold rounded-xl shadow-md hover:bg-brand-dark/90 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                        {loading ? 'Verifying...' : 'Access Dashboard'}
                    </button>
                </form>
            </div>
        )}
        
        {mode === 'user' && (
            <div className="p-4 bg-brand-light/30 border-t border-brand-medium/20 text-center">
                <button 
                    onClick={() => {
                        // Quick demo shortcut
                        loginAsDemo();
                        onClose();
                    }}
                    disabled={loading || !!socialLoading}
                    className="text-sm font-bold text-brand-primary hover:text-brand-dark transition-colors flex items-center justify-center gap-1 mx-auto mb-1"
                >
                    Quick Demo Access <ArrowRight className="w-3 h-3" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
