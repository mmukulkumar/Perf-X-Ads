
import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Clock, Monitor, BarChart2, CheckCircle, Info, ArrowRight, PieChart } from 'lucide-react';
import ShareTool from './ShareTool';

const SoftwareRoiCalculator = () => {
  const [inputs, setInputs] = useState({
    annualSoftwareCost: 12000,
    implementationCost: 5000,
    maintenanceCost: 2000,
    timeSaved: 10,
    hourlyRate: 75,
    userCount: 10,
    revenueIncrease: 5000,
    costReduction: 1000,
    analysisYears: 3
  });

  const [results, setResults] = useState({
    firstYearCost: 0,
    ongoingAnnualCost: 0,
    totalCost: 0,
    annualTimeSavings: 0,
    annualRevenueGain: 0,
    annualCostSavings: 0,
    totalAnnualBenefit: 0,
    totalBenefit: 0,
    netBenefit: 0,
    firstYearROI: 0,
    threeYearROI: 0,
    paybackPeriod: 0,
    isPositive: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  useEffect(() => {
    const { 
      annualSoftwareCost, implementationCost, maintenanceCost, 
      timeSaved, hourlyRate, userCount, 
      revenueIncrease, costReduction, analysisYears 
    } = inputs;

    // Costs
    const firstYearCost = annualSoftwareCost + implementationCost + maintenanceCost;
    const ongoingAnnualCost = annualSoftwareCost + maintenanceCost;
    
    // Total Cost over N years (Year 1 + (Year 2..N))
    const totalCost = firstYearCost + (ongoingAnnualCost * (analysisYears - 1));

    // Benefits (Annual)
    // Time Savings = Hours/User/Month * Hourly Rate * Users * 12
    const annualTimeSavings = timeSaved * hourlyRate * userCount * 12;
    const annualRevenueGain = revenueIncrease * 12;
    const annualCostSavings = costReduction * 12;
    
    const totalAnnualBenefit = annualTimeSavings + annualRevenueGain + annualCostSavings;
    const totalBenefit = totalAnnualBenefit * analysisYears;

    // ROI Calculations
    const netBenefit = totalBenefit - totalCost;
    
    // First Year ROI = (Total Annual Benefit - First Year Cost) / First Year Cost
    const firstYearNet = totalAnnualBenefit - firstYearCost;
    const firstYearROI = firstYearCost > 0 ? (firstYearNet / firstYearCost) * 100 : 0;

    // Total Period ROI
    const threeYearROI = totalCost > 0 ? (netBenefit / totalCost) * 100 : 0;

    // Payback Period (Months)
    // Simple payback = First Year Cost / Monthly Benefit
    const monthlyBenefit = totalAnnualBenefit / 12;
    const paybackPeriod = monthlyBenefit > 0 ? firstYearCost / monthlyBenefit : 0;

    setResults({
      firstYearCost,
      ongoingAnnualCost,
      totalCost,
      annualTimeSavings,
      annualRevenueGain,
      annualCostSavings,
      totalAnnualBenefit,
      totalBenefit,
      netBenefit,
      firstYearROI,
      threeYearROI,
      paybackPeriod,
      isPositive: netBenefit > 0
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
                <Monitor className="w-5 h-5 text-purple-500" />
                <h3>Software ROI Calculator</h3>
             </div>
             
             <div className="space-y-6">
                <div>
                   <label className="block text-xs font-bold text-brand-dark/60 uppercase tracking-wide mb-3">Software Costs</label>
                   
                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Annual Software Cost ($)</label>
                     <input
                        type="number"
                        name="annualSoftwareCost"
                        value={inputs.annualSoftwareCost}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/60 mt-1">Annual subscription or license cost</p>
                   </div>

                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Implementation Cost ($)</label>
                     <input
                        type="number"
                        name="implementationCost"
                        value={inputs.implementationCost}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/60 mt-1">One-time setup, training, integration costs</p>
                   </div>

                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Annual Maintenance/Support ($)</label>
                     <input
                        type="number"
                        name="maintenanceCost"
                        value={inputs.maintenanceCost}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/60 mt-1">Ongoing support, updates, maintenance (often 15-20% of license)</p>
                   </div>
                </div>

                <div className="pt-4 border-t border-brand-medium/10">
                   <label className="block text-xs font-bold text-brand-dark/60 uppercase tracking-wide mb-3">Expected Benefits</label>
                   
                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Time Saved per User (Hours/Month)</label>
                     <input
                        type="number"
                        name="timeSaved"
                        value={inputs.timeSaved}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/60 mt-1">Hours saved monthly per user through automation/efficiency</p>
                   </div>

                   <div className="mb-4 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-1">Hourly Rate/Cost ($)</label>
                        <input
                            type="number"
                            name="hourlyRate"
                            value={inputs.hourlyRate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                        />
                         <p className="text-xs text-brand-dark/60 mt-1">Loaded hourly cost</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-1">Number of Users</label>
                        <input
                            type="number"
                            name="userCount"
                            value={inputs.userCount}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                        />
                         <p className="text-xs text-brand-dark/60 mt-1">Team members</p>
                      </div>
                   </div>

                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Monthly Revenue Increase ($)</label>
                     <input
                        type="number"
                        name="revenueIncrease"
                        value={inputs.revenueIncrease}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/60 mt-1">Additional monthly revenue enabled by software (optional)</p>
                   </div>

                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Monthly Cost Reduction ($)</label>
                     <input
                        type="number"
                        name="costReduction"
                        value={inputs.costReduction}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/60 mt-1">Monthly cost savings (tools replaced, reduced labor, etc.)</p>
                   </div>

                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Analysis Period (Years)</label>
                     <select 
                        name="analysisYears" 
                        value={inputs.analysisYears}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/50 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                     >
                        <option value="1">1 Year</option>
                        <option value="3">3 Years</option>
                        <option value="5">5 Years</option>
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
                       <BarChart2 className="w-5 h-5 text-purple-500" />
                       <h3>ROI Analysis</h3>
                    </div>

                    {/* Main Hero Result */}
                    <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-6 mb-6 border border-purple-100 dark:border-purple-800">
                       <p className="text-sm text-brand-dark font-medium mb-1">{inputs.analysisYears}-Year Net Benefit</p>
                       <div className="text-4xl font-extrabold text-purple-600 dark:text-purple-400">{formatCurrency(results.netBenefit)}</div>
                       <p className="text-xs text-brand-dark/60 mt-2">{results.threeYearROI.toFixed(0)}% return on investment over {inputs.analysisYears} years</p>
                    </div>

                    {/* Secondary Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="p-4 bg-red-50/50 dark:bg-red-900/30 rounded-lg border border-red-100 dark:border-red-800">
                          <p className="text-xs text-red-800 dark:text-red-300 font-semibold mb-1">First Year Total Cost</p>
                          <p className="text-lg font-bold text-red-700 dark:text-red-400">{formatCurrency(results.firstYearCost)}</p>
                          <p className="text-[10px] text-brand-dark/40">Including implementation</p>
                       </div>
                       <div className="p-4 bg-orange-50/50 dark:bg-orange-900/30 rounded-lg border border-orange-100 dark:border-orange-800">
                          <p className="text-xs text-orange-800 dark:text-orange-300 font-semibold mb-1">Ongoing Annual Cost</p>
                          <p className="text-lg font-bold text-orange-700 dark:text-orange-400">{formatCurrency(results.ongoingAnnualCost)}</p>
                          <p className="text-[10px] text-brand-dark/40">Years 2+</p>
                       </div>
                    </div>

                    {/* Total Annual Benefit */}
                    <div className="bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800 p-4 mb-6">
                        <p className="text-xs text-green-800 dark:text-green-300 font-semibold mb-1">Total Annual Benefit</p>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">+{formatCurrency(results.totalAnnualBenefit)}/year</p>
                        <p className="text-[10px] text-brand-dark/40">Time + revenue + cost savings</p>
                        
                        <div className="flex gap-4 mt-3 pt-3 border-t border-green-200 dark:border-green-800/50">
                            <div>
                                <p className="text-[10px] font-semibold text-green-800 dark:text-green-300">Time Savings</p>
                                <p className="text-xs font-bold text-green-700 dark:text-green-400">{formatCurrency(results.annualTimeSavings)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-green-800 dark:text-green-300">Revenue Gain</p>
                                <p className="text-xs font-bold text-green-700 dark:text-green-400">{formatCurrency(results.annualRevenueGain)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-green-800 dark:text-green-300">Cost Savings</p>
                                <p className="text-xs font-bold text-green-700 dark:text-green-400">{formatCurrency(results.annualCostSavings)}</p>
                            </div>
                        </div>
                    </div>

                    {/* ROI & Payback */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="p-4 bg-yellow-50/30 dark:bg-yellow-900/20 rounded-lg border border-yellow-100/50 dark:border-yellow-800/50">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">First Year ROI</p>
                          <p className="text-lg font-bold text-brand-dark">{results.firstYearROI.toFixed(0)}%</p>
                          <p className="text-[10px] text-brand-dark/40">Net: {formatCurrency(results.totalAnnualBenefit - results.firstYearCost)}</p>
                       </div>
                       <div className="p-4 bg-purple-50/30 dark:bg-purple-900/20 rounded-lg border border-purple-100/50 dark:border-purple-800/50">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">{inputs.analysisYears}-Year ROI</p>
                          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{results.threeYearROI.toFixed(0)}%</p>
                          <p className="text-[10px] text-brand-dark/40">Net: {formatCurrency(results.netBenefit)}</p>
                       </div>
                    </div>

                    <div className="bg-blue-50/50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800 p-4 mb-6">
                         <p className="text-xs text-brand-dark/60 font-semibold mb-1">Payback Period</p>
                         <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{results.paybackPeriod.toFixed(1)} months</p>
                         <p className="text-[10px] text-brand-dark/40 mt-1">Time to recover investment</p>
                    </div>

                    {/* Analysis Text */}
                    <div className="p-4 bg-brand-surface border border-brand-medium/20 rounded-lg">
                        <p className="text-xs font-bold text-brand-dark mb-1">Analysis:</p>
                        <p className="text-xs text-brand-dark/70 leading-relaxed">
                            {results.isPositive 
                                ? "Software investment delivers measurable ROI through time savings and productivity improvements."
                                : "The projected benefits do not cover the software costs within the analysis period. Re-evaluate costs or expected gains."}
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-brand-surface">
                   <h4 className="flex items-center gap-2 text-sm font-bold text-brand-dark mb-4">
                      <Info className="w-4 h-4 text-brand-medium" />
                      Software ROI Tips:
                   </h4>
                   <ul className="space-y-2 text-xs text-brand-dark/70">
                      <li className="flex gap-2 text-green-600 dark:text-green-400">
                         <span>•</span>
                         Use loaded hourly rate (salary + benefits + work hours)
                      </li>
                      <li className="flex gap-2 text-green-600 dark:text-green-400">
                         <span>•</span>
                         Track actual time savings during trial period
                      </li>
                      <li className="flex gap-2 text-green-600 dark:text-green-400">
                         <span>•</span>
                         Factor in revenue enabled by new capabilities
                      </li>
                      <li className="flex gap-2 text-green-600 dark:text-green-400">
                         <span>•</span>
                         Include costs of tools being replaced
                      </li>
                      <li className="flex gap-2 text-green-600 dark:text-green-400">
                         <span>•</span>
                         Target 200%+ ROI with 6-12 month payback for confidence
                      </li>
                   </ul>
                </div>
             </div>
          </div>
        </div>
        
        <ShareTool title="Software ROI Calculator" />

      </div>
    </div>
  );
};

export default SoftwareRoiCalculator;
