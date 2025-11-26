
import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Users, BarChart2, CheckCircle, Info, Share2, Copy, Check, Facebook, Linkedin, Twitter, Mail, MessageCircle, ArrowRight, Target, HelpCircle } from 'lucide-react';

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

  const [shareUrl, setShareUrl] = useState('');
  const [isSharedCopied, setIsSharedCopied] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    if (currentUrl.startsWith('blob:') || currentUrl.startsWith('about:')) {
        setShareUrl('https://perfxads.com/tools/clv-calculator');
    } else {
        setShareUrl(currentUrl);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === 'calculationMethod' ? value : parseFloat(value) || 0
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
                      className="w-full px-4 py-3 bg-brand-light/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
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
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/40 mt-1">Average revenue per transaction</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Purchase Frequency (per year)</label>
                   <input
                      type="number"
                      name="purchaseFrequency"
                      value={inputs.purchaseFrequency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/40 mt-1">Number of purchases per customer per year</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Customer Lifespan (years)</label>
                   <input
                      type="number"
                      name="customerLifespan"
                      value={inputs.customerLifespan}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/40 mt-1">Average years customer stays active</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Profit Margin (%)</label>
                   <input
                      type="number"
                      name="profitMargin"
                      value={inputs.profitMargin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/40 mt-1">Gross profit margin on sales</p>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-brand-dark mb-2">Retention Rate % (Optional)</label>
                   <input
                      type="number"
                      name="retentionRate"
                      value={inputs.retentionRate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                   />
                   <p className="text-xs text-brand-dark/40 mt-1">Percentage of customers retained year-over-year</p>
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
                    <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6 mb-6 border border-teal-100 dark:border-teal-800">
                       <p className="text-sm text-teal-900 dark:text-teal-300 font-medium mb-1">Customer Lifetime Value</p>
                       <div className="text-4xl font-extrabold text-teal-700 dark:text-teal-400">{formatCurrency(results.customerLifetimeValue)}</div>
                       <p className="text-xs text-teal-800 dark:text-teal-300 mt-2">Total profit per customer</p>
                    </div>

                    {/* Secondary Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                          <p className="text-xs text-blue-800 dark:text-blue-300 font-semibold mb-1">Lifetime Revenue</p>
                          <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{formatCurrency(results.lifetimeRevenue)}</p>
                       </div>
                       <div className="p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                          <p className="text-xs text-purple-800 dark:text-purple-300 font-semibold mb-1">Total Purchases</p>
                          <p className="text-lg font-bold text-purple-700 dark:text-purple-400">{results.totalPurchases.toFixed(0)}</p>
                       </div>
                    </div>

                    {/* CAC Limit */}
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800 p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-orange-900 dark:text-orange-300 font-semibold mb-1">Max Acquisition Cost</p>
                                <p className="text-xl font-bold text-orange-700 dark:text-orange-400">{formatCurrency(results.maxAcquisitionCost)}</p>
                                <p className="text-[10px] text-orange-800 dark:text-orange-300 mt-1">33% of CLV (sustainable CAC)</p>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Text */}
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-lg">
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

        {/* Types Section */}
        <div className="mb-16">
           <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">CLV Calculator Types & Methods</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                 {
                    title: "Customer Lifetime Value Calculator",
                    desc: "Calculate total profit from customer relationship",
                    formula: "AOV × Frequency × Lifespan",
                    tag: "Formula",
                    note: "Simple method for estimating customer value over time"
                 },
                 {
                    title: "LTV Calculator (SaaS)",
                    desc: "Calculate lifetime value for subscription businesses",
                    formula: "ARPA ÷ Churn Rate",
                    tag: "Method",
                    note: "Specialized calculation for recurring revenue models",
                    color: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                 },
                 {
                    title: "Customer Acquisition Cost Calculator",
                    desc: "Calculate cost to acquire new customers",
                    formula: "CLV:CAC ≥ 3:1",
                    tag: "Target ratio",
                    note: "Ensure sustainable unit economics for profitable growth",
                    color: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                 },
                 {
                    title: "Cohort LTV Calculator",
                    desc: "Track CLV by customer acquisition cohorts",
                    formula: "Time-based segmentation",
                    tag: "Analysis type",
                    note: "Compare customer value across different acquisition periods",
                    color: "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
                 },
                 {
                    title: "Predicted CLV Calculator",
                    desc: "Forecast future customer value using ML",
                    formula: "Predictive modeling",
                    tag: "Approach",
                    note: "Advanced forecasting based on customer behavior patterns",
                    color: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                 },
                 {
                    title: "Customer Profitability Calculator",
                    desc: "Calculate net profit per customer segment",
                    formula: "All costs & revenues",
                    tag: "Includes",
                    note: "Comprehensive profitability analysis by customer type",
                    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                 }
              ].map((card, i) => (
                 <div key={i} className="bg-brand-surface p-6 rounded-xl border border-brand-medium/30 hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-brand-dark mb-1">{card.title}</h3>
                    <p className="text-xs text-brand-dark/60 mb-4 h-8">{card.desc}</p>
                    <div className={`rounded-lg p-3 mb-4 ${card.color ? card.color.split(' ').slice(0, 2).join(' ') : 'bg-brand-light'}`}>
                       <p className="text-[10px] opacity-70 uppercase font-semibold mb-1">{card.tag}</p>
                       <p className={`text-sm font-medium ${card.color ? card.color.split(' ').slice(2).join(' ') : 'text-blue-600 dark:text-blue-400'}`}>{card.formula}</p>
                    </div>
                    <p className="text-xs text-brand-dark/50">{card.note}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* Quick Example Result */}
        <div className="bg-teal-50/50 dark:bg-teal-900/20 rounded-xl p-8 mb-16 border border-teal-100 dark:border-teal-800 text-center">
            <h3 className="text-lg font-bold text-brand-dark mb-2">Quick Example Result</h3>
            <p className="text-brand-dark/60 mb-6 text-sm">For $100 AOV, 4 purchases/year, 3-year lifespan, 30% margin:</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                <div className="bg-green-100 dark:bg-green-900/40 px-6 py-3 rounded-lg min-w-[120px]">
                    <p className="text-xs text-green-800 dark:text-green-300 font-semibold uppercase mb-1">CLV</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-400">$360</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/40 px-6 py-3 rounded-lg min-w-[120px]">
                    <p className="text-xs text-blue-800 dark:text-blue-300 font-semibold uppercase mb-1">Revenue</p>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-400">$1200</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/40 px-6 py-3 rounded-lg min-w-[120px]">
                    <p className="text-xs text-purple-800 dark:text-purple-300 font-semibold uppercase mb-1">Purchases</p>
                    <p className="text-xl font-bold text-purple-700 dark:text-purple-400">12</p>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900/40 px-6 py-3 rounded-lg min-w-[120px]">
                    <p className="text-xs text-orange-800 dark:text-orange-300 font-semibold uppercase mb-1">Max CAC</p>
                    <p className="text-xl font-bold text-orange-700 dark:text-orange-400">$118.8</p>
                </div>
            </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 p-8 md:p-12 mb-16">
           <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">How Our CLV Calculator Works</h2>
           <p className="text-center text-brand-dark/70 max-w-2xl mx-auto mb-12">
              Our CLV calculator uses the standard customer lifetime value formula to determine customer profitability. The calculation accounts for average order value, purchase frequency, customer lifespan, and profit margins to provide accurate <span className="text-teal-600 dark:text-teal-400 font-bold">customer value assessment and acquisition cost limits</span>. This helps businesses make informed decisions about marketing spend and customer retention investments.
           </p>

           <div className="bg-brand-light/50 rounded-xl p-8 max-w-3xl mx-auto border border-brand-medium/20 mb-12">
              <h3 className="font-bold text-brand-dark mb-6">CLV Calculation Formulas</h3>
              <div className="bg-brand-surface p-6 rounded-lg border border-brand-medium/20 font-mono text-xs md:text-sm text-brand-dark/80 leading-relaxed shadow-sm space-y-3">
                 <div>
                    <span className="font-bold block mb-1">Customer Lifetime Value:</span>
                    <span className="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">CLV = AOV × Purchase Frequency × Lifespan × Profit Margin</span>
                 </div>
                 <div>
                    <span className="font-bold block mb-1">Lifetime Revenue:</span>
                    <span className="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">Revenue = AOV × Purchase Frequency × Customer Lifespan</span>
                 </div>
                 <div>
                    <span className="font-bold block mb-1">Maximum CAC:</span>
                    <span className="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">Max CAC = CLV × 0.33 (for 3:1 ratio)</span>
                 </div>
                 <div>
                    <span className="font-bold block mb-1">Customer Lifespan:</span>
                    <span className="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">Lifespan (years) = 1 ÷ Annual Churn Rate</span>
                 </div>
              </div>
              
              <div className="mt-6">
                 <p className="text-xs font-bold text-brand-dark/60 uppercase mb-2">Key Components:</p>
                 <ul className="text-xs text-brand-dark/70 space-y-1">
                    <li>• <span className="font-bold">AOV</span> = Average Order Value (revenue per transaction)</li>
                    <li>• <span className="font-bold">Frequency</span> = Purchases per year</li>
                    <li>• <span className="font-bold">Lifespan</span> = Years customer remains active</li>
                    <li>• <span className="font-bold">Margin</span> = Gross profit percentage</li>
                    <li>• <span className="font-bold">CAC</span> = Customer Acquisition Cost</li>
                 </ul>
              </div>
           </div>
        </div>

        {/* Understanding CLV */}
        <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-xl font-bold text-brand-dark mb-4">Understanding CLV and Its Impact</h3>
            <p className="text-sm text-brand-dark/70 mb-6 leading-relaxed">
                Customer Lifetime Value is the total profit a customer generates during their relationship with your business. It's crucial for determining how much you can spend on customer acquisition while remaining profitable. The industry standard is maintaining a 3:1 CLV to CAC ratio. A customer with $360 CLV allows for $120 maximum acquisition cost. Improving any component (AOV, frequency, lifespan, margin) directly increases CLV and enables more aggressive growth strategies.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-brand-dark/70 mb-8">
                <li>Track CLV by customer segment and acquisition channel</li>
                <li>5% retention improvement can increase CLV by 25-95%</li>
                <li>Focus on retention over acquisition for CLV growth</li>
                <li>Include all costs in CAC: ads, sales, marketing tools, overhead</li>
                <li>Measure actual CLV from cohort data, not just projections</li>
                <li>Update calculations quarterly as business metrics evolve</li>
            </ul>
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
                       href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check%20out%20this%20CLV%20Calculator`}
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
                       href={`https://wa.me/?text=${encodeURIComponent('Check out this CLV Calculator: ' + shareUrl)}`}
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
                 href={`mailto:?subject=CLV Calculator&body=Check out this Customer Lifetime Value Calculator: ${shareUrl}`}
                 className="flex items-center justify-center gap-2 w-full py-2.5 border border-brand-medium/30 rounded-lg hover:bg-brand-light transition-colors mb-6 text-brand-dark"
              >
                 <Mail className="w-4 h-4" />
                 <span className="text-sm font-medium">Share via Email</span>
              </a>

               <button 
                  onClick={() => {
                      if (navigator.share) {
                          navigator.share({
                              title: 'CLV Calculator',
                              text: 'Check out this Customer Lifetime Value Calculator!',
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
                  Suggested hashtags: #CLV #LTV #Marketing #Ecommerce #SaaS #Calculator
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ClvCalculator;
