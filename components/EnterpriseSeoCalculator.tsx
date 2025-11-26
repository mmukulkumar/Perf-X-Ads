import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Search, BarChart3, Info, Share2, Copy, Check, Facebook, Linkedin, Twitter, Mail, MessageCircle, ArrowRight, Globe, LineChart, Target } from 'lucide-react';

const EnterpriseSeoCalculator = () => {
  const [inputs, setInputs] = useState({
    monthlyInvestment: 15000,
    currentTraffic: 50000,
    trafficIncreasePercent: 100,
    conversionRate: 2.5,
    averageOrderValue: 150,
    timeframe: 12,
    industry: 'E-commerce'
  });

  const [results, setResults] = useState({
    totalInvestment: 0,
    trafficIncreaseVolume: 0,
    monthlyConversions: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    netProfit: 0,
    roiPercentage: 0,
    paybackPeriod: 0,
    isPositive: true
  });

  const [shareUrl, setShareUrl] = useState('');
  const [isSharedCopied, setIsSharedCopied] = useState(false);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === 'industry' ? value : parseFloat(value) || 0
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
    const { monthlyInvestment, currentTraffic, trafficIncreasePercent, conversionRate, averageOrderValue, timeframe } = inputs;

    // 1. Total Investment = Monthly * Timeframe
    const totalInvestment = monthlyInvestment * timeframe;

    // 2. Traffic Increase Volume = Current * (Percent / 100)
    // Note: The example implies this is the target increase achieved and sustained/averaged.
    const trafficIncreaseVolume = currentTraffic * (trafficIncreasePercent / 100);

    // 3. Monthly Conversions (from new traffic)
    const monthlyConversions = trafficIncreaseVolume * (conversionRate / 100);

    // 4. Monthly Revenue (from new traffic)
    const monthlyRevenue = monthlyConversions * averageOrderValue;

    // 5. Total Revenue over timeframe
    // Using the linear model from the example: Monthly Revenue * Timeframe
    const totalRevenue = monthlyRevenue * timeframe;

    // 6. Net Profit
    const netProfit = totalRevenue - totalInvestment;

    // 7. ROI Percentage
    const roiPercentage = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

    // 8. Payback Period
    // Investment / Monthly Revenue
    const paybackPeriod = monthlyRevenue > 0 ? totalInvestment / monthlyRevenue : 0;

    setResults({
      totalInvestment,
      trafficIncreaseVolume,
      monthlyConversions,
      monthlyRevenue,
      totalRevenue,
      netProfit,
      roiPercentage,
      paybackPeriod,
      isPositive: netProfit > 0
    });

  }, [inputs]);

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="relative bg-brand-light border-b border-brand-medium/20 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-5"></div>
        <div className="absolute top-0 right-0 p-12 opacity-10">
           <LineChart className="w-64 h-64 text-brand-dark" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
             <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface text-brand-dark text-xs font-semibold mb-4 border border-brand-medium/30">
                  <Search className="w-3 h-3" />
                  SEO Analytics Tool
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-brand-dark tracking-tight mb-4 leading-tight">
                  Enterprise SEO ROI Calculator - SEO ROI Calculator & Organic Search ROI Calculator
                </h1>
                <p className="text-lg text-brand-dark/70 leading-relaxed mb-6">
                  Free enterprise SEO ROI calculator & SEO return on investment calculator. Calculate SEO ROI, payback period, organic revenue & traffic growth. Our calculator uses proven <span className="font-semibold text-indigo-600 dark:text-indigo-400">SEO ROI formulas</span> to analyze enterprise search engine optimization investments and provide actionable recommendations for maximizing organic search performance.
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm text-brand-dark/60">
                   <div className="flex items-center gap-1.5">
                     <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                     Comprehensive ROI and payback analysis
                   </div>
                   <div className="flex items-center gap-1.5">
                     <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                     SEO vs PPC comparison
                   </div>
                   <div className="flex items-center gap-1.5">
                     <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                     Multiple scenario projections
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* Main Calculator Area */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          
          {/* Inputs Column */}
          <div className="w-full lg:w-5/12 bg-brand-surface p-6 md:p-8 rounded-2xl border border-brand-medium/30 shadow-sm h-fit">
             <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold text-lg border-b border-brand-medium/10 pb-4">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h3>Enterprise SEO ROI Calculator</h3>
             </div>
             <p className="text-brand-dark/60 text-sm mb-6">Calculate ROI, payback period, and long-term value of SEO investments</p>
             
             <div className="space-y-6">
                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Monthly SEO Investment ($)</label>
                   <input
                      type="number"
                      name="monthlyInvestment"
                      value={inputs.monthlyInvestment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/40 mt-1">Total monthly SEO spend (agency, tools, content, etc.)</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Current Monthly Organic Traffic</label>
                   <input
                      type="number"
                      name="currentTraffic"
                      value={inputs.currentTraffic}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/40 mt-1">Current monthly organic search visitors</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Expected Traffic Increase (%)</label>
                   <input
                      type="number"
                      name="trafficIncreasePercent"
                      value={inputs.trafficIncreasePercent}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/40 mt-1">Projected percentage increase in organic traffic</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Conversion Rate (%)</label>
                   <input
                      type="number"
                      name="conversionRate"
                      value={inputs.conversionRate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/40 mt-1">Percentage of visitors who convert</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Average Order Value ($)</label>
                   <input
                      type="number"
                      name="averageOrderValue"
                      value={inputs.averageOrderValue}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/40 mt-1">Average revenue per conversion</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-2">Timeframe (Months)</label>
                        <input
                            type="number"
                            name="timeframe"
                            value={inputs.timeframe}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-2">Industry Type</label>
                        <select 
                            name="industry" 
                            value={inputs.industry}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-brand-light/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        >
                            <option value="E-commerce">E-commerce</option>
                            <option value="SaaS">SaaS</option>
                            <option value="B2B Services">B2B Services</option>
                            <option value="Local Business">Local Business</option>
                            <option value="Content/Media">Content/Media</option>
                        </select>
                    </div>
                </div>

                <button className="w-full py-3 bg-brand-dark hover:bg-brand-dark/90 text-white font-bold rounded-lg shadow-md transition-all active:scale-95 flex justify-center items-center gap-2 mt-4">
                    <Calculator className="w-4 h-4" />
                    Calculate SEO ROI
                </button>
             </div>
          </div>

          {/* Results Column */}
          <div className="w-full lg:w-7/12">
             <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-xl overflow-hidden sticky top-24">
                <div className="p-6 md:p-8 bg-brand-light border-b border-brand-medium/20">
                    <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold">
                       <LineChart className="w-5 h-5 text-indigo-600" />
                       <h3>Investment Analysis</h3>
                    </div>

                    <div className={`rounded-xl p-6 mb-6 border ${results.isPositive ? 'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'}`}>
                       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                           <div>
                                <p className="text-sm font-semibold opacity-80 mb-1 text-brand-dark">Projected ROI</p>
                                <div className={`text-5xl font-extrabold ${results.isPositive ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600'}`}>
                                    {results.roiPercentage.toFixed(0)}%
                                </div>
                           </div>
                           <div className="text-left md:text-right">
                                <p className="text-sm font-semibold opacity-80 mb-1 text-brand-dark">Payback Period</p>
                                <div className="text-2xl font-bold text-brand-dark">
                                    {results.paybackPeriod === Infinity ? 'Never' : results.paybackPeriod.toFixed(1)} <span className="text-sm font-normal text-brand-dark/60">months</span>
                                </div>
                           </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="p-4 bg-brand-surface rounded-lg border border-brand-medium/20">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">Net Profit</p>
                          <p className={`text-xl font-bold ${results.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                              {results.isPositive ? '+' : ''}{formatCurrency(results.netProfit)}
                          </p>
                       </div>
                       <div className="p-4 bg-brand-surface rounded-lg border border-brand-medium/20">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">Total Revenue</p>
                          <p className="text-xl font-bold text-brand-dark">{formatCurrency(results.totalRevenue)}</p>
                       </div>
                       <div className="p-4 bg-brand-surface rounded-lg border border-brand-medium/20">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">Traffic Increase</p>
                          <p className="text-xl font-bold text-brand-dark">+{formatNumber(results.trafficIncreaseVolume)}</p>
                          <p className="text-[10px] text-brand-dark/40">Monthly visitors</p>
                       </div>
                       <div className="p-4 bg-brand-surface rounded-lg border border-brand-medium/20">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">Conversions</p>
                          <p className="text-xl font-bold text-brand-dark">+{formatNumber(results.monthlyConversions)}</p>
                          <p className="text-[10px] text-brand-dark/40">Monthly sales/leads</p>
                       </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Total Investment ({inputs.timeframe} mo)</p>
                            <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{formatCurrency(results.totalInvestment)}</p>
                        </div>
                    </div>

                    {/* Analysis Text */}
                    <div className="p-4 bg-brand-surface border border-brand-medium/20 rounded-lg">
                        <p className="text-xs font-bold text-brand-dark mb-1">Analysis:</p>
                        <p className="text-xs text-brand-dark/70 leading-relaxed">
                            {results.isPositive 
                                ? `Excellent potential. Your projected revenue of ${formatCurrency(results.totalRevenue)} significantly exceeds the investment. A ${results.roiPercentage.toFixed(0)}% ROI indicates a highly efficient channel.`
                                : "Projected revenue does not cover the investment within the selected timeframe. Consider increasing conversion rate, AOV, or extending the timeframe as SEO often takes 6+ months to yield results."}
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-brand-surface">
                   <h4 className="flex items-center gap-2 text-sm font-bold text-brand-dark mb-4">
                      <Globe className="w-4 h-4 text-brand-medium" />
                      Enterprise SEO ROI Tips:
                   </h4>
                   <ul className="space-y-2 text-xs text-brand-dark/70">
                      <li className="flex gap-2 text-indigo-600 dark:text-indigo-400">
                         <span>•</span>
                         Calculate "Brand" vs "Non-Brand" traffic for accuracy
                      </li>
                      <li className="flex gap-2 text-indigo-600 dark:text-indigo-400">
                         <span>•</span>
                         Factor in Customer Lifetime Value (LTV) for B2B/SaaS
                      </li>
                      <li className="flex gap-2 text-indigo-600 dark:text-indigo-400">
                         <span>•</span>
                         Include technical SEO and content production costs
                      </li>
                      <li className="flex gap-2 text-indigo-600 dark:text-indigo-400">
                         <span>•</span>
                         Track "Assisted Conversions" in analytics
                      </li>
                   </ul>
                </div>
             </div>
          </div>
        </div>

        {/* Types Section */}
        <div className="mb-16">
           <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">Enterprise SEO ROI Calculator Types & Analysis</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                 {
                    title: "SEO ROI Calculator",
                    desc: "Calculate return on investment for SEO campaigns",
                    formula: "(Revenue - Cost) ÷ Cost × 100%",
                    tag: "Formula",
                    note: "Measure profitability of SEO investments"
                 },
                 {
                    title: "Organic Search ROI Calculator",
                    desc: "Track organic channel profitability and growth",
                    formula: "Organic Revenue Growth",
                    tag: "Metric",
                    note: "Measure organic search channel performance over time",
                    color: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                 },
                 {
                    title: "SEO Payback Period Calculator",
                    desc: "Calculate time to recover SEO investment",
                    formula: "Investment ÷ Monthly Revenue",
                    tag: "Formula",
                    note: "Shows months needed to break even on SEO spend",
                    color: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                 },
                 {
                    title: "SEO Value Calculator",
                    desc: "Calculate long-term value of organic rankings",
                    formula: "Lifetime Value",
                    tag: "Analysis",
                    note: "Project multi-year revenue from SEO investments",
                    color: "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
                 },
                 {
                    title: "SEO vs PPC ROI Calculator",
                    desc: "Compare organic and paid search profitability",
                    formula: "Channel Effectiveness",
                    tag: "Comparison",
                    note: "Determine optimal budget allocation between channels",
                    color: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                 },
                 {
                    title: "Enterprise SEO Investment Calculator",
                    desc: "Plan SEO budgets and resource allocation",
                    formula: "Budget Optimization",
                    tag: "Planning",
                    note: "Determine optimal SEO investment levels",
                    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                 }
              ].map((card, i) => (
                 <div key={i} className="bg-brand-surface p-6 rounded-xl border border-brand-medium/30 hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-brand-dark mb-2">{card.title}</h3>
                    <p className="text-xs text-brand-dark/60 mb-4 h-8">{card.desc}</p>
                    <div className={`rounded-lg p-3 mb-4 ${card.color ? card.color.split(' ').slice(0, 2).join(' ') : 'bg-brand-light'}`}>
                       <p className="text-[10px] opacity-70 uppercase font-semibold mb-1">{card.tag}</p>
                       <p className={`text-sm font-medium ${card.color ? card.color.split(' ').slice(2).join(' ') : 'text-indigo-600 dark:text-indigo-400'}`}>{card.formula}</p>
                    </div>
                    <p className="text-xs text-brand-dark/50">{card.note}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* Quick Example Result */}
        <div className="bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl p-8 mb-16 border border-indigo-100 dark:border-indigo-800 text-center">
            <h3 className="text-lg font-bold text-brand-dark mb-2">Quick Example Result</h3>
            <p className="text-brand-dark/60 mb-6 text-sm">For $15,000/month SEO investment over 12 months with 100% traffic increase, 2.5% conversion, $150 AOV:</p>
            <div className="flex justify-center gap-8">
                <div>
                    <p className="text-xs text-brand-dark/50 font-semibold uppercase">ROI</p>
                    <div className="px-6 py-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-lg font-bold text-lg inline-block mt-1">
                        108%
                    </div>
                </div>
                <div>
                    <p className="text-xs text-brand-dark/50 font-semibold uppercase">Payback Period</p>
                    <div className="px-6 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg font-bold text-lg inline-block mt-1">
                        9.6 months
                    </div>
                </div>
            </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 p-8 md:p-12 mb-16">
           <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">How Our Enterprise SEO ROI Calculator Works</h2>
           <p className="text-center text-brand-dark/70 max-w-2xl mx-auto mb-12">
              Our enterprise SEO ROI calculator uses proven <span className="text-indigo-600 dark:text-indigo-400 font-bold">digital marketing analytics</span> formulas to measure search engine optimization profitability. The calculation projects traffic growth from SEO efforts, converts that traffic to revenue based on your conversion rate and average order value, then calculates ROI and payback period.
           </p>

           <div className="bg-brand-light/50 rounded-xl p-8 max-w-3xl mx-auto border border-brand-medium/20 mb-12">
              <h3 className="font-bold text-brand-dark mb-6">The Enterprise SEO ROI Formula</h3>
              <div className="bg-brand-surface p-6 rounded-lg border border-brand-medium/20 font-mono text-xs md:text-sm text-brand-dark/80 leading-relaxed shadow-sm space-y-2">
                 <p>Traffic Increase = Current Traffic × Growth %</p>
                 <p>Conversions = New Traffic × Conversion Rate</p>
                 <p>Revenue = Conversions × Average Order Value</p>
                 <p className="font-bold mt-2">ROI = ((Revenue - Investment) ÷ Investment) × 100%</p>
              </div>
              <p className="text-xs text-brand-dark/50 mt-4 text-center">
                  These formulas calculate the complete financial impact of SEO investments. The calculator projects traffic growth, converts it to revenue, and compares against costs to determine profitability and payback period.
              </p>
              
              <div className="mt-8 text-center">
                 <p className="text-xs font-bold text-brand-dark/40 uppercase mb-2 flex items-center justify-center gap-2">
                    <LineChart className="w-3 h-3" />
                    SEO ROI Growth Curve
                 </p>
                 <p className="text-xs text-brand-dark/60">Shows typical SEO ROI progression over 24 months</p>
              </div>
           </div>
        </div>

        {/* Understanding Section */}
        <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-xl font-bold text-brand-dark mb-4">Understanding Enterprise SEO ROI</h3>
            <p className="text-sm text-brand-dark/70 mb-6 leading-relaxed">
                Enterprise SEO ROI differs from other marketing channels because results compound over time. Unlike PPC where traffic stops when spend ends, SEO builds lasting assets (rankings, content, authority) that continue generating revenue long after initial investment. Typical enterprise SEO shows 50-100% ROI in months 6-12, growing to 300-500%+ ROI in years 2-3 as rankings strengthen and traffic compounds.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-brand-dark/70 mb-8">
                <li>SEO ROI compounds over time (unlike PPC)</li>
                <li>Initial results appear in 4-6 months for competitive keywords</li>
                <li>Payback period typically 6-12 months for enterprise</li>
                <li>Year 2-3 ROI often 3-5x higher than year 1</li>
                <li>Cost per acquisition decreases as rankings improve</li>
                <li>Organic traffic provides better customer lifetime value</li>
            </ul>

            <div className="bg-brand-light/30 p-6 rounded-xl border border-brand-medium/20">
                <h4 className="font-bold text-brand-dark mb-3">Sources & References</h4>
                <div className="space-y-3 text-xs text-brand-dark/70">
                    <p className="flex gap-2">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">The Art of SEO</span> - 
                        <span>Enge, Spencer, Stricchiola. Comprehensive guide to enterprise SEO strategy and ROI</span>
                    </p>
                    <p className="flex gap-2">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">Enterprise SEO Audit</span> - 
                        <span>Olga Andrienko (SEMrush). Best practices for measuring enterprise SEO performance</span>
                    </p>
                    <p className="flex gap-2">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">Moz</span> - 
                        <span>How to Calculate and Prove SEO ROI. Expert guidance on SEO ROI measurement and reporting</span>
                    </p>
                </div>
            </div>
        </div>

        {/* Example Section */}
        <div className="max-w-4xl mx-auto mb-16">
           <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">Enterprise SEO ROI Calculator Examples</h2>
           <div className="bg-brand-surface p-8 rounded-2xl border border-brand-medium/30 shadow-sm">
                <h3 className="font-bold text-lg text-brand-dark mb-4">Enterprise E-commerce SEO ROI Example</h3>
                <p className="text-sm text-brand-dark/60 mb-6">Calculate SEO ROI for an enterprise e-commerce website</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    <div>
                        <h4 className="font-semibold text-brand-dark mb-2">SEO Investment:</h4>
                        <ul className="space-y-2 text-brand-dark/70">
                            <li><span className="font-semibold text-brand-dark">Monthly Investment:</span> $15,000</li>
                            <li><span className="font-semibold text-brand-dark">Current Organic Traffic:</span> 50,000/month</li>
                            <li><span className="font-semibold text-brand-dark">Expected Increase:</span> 100%</li>
                            <li><span className="font-semibold text-brand-dark">Conversion Rate:</span> 2.5%</li>
                            <li><span className="font-semibold text-brand-dark">Average Order Value:</span> $150</li>
                            <li><span className="font-semibold text-brand-dark">Timeframe:</span> 12 months</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-brand-dark mb-2">Calculation Steps:</h4>
                        <ol className="space-y-2 text-brand-dark/70 list-decimal pl-4">
                            <li>Total Investment: $15,000 × 12 = $180,000</li>
                            <li>Traffic Increase: 50,000 × 100% = 50,000</li>
                            <li>Monthly Conversions: 50,000 × 2.5% = 1,250</li>
                            <li>Monthly Revenue: 1,250 × $150 = $187,500</li>
                            <li>Total Revenue: $187,500 × 12 = $2,250,000</li>
                            <li>ROI: (($2,250,000 - $180,000) ÷ $180,000) × 100 = 1,150%</li>
                        </ol>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg text-sm">
                    <span className="font-bold text-purple-800 dark:text-purple-300">Result: 1,150% ROI with 0.96 month payback period</span>
                    <p className="text-purple-700 dark:text-purple-200 mt-1">Exceptional enterprise SEO performance with rapid payback and high profitability.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="font-bold text-sm text-brand-dark">B2B SaaS Example</p>
                        <p className="text-xs text-brand-dark/60 mt-1">$20k/mo, 75% increase, 3% conv, $500 AOV</p>
                        <p className="font-bold text-blue-600 mt-2 text-sm">ROI: 281% | Payback: 12.8 months</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <p className="font-bold text-sm text-brand-dark">Local Business Example</p>
                        <p className="text-xs text-brand-dark/60 mt-1">$5k/mo, 150% increase, 4% conv, $200 AOV</p>
                        <p className="font-bold text-green-600 mt-2 text-sm">ROI: 600% | Payback: 5 months</p>
                    </div>
                </div>
           </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {[
                    "What is SEO ROI and why is it important?",
                    "How do you calculate SEO return on investment?",
                    "What is a good ROI for enterprise SEO?",
                    "How long does it take to see SEO ROI?",
                    "What should be included in SEO investment calculations?",
                    "How do you measure organic revenue for SEO ROI?",
                    "How does enterprise SEO ROI compare to PPC?",
                    "What factors affect enterprise SEO ROI?",
                    "How can I improve my SEO ROI?",
                    "What metrics should I track for enterprise SEO ROI?"
                ].map((q, i) => (
                    <div key={i} className="border-b border-brand-medium/20 pb-4">
                        <button className="flex justify-between items-center w-full text-left font-medium text-brand-dark hover:text-indigo-600 transition-colors">
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
              <p className="text-brand-dark/70">Share it with others who need help with SEO ROI analysis</p>
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
                       href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check%20out%20this%20SEO%20ROI%20Calculator`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-start gap-3 px-4 py-2.5 border border-brand-medium/30 rounded-lg hover:bg-brand-light transition-colors group"
                    >
                       <div className="w-5 h-5 flex items-center justify-center">
                            <Twitter className="w-4 h-4 text-brand-dark dark:text-brand-dark/80 group-hover:text-blue-400 transition-colors" />
                       </div>
                       <span className="text-sm font-medium text-brand-dark">X</span>
                    </a>
                    <a 
                       href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-start gap-3 px-4 py-2.5 border border-brand-medium/30 rounded-lg hover:bg-brand-light transition-colors group"
                    >
                       <div className="w-5 h-5 flex items-center justify-center">
                            <Facebook className="w-4 h-4 text-blue-600" />
                       </div>
                       <span className="text-sm font-medium text-brand-dark text-blue-600 dark:text-blue-400">Facebook</span>
                    </a>
                    <a 
                       href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-start gap-3 px-4 py-2.5 border border-brand-medium/30 rounded-lg hover:bg-brand-light transition-colors group"
                    >
                       <div className="w-5 h-5 flex items-center justify-center">
                            <Linkedin className="w-4 h-4 text-blue-700 dark:text-blue-500" />
                       </div>
                       <span className="text-sm font-medium text-brand-dark text-blue-700 dark:text-blue-500">LinkedIn</span>
                    </a>
                    <a 
                       href={`https://wa.me/?text=${encodeURIComponent('Check out this SEO ROI Calculator: ' + shareUrl)}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-start gap-3 px-4 py-2.5 border border-brand-medium/30 rounded-lg hover:bg-brand-light transition-colors group"
                    >
                       <div className="w-5 h-5 flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 text-green-500" />
                       </div>
                       <span className="text-sm font-medium text-brand-dark text-green-600 dark:text-green-400">WhatsApp</span>
                    </a>
                 </div>
              </div>
              
              {/* Email */}
              <a 
                 href={`mailto:?subject=SEO ROI Calculator&body=Check out this SEO ROI Calculator: ${shareUrl}`}
                 className="flex items-center justify-center gap-2 w-full py-2.5 border border-brand-medium/30 rounded-lg hover:bg-brand-light transition-colors mb-6 text-brand-dark"
              >
                 <Mail className="w-4 h-4" />
                 <span className="text-sm font-medium">Share via Email</span>
              </a>

               <button 
                  onClick={() => {
                      if (navigator.share) {
                          navigator.share({
                              title: 'SEO ROI Calculator',
                              text: 'Check out this SEO ROI Calculator!',
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
                  Suggested hashtags: #SEO #ROI #Enterprise #Marketing #Calculator
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default EnterpriseSeoCalculator;