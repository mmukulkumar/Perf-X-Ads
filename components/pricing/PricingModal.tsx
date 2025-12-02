
import React, { useState, useEffect } from 'react';
import { X, Check, Zap, Star, Shield, Loader2, Users, Minus, Plus, Tag, ArrowLeft, CreditCard, Lock, AlertCircle, Server, Info } from 'lucide-react';
import { useAuth, SubscriptionTier } from '../../contexts/AuthContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simulated Payment Component (Replaces Stripe)
const SimulatedPaymentForm: React.FC<{
    currentTotal: number;
    planName: string;
    onSuccess: () => void;
    isProcessing: boolean;
    setIsProcessing: (val: boolean) => void;
}> = ({ currentTotal, planName, onSuccess, isProcessing, setIsProcessing }) => {
    const [cardholderName, setCardholderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!cardholderName.trim()) {
            setError("Cardholder name is required.");
            return;
        }
        if (cardNumber.length < 16) {
            setError("Please enter a valid card number.");
            return;
        }

        setIsProcessing(true);

        // Simulate Network Request
        setTimeout(() => {
            console.log('Transaction approved (Simulated)');
            setIsProcessing(false);
            onSuccess();
        }, 1500);
    };

    return (
        <form onSubmit={handlePayment} className="space-y-5">
            {/* Simulation Indicator */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-xs text-blue-800 dark:text-blue-200">
                <div className="flex items-center gap-2 font-bold mb-1">
                    <Info className="w-4 h-4" />
                    <span>Secure Checkout</span>
                </div>
                <p className="opacity-90">Enter your payment details to upgrade.</p>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2 border border-red-100 animate-in fade-in">
                    <AlertCircle className="w-4 h-4" /> {error}
                </div>
            )}
            
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5">Card Number</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                            placeholder="0000 0000 0000 0000" 
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-brand-surface border border-brand-medium/30 rounded-lg outline-none text-brand-dark text-sm placeholder-brand-dark/30 focus:border-indigo-500 transition-colors shadow-sm font-mono"
                        />
                        <CreditCard className="absolute left-3 top-3 w-4 h-4 text-brand-dark/40" />
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5">Expiry</label>
                        <input 
                            type="text" 
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            placeholder="MM/YY" 
                            className="w-full p-3 bg-white dark:bg-brand-surface border border-brand-medium/30 rounded-lg outline-none text-brand-dark text-sm placeholder-brand-dark/30 focus:border-indigo-500 transition-colors shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5">CVC</label>
                        <input 
                            type="text" 
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            placeholder="123" 
                            className="w-full p-3 bg-white dark:bg-brand-surface border border-brand-medium/30 rounded-lg outline-none text-brand-dark text-sm placeholder-brand-dark/30 focus:border-indigo-500 transition-colors shadow-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5">Cardholder Name</label>
                    <input 
                        type="text" 
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder="Full name on card" 
                        className="w-full p-3 bg-white dark:bg-brand-surface border border-brand-medium/30 rounded-lg outline-none text-brand-dark text-sm placeholder-brand-dark/30 focus:border-indigo-500 transition-colors shadow-sm"
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing Payment...</span>
                    </>
                ) : (
                    <>Pay ${currentTotal.toFixed(2)}</>
                )}
            </button>

            <div className="flex flex-col items-center justify-center gap-2 text-xs text-brand-dark/40 mt-4">
                <div className="flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    <span>Payments processed securely</span>
                </div>
                <div className="flex gap-1 items-center">
                    <Server className="w-3 h-3" />
                    <span>Encrypted via 256-bit SSL</span>
                </div>
            </div>
        </form>
    );
};

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const { upgradeSubscription } = useAuth();
  const [step, setStep] = useState<'select' | 'payment'>('select');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // User Seat State
  const [seatCount, setSeatCount] = useState(1);
  const [lifetimeOption, setLifetimeOption] = useState<'solo' | 'team5'>('solo');

  // Reset state when opening/closing
  useEffect(() => {
    if (!isOpen) {
        setStep('select');
        setIsProcessing(false);
        setSeatCount(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- Pricing Logic ---
  const getPrice = (tier: SubscriptionTier) => {
      if (tier === 'lifetime') {
          return lifetimeOption === 'solo' ? 249 : 1890;
      }
      const base = billingCycle === 'annual' ? 15 : 29;
      return base;
  };

  const calculateTotal = (tier: SubscriptionTier) => {
      if (tier === 'lifetime') return getPrice(tier);
      
      const base = getPrice(tier);
      const subTotal = base * seatCount;
      const isBulkDiscount = seatCount >= 10;
      const discountAmount = isBulkDiscount ? subTotal * 0.20 : 0;
      return subTotal - discountAmount;
  };

  const handlePlanSelect = (tier: SubscriptionTier) => {
    setSelectedPlan(tier);
    setStep('payment');
  };

  const handlePaymentSuccess = async () => {
      if (selectedPlan) {
          await upgradeSubscription(selectedPlan);
          setIsProcessing(false);
          setStep('select'); 
          setSelectedPlan(null);
          onClose();
      }
  };

  // --- Render Helpers ---
  const annualSavingsPerUser = (29 * 12) - (15 * 12);
  
  const currentTotal = selectedPlan ? calculateTotal(selectedPlan) : 0;
  const planName = selectedPlan === 'lifetime' 
    ? `Lifetime Access (${lifetimeOption === 'solo' ? 'Solo' : 'Team'})` 
    : `Pro ${billingCycle === 'annual' ? 'Annual' : 'Monthly'} (${seatCount} Seats)`;

  const ApplePayLogo = ({ className = "h-6 w-auto" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 132 54" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M51.1,25.6c0-6.9,5.7-10.3,6-10.5c-3.3-4.6-8.4-5.3-10.2-5.3c-4.3-0.4-8.4,2.5-10.6,2.5c-2.2,0-5.5-2.4-9.1-2.4c-4.7,0-9,2.7-11.4,6.9C10.9,25.4,14.5,35.8,19.2,42.5c2.3,3.3,5,6.9,8.6,6.8c3.4-0.1,4.7-2.2,8.8-2.2c4.1,0,5.3,2.2,8.9,2.1c3.7-0.1,6-3.3,8.2-6.5c2.6-3.7,3.6-7.3,3.7-7.5C57.3,35.2,51.1,32.9,51.1,25.6z M36.3,10.6c1.9-2.3,3.2-5.5,2.8-8.7c-2.7,0.1-6,1.8-8,4.1c-1.7,2-3.3,5.2-2.9,8.3C31.2,14.5,34.2,12.8,36.3,10.6z"/>
        <path fill="currentColor" d="M68.5,13h5.9c3.4,0,5.9,0.7,7.5,2.1c1.6,1.4,2.4,3.4,2.4,6.1c0,2.8-0.8,4.9-2.5,6.3c-1.7,1.4-4.2,2.2-7.5,2.2h-2.3v13h-3.5V13z M72,26.7h2.2c2.3,0,3.9-0.4,4.8-1.2c0.9-0.8,1.4-2.1,1.4-3.7c0-1.6-0.4-2.8-1.3-3.6c-0.9-0.8-2.4-1.2-4.6-1.2H72V26.7z"/>
        <path fill="currentColor" d="M102.2,25.7v17h-3.3v-2.3c-1.6,1.9-3.7,2.8-6.3,2.8c-2.4,0-4.3-0.7-5.8-2.2c-1.5-1.5-2.2-3.4-2.2-5.8c0-2.6,0.9-4.7,2.6-6.1c1.7-1.5,4.1-2.2,7.2-2.2h4.3v-0.7c0-1.3-0.3-2.3-1-3c-0.7-0.7-1.7-1-3.1-1c-2.4,0-4.4,0.9-6.1,2.6l-2-2.1c2.3-2.3,5.1-3.5,8.5-3.5c2.3,0,4.1,0.6,5.3,1.8C101.5,22.2,102.2,23.8,102.2,25.7z M98.8,31.7h-3.8c-2.1,0-3.6,0.4-4.6,1.1c-1,0.7-1.5,1.7-1.5,3c0,1.3,0.4,2.3,1.3,3c0.9,0.7,2,1.1,3.4,1.1c1.7,0,3.2-0.6,4.2-1.8c1-1.2,1.6-2.9,1.6-5.1v-1.3H98.8z"/>
        <path fill="currentColor" d="M107.5,19.5l-4-6.2h3.8l2.1,3.9l2-3.9h3.7l-9.9,16.7c-1.2,2-2.2,3.4-2.8,4.1c-0.7,0.7-1.5,1.2-2.6,1.5l-1.2-2.6c0.6-0.2,1.1-0.5,1.6-0.9c0.4-0.4,1.1-1.3,2-2.7L107.5,19.5z"/>
    </svg>
  );

  const GooglePayLogo = ({ className = "h-6 w-auto" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 132 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M49.33 23.33V32.79H46.39V23.77C46.39 21.73 45.37 20.78 43.6 20.78C42.06 20.78 40.68 21.49 39.97 22.86V32.79H37.03V17.74H39.86V20.06H40.01C41.34 18.25 43.23 17.37 45.42 17.37C47.04 17.37 48.27 17.85 49.12 18.79C49.97 19.74 50.43 21.17 50.43 22.95L49.33 23.33ZM33.56 22.09C33.56 20.57 33.15 19.35 32.33 18.42C31.51 17.49 30.39 17.03 28.97 17.03C27.42 17.03 26.12 17.57 25.07 18.65C24.03 19.72 23.51 21.05 23.51 22.64C23.51 24.27 24.03 25.62 25.07 26.69C26.12 27.76 27.42 28.3 28.97 28.3C30.33 28.3 31.42 27.87 32.22 27.01C33.02 26.15 33.42 25.03 33.42 23.66V22.09H33.56ZM36.19 22.64C36.19 24.87 35.48 26.65 34.05 28.05C32.63 29.45 30.93 30.15 28.97 30.15C26.79 30.15 24.96 29.43 23.49 27.99C22.02 26.55 21.28 24.77 21.28 22.64C21.28 20.53 22.01 18.77 23.46 17.36C24.92 15.94 26.73 15.23 28.89 15.23C31.05 15.23 32.84 15.93 34.25 17.32C35.66 18.72 36.37 20.49 36.37 22.64H36.19ZM20.21 32.79H17.27V15.6H20.21V32.79ZM65.81 17.74H62.97L59.18 29.32H56.12L52.4 17.74H49.33L54.73 32.79H57.77L63.09 17.74H65.81ZM72.76 22.09C72.76 20.57 72.35 19.35 71.53 18.42C70.71 17.49 69.59 17.03 68.17 17.03C66.62 17.03 65.32 17.57 64.27 18.65C63.23 19.72 62.71 21.05 62.71 22.64C62.71 24.27 63.23 25.62 64.27 26.69C65.32 27.76 66.62 28.3 68.17 28.3C69.53 28.3 70.62 27.87 71.42 27.01C72.22 26.15 72.62 25.03 72.62 23.66V22.09H72.76ZM75.39 22.64C75.39 24.87 74.68 26.65 73.25 28.05C71.83 29.45 70.13 30.15 68.17 30.15C65.99 30.15 64.16 29.43 62.69 27.99C61.22 26.55 60.48 24.77 60.48 22.64C60.48 20.53 61.21 18.77 62.66 17.36C64.12 15.94 65.93 15.23 68.09 15.23C70.25 15.23 72.04 15.93 73.45 17.32C74.86 18.72 75.57 20.49 75.57 22.64H75.39Z" fill="#5F6368"/>
        <path d="M14.39 23.01V32.79H8.62V23.23C8.62 20.25 9.39 17.72 10.93 15.63H5.66V12.7H17.44V32.79H14.39V23.01Z" fill="#4285F4"/>
        <path d="M29.56 12.7H35.33V32.79H29.56V12.7Z" fill="#34A853"/>
        <path d="M14.39 12.7V23.01C15.82 22.38 17.35 22.05 18.91 22.05C22.61 22.05 25.7 23.36 28.18 25.98V15.63C26.79 13.68 24.96 12.7 22.69 12.7H14.39Z" fill="#EA4335"/>
        <path d="M18.91 33.15C15.93 33.15 13.39 32.19 11.29 30.27C9.19 28.35 8.14 25.81 8.14 22.64C8.14 19.47 9.19 16.93 11.29 15.01C13.39 13.09 15.93 12.13 18.91 12.13C21.89 12.13 24.43 13.09 26.53 15.01C28.63 16.93 29.68 19.47 29.68 22.64C29.68 25.81 28.63 28.35 26.53 30.27C24.43 32.19 21.89 33.15 18.91 33.15Z" fill="#FBBC04"/>
    </svg>
  );

  const PayPalLogo = ({ className = "h-5 w-auto" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 124 33" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M46.211 11.838c-1.378-1.944-4.011-3.04-8.216-3.04h-8.368c-0.669 0-1.255 0.474-1.372 1.134l-3.9 21.884c-0.07 0.399 0.237 0.771 0.643 0.771h4.755c0.59 0 1.096-0.428 1.196-1.01l0.026-0.12 1.304-8.261 0.032-0.203c0.1-0.632 0.645-1.091 1.285-1.091h2.529c5.034 0 8.956-2.046 10.086-7.859 0.083-0.44 0.132-0.871 0.147-1.293 0.027-0.34 0.024-0.662-0.147-0.912z" fill="#003087"/>
        <path d="M46.211 11.838c-1.378-1.944-4.011-3.04-8.216-3.04h-8.368c-0.669 0-1.255 0.474-1.372 1.134l-3.9 21.884c-0.07 0.399 0.237 0.771 0.643 0.771h4.755c0.59 0 1.096-0.428 1.196-1.01l0.026-0.12 1.304-8.261 0.032-0.203c0.1-0.632 0.645-1.091 1.285-1.091h2.529c5.034 0 8.956-2.046 10.086-7.859 0.083-0.44 0.132-0.871 0.147-1.293 0.027-0.34 0.024-0.662-0.147-0.912z" fill="#003087"/>
        <path d="M21.573 1.134C21.691 0.474 22.277 0 22.946 0h8.92c4.464 0 7.893 0.932 9.479 2.879 1.957 2.404 1.637 5.922-0.627 9.29-2.226 3.32-6.262 5.09-11.234 5.09h-4.32c-0.59 0-1.096 0.429-1.196 1.01l-1.638 10.372-0.323 2.049c-0.07 0.399 0.237 0.771 0.643 0.771h5.36c0.59 0 1.096-0.428 1.196-1.01l0.06-0.342 1.15-7.291c0.1-0.632 0.645-1.091 1.285-1.091h1.564c4.619 0 8.219-1.879 9.253-7.214 0.023-0.117 0.043-0.233 0.062-0.35 0.92-4.805-2.254-8.03-7.56-8.03h-8.92c-0.669 0-1.255 0.474-1.372 1.134L17.7 26.59c-0.07 0.399 0.237 0.771 0.643 0.771h4.821l1.638-10.371 1.771-11.216z" fill="#009cde"/>
        <path d="M103.771 1.134C103.889 0.474 104.475 0 105.144 0h8.92c4.464 0 7.893 0.932 9.479 2.879 1.957 2.404 1.637 5.922-0.627 9.29-2.226 3.32-6.262 5.09-11.234 5.09h-4.32c-0.59 0-1.096 0.429-1.196 1.01l-1.638 10.372-0.323 2.049c-0.07 0.399 0.237 0.771 0.643 0.771h5.36c0.59 0 1.096-0.428 1.196-1.01l0.06-0.342 1.15-7.291c0.1-0.632 0.645-1.091 1.285-1.091h1.564c4.619 0 8.219-1.879 9.253-7.214 0.023-0.117 0.043-0.233 0.062-0.35 0.92-4.805-2.254-8.03-7.56-8.03h-8.92c-0.669 0-1.255 0.474-1.372 1.134l-8.498 25.456c-0.07 0.399 0.237 0.771 0.643 0.771h4.821l1.638-10.371 1.771-11.216z" fill="#009cde"/>
        <path d="M99.897 26.59l-2.023 2.023c-0.399 0.399-1.092 0.203-1.205-0.34l-4.437-21.211c-0.135-0.646 0.36-1.246 1.019-1.246h4.372c0.474 0 0.893 0.318 1.026 0.778l3.023 10.495 2.879-10.48c0.129-0.469 0.556-0.793 1.042-0.793h4.312c0.65 0 1.144 0.587 1.019 1.222l-8.629 44.022c-0.106 0.541-0.579 0.939-1.129 0.939h-4.321c-0.569 0-1.054-0.423-1.118-0.988l-0.782-6.852 4.952-16.79z" fill="#009cde"/>
        <path d="M58.75 26.59l-2.023 2.023c-0.399 0.399-1.092 0.203-1.205-0.34l-4.437-21.211c-0.135-0.646 0.36-1.246 1.019-1.246h4.372c0.474 0 0.893 0.318 1.026 0.778l3.023 10.495 2.879-10.48c0.129-0.469 0.556-0.793 1.042-0.793h4.312c0.65 0 1.144 0.587 1.019 1.222l-8.629 44.022c-0.106 0.541-0.579 0.939-1.129 0.939h-4.321c-0.569 0-1.054-0.423-1.118-0.988l-0.782-6.852 4.952-16.79z" fill="#009cde"/>
    </svg>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-brand-surface rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-brand-medium/20 flex flex-col md:flex-row">
         
         {/* Left Panel - Value Prop */}
         <div className="w-full md:w-1/3 bg-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            <div className="relative z-10">
                <div className="mb-8">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                        <Zap className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Upgrade to Pro</h2>
                    <p className="text-white/70 text-sm">Unlock the full power of Perf X Ads and scale your marketing.</p>
                </div>
                
                <ul className="space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-400 shrink-0" />
                        <span>Unlimited Tool Access</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-400 shrink-0" />
                        <span>Advanced AI Analysis</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-400 shrink-0" />
                        <span>Priority Support</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-400 shrink-0" />
                        <span>Export & Save Reports</span>
                    </li>
                </ul>
            </div>
            
            <div className="relative z-10 pt-8 border-t border-white/10 mt-8">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-white/60" />
                    <span className="text-xs text-white/60 font-medium">Secure Payment</span>
                </div>
                <div className="flex gap-2 opacity-50 grayscale">
                    <div className="h-6 w-10 bg-white rounded"></div>
                    <div className="h-6 w-10 bg-white rounded"></div>
                    <div className="h-6 w-10 bg-white rounded"></div>
                </div>
            </div>
         </div>

         {/* Right Panel - Plan Selection & Payment */}
         <div className="flex-1 bg-brand-surface p-8 overflow-y-auto relative">
             <button 
                onClick={onClose} 
                className="absolute top-4 right-4 p-2 text-brand-dark/40 hover:text-brand-dark hover:bg-brand-light rounded-full transition-colors z-10"
             >
                <X className="w-5 h-5" />
             </button>

             {step === 'select' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                     <div className="text-center mb-6">
                         <h3 className="text-xl font-bold text-brand-dark mb-4">Choose your plan</h3>
                         <div className="inline-flex bg-brand-light p-1 rounded-xl border border-brand-medium/20">
                             <button 
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-brand-dark' : 'text-brand-dark/60 hover:text-brand-dark'}`}
                             >
                                 Monthly
                             </button>
                             <button 
                                onClick={() => setBillingCycle('annual')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'annual' ? 'bg-white shadow-sm text-brand-dark' : 'text-brand-dark/60 hover:text-brand-dark'}`}
                             >
                                 Yearly <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase">Save 50%</span>
                             </button>
                         </div>
                     </div>

                     {/* Plan Cards */}
                     <div className="grid grid-cols-1 gap-4">
                         {/* Pro Plan */}
                         <div 
                            onClick={() => handlePlanSelect(billingCycle === 'monthly' ? 'monthly' : 'annual')}
                            className="border-2 border-brand-primary/20 bg-brand-primary/5 hover:border-brand-primary hover:bg-brand-primary/10 rounded-xl p-5 cursor-pointer transition-all group relative overflow-hidden"
                         >
                             <div className="absolute top-0 right-0 bg-brand-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wide">Most Popular</div>
                             <div className="flex justify-between items-center mb-2">
                                 <div>
                                     <h4 className="font-bold text-brand-dark text-lg group-hover:text-brand-primary transition-colors">Pro</h4>
                                     <p className="text-sm text-brand-dark/60">For freelancers & marketers</p>
                                 </div>
                                 <div className="text-right">
                                     <div className="text-2xl font-extrabold text-brand-dark">${billingCycle === 'annual' ? '15' : '29'}<span className="text-sm font-normal text-brand-dark/50">/mo</span></div>
                                     {billingCycle === 'annual' && <div className="text-xs text-green-600 font-medium">Billed $180 yearly</div>}
                                 </div>
                             </div>
                             <ul className="space-y-1 text-sm text-brand-dark/70">
                                 <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand-primary" /> Unlimited AI Generations</li>
                                 <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand-primary" /> All Pro Tools</li>
                             </ul>
                         </div>

                         {/* Lifetime Plan */}
                         <div 
                            onClick={() => handlePlanSelect('lifetime')}
                            className="border border-brand-medium/30 bg-brand-surface hover:border-purple-500 hover:bg-purple-50/50 rounded-xl p-5 cursor-pointer transition-all group"
                         >
                             <div className="flex justify-between items-center mb-2">
                                 <div>
                                     <h4 className="font-bold text-brand-dark text-lg group-hover:text-purple-600 transition-colors flex items-center gap-2">Lifetime <Star className="w-4 h-4 text-yellow-400 fill-current" /></h4>
                                     <p className="text-sm text-brand-dark/60">Pay once, own forever</p>
                                 </div>
                                 <div className="text-right">
                                     <div className="text-2xl font-extrabold text-brand-dark">$249</div>
                                     <div className="text-xs text-brand-dark/50">One-time payment</div>
                                 </div>
                             </div>
                             <ul className="space-y-1 text-sm text-brand-dark/70">
                                 <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-500" /> Lifetime access to all future updates</li>
                                 <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-500" /> No recurring fees</li>
                             </ul>
                         </div>
                     </div>
                     
                     <div className="text-center">
                        <button onClick={onClose} className="text-sm text-brand-dark/50 hover:text-brand-dark underline decoration-dotted">Continue with Free Plan</button>
                     </div>
                 </div>
             )}

             {step === 'payment' && (
                 <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                     <button onClick={() => setStep('select')} className="flex items-center gap-1 text-sm font-medium text-brand-dark/50 hover:text-brand-dark mb-6">
                         <ArrowLeft className="w-4 h-4" /> Back
                     </button>

                     <h3 className="text-xl font-bold text-brand-dark mb-6">Checkout</h3>

                     <div className="bg-brand-light/30 rounded-xl p-4 mb-6 border border-brand-medium/20">
                         <div className="flex justify-between items-center mb-2">
                             <span className="font-bold text-brand-dark">{planName}</span>
                             <span className="font-bold text-brand-dark">${currentTotal.toFixed(2)}</span>
                         </div>
                         {selectedPlan !== 'lifetime' && (
                             <div className="flex justify-between items-center text-sm text-brand-dark/60">
                                 <span>Billed {billingCycle}</span>
                                 {billingCycle === 'annual' && <span className="text-green-600">Saved ${(29 * 12 - 15 * 12) * seatCount}</span>}
                             </div>
                         )}
                         {selectedPlan !== 'lifetime' && (
                             <div className="mt-3 pt-3 border-t border-brand-medium/10 flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                     <span className="text-sm font-medium text-brand-dark">Seats</span>
                                     <div className="flex items-center gap-2">
                                         <button onClick={() => setSeatCount(Math.max(1, seatCount - 1))} className="p-1 rounded bg-brand-surface border hover:bg-brand-light"><Minus className="w-3 h-3" /></button>
                                         <span className="text-sm font-bold w-4 text-center">{seatCount}</span>
                                         <button onClick={() => setSeatCount(seatCount + 1)} className="p-1 rounded bg-brand-surface border hover:bg-brand-light"><Plus className="w-3 h-3" /></button>
                                     </div>
                                 </div>
                             </div>
                         )}
                     </div>

                     <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-brand-medium/20"></div>
                                <span className="flex-shrink-0 mx-4 text-xs font-bold text-brand-dark/40 uppercase">Express Checkout</span>
                                <div className="flex-grow border-t border-brand-medium/20"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center py-2.5 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors border border-black/10 shadow-sm relative group overflow-hidden">
                                     <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                     <ApplePayLogo className="h-5 w-auto" />
                                </button>
                                <button className="flex items-center justify-center py-2.5 bg-white text-black border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm relative group overflow-hidden">
                                     <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                     <GooglePayLogo className="h-5 w-auto" />
                                </button>
                            </div>
                            
                            <button className="w-full py-2.5 bg-[#FFC439] hover:bg-[#F4BB33] text-[#003087] font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center relative group overflow-hidden">
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <PayPalLogo className="h-5 w-auto" />
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-medium/20"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-2 bg-brand-light/20 text-brand-dark/40 font-medium">Or pay with card</span></div>
                        </div>

                        {/* Simulated Payment Form */}
                        <SimulatedPaymentForm 
                            currentTotal={currentTotal} 
                            planName={planName} 
                            onSuccess={handlePaymentSuccess} 
                            isProcessing={isProcessing} 
                            setIsProcessing={setIsProcessing} 
                        />
                     </div>
                 </div>
             )}
         </div>
      </div>
    </div>
  );
};

export default PricingModal;
