
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
             <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold text-lg">
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
                          className="w-full px-4 py-3 bg-brand-light/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
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
                          className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                       />
                       <p className="text-xs text-brand-dark/50 mt-1">Current monthly cost ($0 for free plans)</p>
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
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/50 mt-1">Monthly cost of upgraded plan</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Time Spent Using Tool (Hours/Month)</label>
                   <input
                      type="number"
                      name="timeSpent"
                      value={inputs.timeSpent}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/50 mt-1">Hours per month you or your team use this tool</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Hourly Rate/Value ($)</label>
                   <input
                      type="number"
                      name="hourlyRate"
                      value={inputs.hourlyRate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/50 mt-1">Average hourly rate or opportunity cost of time</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Efficiency Gain from Upgrade (%)</label>
                   <input
                      type="number"
                      name="efficiencyGain"
                      value={inputs.efficiencyGain}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/50 mt-1">Estimated % time saved (e.g., 25% means saving 10 hours from 40 hours)</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Monthly Revenue Increase ($)</label>
                   <input
                      type="number"
                      name="revenueIncrease"
                      value={inputs.revenueIncrease}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/50 mt-1">Additional monthly revenue enabled by upgraded features (optional)</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Analysis Period (Months)</label>
                   <select 
                      name="analysisMonths" 
                      value={inputs.analysisMonths}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
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

                    <div className={`border rounded-xl p-6 mb-6 transition-colors duration-300 ${results.isPositive ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800' : 'bg-red-50/50 dark:bg-red-900/20 border-red-100 dark:border-red-800'}`}>
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
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800 p-4 mb-6">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">Payback Period</span>
                                <span className="text-lg font-bold text-yellow-700 dark:text-yellow-400">{results.paybackPeriod.toFixed(1)} months</span>
                            </div>
                            <div className="text-xs text-yellow-600 dark:text-yellow-500">Time to recover upgrade cost</div>
                        </div>
                    )}

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
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

        {/* Quick Example Result */}
        <div className="bg-brand-light/30 rounded-xl p-8 mb-16 border border-brand-medium/20 text-center">
            <h3 className="text-lg font-bold text-brand-dark mb-2">Quick Example Result</h3>
            <p className="text-brand-dark/60 mb-6 text-sm">Upgrading from $49/month to $199/month with 25% efficiency gain:</p>
            <div className="flex justify-center gap-8">
                <div>
                    <p className="text-xs text-brand-dark/50 font-semibold uppercase">Net Annual ROI</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">$10,200</p>
                </div>
                <div>
                    <p className="text-xs text-brand-dark/50 font-semibold uppercase">ROI Percentage</p>
                    <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-bold text-sm inline-block mt-1">
                        567%
                    </div>
                </div>
            </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 p-8 md:p-12 mb-16">
           <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">How Our SaaS Pricing ROI Calculator Works</h2>
           <p className="text-center text-brand-dark/70 max-w-2xl mx-auto mb-12">
              Our SaaS pricing ROI calculator helps businesses evaluate the financial impact of upgrading to higher-tier subscription plans. The calculation uses <span className="text-brand-dark font-bold">cost-benefit analysis</span> to compare upgrade costs against quantified benefits from time savings, efficiency gains, and revenue increases.
           </p>

           <div className="bg-brand-light/50 rounded-xl p-8 max-w-3xl mx-auto border border-brand-medium/20 mb-12">
              <h3 className="font-bold text-brand-dark mb-6">The SaaS Pricing ROI Formula</h3>
              <div className="bg-brand-surface p-6 rounded-lg border border-brand-medium/20 font-mono text-xs md:text-sm text-brand-dark/80 leading-relaxed shadow-sm">
                 <p>Additional Monthly Cost = Upgrade Cost - Current Cost</p>
                 <p>Time Savings Value = Hours Saved × Hourly Rate</p>
                 <p>Total Benefit = Time Savings + Revenue Gain</p>
                 <p className="font-bold mt-2">Net ROI = (Total Benefit - Additional Cost) ÷ Additional Cost × 100%</p>
              </div>
              <p className="text-xs text-brand-dark/50 mt-4 text-center">
                  The calculator computes Net ROI by quantifying time savings (efficiency gain × hours used × hourly rate) plus revenue increases enabled by upgraded features, then subtracts the additional subscription cost. Payback period shows how quickly the upgrade investment is recovered from monthly net benefits.
              </p>
           </div>
        </div>

        {/* Example Section */}
        <div className="max-w-4xl mx-auto mb-16">
           <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">SaaS Pricing ROI Example</h2>
           <div className="bg-brand-surface p-8 rounded-2xl border border-brand-medium/30 shadow-sm">
                <h3 className="font-bold text-lg text-brand-dark mb-4">Project Management Tool Upgrade Example</h3>
                <p className="text-sm text-brand-dark/60 mb-6">Team considering upgrade from Basic ($49/month) to Professional ($199/month) plan</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    <div>
                        <h4 className="font-semibold text-brand-dark mb-2">Current Situation:</h4>
                        <ul className="space-y-2 text-brand-dark/70">
                            <li><span className="font-semibold text-brand-dark">Current Plan:</span> Basic ($49/month)</li>
                            <li><span className="font-semibold text-brand-dark">Upgrade Plan:</span> Professional ($199/month)</li>
                            <li><span className="font-semibold text-brand-dark">Additional Cost:</span> $150/month</li>
                            <li><span className="font-semibold text-brand-dark">Time Using Tool:</span> 40 hours/month</li>
                            <li><span className="font-semibold text-brand-dark">Hourly Rate:</span> $50/hour</li>
                            <li><span className="font-semibold text-brand-dark">Efficiency Gain:</span> 25% (automation features)</li>
                            <li><span className="font-semibold text-brand-dark">Revenue Increase:</span> $500/month (faster delivery)</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-brand-dark mb-2">ROI Results:</h4>
                        <ul className="space-y-2 text-brand-dark/70">
                            <li>• Time saved: 10 hours/month</li>
                            <li>• Time savings value: $500/month</li>
                            <li>• Revenue gain: $500/month</li>
                            <li>• Total benefit: $1,000/month</li>
                            <li>• Net monthly ROI: $850/month</li>
                            <li>• Net annual ROI: $10,200</li>
                            <li>• ROI percentage: 567%</li>
                            <li>• Payback: 0.2 months</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg text-sm">
                    <span className="font-bold text-blue-800 dark:text-blue-300">Result: Strong positive ROI—upgrade pays for itself in under 6 days</span>
                    <p className="text-blue-700 dark:text-blue-200 mt-1">The combination of time savings and revenue increase creates compelling business case for upgrade. 567% annual ROI significantly exceeds typical investment thresholds.</p>
                </div>
           </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {[
                    "How do I calculate ROI for upgrading my SaaS subscription?",
                    "What factors should I consider when evaluating SaaS pricing tiers?",
                    "When should I upgrade to a higher SaaS pricing tier?",
                    "How do I measure the time savings from SaaS tool upgrades?",
                    "What is a good ROI for SaaS software investments?"
                ].map((q, i) => (
                    <div key={i} className="border-b border-brand-medium/20 pb-4">
                        <button className="flex justify-between items-center w-full text-left font-medium text-brand-dark hover:text-blue-600 transition-colors">
                            {q}
                            <ArrowRight className="w-4 h-4 text-brand-medium" />
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* Found This Calculator Helpful Section */}
        <div className="max-w-2xl mx-auto mb-16">
           <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-dark mb-2">Found This Calculator Helpful?</h2>
              <p className="text-brand-dark/70">Share it with other business leaders and teams</p>
           </div>

           <div className="bg-brand-surface p-8 rounded-2xl border border-brand-medium/30 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                 <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                 <h3 className="font-bold text-lg text-brand-dark">Share This Calculator</h3>
              </div>
              <p className="text-sm text-brand-dark/60 mb-6">Help others discover this useful tool</p>

              {/* Copy Link */}
              <div className="mb-6">
                 <label className="block text-xs font-semibold text-brand-dark mb-2">Copy Link</label>
                 <div className="flex gap-2">
                    <input 
                       type="text" 
                       readOnly 
                       value={shareUrl} 
                       className="flex-1 px-3 py-2.5 bg-brand-light/20 border border-brand-medium/30 rounded-lg text-sm text-brand-dark/70 font-mono"
                    />
                    <button 
                       onClick={handleShareCopy}
                       className="flex items-center gap-2 px-4 py-2 bg-brand-surface border border-brand-medium/30 rounded-lg text-sm font-bold text-brand-dark hover:bg-brand-light transition-colors"
                    >
                       {isSharedCopied ? <Check className="w-4 h-4 text-green-600 dark:text-green-400" /> : <Copy className="w-4 h-4" />}
                       {isSharedCopied ? 'Copied' : 'Copy'}
                    </button>
                 </div>
              </div>

              {/* Social Buttons */}
              <div className="mb-4">
                 <label className="block text-xs font-semibold text-brand-dark mb-3">Share on Social Media</label>
                 <div className="grid grid-cols-2 gap-3">
                    <a 
                       href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check%20out%20this%20SaaS%20ROI%20Calculator`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-start gap-3 px-4 py-2.5 border border-brand-medium/30 rounded-lg hover:bg-brand-light transition-colors group"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                       <span className="text-sm font-medium text-brand-dark">X</span>
                    </a>
                    <a 
                       href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-start gap-3 px-4 py-2.5 border border-brand-medium/30 rounded-lg hover:bg-brand-light transition-colors group"
                    >
                       <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                       <span className="text-sm font-medium text-brand-dark text-blue-600 dark:text-blue-400">Facebook</span>
                    </a>
                    <a 
                       href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-start gap-3 px-4 py-2.5 border border-brand-medium/30 rounded-lg hover:bg-brand-light transition-colors group"
                    >
                       <svg className="w-5 h-5 text-blue-700 dark:text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                       <span className="text-sm font-medium text-brand-dark text-blue-700 dark:text-blue-500">LinkedIn</span>
                    </a>
                    <a 
                       href={`https://wa.me/?text=${encodeURIComponent('Check out this SaaS ROI Calculator: ' + shareUrl)}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-start gap-3 px-4 py-2.5 border border-brand-medium/30 rounded-lg hover:bg-brand-light transition-colors group"
                    >
                       <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                       <span className="text-sm font-medium text-brand-dark text-green-600 dark:text-green-400">WhatsApp</span>
                    </a>
                 </div>
              </div>
              
              {/* Email */}
              <a 
                 href={`mailto:?subject=SaaS ROI Calculator&body=Check out this SaaS ROI Calculator: ${shareUrl}`}
                 className="flex items-center justify-center gap-2 w-full py-2.5 border border-brand-medium/30 rounded-lg hover:bg-brand-light transition-colors mb-6 text-brand-dark"
              >
                 <Mail className="w-4 h-4" />
                 <span className="text-sm font-medium">Share via Email</span>
              </a>

               <button 
                  onClick={() => {
                      if (navigator.share) {
                          navigator.share({
                              title: 'SaaS ROI Calculator',
                              text: 'Check out this SaaS ROI Calculator!',
                              url: shareUrl,
                          }).catch(console.error);
                      }
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
              >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-bold">More Share Options</span>
              </button>
              
              <p className="text-xs text-brand-dark/50 mt-4 text-center">
                  Suggested hashtags: #SaaS #ROI #SoftwareTools #BusinessTools #Calculator
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default SaasCalculator;
