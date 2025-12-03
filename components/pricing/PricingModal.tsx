
import React, { useState, useEffect } from 'react';
import { X, Check, Zap, Star, Loader2, Minus, Plus, ArrowLeft, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { useAuth, SubscriptionTier } from '../../contexts/AuthContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

  const handleCheckout = async () => {
      if (!selectedPlan) return;
      setIsProcessing(true);
      
      // Determine Stripe Price ID based on selection
      // Note: In a real app, these IDs come from your Stripe Dashboard
      let priceId = '';
      if (selectedPlan === 'lifetime') priceId = 'price_lifetime_id_placeholder';
      else if (billingCycle === 'annual') priceId = 'price_annual_id_placeholder';
      else priceId = 'price_monthly_id_placeholder';

      await upgradeSubscription(priceId);
      
      // If the function falls back to simulation (in AuthContext), we close the modal
      setIsProcessing(false);
      onClose();
  };

  // --- Render Helpers ---
  const currentTotal = selectedPlan ? calculateTotal(selectedPlan) : 0;
  const planName = selectedPlan === 'lifetime' 
    ? `Lifetime Access (${lifetimeOption === 'solo' ? 'Solo' : 'Team'})` 
    : `Pro ${billingCycle === 'annual' ? 'Annual' : 'Monthly'} (${seatCount} Seats)`;

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
                    <ShieldCheck className="w-4 h-4 text-white/60" />
                    <span className="text-xs text-white/60 font-medium">Secure Checkout</span>
                </div>
                <div className="flex gap-2 opacity-50 grayscale">
                    <CreditCard className="w-6 h-6 text-white" />
                    <span className="text-xs text-white/80 self-center">Powered by Stripe</span>
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

                     <h3 className="text-xl font-bold text-brand-dark mb-6">Summary</h3>

                     <div className="bg-brand-light/30 rounded-xl p-6 mb-6 border border-brand-medium/20">
                         <div className="flex justify-between items-center mb-2">
                             <span className="font-bold text-brand-dark text-lg">{planName}</span>
                             <span className="font-bold text-brand-dark text-lg">${currentTotal.toFixed(2)}</span>
                         </div>
                         {selectedPlan !== 'lifetime' && (
                             <div className="flex justify-between items-center text-sm text-brand-dark/60">
                                 <span>Billed {billingCycle}</span>
                                 {billingCycle === 'annual' && <span className="text-green-600">Saved ${(29 * 12 - 15 * 12) * seatCount}</span>}
                             </div>
                         )}
                         {selectedPlan !== 'lifetime' && (
                             <div className="mt-4 pt-4 border-t border-brand-medium/10 flex items-center justify-between">
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

                     <div className="space-y-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3 text-sm text-blue-800 dark:text-blue-200">
                            <Lock className="w-5 h-5 shrink-0 mt-0.5" />
                            <p>
                                You will be redirected to Stripe to securely complete your payment. 
                                No credit card information is stored on our servers.
                            </p>
                        </div>

                        <button 
                            onClick={handleCheckout}
                            disabled={isProcessing}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Redirecting to Stripe...</span>
                                </>
                            ) : (
                                <>Proceed to Checkout</>
                            )}
                        </button>
                     </div>
                 </div>
             )}
         </div>
      </div>
    </div>
  );
};

export default PricingModal;
