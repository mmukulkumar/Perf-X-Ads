
import React, { useState, useEffect } from 'react';
import { Activity, TrendingDown, Users, DollarSign, ArrowRight, BarChart3, AlertCircle, Share2, Copy, Check, Facebook, Linkedin, Twitter, Mail, MessageCircle, HelpCircle } from 'lucide-react';

const ChurnCalculator = () => {
  const [inputs, setInputs] = useState({
    currentMrr: 100000,
    currentChurnRate: 5,
    customerCount: 500,
    targetChurnRate: 3,
    analysisMonths: 12
  });

  const [results, setResults] = useState({
    revenueSaved: 0,
    monthlyChurnedRevenueCurrent: 0,
    monthlyChurnedRevenueTarget: 0,
    annualImpact: 0,
    customersRetainedMonthly: 0,
    ltvIncrease: 0,
    mrrProjectionLost: 0,
    arpu: 0
  });

  const [shareUrl, setShareUrl] = useState('');
  const [isSharedCopied, setIsSharedCopied] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    if (currentUrl.startsWith('blob:') || currentUrl.startsWith('about:')) {
        setShareUrl('https://perfxads.com/tools/churn-calculator');
    } else {
        setShareUrl(currentUrl);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleShareCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsSharedCopied(true);
    setTimeout(() => setIsSharedCopied(false), 2000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  useEffect(() => {
    const { currentMrr, currentChurnRate, customerCount, targetChurnRate, analysisMonths } = inputs;

    // Derived Metrics
    const arpu = customerCount > 0 ? currentMrr / customerCount : 0;
    const churnDecimalCurrent = currentChurnRate / 100;
    const churnDecimalTarget = targetChurnRate / 100;

    // 1. Monthly Churned Revenue (Simple Linear View)
    const monthlyChurnedRevenueCurrent = currentMrr * churnDecimalCurrent;
    const monthlyChurnedRevenueTarget = currentMrr * churnDecimalTarget;
    
    // 2. Annual Impact of Improvement (Linear approximation for "Annual Benefit")
    const annualImpact = (monthlyChurnedRevenueCurrent - monthlyChurnedRevenueTarget) * 12;

    // 3. MRR Projection Impact (Compound Decay)
    const mrrRemainingCurrent = currentMrr * Math.pow(1 - churnDecimalCurrent, analysisMonths);
    const mrrLostCurrent = currentMrr - mrrRemainingCurrent;

    const mrrRemainingTarget = currentMrr * Math.pow(1 - churnDecimalTarget, analysisMonths);
    const mrrLostTarget = currentMrr - mrrRemainingTarget;

    // 4. Revenue Saved (Difference in MRR Lost at end of period)
    const revenueSaved = mrrLostCurrent - mrrLostTarget;

    // 5. Customers Retained (Monthly linear view based on churn diff)
    const customersLostMonthlyCurrent = customerCount * churnDecimalCurrent;
    const customersLostMonthlyTarget = customerCount * churnDecimalTarget;
    const customersRetainedMonthly = customersLostMonthlyCurrent - customersLostMonthlyTarget;

    // 6. LTV Increase
    // LTV = ARPU / Churn Rate
    const ltvCurrent = churnDecimalCurrent > 0 ? arpu / churnDecimalCurrent : 0;
    const ltvTarget = churnDecimalTarget > 0 ? arpu / churnDecimalTarget : 0;
    const ltvIncrease = ltvTarget - ltvCurrent;

    setResults({
      revenueSaved,
      monthlyChurnedRevenueCurrent,
      monthlyChurnedRevenueTarget,
      annualImpact,
      customersRetainedMonthly,
      ltvIncrease,
      mrrProjectionLost: mrrLostCurrent,
      arpu
    });

  }, [inputs]);

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* Main Calculator Area */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          
          {/* Inputs Column */}
          <div className="w-full lg:w-5/12 bg-brand-surface p-6 md:p-8 rounded-2xl border border-brand-medium/30 shadow-sm h-fit">
             <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold text-lg border-b border-brand-medium/10 pb-4">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <h3>Churn Impact Calculator</h3>
             </div>
             
             <div className="space-y-6">
                <div>
                   <label className="block text-xs font-bold text-brand-dark/60 uppercase tracking-wide mb-3">Current Business Metrics</label>
                   
                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Current MRR ($)</label>
                     <input
                        type="number"
                        name="currentMrr"
                        value={inputs.currentMrr}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/60 mt-1">Monthly Recurring Revenue</p>
                   </div>

                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Current Monthly Churn Rate (%)</label>
                     <input
                        type="number"
                        name="currentChurnRate"
                        value={inputs.currentChurnRate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/60 mt-1">Percentage of customers churning monthly (2-7% typical for SaaS)</p>
                   </div>

                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Number of Customers</label>
                     <input
                        type="number"
                        name="customerCount"
                        value={inputs.customerCount}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/60 mt-1">Total active customer count</p>
                   </div>
                </div>

                <div className="pt-2 border-t border-brand-medium/10">
                   <label className="block text-xs font-bold text-brand-dark/60 uppercase tracking-wide mb-3">Target Improvement</label>
                   
                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Target Monthly Churn Rate (%)</label>
                     <input
                        type="number"
                        name="targetChurnRate"
                        value={inputs.targetChurnRate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/50 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/60 mt-1">Goal churn rate after improvements (lower is better)</p>
                   </div>

                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Analysis Period (Months)</label>
                     <select 
                        name="analysisMonths" 
                        value={inputs.analysisMonths}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/50 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                     >
                        <option value="12">12 Months</option>
                        <option value="24">24 Months</option>
                        <option value="36">36 Months</option>
                     </select>
                   </div>
                </div>
             </div>
          </div>

          {/* Results Column */}
          <div className="w-full lg:w-7/12">
             <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-xl overflow-hidden sticky top-24">
                <div className="p-6 md:p-8 bg-brand-light border-b border-brand-medium/20">
                    <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold">
                       <BarChart3 className="w-5 h-5 text-red-500" />
                       <h3>Churn Impact Analysis</h3>
                    </div>

                    {/* Main Hero Result */}
                    <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-6 mb-6 border border-red-100 dark:border-red-800">
                       <p className="text-sm text-brand-dark font-medium mb-1">Revenue Saved (Churn Reduction)</p>
                       <div className="text-4xl font-extrabold text-red-600 dark:text-red-400">{formatCurrency(results.revenueSaved)}</div>
                       <p className="text-xs text-brand-dark/60 mt-2">over {inputs.analysisMonths} months (Projected MRR retained vs lost)</p>
                    </div>

                    {/* Secondary Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="p-4 bg-orange-50/50 dark:bg-orange-900/30 rounded-lg border border-orange-100 dark:border-orange-800">
                          <p className="text-xs text-orange-800 dark:text-orange-300 font-semibold mb-1">Monthly Churned Revenue</p>
                          <p className="text-lg font-bold text-orange-700 dark:text-orange-400">{formatCurrency(results.monthlyChurnedRevenueCurrent)}</p>
                          <p className="text-[10px] text-brand-dark/40">Current loss/month</p>
                       </div>
                       <div className="p-4 bg-red-50/50 dark:bg-red-900/30 rounded-lg border border-red-100 dark:border-red-800">
                          <p className="text-xs text-red-800 dark:text-red-300 font-semibold mb-1">Annual Churned Revenue</p>
                          <p className="text-lg font-bold text-red-700 dark:text-red-400">{formatCurrency(results.monthlyChurnedRevenueCurrent * 12)}</p>
                          <p className="text-[10px] text-brand-dark/40">Annual cost of churn</p>
                       </div>
                    </div>

                    {/* Annual Impact Green Box */}
                    <div className="bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800 p-4 mb-6 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-green-800 dark:text-green-300 font-semibold mb-1">Annual Impact of Improvement</p>
                            <p className="text-xl font-bold text-green-600 dark:text-green-400">+{formatCurrency(results.annualImpact)}/year</p>
                            <p className="text-[10px] text-brand-dark/40">Additional revenue retained annually</p>
                        </div>
                    </div>

                    {/* Additional Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="p-4 bg-blue-50/30 dark:bg-blue-900/20 rounded-lg border border-blue-100/50 dark:border-blue-800/50">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">Customers Retained</p>
                          <p className="text-lg font-bold text-brand-dark">+{results.customersRetainedMonthly.toFixed(0)}</p>
                          <p className="text-[10px] text-brand-dark/40">Additional customers/month</p>
                       </div>
                       <div className="p-4 bg-purple-50/30 dark:bg-purple-900/20 rounded-lg border border-purple-100/50 dark:border-purple-800/50">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">LTV Increase</p>
                          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">+{formatCurrency(results.ltvIncrease)}</p>
                          <p className="text-[10px] text-brand-dark/40">From retention improvement</p>
                       </div>
                    </div>

                    <div className="bg-yellow-50/50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800 p-4 mb-6">
                         <p className="text-xs text-brand-dark/60 font-semibold mb-1">MRR Projection Impact</p>
                         <div className="flex justify-between items-end">
                             <p className="text-xl font-bold text-brand-dark">{formatCurrency(results.mrrProjectionLost)}</p>
                         </div>
                         <p className="text-[10px] text-brand-dark/40 mt-1">MRR loss over {inputs.analysisMonths} months at current churn rate</p>
                    </div>

                    {/* Analysis Text */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg">
                        <p className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">Analysis:</p>
                        <p className="text-xs text-blue-700 dark:text-blue-200 leading-relaxed">
                            Reducing churn from <span className="font-bold">{inputs.currentChurnRate}%</span> to <span className="font-bold">{inputs.targetChurnRate}%</span> saves significant revenue and improves customer retention. 
                            You are currently losing <span className="font-bold">{formatCurrency(results.monthlyChurnedRevenueCurrent)}</span> every month. Improving retention would save <span className="font-bold">{formatCurrency(results.annualImpact)}</span> per year.
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-brand-light/30">
                   <h4 className="flex items-center gap-2 text-sm font-bold text-brand-dark mb-4">
                      <HelpCircle className="w-4 h-4 text-brand-medium" />
                      Churn Reduction Strategies:
                   </h4>
                   <ul className="space-y-2 text-xs text-brand-dark/70">
                      <li className="flex gap-2 text-blue-600 dark:text-blue-400">
                         <span>•</span>
                         Improve onboarding to reduce early-stage churn
                      </li>
                      <li className="flex gap-2 text-blue-600 dark:text-blue-400">
                         <span>•</span>
                         Implement proactive customer success programs
                      </li>
                      <li className="flex gap-2 text-blue-600 dark:text-blue-400">
                         <span>•</span>
                         Monitor usage patterns and intervene before churn
                      </li>
                      <li className="flex gap-2 text-blue-600 dark:text-blue-400">
                         <span>•</span>
                         Gather feedback and address pain points quickly
                      </li>
                      <li className="flex gap-2 text-blue-600 dark:text-blue-400">
                         <span>•</span>
                         Offer incentives for annual contracts (lower effective churn)
                      </li>
                   </ul>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChurnCalculator;
