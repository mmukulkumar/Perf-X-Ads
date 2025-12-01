
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
                      className="w-full px-4 py-3 bg-brand-light/50 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
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
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/60 mt-1">Monthly visitors to your landing page</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Current Conversion Rate (%)</label>
                   <input
                      type="number"
                      name="currentConversionRate"
                      value={inputs.currentConversionRate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/60 mt-1">Current page conversion rate</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Target Conversion Rate (%)</label>
                   <input
                      type="number"
                      name="targetConversionRate"
                      value={inputs.targetConversionRate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
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
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
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
                    <div className={`${results.isPositive ? 'bg-green-50 dark:bg-green-900/30 border-green-100 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-800'} rounded-xl p-6 mb-6 border`}>
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
                       <div className="p-4 bg-green-50/50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800">
                          <p className="text-xs text-green-800 dark:text-green-300 font-semibold mb-1">Target CVR</p>
                          <p className="text-lg font-bold text-green-700 dark:text-green-400">{inputs.targetConversionRate}%</p>
                          <p className="text-[10px] text-green-800/60 dark:text-green-300/60">{formatNumber(results.targetConversions)} conversions/mo</p>
                       </div>
                       <div className="p-4 bg-brand-surface rounded-lg border border-brand-medium/20">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">Current Revenue</p>
                          <p className="text-lg font-bold text-purple-700 dark:text-purple-400">{formatCurrency(results.currentRevenue)}</p>
                       </div>
                       <div className="p-4 bg-purple-50/50 dark:bg-purple-900/30 rounded-lg border border-purple-100 dark:border-purple-800">
                          <p className="text-xs text-purple-800 dark:text-purple-300 font-semibold mb-1">Target Revenue</p>
                          <p className="text-lg font-bold text-purple-700 dark:text-purple-400">{formatCurrency(results.targetRevenue)}</p>
                       </div>
                    </div>

                    {/* Improvement Stat */}
                    <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg border border-orange-100 dark:border-orange-800 p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-orange-900 dark:text-orange-300 font-semibold mb-1">CVR Improvement</p>
                                <p className="text-xl font-bold text-orange-700 dark:text-orange-400">{results.cvrImprovement.toFixed(1)}%</p>
                                <p className="text-[10px] text-orange-800 dark:text-orange-300 mt-1">+{formatNumber(results.additionalConversions)} conversions/month</p>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Text */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg">
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

      </div>
    </div>
  );
};

export default LandingPageImpactCalculator;
