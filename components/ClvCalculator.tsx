
import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Users, BarChart2, CheckCircle, Info, ArrowRight, Target, HelpCircle } from 'lucide-react';
import ShareTool from './ShareTool';

const ClvCalculator = () => {
  const [inputs, setInputs] = useState({
    calculationMethod: 'Simple CLV',
    averageOrderValue: 100,
    purchaseFrequency: 4,
    customerLifespan: 3,
    profitMargin: 30,
    retentionRate: 60
  });

  const [results, setResults] = useState({
    customerLifetimeValue: 0,
    lifetimeRevenue: 0,
    totalPurchases: 0,
    maxAcquisitionCost: 0,
    isHighValue: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === 'calculationMethod' ? value : parseFloat(value) || 0
    }));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  useEffect(() => {
    const { averageOrderValue, purchaseFrequency, customerLifespan, profitMargin } = inputs;

    // 1. Lifetime Revenue = AOV * Frequency * Lifespan
    const lifetimeRevenue = averageOrderValue * purchaseFrequency * customerLifespan;

    // 2. Customer Lifetime Value (Profit based) = Lifetime Revenue * (Margin / 100)
    const customerLifetimeValue = lifetimeRevenue * (profitMargin / 100);

    // 3. Total Purchases
    const totalPurchases = purchaseFrequency * customerLifespan;

    // 4. Max Acquisition Cost (Benchmark: 33% of CLV is healthy limit for CAC, i.e. 3:1 ratio)
    const maxAcquisitionCost = customerLifetimeValue * 0.33;

    setResults({
      customerLifetimeValue,
      lifetimeRevenue,
      totalPurchases,
      maxAcquisitionCost,
      isHighValue: customerLifetimeValue > 1000 // Arbitrary threshold for UI logic
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
                <Users className="w-5 h-5 text-teal-600" />
                <h3>CLV Calculator</h3>
             </div>
             <p className="text-brand-dark/60 text-sm mb-6">Calculate customer lifetime value and acquisition cost</p>
             
             <div className="space-y-6">
                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Calculation Method</label>
                   <select 
                      name="calculationMethod" 
                      value={inputs.calculationMethod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/50 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                   >
                      <option value="Simple CLV">Simple CLV</option>
                      <option value="SaaS LTV">SaaS LTV (Coming Soon)</option>
                   </select>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Average Order Value ($)</label>
                   <input
                      type="number"
                      name="averageOrderValue"
                      value={inputs.averageOrderValue}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/60 mt-1">Average revenue per transaction</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Purchase Frequency (per year)</label>
                   <input
                      type="number"
                      name="purchaseFrequency"
                      value={inputs.purchaseFrequency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/60 mt-1">Number of purchases per customer per year</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Customer Lifespan (years)</label>
                   <input
                      type="number"
                      name="customerLifespan"
                      value={inputs.customerLifespan}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/60 mt-1">Average years customer stays active</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Profit Margin (%)</label>
                   <input
                      type="number"
                      name="profitMargin"
                      value={inputs.profitMargin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/60 mt-1">Gross profit margin on sales</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Retention Rate % (Optional)</label>
                   <input
                      type="number"
                      name="retentionRate"
                      value={inputs.retentionRate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/60 mt-1">Percentage of customers retained year-over-year</p>
                </div>
             </div>
          </div>

          {/* Results Column */}
          <div className="w-full lg:w-7/12">
             <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-xl overflow-hidden sticky top-24">
                <div className="p-6 md:p-8 bg-brand-light border-b border-brand-medium/20">
                    <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold">
                       <BarChart2 className="w-5 h-5 text-teal-600" />
                       <h3>CLV Analysis</h3>
                    </div>

                    {/* Main Hero Result */}
                    <div className="bg-teal-50 dark:bg-teal-900/30 rounded-xl p-6 mb-6 border border-teal-100 dark:border-teal-800">
                       <p className="text-sm text-teal-900 dark:text-teal-300 font-medium mb-1">Customer Lifetime Value</p>
                       <div className="text-4xl font-extrabold text-teal-700 dark:text-teal-400">{formatCurrency(results.customerLifetimeValue)}</div>
                       <p className="text-xs text-teal-800 dark:text-teal-300 mt-2">Total profit per customer</p>
                    </div>

                    {/* Secondary Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="p-4 bg-blue-50/50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                          <p className="text-xs text-blue-800 dark:text-blue-300 font-semibold mb-1">Lifetime Revenue</p>
                          <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{formatCurrency(results.lifetimeRevenue)}</p>
                       </div>
                       <div className="p-4 bg-purple-50/50 dark:bg-purple-900/30 rounded-lg border border-purple-100 dark:border-purple-800">
                          <p className="text-xs text-purple-800 dark:text-purple-300 font-semibold mb-1">Total Purchases</p>
                          <p className="text-lg font-bold text-purple-700 dark:text-purple-400">{results.totalPurchases.toFixed(0)}</p>
                       </div>
                    </div>

                    {/* CAC Limit */}
                    <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg border border-orange-100 dark:border-orange-800 p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-orange-900 dark:text-orange-300 font-semibold mb-1">Max Acquisition Cost</p>
                                <p className="text-xl font-bold text-orange-700 dark:text-orange-400">{formatCurrency(results.maxAcquisitionCost)}</p>
                                <p className="text-[10px] text-orange-800 dark:text-orange-300 mt-1">33% of CLV (sustainable CAC)</p>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Text */}
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg">
                        <p className="text-xs font-bold text-amber-800 dark:text-amber-400 mb-1">Customer Value: {results.isHighValue ? "High Value" : "Moderate Value"}</p>
                        <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
                            {results.isHighValue 
                                ? "Strong LTV metrics. You have significant margin to invest in acquisition. Consider increasing CAC to accelerate growth."
                                : "Moderate CLV provides decent margins for growth. Opportunities: increase purchase frequency with email campaigns, extend customer lifespan through subscriptions."}
                            <br/>
                            <span className="mt-2 block">• Max CAC should be 3× lower than CLV for health</span>
                            <span>• 5% increase in retention can boost CLV by 25-95%</span>
                        </p>
                    </div>

                    <div className="mt-6 p-4 bg-brand-surface border border-brand-medium/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Info className="w-4 h-4 text-brand-medium" />
                            <span className="text-xs font-bold text-brand-dark">CLV Tips:</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-brand-dark/70">
                            <li>• CLV = AOV × Purchase Frequency × Customer Lifespan × Margin</li>
                            <li>• CAC should be 3× lower than CLV for healthy business</li>
                            <li>• 5% increase in retention can boost CLV by 25-95%</li>
                            <li>• Track CLV by cohort for accurate trending</li>
                        </ul>
                    </div>
                </div>
             </div>
          </div>
        </div>
        
        <ShareTool title="CLV Calculator" />

      </div>
    </div>
  );
};

export default ClvCalculator;
