
import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart2, CheckCircle, AlertCircle, Info, Share2, Copy, Check, Facebook, Linkedin, Twitter, Mail, MessageCircle } from 'lucide-react';

const ROICalculator = () => {
  const [inputs, setInputs] = useState({
    campaignType: 'PPC / Paid Search',
    cost: 10000,
    revenue: 40000,
    conversions: 100,
    leads: 250
  });

  const [results, setResults] = useState({
    roiPercentage: 0,
    profit: 0,
    revenuePerDollar: 0,
    cpa: 0,
    cpl: 0,
    performance: 'Excellent',
    performanceColor: 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 border-green-100 dark:border-green-800',
    performanceMessage: 'Outstanding performance: Campaign is highly profitable.'
  });

  const [isSharedCopied, setIsSharedCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => { setShareUrl(window.location.href); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: name === 'campaignType' ? value : parseFloat(value) || 0 }));
  };

  useEffect(() => {
    const { cost, revenue, conversions, leads } = inputs;
    const safeCost = cost > 0 ? cost : 1;
    const profit = revenue - cost;
    const roiPercentage = ((revenue - cost) / safeCost) * 100;
    const revenuePerDollar = revenue / safeCost;
    const cpa = conversions > 0 ? cost / conversions : 0;
    const cpl = leads > 0 ? cost / leads : 0;

    let performance = 'Neutral';
    let performanceColor = 'text-brand-dark bg-brand-light border-brand-medium';
    let performanceMessage = 'Enter campaign data to see performance analysis.';

    if (cost > 0) {
        if (roiPercentage < 0) {
            performance = 'Loss (Negative ROI)';
            performanceColor = 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-800';
            performanceMessage = 'Negative ROI indicates the campaign is losing money.';
        } else if (roiPercentage < 200) {
            performance = 'Good';
            performanceColor = 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800';
            performanceMessage = 'Solid performance. The campaign is generating good returns.';
        } else {
            performance = 'Excellent';
            performanceColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800';
            performanceMessage = 'Outstanding performance: Campaign is highly profitable.';
        }
    }

    setResults({ roiPercentage, profit, revenuePerDollar, cpa, cpl, performance, performanceColor, performanceMessage });
  }, [inputs]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="w-full lg:w-1/2 bg-brand-surface p-6 md:p-8 rounded-2xl border border-brand-medium/30 shadow-sm">
             <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold text-lg">
                <TrendingUp className="w-5 h-5 text-brand-medium" />
                <h3>Campaign Data</h3>
             </div>
             <div className="space-y-6">
                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Campaign Type</label>
                   <select name="campaignType" value={inputs.campaignType} onChange={handleInputChange} className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all">
                      <option value="PPC / Paid Search">PPC / Paid Search</option>
                      <option value="Social Media Ads">Social Media Ads</option>
                      <option value="Email Marketing">Email Marketing</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Total Campaign Cost ($)</label>
                   <input type="number" name="cost" value={inputs.cost} onChange={handleInputChange} className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
                </div>
                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Revenue Generated ($)</label>
                   <input type="number" name="revenue" value={inputs.revenue} onChange={handleInputChange} className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
                </div>
             </div>
          </div>

          <div className="w-full lg:w-1/2">
             <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-xl overflow-hidden sticky top-24">
                <div className="p-6 md:p-8 bg-brand-light border-b border-brand-medium/20">
                    <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold">
                       <BarChart2 className="w-5 h-5 text-brand-medium" />
                       <h3>ROI Analysis</h3>
                    </div>
                    <div className={`${results.performanceColor} border rounded-xl p-6 mb-6 transition-colors duration-300`}>
                       <p className="text-sm font-semibold opacity-80 mb-1">Return on Investment</p>
                       <div className="text-4xl font-extrabold mb-1">{results.roiPercentage.toFixed(0)}%</div>
                       <p className="text-xs opacity-70 font-medium">({(results.roiPercentage / 100).toFixed(1)}:1 ratio)</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="p-4 bg-blue-50/50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                          <p className="text-xs text-blue-800 dark:text-blue-300 font-semibold mb-1">Profit</p>
                          <p className="text-xl font-bold text-brand-dark">{formatCurrency(results.profit)}</p>
                       </div>
                       <div className="p-4 bg-purple-50/50 dark:bg-purple-900/30 rounded-lg border border-purple-100 dark:border-purple-800">
                          <p className="text-xs text-purple-800 dark:text-purple-300 font-semibold mb-1">Revenue per $1</p>
                          <p className="text-xl font-bold text-brand-dark">${results.revenuePerDollar.toFixed(2)}</p>
                       </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
