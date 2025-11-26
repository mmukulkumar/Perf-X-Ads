
import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Clock, Monitor, BarChart2, CheckCircle, Info, Share2, Copy, Check, Facebook, Linkedin, Twitter, Mail, MessageCircle, ArrowRight, PieChart } from 'lucide-react';

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

  const [shareUrl, setShareUrl] = useState('');
  const [isSharedCopied, setIsSharedCopied] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    if (currentUrl.startsWith('blob:') || currentUrl.startsWith('about:')) {
        setShareUrl('https://perfxads.com/tools/software-roi-calculator');
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
                        className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/40 mt-1">Annual subscription or license cost</p>
                   </div>

                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Implementation Cost ($)</label>
                     <input
                        type="number"
                        name="implementationCost"
                        value={inputs.implementationCost}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/40 mt-1">One-time setup, training, integration costs</p>
                   </div>

                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Annual Maintenance/Support ($)</label>
                     <input
                        type="number"
                        name="maintenanceCost"
                        value={inputs.maintenanceCost}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/40 mt-1">Ongoing support, updates, maintenance (often 15-20% of license)</p>
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
                        className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/40 mt-1">Hours saved monthly per user through automation/efficiency</p>
                   </div>

                   <div className="mb-4 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-1">Hourly Rate/Cost ($)</label>
                        <input
                            type="number"
                            name="hourlyRate"
                            value={inputs.hourlyRate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                        />
                         <p className="text-xs text-brand-dark/40 mt-1">Loaded hourly cost</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-brand-dark mb-1">Number of Users</label>
                        <input
                            type="number"
                            name="userCount"
                            value={inputs.userCount}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                        />
                         <p className="text-xs text-brand-dark/40 mt-1">Team members</p>
                      </div>
                   </div>

                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Monthly Revenue Increase ($)</label>
                     <input
                        type="number"
                        name="revenueIncrease"
                        value={inputs.revenueIncrease}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/40 mt-1">Additional monthly revenue enabled by software (optional)</p>
                   </div>

                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Monthly Cost Reduction ($)</label>
                     <input
                        type="number"
                        name="costReduction"
                        value={inputs.costReduction}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                     />
                     <p className="text-xs text-brand-dark/40 mt-1">Monthly cost savings (tools replaced, reduced labor, etc.)</p>
                   </div>

                   <div className="mb-4">
                     <label className="block text-sm font-semibold text-brand-dark mb-1">Analysis Period (Years)</label>
                     <select 
                        name="analysisYears" 
                        value={inputs.analysisYears}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-brand-light/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
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
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 mb-6 border border-purple-100 dark:border-purple-800">
                       <p className="text-sm text-brand-dark font-medium mb-1">{inputs.analysisYears}-Year Net Benefit</p>
                       <div className="text-4xl font-extrabold text-purple-600 dark:text-purple-400">{formatCurrency(results.netBenefit)}</div>
                       <p className="text-xs text-brand-dark/60 mt-2">{results.threeYearROI.toFixed(0)}% return on investment over {inputs.analysisYears} years</p>
                    </div>

                    {/* Secondary Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="p-4 bg-red-50/50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                          <p className="text-xs text-red-800 dark:text-red-300 font-semibold mb-1">First Year Total Cost</p>
                          <p className="text-lg font-bold text-red-700 dark:text-red-400">{formatCurrency(results.firstYearCost)}</p>
                          <p className="text-[10px] text-brand-dark/40">Including implementation</p>
                       </div>
                       <div className="p-4 bg-orange-50/50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
                          <p className="text-xs text-orange-800 dark:text-orange-300 font-semibold mb-1">Ongoing Annual Cost</p>
                          <p className="text-lg font-bold text-orange-700 dark:text-orange-400">{formatCurrency(results.ongoingAnnualCost)}</p>
                          <p className="text-[10px] text-brand-dark/40">Years 2+</p>
                       </div>
                    </div>

                    {/* Total Annual Benefit */}
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 p-4 mb-6">
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
                       <div className="p-4 bg-yellow-50/30 dark:bg-yellow-900/10 rounded-lg border border-yellow-100/50 dark:border-yellow-800/50">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">First Year ROI</p>
                          <p className="text-lg font-bold text-brand-dark">{results.firstYearROI.toFixed(0)}%</p>
                          <p className="text-[10px] text-brand-dark/40">Net: {formatCurrency(results.totalAnnualBenefit - results.firstYearCost)}</p>
                       </div>
                       <div className="p-4 bg-purple-50/30 dark:bg-purple-900/10 rounded-lg border border-purple-100/50 dark:border-purple-800/50">
                          <p className="text-xs text-brand-dark/60 font-semibold mb-1">{inputs.analysisYears}-Year ROI</p>
                          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{results.threeYearROI.toFixed(0)}%</p>
                          <p className="text-[10px] text-brand-dark/40">Net: {formatCurrency(results.netBenefit)}</p>
                       </div>
                    </div>

                    <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 p-4 mb-6">
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

        {/* Benchmarks Section */}
        <div className="mb-16">
           <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">Software ROI Benchmarks by Category</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                 {
                    title: "Productivity Software",
                    desc: "Collaboration & project tools",
                    roi: "200-500%",
                    color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
                    payback: "Payback: 6-12 months typical"
                 },
                 {
                    title: "Revenue-Generating Tools",
                    desc: "CRM, marketing, sales software",
                    roi: "500-1,000%",
                    color: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
                    payback: "Payback: 3-6 months typical"
                 },
                 {
                    title: "Infrastructure Software",
                    desc: "Cloud, DevOps, platforms",
                    roi: "100-300%",
                    color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
                    payback: "Payback: 12-24 months typical"
                 }
              ].map((card, i) => (
                 <div key={i} className="bg-brand-surface p-6 rounded-xl border border-brand-medium/30 hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-brand-dark mb-1">{card.title}</h3>
                    <p className="text-xs text-brand-dark/60 mb-4">{card.desc}</p>
                    <div className={`rounded-lg p-4 mb-4 ${card.color}`}>
                       <p className="text-xs opacity-70 uppercase font-semibold mb-1">Target ROI</p>
                       <p className="text-lg font-bold">{card.roi}</p>
                    </div>
                    <p className="text-xs text-brand-dark/50">{card.payback}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* Quick Example Result */}
        <div className="bg-purple-50/50 dark:bg-purple-900/20 rounded-xl p-8 mb-16 border border-purple-100 dark:border-purple-800 text-center">
            <h3 className="text-lg font-bold text-brand-dark mb-2">Quick Example Result</h3>
            <p className="text-brand-dark/60 mb-6 text-sm">$12k/year software, 10 users saving 10 hours/month each at $75/hour:</p>
            <div className="flex justify-center gap-8">
                <div>
                    <p className="text-xs text-brand-dark/50 font-semibold uppercase">3-Year Net Benefit</p>
                    <div className="px-6 py-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg font-bold text-lg inline-block mt-1">
                        $439,000
                    </div>
                </div>
                <div>
                    <p className="text-xs text-brand-dark/50 font-semibold uppercase">3-Year ROI</p>
                    <div className="px-6 py-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-lg font-bold text-lg inline-block mt-1">
                        934%
                    </div>
                </div>
            </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 p-8 md:p-12 mb-16">
           <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">How Our Software ROI Calculator Works</h2>
           <p className="text-center text-brand-dark/70 max-w-2xl mx-auto mb-12">
              Our software ROI calculator provides comprehensive return on investment analysis for business software purchases. The calculation uses <span className="text-purple-600 dark:text-purple-400 font-bold">total cost of ownership modeling</span> to compare all costs (software, implementation, maintenance) against quantified benefits (time savings, revenue, cost reduction).
           </p>

           <div className="bg-purple-50/30 dark:bg-purple-900/10 rounded-xl p-8 max-w-3xl mx-auto border border-purple-100 dark:border-purple-800/50 mb-12">
              <h3 className="font-bold text-brand-dark mb-6 text-purple-900 dark:text-purple-300">The Software ROI Formula</h3>
              <div className="bg-brand-surface p-6 rounded-lg border border-purple-100 dark:border-purple-800/50 font-mono text-xs md:text-sm text-brand-dark/80 leading-relaxed shadow-sm">
                 <p className="font-semibold">Total Cost = Software + Implementation + Maintenance</p>
                 <p>Time Savings Value = Hours Saved × Hourly Rate × Users × 12</p>
                 <p>Total Benefit = Time Savings + Revenue + Cost Reduction</p>
                 <p className="font-bold mt-2">ROI = (Total Benefit - Total Cost) ÷ Total Cost × 100%</p>
              </div>
              <p className="text-xs text-brand-dark/50 mt-4 text-center">
                  The calculator computes total costs including one-time implementation and ongoing subscription/maintenance. Benefits include time savings (hours saved × team size × hourly rate), revenue increases enabled by software, and cost reductions from eliminated tools or processes. ROI percentage shows return, while payback period indicates months to recover investment.
              </p>
              
              <div className="mt-8 text-center">
                 <p className="text-xs font-bold text-brand-dark/40 uppercase mb-2">ROI Time Visualization</p>
                 <p className="text-xs text-brand-dark/60">Shows cumulative costs vs. benefits over {inputs.analysisYears}-year period</p>
              </div>
           </div>
        </div>

        {/* Math Foundation & Sources */}
        <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-xl font-bold text-brand-dark mb-4">Mathematical Foundation</h3>
            <p className="text-sm text-brand-dark/70 mb-6 leading-relaxed">
                Software ROI calculation is based on cost-benefit analysis comparing total cost of ownership against quantified benefits over time. First-year costs include annual software subscription, one-time implementation expenses (setup, training, integration), and annual maintenance/support fees. Ongoing annual costs (years 2+) include only subscription and maintenance without implementation. Benefits calculation starts with time savings: hours saved per user per month × hourly rate (loaded cost including salary, benefits, overhead) × number of users × 12 months. Revenue increases represent additional income directly enabled by software capabilities (better CRM closes more deals, automation serves more customers). Cost reductions include eliminated expenses (replaced tools, reduced labor, fewer errors). Total annual benefit sums all three categories. ROI percentage calculates (Benefits - Costs) ÷ Costs × 100%. Payback period shows months to recover investment: one-time costs ÷ monthly net benefit. Multi-year ROI typically improves as implementation costs amortize over longer period. Conservative modeling uses 70-80% of projected benefits to account for realistic adoption and execution.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-brand-dark/70 mb-8">
                <li>Total cost of ownership includes software, implementation, training, and maintenance</li>
                <li>Time savings calculated using loaded hourly rate (salary + benefits + overhead)</li>
                <li>Multi-year ROI improves as implementation costs amortize over time</li>
                <li>Target 200%+ ROI with 6-12 month payback for most software investments</li>
                <li>Revenue-generating tools should deliver 500-1,000% ROI or higher</li>
                <li>Conservative estimates (70% of projected benefits) reduce investment risk</li>
            </ul>

            <div className="bg-brand-light/30 p-6 rounded-xl border border-brand-medium/20">
                <h4 className="font-bold text-brand-dark mb-3">Sources & References</h4>
                <div className="space-y-3 text-xs text-brand-dark/70">
                    <p className="flex gap-2">
                        <span className="font-bold text-purple-600 dark:text-purple-400">Nucleus Research</span> - 
                        <span>ROI Studies and Software Value Research. Independent research on software ROI and technology investment returns</span>
                    </p>
                    <p className="flex gap-2">
                        <span className="font-bold text-purple-600 dark:text-purple-400">Forrester Total Economic Impact</span> - 
                        <span>Software TCO and ROI Methodology. Framework for calculating total economic impact of software investments</span>
                    </p>
                    <p className="flex gap-2">
                        <span className="font-bold text-purple-600 dark:text-purple-400">G2 ROI Reports</span> - 
                        <span>User-Reported Software Value. Real-user data on time savings and ROI from business software</span>
                    </p>
                </div>
            </div>
        </div>

        {/* Example Section */}
        <div className="max-w-4xl mx-auto mb-16">
           <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">Software ROI Example</h2>
           <div className="bg-brand-surface p-8 rounded-2xl border border-brand-medium/30 shadow-sm">
                <h3 className="font-bold text-lg text-brand-dark mb-4">Team Productivity Software Investment Example</h3>
                <p className="text-sm text-brand-dark/60 mb-6">10-person team implementing project management software with automation features</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    <div>
                        <h4 className="font-semibold text-brand-dark mb-2">Investment Details:</h4>
                        <ul className="space-y-2 text-brand-dark/70">
                            <li><span className="font-semibold text-brand-dark">Annual Software Cost:</span> $12,000</li>
                            <li><span className="font-semibold text-brand-dark">Implementation:</span> $5,000 one-time</li>
                            <li><span className="font-semibold text-brand-dark">Annual Maintenance:</span> $2,000</li>
                            <li><span className="font-semibold text-brand-dark">Time Saved:</span> 10 hours/user/month</li>
                            <li><span className="font-semibold text-brand-dark">Hourly Rate:</span> $75 (loaded cost)</li>
                            <li><span className="font-semibold text-brand-dark">Team Size:</span> 10 users</li>
                            <li><span className="font-semibold text-brand-dark">Revenue Increase:</span> $5,000/month</li>
                            <li><span className="font-semibold text-brand-dark">Cost Reduction:</span> $1,000/month</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-brand-dark mb-2">ROI Results:</h4>
                        <ul className="space-y-2 text-brand-dark/70">
                            <li>• First year cost: $19,000</li>
                            <li>• Annual benefit: $162,000</li>
                            <li>• First year ROI: 753%</li>
                            <li>• 3-year ROI: 934%</li>
                            <li>• Payback: 1.3 months</li>
                            <li>• 3-year net benefit: $439,000</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg text-sm">
                    <span className="font-bold text-purple-800 dark:text-purple-300">Result: Exceptional ROI—software investment delivers massive value</span>
                    <p className="text-purple-700 dark:text-purple-200 mt-1">753% first-year ROI with 1.3-month payback. Three-year ROI of 934% shows sustained value creation. Strong business case for immediate implementation.</p>
                </div>
           </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {[
                    "How do I calculate ROI for software purchases?",
                    "What is a good ROI for enterprise software?",
                    "What are the most important benefits to measure in software ROI?",
                    "How long should software ROI payback period be?",
                    "What costs should I include in total cost of ownership (TCO) for software?",
                    "How do I validate software ROI projections before purchasing?",
                    "How do I calculate time savings for software ROI?",
                    "Should I calculate software ROI for the first year or over multiple years?",
                    "What are common mistakes in calculating software ROI?",
                    "How do I calculate software ROI for a team vs. individual user?"
                ].map((q, i) => (
                    <div key={i} className="border-b border-brand-medium/20 pb-4">
                        <button className="flex justify-between items-center w-full text-left font-medium text-brand-dark hover:text-purple-600 transition-colors">
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
              <p className="text-brand-dark/70">Share it with other business leaders and IT teams</p>
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
                       href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check%20out%20this%20Software%20ROI%20Calculator`}
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
                       href={`https://wa.me/?text=${encodeURIComponent('Check out this Software ROI Calculator: ' + shareUrl)}`}
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
                 href={`mailto:?subject=Software ROI Calculator&body=Check out this Software ROI Calculator: ${shareUrl}`}
                 className="flex items-center justify-center gap-2 w-full py-2.5 border border-brand-medium/30 rounded-lg hover:bg-brand-light transition-colors mb-6 text-brand-dark"
              >
                 <Mail className="w-4 h-4" />
                 <span className="text-sm font-medium">Share via Email</span>
              </a>

               <button 
                  onClick={() => {
                      if (navigator.share) {
                          navigator.share({
                              title: 'Software ROI Calculator',
                              text: 'Check out this Software ROI Calculator!',
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
                  Suggested hashtags: #SoftwareROI #SaaS #BusinessTools #ROI #Calculator
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default SoftwareRoiCalculator;
