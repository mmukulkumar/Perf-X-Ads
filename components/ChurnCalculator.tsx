
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
    // Usually calculated as (Current Lost - Target Lost) * 12 for the annualized run-rate benefit
    const annualImpact = (monthlyChurnedRevenueCurrent - monthlyChurnedRevenueTarget) * 12;

    // 3. MRR Projection Impact (Compound Decay)
    // How much MRR is lost from the original cohort after X months
    // Formula: StartMRR - StartMRR * (1 - rate)^months
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
                        className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/40 mt-1">Monthly Recurring Revenue</p>
                   </div>

                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Current Monthly Churn Rate (%)</label>
                     <input
                        type="number"
                        name="currentChurnRate"
                        value={inputs.currentChurnRate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/40 mt-1">Percentage of customers churning monthly (2-7% typical for SaaS)</p>
                   </div>

                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Number of Customers</label>
                     <input
                        type="number"
                        name="customerCount"
                        value={inputs.customerCount}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/40 mt-1">Total active customer count</p>
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
                        className="w-full px-4 py-2.5 bg-brand-light/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/40 mt-1">Goal churn rate after improvements (lower is better)</p>
                   </div>

                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Analysis Period (Months)</label>
                     <select 
                        name="analysisMonths" 
                        value={inputs.analysisMonths}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
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
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 mb-6 border border-red-100 dark:border-red-800">
                       <p className="text-sm text-brand-dark font-medium mb-1">Revenue Saved (Churn Reduction)</p>
                       <div className="text-4xl font-extrabold text-red-600 dark:text-red-400">{formatCurrency(results.revenueSaved)}</div>
                       <p className="text-xs text-brand-dark/60 mt-2">over {inputs.analysisMonths} months (Projected MRR retained vs lost)</p>
                    </div>

                    {/* Secondary Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="p-4 bg-orange-50/50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
                          <p className="text-xs text-orange-800 dark:text-orange-300 font-semibold mb-1">Monthly Churned Revenue</p>
                          <p className="text-lg font-bold text-orange-700 dark:text-orange-400">{formatCurrency(results.monthlyChurnedRevenueCurrent)}</p>
                          <p className="text-[10px] text-brand-dark/40">Current loss/month</p>
                       </div>
                       <div className="p-4 bg-red-50/50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                          <p className="text-xs text-red-800 dark:text-red-300 font-semibold mb-1">Annual Churned Revenue</p>
                          <p className="text-lg font-bold text-red-700 dark:text-red-400">{formatCurrency(results.monthlyChurnedRevenueCurrent * 12)}</p>
                          <p className="text-[10px] text-brand-dark/40">Annual cost of churn</p>
                       </div>
                    </div>

                    {/* Annual Impact Green Box */}
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 p-4 mb-6 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-green-800 dark:text-green-300 font-semibold mb-1">Annual Impact of Improvement</p>
                            <p className="text-xl font-bold text-green-600 dark:text-green-400">+{formatCurrency(results.annualImpact)}/year</p>
                            <p className="text-[10px] text-brand-dark/40">Additional revenue retained annually</p>
                        </div>
                    </div>

                    {/* Additional Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="p-4 bg-blue-50/30 dark:bg-blue-900/10 rounded-lg border border-blue-100/50 dark:border-blue-800/50">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">Customers Retained</p>
                          <p className="text-lg font-bold text-brand-dark">+{results.customersRetainedMonthly.toFixed(0)}</p>
                          <p className="text-[10px] text-brand-dark/40">Additional customers/month</p>
                       </div>
                       <div className="p-4 bg-purple-50/30 dark:bg-purple-900/10 rounded-lg border border-purple-100/50 dark:border-purple-800/50">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">LTV Increase</p>
                          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">+{formatCurrency(results.ltvIncrease)}</p>
                          <p className="text-[10px] text-brand-dark/40">From retention improvement</p>
                       </div>
                    </div>

                    <div className="bg-yellow-50/50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-800 p-4 mb-6">
                         <p className="text-xs text-brand-dark/60 font-semibold mb-1">MRR Projection Impact</p>
                         <div className="flex justify-between items-end">
                             <p className="text-xl font-bold text-brand-dark">{formatCurrency(results.mrrProjectionLost)}</p>
                         </div>
                         <p className="text-[10px] text-brand-dark/40 mt-1">MRR loss over {inputs.analysisMonths} months at current churn rate</p>
                    </div>

                    {/* Analysis Text */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
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

        {/* Benchmarks Section */}
        <div className="mb-16">
           <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">SaaS Churn Rate Benchmarks by Segment</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                 {
                    title: "Enterprise SaaS",
                    desc: "High-value B2B customers",
                    rate: "less than 1% Monthly",
                    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
                    annual: "Annual churn: 5-10% typical"
                 },
                 {
                    title: "Mid-Market SaaS",
                    desc: "$10k-$100k ACV customers",
                    rate: "1-3% Monthly",
                    color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
                    annual: "Annual churn: 12-30% typical"
                 },
                 {
                    title: "SMB SaaS",
                    desc: "Small business customers",
                    rate: "3-7% Monthly",
                    color: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20",
                    annual: "Annual churn: 30-60% typical"
                 }
              ].map((card, i) => (
                 <div key={i} className="bg-brand-surface p-6 rounded-xl border border-brand-medium/30 hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-brand-dark mb-1">{card.title}</h3>
                    <p className="text-xs text-brand-dark/60 mb-4">{card.desc}</p>
                    <div className={`rounded-lg p-4 mb-4 ${card.color}`}>
                       <p className="text-xs opacity-70 uppercase font-semibold mb-1">Good Churn Rate</p>
                       <p className="text-lg font-bold">{card.rate}</p>
                    </div>
                    <p className="text-xs text-brand-dark/50">{card.annual}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* Quick Example Result */}
        <div className="bg-red-50/50 dark:bg-red-900/20 rounded-xl p-8 mb-16 border border-red-100 dark:border-red-800 text-center">
            <h3 className="text-lg font-bold text-brand-dark mb-2">Quick Example Result</h3>
            <p className="text-brand-dark/60 mb-6 text-sm">$100k MRR, 500 customers, reducing churn from 5% to 3% over 12 months:</p>
            <div className="flex justify-center gap-8">
                <div>
                    <p className="text-xs text-brand-dark/50 font-semibold uppercase">Revenue Saved</p>
                    <div className="px-6 py-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg font-bold text-lg inline-block mt-1">
                        $15,348
                    </div>
                </div>
                <div>
                    <p className="text-xs text-brand-dark/50 font-semibold uppercase">Annual Impact</p>
                    <div className="px-6 py-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-lg font-bold text-lg inline-block mt-1">
                        +$24,000/yr
                    </div>
                </div>
            </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 p-8 md:p-12 mb-16">
           <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">How Our Churn Impact Calculator Works</h2>
           <p className="text-center text-brand-dark/70 max-w-2xl mx-auto mb-12">
              Our churn impact calculator quantifies the financial impact of customer churn reduction on SaaS businesses. The calculation uses <span className="text-red-600 dark:text-red-400 font-bold">compound revenue modeling</span> to project how improved retention affects MRR, customer lifetime value, and annual recurring revenue over time.
           </p>

           <div className="bg-red-50/30 dark:bg-red-900/10 rounded-xl p-8 max-w-3xl mx-auto border border-red-100 dark:border-red-800/50 mb-12">
              <h3 className="font-bold text-brand-dark mb-6 text-red-900 dark:text-red-300">The Churn Impact Formula</h3>
              <div className="bg-brand-surface p-6 rounded-lg border border-red-100 dark:border-red-800/50 font-mono text-xs md:text-sm text-brand-dark/80 leading-relaxed shadow-sm">
                 <p>Monthly Churned Revenue = MRR × Churn Rate %</p>
                 <p>Annual Churned Revenue = Monthly Churned Revenue × 12</p>
                 <p>Projected MRR = Starting MRR × (1 - Churn Rate)^Months</p>
                 <p className="font-bold mt-2">Revenue Saved = Current Churn Impact - Improved Churn Impact</p>
              </div>
              <p className="text-xs text-brand-dark/50 mt-4 text-center">
                  The calculator models compound churn effects over time, showing how small improvements in monthly churn rate create exponential revenue retention benefits. It calculates customers retained, lifetime value increase, and annual revenue impact from churn reduction initiatives.
              </p>
           </div>
        </div>

        {/* Math Foundation & Sources */}
        <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-xl font-bold text-brand-dark mb-4">Mathematical Foundation</h3>
            <p className="text-sm text-brand-dark/70 mb-6 leading-relaxed">
                Churn impact calculation is based on compound revenue decay models where monthly churn rate represents the percentage of MRR lost each month. The formula MRR[t] = MRR[0] × (1 - r)^t models how retention compounds over time, where r is the monthly churn rate and t is time in months. For example, 5% monthly churn means retaining 95% each month: after 12 months, you retain only 54% of original MRR (0.95^12 = 0.54). Revenue saved from churn reduction is calculated by comparing two scenarios: current churn trajectory vs. improved churn trajectory over the analysis period.
                <br/><br/>
                Customer lifetime value (LTV) is inversely proportional to churn rate: LTV = ARPU ÷ Churn Rate, so reducing churn from 5% to 3% increases LTV by 67% (1/0.03 vs 1/0.05). Customers retained calculation uses the churn rate differential applied to total customer base over time. The calculator accounts for compound effects that make churn reduction increasingly valuable over longer time periods.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-brand-dark/70 mb-8">
                <li>Churn compounds negatively—5% monthly churn ≈ 46% annual customer loss (not 60%)</li>
                <li>Small churn improvements create exponential LTV increases</li>
                <li>Revenue saved compounds over time due to retention of retained customers</li>
                <li>Customer Lifetime = 1 ÷ Churn Rate (months until average customer churns)</li>
                <li>Net Revenue Retention includes expansion revenue beyond churn reduction</li>
                <li>Cohort-based analysis reveals retention patterns over customer lifecycle</li>
            </ul>

            <div className="bg-brand-light/30 p-6 rounded-xl border border-brand-medium/20">
                <h4 className="font-bold text-brand-dark mb-3">Sources & References</h4>
                <div className="space-y-3 text-xs text-brand-dark/70">
                    <p className="flex gap-2">
                        <span className="font-bold text-red-600 dark:text-red-400">SaaS Capital Survey</span> - 
                        <span>Annual SaaS Metrics Benchmarks. Comprehensive industry benchmarks for churn, retention, and growth metrics.</span>
                    </p>
                    <p className="flex gap-2">
                        <span className="font-bold text-red-600 dark:text-red-400">KeyBanc SaaS Survey</span> - 
                        <span>Public SaaS Company Metrics. Analysis of public SaaS company retention and churn benchmarks.</span>
                    </p>
                    <p className="flex gap-2">
                        <span className="font-bold text-red-600 dark:text-red-400">Bessemer Cloud Index</span> - 
                        <span>SaaS Retention Best Practices. Research on best-in-class SaaS retention metrics and strategies.</span>
                    </p>
                </div>
            </div>
        </div>

        {/* Found This Calculator Helpful Section */}
        <div className="max-w-2xl mx-auto mb-16">
           <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-dark mb-2">Found This Calculator Helpful?</h2>
              <p className="text-brand-dark/70">Share it with other SaaS founders and growth teams</p>
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
                       href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check%20out%20this%20Churn%20Impact%20Calculator`}
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
                       href={`https://wa.me/?text=${encodeURIComponent('Check out this Churn Impact Calculator: ' + shareUrl)}`}
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
                 href={`mailto:?subject=Churn Impact Calculator&body=Check out this Churn Impact Calculator: ${shareUrl}`}
                 className="flex items-center justify-center gap-2 w-full py-2.5 border border-brand-medium/30 rounded-lg hover:bg-brand-light transition-colors mb-6 text-brand-dark"
              >
                 <Mail className="w-4 h-4" />
                 <span className="text-sm font-medium">Share via Email</span>
              </a>

               <button 
                  onClick={() => {
                      if (navigator.share) {
                          navigator.share({
                              title: 'Churn Impact Calculator',
                              text: 'Check out this Churn Impact Calculator!',
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
                  Suggested hashtags: #SaaS #Churn #Retention #CustomerRetention #GrowthMetrics #Calculator
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ChurnCalculator;
