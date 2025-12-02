
import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Search, LineChart, Info } from 'lucide-react';
import ShareTool from './ShareTool';

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

  useEffect(() => {
    // Current URL handled by ShareTool
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === 'industry' ? value : parseFloat(value) || 0
    }));
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
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/60 mt-1">Total monthly SEO spend (agency, tools, content, etc.)</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Current Monthly Organic Traffic</label>
                   <input
                      type="number"
                      name="currentTraffic"
                      value={inputs.currentTraffic}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/60 mt-1">Current monthly organic search visitors</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Expected Traffic Increase (%)</label>
                   <input
                      type="number"
                      name="trafficIncreasePercent"
                      value={inputs.trafficIncreasePercent}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/60 mt-1">Projected percentage increase in organic traffic</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Conversion Rate (%)</label>
                   <input
                      type="number"
                      name="conversionRate"
                      value={inputs.conversionRate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
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
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
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
                            className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-2">Industry Type</label>
                        <select 
                            name="industry" 
                            value={inputs.industry}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-brand-light/50 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        >
                            <option value="E-commerce">E-commerce</option>
                            <option value="SaaS">SaaS</option>
                            <option value="B2B Services">B2B Services</option>
                            <option value="Local Business">Local Business</option>
                            <option value="Content/Media">Content/Media</option>
                        </select>
                    </div>
                </div>

                <button className="w-full py-3 bg-brand-dark dark:bg-indigo-600 hover:bg-brand-dark/90 dark:hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-95 flex justify-center items-center gap-2 mt-4">
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

                    <div className={`rounded-xl p-6 mb-6 border ${results.isPositive ? 'bg-indigo-50/50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800' : 'bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-800'}`}>
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

                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg p-4 mb-6">
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
                      <Info className="w-4 h-4 text-brand-medium" />
                      SEO ROI Tips:
                   </h4>
                   <ul className="space-y-2 text-xs text-brand-dark/70">
                      <li className="flex gap-2 text-indigo-600 dark:text-indigo-400">
                         <span>•</span>
                         SEO is a long-term game; calculate ROI over 12+ months
                      </li>
                      <li className="flex gap-2 text-indigo-600 dark:text-indigo-400">
                         <span>•</span>
                         Factor in the compounding value of organic traffic
                      </li>
                      <li className="flex gap-2 text-indigo-600 dark:text-indigo-400">
                         <span>•</span>
                         Include content production and link building costs
                      </li>
                      <li className="flex gap-2 text-indigo-600 dark:text-indigo-400">
                         <span>•</span>
                         Compare SEO CAC vs Paid Media CAC for budget allocation
                      </li>
                   </ul>
                </div>
             </div>
          </div>
        </div>
        
        <ShareTool title="Enterprise SEO ROI Calculator" />

      </div>
    </div>
  );
};

export default EnterpriseSeoCalculator;
