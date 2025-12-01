
import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Clock, Zap, BarChart2, CheckCircle, Info, Share2, Copy, Check, Facebook, Linkedin, Twitter, Mail, MessageCircle, ArrowRight } from 'lucide-react';

const SaasCalculator = () => {
  const [inputs, setInputs] = useState({
    currentPlanName: 'Basic Plan',
    currentCost: 49,
    upgradeCost: 199,
    timeSpent: 40,
    hourlyRate: 50,
    efficiencyGain: 25,
    revenueIncrease: 500,
    analysisMonths: 12
  });

  const [results, setResults] = useState({
    additionalCost: 0,
    timeSavingsValue: 0,
    totalMonthlyBenefit: 0,
    netMonthlyROI: 0,
    netAnnualROI: 0,
    roiPercentage: 0,
    paybackPeriod: 0,
    isPositive: true
  });

  const [shareUrl, setShareUrl] = useState('');
  const [isSharedCopied, setIsSharedCopied] = useState(false);

  useEffect(() => {
    // Handle blob/preview URLs which fail in navigator.share
    const currentUrl = window.location.href;
    if (currentUrl.startsWith('blob:') || currentUrl.startsWith('about:')) {
        setShareUrl('https://perfxads.com/tools/saas-roi-calculator');
    } else {
        setShareUrl(currentUrl);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === 'currentPlanName' ? value : parseFloat(value) || 0
    }));
  };

  useEffect(() => {
    const { currentCost, upgradeCost, timeSpent, hourlyRate, efficiencyGain, revenueIncrease, analysisMonths } = inputs;

    // 1. Additional Monthly Cost
    const additionalCost = upgradeCost - currentCost;

    // 2. Time Savings Value = (Time Spent * (Efficiency Gain / 100)) * Hourly Rate
    const hoursSaved = timeSpent * (efficiencyGain / 100);
    const timeSavingsValue = hoursSaved * hourlyRate;

    // 3. Total Monthly Benefit
    const totalMonthlyBenefit = timeSavingsValue + revenueIncrease;

    // 4. Net Monthly ROI
    const netMonthlyROI = totalMonthlyBenefit - additionalCost;

    // 5. Net Annual ROI
    const netAnnualROI = netMonthlyROI * 12;

    // 6. ROI Percentage
    const roiPercentage = additionalCost > 0 ? (netMonthlyROI / additionalCost) * 100 : 0;

    // 7. Payback Period
    const paybackPeriod = (netMonthlyROI > 0 && additionalCost > 0) ? (additionalCost / netMonthlyROI) : 0;

    setResults({
      additionalCost,
      timeSavingsValue,
      totalMonthlyBenefit,
      netMonthlyROI,
      netAnnualROI,
      roiPercentage,
      paybackPeriod,
      isPositive: netMonthlyROI > 0
    });

  }, [inputs]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const handleShareCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsSharedCopied(true);
    setTimeout(() => setIsSharedCopied(false), 2000);
  };

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* Main Calculator Area */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          
          {/* Inputs Column */}
          <div className="w-full lg:w-1/2 bg-brand-surface p-6 md:p-8 rounded-2xl border border-brand-medium/30 shadow-sm">
             <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold text-lg border-b border-brand-medium/10 pb-4">
                <DollarSign className="w-5 h-5 text-brand-medium" />
                <h3>SaaS Pricing ROI Calculator</h3>
             </div>
             <p className="text-brand-dark/60 text-sm mb-6">Calculate ROI for upgrading to higher-tier SaaS plans</p>
             
             <div className="space-y-6">
                <h4 className="font-semibold text-brand-dark border-b border-brand-medium/20 pb-2">Current Plan Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-semibold text-brand-dark mb-2">Current Plan</label>
                       <select 
                          name="currentPlanName" 
                          value={inputs.currentPlanName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                       >
                          <option value="Free Tier">Free Tier</option>
                          <option value="Basic Plan">Basic Plan</option>
                          <option value="Pro Plan">Pro Plan</option>
                          <option value="Enterprise">Enterprise</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-sm font-semibold text-brand-dark mb-2">Current Monthly Cost ($)</label>
                       <input
                          type="number"
                          name="currentCost"
                          value={inputs.currentCost}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                       />
                       <p className="text-xs text-brand-dark/60 mt-1">Current monthly cost ($0 for free plans)</p>
                    </div>
                </div>

                <h4 className="font-semibold text-brand-dark border-b border-brand-medium/20 pb-2 pt-2">Upgrade Plan Details</h4>
                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Upgrade Plan Monthly Cost ($)</label>
                   <input
                      type="number"
                      name="upgradeCost"
                      value={inputs.upgradeCost}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/60 mt-1">Monthly cost of upgraded plan</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Time Spent Using Tool (Hours/Month)</label>
                   <input
                      type="number"
                      name="timeSpent"
                      value={inputs.timeSpent}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/60 mt-1">Hours per month you or your team use this tool</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Hourly Rate/Value ($)</label>
                   <input
                      type="number"
                      name="hourlyRate"
                      value={inputs.hourlyRate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/60 mt-1">Average hourly rate or opportunity cost of time</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Efficiency Gain from Upgrade (%)</label>
                   <input
                      type="number"
                      name="efficiencyGain"
                      value={inputs.efficiencyGain}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/60 mt-1">Estimated % time saved (e.g., 25% means saving 10 hours from 40 hours)</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Monthly Revenue Increase ($)</label>
                   <input
                      type="number"
                      name="revenueIncrease"
                      value={inputs.revenueIncrease}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/60 mt-1">Additional monthly revenue enabled by upgraded features (optional)</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Analysis Period (Months)</label>
                   <select 
                      name="analysisMonths" 
                      value={inputs.analysisMonths}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/50 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                   >
                      <option value="12">12 Months (1 Year)</option>
                      <option value="24">24 Months (2 Years)</option>
                   </select>
                </div>
             </div>
          </div>

          {/* Results Column */}
          <div className="w-full lg:w-1/2">
             <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-xl overflow-hidden sticky top-24">
                <div className="p-6 md:p-8 bg-brand-light border-b border-brand-medium/20">
                    <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold">
                       <BarChart2 className="w-5 h-5 text-brand-medium" />
                       <h3>ROI Analysis</h3>
                    </div>

                    <div className={`border rounded-xl p-6 mb-6 transition-colors duration-300 ${results.isPositive ? 'bg-blue-50/50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800' : 'bg-red-50/50 dark:bg-red-900/30 border-red-100 dark:border-red-800'}`}>
                       <p className="text-sm font-semibold opacity-80 mb-1 text-brand-dark">Net Annual ROI</p>
                       <div className={`text-4xl font-extrabold mb-1 ${results.isPositive ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                           {formatCurrency(results.netAnnualROI)}
                       </div>
                       <p className={`text-xs font-medium ${results.isPositive ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'}`}>
                           {results.roiPercentage.toFixed(0)}% return on investment
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="p-4 bg-brand-surface rounded-lg border border-brand-medium/20">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">Monthly Cost Increase</p>
                          <p className="text-lg font-bold text-red-500">+{formatCurrency(results.additionalCost)}</p>
                          <p className="text-[10px] text-brand-dark/40">Per month</p>
                       </div>
                       <div className="p-4 bg-brand-surface rounded-lg border border-brand-medium/20">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">Annual Cost Increase</p>
                          <p className="text-lg font-bold text-red-500">+{formatCurrency(results.additionalCost * 12)}</p>
                          <p className="text-[10px] text-brand-dark/40">Per year</p>
                       </div>
                       <div className="p-4 bg-brand-surface rounded-lg border border-brand-medium/20">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">Time Savings</p>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">+{formatCurrency(results.timeSavingsValue)}</p>
                          <p className="text-[10px] text-brand-dark/40">Worth {formatCurrency(results.timeSavingsValue)}/mo</p>
                       </div>
                       <div className="p-4 bg-brand-surface rounded-lg border border-brand-medium/20">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">Revenue Gain</p>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">+{formatCurrency(inputs.revenueIncrease)}</p>
                          <p className="text-[10px] text-brand-dark/40">Per month</p>
                       </div>
                    </div>

                    <div className="bg-brand-surface rounded-lg border border-brand-medium/20 p-4 mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-semibold text-brand-dark">Total Monthly Benefit</span>
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(results.totalMonthlyBenefit)}</span>
                        </div>
                        <div className="text-xs text-brand-dark/50">Time savings + revenue gain</div>
                    </div>
                    
                    <div className="bg-brand-surface rounded-lg border border-brand-medium/20 p-4 mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-semibold text-brand-dark">Net Monthly ROI</span>
                            <span className={`text-lg font-bold ${results.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                                {results.isPositive ? '+' : ''}{formatCurrency(results.netMonthlyROI)}
                            </span>
                        </div>
                        <div className="text-xs text-brand-dark/50">Benefit minus cost increase</div>
                    </div>

                    {results.isPositive && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-100 dark:border-yellow-800 p-4 mb-6">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">Payback Period</span>
                                <span className="text-lg font-bold text-yellow-700 dark:text-yellow-400">{results.paybackPeriod.toFixed(1)} months</span>
                            </div>
                            <div className="text-xs text-yellow-600 dark:text-yellow-500">Time to recover upgrade cost</div>
                        </div>
                    )}

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg">
                        <p className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">Analysis:</p>
                        <p className="text-xs text-blue-700 dark:text-blue-200 leading-relaxed">
                            {results.isPositive 
                                ? "Upgrade delivers measurable ROI through time savings and productivity gains." 
                                : "The efficiency gains may not currently justify the cost of the upgrade. Consider negotiating price or increasing usage."}
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-brand-surface">
                   <h4 className="flex items-center gap-2 text-sm font-bold text-brand-dark mb-4">
                      <Zap className="w-4 h-4 text-brand-medium" />
                      SaaS Pricing ROI Tips:
                   </h4>
                   <ul className="space-y-2 text-xs text-brand-dark/70">
                      <li className="flex gap-2">
                         <span className="text-brand-medium">•</span>
                         Calculate time savings = hourly rate for productivity ROI
                      </li>
                      <li className="flex gap-2">
                         <span className="text-brand-medium">•</span>
                         Team impact = multiply benefits by number of users
                      </li>
                      <li className="flex gap-2">
                         <span className="text-brand-medium">•</span>
                         Consider revenue enabled by advanced features
                      </li>
                      <li className="flex gap-2">
                         <span className="text-brand-medium">•</span>
                         Annual plans typically offer 15-20% discount vs monthly
                      </li>
                   </ul>
                </div>
             </div>
          </div>
        </div>

        {/* Common Models */}
        <div className="mb-16">
           <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">Common SaaS Pricing Models</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                 {
                    title: "Per-User Pricing",
                    desc: "Cost scales with team size",
                    example: "$10-100/user/month",
                    bestFor: "Best for: Collaboration tools, CRM, project management"
                 },
                 {
                    title: "Tiered Flat-Rate",
                    desc: "Fixed price per tier",
                    example: "$49-499/month",
                    bestFor: "Best for: Marketing automation, analytics, hosting",
                    color: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                 },
                 {
                    title: "Usage-Based",
                    desc: "Pay for what you use",
                    example: "Variable per unit",
                    bestFor: "Best for: Cloud infrastructure, APIs, communications",
                    color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                 }
              ].map((card, i) => (
                 <div key={i} className="bg-brand-surface p-6 rounded-xl border border-brand-medium/30 hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-brand-dark mb-2">{card.title}</h3>
                    <p className="text-xs text-brand-dark/60 mb-4">{card.desc}</p>
                    <div className={`rounded-lg p-3 mb-4 ${card.color ? card.color.split(' ').slice(1).join(' ') : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                       <p className="text-xs text-brand-dark/50 uppercase font-semibold mb-1">Typical Structure</p>
                       <p className={`text-sm font-medium ${card.color ? card.color.split(' ')[0] : 'text-blue-600 dark:text-blue-400'}`}>{card.example}</p>
                    </div>
                    <p className="text-xs text-brand-dark/50">{card.bestFor}</p>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default SaasCalculator;
