
import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, MousePointer, BarChart2, CheckCircle, Info, Share2, Copy, Check, Facebook, Linkedin, Twitter, Mail, MessageCircle, ArrowRight, Layout, Monitor, Target } from 'lucide-react';

const LandingPageImpactCalculator = () => {
  const [inputs, setInputs] = useState({
    pageType: 'Product Landing Page',
    monthlyTraffic: 2500,
    currentConversionRate: 2.0,
    targetConversionRate: 3.0,
    averageOrderValue: 300
  });

  const [results, setResults] = useState({
    currentConversions: 0,
    targetConversions: 0,
    currentRevenue: 0,
    targetRevenue: 0,
    additionalRevenue: 0,
    cvrImprovement: 0,
    additionalConversions: 0,
    revenueIncreasePercent: 0,
    isPositive: true
  });

  const [shareUrl, setShareUrl] = useState('');
  const [isSharedCopied, setIsSharedCopied] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    if (currentUrl.startsWith('blob:') || currentUrl.startsWith('about:')) {
        setShareUrl('https://perfxads.com/tools/landing-page-calculator');
    } else {
        setShareUrl(currentUrl);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === 'pageType' ? value : parseFloat(value) || 0
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

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val);
  };

  useEffect(() => {
    const { monthlyTraffic, currentConversionRate, targetConversionRate, averageOrderValue } = inputs;

    // 1. Current Conversions = Traffic * (Current CVR / 100)
    const currentConversions = monthlyTraffic * (currentConversionRate / 100);

    // 2. Target Conversions = Traffic * (Target CVR / 100)
    const targetConversions = monthlyTraffic * (targetConversionRate / 100);

    // 3. Current Revenue
    const currentRevenue = currentConversions * averageOrderValue;

    // 4. Target Revenue
    const targetRevenue = targetConversions * averageOrderValue;

    // 5. Additional Revenue
    const additionalRevenue = targetRevenue - currentRevenue;

    // 6. CVR Improvement %
    const cvrImprovement = currentConversionRate > 0 
        ? ((targetConversionRate - currentConversionRate) / currentConversionRate) * 100 
        : 0;
    
    // 7. Additional Conversions
    const additionalConversions = targetConversions - currentConversions;

    // 8. Revenue Increase %
    const revenueIncreasePercent = currentRevenue > 0
        ? ((targetRevenue - currentRevenue) / currentRevenue) * 100
        : 0;

    setResults({
      currentConversions,
      targetConversions,
      currentRevenue,
      targetRevenue,
      additionalRevenue,
      cvrImprovement,
      additionalConversions,
      revenueIncreasePercent,
      isPositive: additionalRevenue >= 0
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
                <MousePointer className="w-5 h-5 text-purple-600" />
                <h3>Landing Page Impact Calculator</h3>
             </div>
             <p className="text-brand-dark/60 text-sm mb-6">Calculate revenue impact of landing page optimization</p>
             
             <div className="space-y-6">
                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Page Type</label>
                   <select 
                      name="pageType" 
                      value={inputs.pageType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                   >
                      <option value="Product Landing Page">Product Landing Page</option>
                      <option value="SaaS Signup Page">SaaS Signup Page</option>
                      <option value="Lead Generation Page">Lead Generation Page</option>
                      <option value="Webinar Registration">Webinar Registration</option>
                      <option value="Checkout Page">Checkout Page</option>
                   </select>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Monthly Traffic</label>
                   <input
                      type="number"
                      name="monthlyTraffic"
                      value={inputs.monthlyTraffic}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/40 mt-1">Monthly visitors to your landing page</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Current Conversion Rate (%)</label>
                   <input
                      type="number"
                      name="currentConversionRate"
                      value={inputs.currentConversionRate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/40 mt-1">Current page conversion rate</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Target Conversion Rate (%)</label>
                   <input
                      type="number"
                      name="targetConversionRate"
                      value={inputs.targetConversionRate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/40 mt-1">Goal conversion rate after optimization</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Average Order Value ($)</label>
                   <input
                      type="number"
                      name="averageOrderValue"
                      value={inputs.averageOrderValue}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/40 mt-1">Average transaction value</p>
                </div>
             </div>
          </div>

          {/* Results Column */}
          <div className="w-full lg:w-7/12">
             <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-xl overflow-hidden sticky top-24">
                <div className="p-6 md:p-8 bg-brand-light border-b border-brand-medium/20">
                    <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold">
                       <BarChart2 className="w-5 h-5 text-purple-600" />
                       <h3>Impact Analysis</h3>
                    </div>

                    {/* Main Hero Result */}
                    <div className={`${results.isPositive ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'} rounded-xl p-6 mb-6 border`}>
                       <p className={`text-sm font-medium mb-1 ${results.isPositive ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>Additional Monthly Revenue</p>
                       <div className={`text-4xl font-extrabold ${results.isPositive ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                           {results.additionalRevenue >= 0 ? '+' : ''}{formatCurrency(results.additionalRevenue)}
                       </div>
                       <p className={`text-xs mt-2 ${results.isPositive ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                           ({results.revenueIncreasePercent.toFixed(2)}% increase - Significant Improvement)
                       </p>
                    </div>

                    {/* Comparison Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="p-4 bg-brand-surface rounded-lg border border-brand-medium/20">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">Current CVR</p>
                          <p className="text-lg font-bold text-brand-dark">{inputs.currentConversionRate}%</p>
                          <p className="text-[10px] text-brand-dark/40">{formatNumber(results.currentConversions)} conversions/mo</p>
                       </div>
                       <div className="p-4 bg-green-50/50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                          <p className="text-xs text-green-800 dark:text-green-300 font-semibold mb-1">Target CVR</p>
                          <p className="text-lg font-bold text-green-700 dark:text-green-400">{inputs.targetConversionRate}%</p>
                          <p className="text-[10px] text-green-800/60 dark:text-green-300/60">{formatNumber(results.targetConversions)} conversions/mo</p>
                       </div>
                       <div className="p-4 bg-brand-surface rounded-lg border border-brand-medium/20">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">Current Revenue</p>
                          <p className="text-lg font-bold text-purple-700 dark:text-purple-400">{formatCurrency(results.currentRevenue)}</p>
                       </div>
                       <div className="p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                          <p className="text-xs text-purple-800 dark:text-purple-300 font-semibold mb-1">Target Revenue</p>
                          <p className="text-lg font-bold text-purple-700 dark:text-purple-400">{formatCurrency(results.targetRevenue)}</p>
                       </div>
                    </div>

                    {/* Improvement Stat */}
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800 p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-orange-900 dark:text-orange-300 font-semibold mb-1">CVR Improvement</p>
                                <p className="text-xl font-bold text-orange-700 dark:text-orange-400">{results.cvrImprovement.toFixed(1)}%</p>
                                <p className="text-[10px] text-orange-800 dark:text-orange-300 mt-1">+{formatNumber(results.additionalConversions)} conversions/month</p>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Text */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                        <p className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">Analysis:</p>
                        <p className="text-xs text-blue-700 dark:text-blue-200 leading-relaxed">
                            <span className="font-bold">✓ Significant improvement target ({results.cvrImprovement.toFixed(0)}% CVR increase).</span> Requires major optimization: complete page redesign, user research and testing, funnel optimization, new value proposition development, professional copywriting. Expected timeline: 3-6 months. Additional monthly revenue: {formatCurrency(results.additionalRevenue)}. Investment needed: Hire CRO specialist or agency, implement proper testing tools, conduct user research, dedicate resources to continuous testing. This level requires comprehensive changes but delivers transformational results. Moderate revenue opportunity: {formatCurrency(results.additionalRevenue * 12)} additional annual revenue supports dedicated optimization effort.
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-brand-surface">
                   <h4 className="flex items-center gap-2 text-sm font-bold text-brand-dark mb-4">
                      <Info className="w-4 h-4 text-brand-medium" />
                      Optimization Tips:
                   </h4>
                   <ul className="space-y-2 text-xs text-brand-dark/70">
                      <li className="flex gap-2 text-purple-600 dark:text-purple-400">
                         <span>•</span>
                         Test one element at a time for clear results
                      </li>
                      <li className="flex gap-2 text-purple-600 dark:text-purple-400">
                         <span>•</span>
                         Industry average CVR: 2-5% (5%+ is excellent)
                      </li>
                      <li className="flex gap-2 text-purple-600 dark:text-purple-400">
                         <span>•</span>
                         Mobile optimization can boost CVR by 30-50%
                      </li>
                      <li className="flex gap-2 text-purple-600 dark:text-purple-400">
                         <span>•</span>
                         Page speed: Each second delay = 7% conversion loss
                      </li>
                   </ul>
                </div>
             </div>
          </div>
        </div>

        {/* Types Section */}
        <div className="mb-16">
           <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">Landing Page Calculator Types & Features</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                 {
                    title: "Landing Page Optimization Calculator",
                    desc: "Calculate revenue impact of landing page improvements on revenue",
                    tag: "Optimization impact",
                    tagContent: "Revenue Growth Projections",
                    note: "Measures additional revenue from conversion rate improvements"
                 },
                 {
                    title: "Conversion Rate Improvement Calculator",
                    desc: "Track CVR improvements and business impact over time",
                    tag: "CVR analysis",
                    tagContent: "Percentage Improvement Tracking",
                    note: "Calculates conversion rate increase and additional conversions"
                 },
                 {
                    title: "Landing Page Revenue Calculator",
                    desc: "Calculate revenue from landing page traffic and conversions",
                    tag: "Revenue metrics",
                    tagContent: "Monthly & Annual Revenue",
                    note: "Projects current and target revenue based on CVR goals"
                 },
                 {
                    title: "CRO Calculator",
                    desc: "Conversion Rate Optimization return on investment calculator",
                    tag: "CRO ROI",
                    tagContent: "Optimization Investment Returns",
                    note: "Measures return on investment from CRO programs"
                 },
                 {
                    title: "A/B Testing Impact Calculator",
                    desc: "Calculate revenue impact from A/B test winning variations",
                    tag: "Test results",
                    tagContent: "Winner Revenue Impact",
                    note: "Quantifies value of A/B test improvements"
                 },
                 {
                    title: "Landing Page Performance Calculator",
                    desc: "Analyze comprehensive landing page metrics and KPIs",
                    tag: "Performance KPIs",
                    tagContent: "Multi-Metric Analysis",
                    note: "Tracks bounce rate, time on page, and conversion funnel"
                 }
              ].map((card, i) => (
                 <div key={i} className="bg-brand-surface p-6 rounded-xl border border-brand-medium/30 hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-brand-dark mb-2">{card.title}</h3>
                    <p className="text-xs text-brand-dark/60 mb-4 h-8">{card.desc}</p>
                    <div className="bg-brand-light rounded-lg p-3 mb-4">
                       <p className="text-[10px] opacity-70 uppercase font-semibold mb-1">{card.tag}</p>
                       <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{card.tagContent}</p>
                    </div>
                    <p className="text-xs text-brand-dark/50">{card.note}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* Quick Example Result */}
        <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-8 mb-16 border border-blue-100 dark:border-blue-800 text-center">
            <h3 className="text-lg font-bold text-brand-dark mb-2">Example Calculation Result</h3>
            <p className="text-brand-dark/60 mb-6 text-sm">Landing page with 10,000 monthly visitors, improving CVR from 2% to 3% at $100 AOV:</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                <div className="bg-blue-100 dark:bg-blue-900/40 px-6 py-3 rounded-lg min-w-[120px]">
                    <p className="text-xs text-blue-800 dark:text-blue-300 font-semibold uppercase mb-1">Current CVR</p>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-400">2%</p>
                    <p className="text-[10px] text-blue-800/60 dark:text-blue-300/60">200 conversions/mo</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/40 px-6 py-3 rounded-lg min-w-[120px]">
                    <p className="text-xs text-green-800 dark:text-green-300 font-semibold uppercase mb-1">Target CVR</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-400">3%</p>
                    <p className="text-[10px] text-green-800/60 dark:text-green-300/60">300 conversions/mo</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/40 px-6 py-3 rounded-lg min-w-[120px]">
                    <p className="text-xs text-purple-800 dark:text-purple-300 font-semibold uppercase mb-1">Add. Revenue</p>
                    <p className="text-xl font-bold text-purple-700 dark:text-purple-400">$10,000</p>
                    <p className="text-[10px] text-purple-800/60 dark:text-purple-300/60">+50% increase</p>
                </div>
            </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 p-8 md:p-12 mb-16">
           <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">How Our Landing Page Impact Calculator Works</h2>
           <p className="text-center text-brand-dark/70 max-w-2xl mx-auto mb-12">
              Our landing page impact calculator quantifies the financial value of conversion rate optimization. The calculation projects revenue increases based on traffic volume, current vs. target conversion rates, and average order value to show the <span className="text-purple-600 dark:text-purple-400 font-bold">ROI of page optimization efforts</span>.
           </p>

           <div className="bg-brand-light/50 rounded-xl p-8 max-w-3xl mx-auto border border-brand-medium/20 mb-12">
              <h3 className="font-bold text-brand-dark mb-6">Impact Calculation Formulas</h3>
              <div className="bg-brand-surface p-6 rounded-lg border border-brand-medium/20 font-mono text-xs md:text-sm text-brand-dark/80 leading-relaxed shadow-sm space-y-3">
                 <div>
                    <span className="font-bold block mb-1">Current Conversions:</span>
                    <span className="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">Traffic × (Current CVR ÷ 100)</span>
                 </div>
                 <div>
                    <span className="font-bold block mb-1">Target Conversions:</span>
                    <span className="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">Traffic × (Target CVR ÷ 100)</span>
                 </div>
                 <div>
                    <span className="font-bold block mb-1">Additional Revenue:</span>
                    <span className="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">(Target Conversions - Current Conversions) × AOV</span>
                 </div>
                 <div>
                    <span className="font-bold block mb-1">CVR Improvement %:</span>
                    <span className="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">((Target CVR - Current CVR) ÷ Current CVR) × 100</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Found This Calculator Helpful Section */}
        <div className="max-w-2xl mx-auto mb-16">
           <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-dark mb-2">Found This Calculator Helpful?</h2>
              <p className="text-brand-dark/70">Share it with your marketing team</p>
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
                       href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check%20out%20this%20Landing%20Page%20Calculator`}
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
                       href={`https://wa.me/?text=${encodeURIComponent('Check out this Landing Page Calculator: ' + shareUrl)}`}
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
                 href={`mailto:?subject=Landing Page Impact Calculator&body=Check out this Landing Page Impact Calculator: ${shareUrl}`}
                 className="flex items-center justify-center gap-2 w-full py-2.5 border border-brand-medium/30 rounded-lg hover:bg-brand-light transition-colors mb-6 text-brand-dark"
              >
                 <Mail className="w-4 h-4" />
                 <span className="text-sm font-medium">Share via Email</span>
              </a>

               <button 
                  onClick={() => {
                      if (navigator.share) {
                          navigator.share({
                              title: 'Landing Page Calculator',
                              text: 'Check out this Landing Page Impact Calculator!',
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
                  Suggested hashtags: #CRO #Marketing #LandingPage #Optimization #Calculator
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPageImpactCalculator;
