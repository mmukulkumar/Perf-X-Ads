
import React, { useState, useEffect } from 'react';
import { Calculator, AlertCircle, TrendingUp, Info } from 'lucide-react';
import ShareTool from './ShareTool';

const AdBudgetPlanner = () => {
  const [inputs, setInputs] = useState({
    budgetPeriod: 'Monthly',
    revenueGoal: 50000,
    targetRoas: 4,
    averageOrderValue: 150,
    conversionRate: 3,
    averageCpc: 2.50,
  });

  const [results, setResults] = useState({
    recommendedBudget: 0,
    dailyBudget: 0,
    expectedClicks: 0,
    expectedConversions: 0,
    expectedRevenue: 0,
    projectedRoas: 0,
    breakEvenCpc: 0,
    isRoasLow: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === 'budgetPeriod' ? value : parseFloat(value) || 0
    }));
  };

  useEffect(() => {
    const { revenueGoal, targetRoas, averageOrderValue, conversionRate, averageCpc } = inputs;
    const safeTargetRoas = targetRoas || 1;
    const safeCpc = averageCpc || 0.01;

    const recommendedBudget = revenueGoal / safeTargetRoas;
    const dailyBudget = recommendedBudget / 30.4; 
    const expectedClicks = recommendedBudget / safeCpc;
    const expectedConversions = expectedClicks * (conversionRate / 100);
    const expectedRevenue = expectedConversions * averageOrderValue;
    const projectedRoas = recommendedBudget > 0 ? expectedRevenue / recommendedBudget : 0;
    const breakEvenCpc = (averageOrderValue * conversionRate) / 100;

    setResults({
      recommendedBudget,
      dailyBudget,
      expectedClicks,
      expectedConversions,
      expectedRevenue,
      projectedRoas,
      breakEvenCpc,
      isRoasLow: projectedRoas < targetRoas
    });
  }, [inputs]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(val);
  const formatNumber = (val: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val);

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          
          <div className="w-full lg:w-1/2 bg-brand-surface p-6 md:p-8 rounded-2xl border border-brand-medium/30 shadow-sm">
             <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold text-lg">
                <TrendingUp className="w-5 h-5 text-brand-medium" />
                <h3>Ad Budget Planner</h3>
             </div>
             <p className="text-brand-dark/60 text-sm mb-6">Calculate optimal advertising budget and performance projections</p>
             
             <div className="space-y-6">
                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Budget Period</label>
                   <select name="budgetPeriod" value={inputs.budgetPeriod} onChange={handleInputChange} className="w-full px-4 py-3 bg-brand-light/50 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all">
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                      <option value="Quarterly">Quarterly</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">{inputs.budgetPeriod} Revenue Goal ($)</label>
                   <input type="number" name="revenueGoal" value={inputs.revenueGoal} onChange={handleInputChange} className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
                </div>
                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Target ROAS</label>
                   <input type="number" name="targetRoas" value={inputs.targetRoas} onChange={handleInputChange} className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
                </div>
                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Average Order Value ($)</label>
                   <input type="number" name="averageOrderValue" value={inputs.averageOrderValue} onChange={handleInputChange} className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
                </div>
                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Conversion Rate (%)</label>
                   <input type="number" name="conversionRate" value={inputs.conversionRate} onChange={handleInputChange} className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
                </div>
                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Average CPC ($)</label>
                   <input type="number" name="averageCpc" value={inputs.averageCpc} onChange={handleInputChange} className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
                </div>
             </div>
          </div>

          <div className="w-full lg:w-1/2">
             <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-xl overflow-hidden sticky top-24">
                <div className="p-6 md:p-8 bg-brand-light border-b border-brand-medium/20">
                    <div className="flex items-center gap-2 mb-4 text-brand-dark font-bold">
                       <Calculator className="w-5 h-5 text-brand-medium" />
                       <h3>Results</h3>
                    </div>
                    <div className="bg-brand-surface border border-brand-medium/30 rounded-xl p-5 mb-6 shadow-sm">
                       <p className="text-sm text-brand-dark font-medium mb-1">Recommended Budget</p>
                       <div className="text-3xl font-extrabold text-brand-dark">{formatCurrency(results.recommendedBudget)}</div>
                       <p className="text-xs text-brand-dark/70 mt-1">({formatCurrency(results.dailyBudget)}/day)</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="p-4 bg-blue-50/50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                          <p className="text-xs text-blue-800 dark:text-blue-300 font-semibold mb-1">Expected Clicks</p>
                          <p className="text-xl font-bold text-brand-dark">{formatNumber(results.expectedClicks)}</p>
                       </div>
                       <div className="p-4 bg-purple-50/50 dark:bg-purple-900/30 rounded-lg border border-purple-100 dark:border-purple-800">
                          <p className="text-xs text-purple-800 dark:text-purple-300 font-semibold mb-1">Conversions</p>
                          <p className="text-xl font-bold text-brand-dark">{formatNumber(results.expectedConversions)}</p>
                       </div>
                       <div className="p-4 bg-amber-50/50 dark:bg-amber-900/30 rounded-lg border border-amber-100 dark:border-amber-800">
                          <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold mb-1">Revenue</p>
                          <p className="text-xl font-bold text-brand-dark">{formatCurrency(results.expectedRevenue)}</p>
                       </div>
                       <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/30 rounded-lg border border-emerald-100 dark:border-emerald-800">
                          <p className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold mb-1">Projected ROAS</p>
                          <p className="text-xl font-bold text-brand-dark">{results.projectedRoas.toFixed(2)}:1</p>
                       </div>
                    </div>
                    {results.isRoasLow && (
                       <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-lg flex gap-3">
                          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                          <div>
                             <p className="text-xs font-bold text-red-800 dark:text-red-300 mb-1">Recommendation:</p>
                             <p className="text-xs text-red-700 dark:text-red-300">Expected ROAS is below target. Consider optimizing funnel.</p>
                          </div>
                       </div>
                    )}
                </div>
             </div>
          </div>
        </div>
        
        <ShareTool title="Ad Budget Planner" />
      </div>
    </div>
  );
};

export default AdBudgetPlanner;
