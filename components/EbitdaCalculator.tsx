
import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, PieChart, BarChart3, Info, Share2, Copy, Check, Facebook, Linkedin, Twitter, Mail, MessageCircle, ArrowRight, Percent, HelpCircle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const EbitdaCalculator = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'revenue' | 'multi'>('basic');
  
  const [inputs, setInputs] = useState({
    // Basic Inputs
    netIncome: 100000,
    interestExpense: 5000,
    taxExpense: 12000,
    depreciation: 10000,
    amortization: 5000,
    
    // Revenue Inputs
    totalRevenue: 500000,
    cogs: 200000,
    operatingExpenses: 150000,
    
    // Multi-Period Inputs
    period1Ebitda: 100000,
    period2Ebitda: 110000,
    period3Ebitda: 125000,
  });

  const [results, setResults] = useState({
    ebitda: 0,
    ebitdaMargin: 0,
    netIncome: 0, // Calculated for Revenue method
    performance: 'Healthy',
    performanceColor: 'text-green-600',
    message: '',
    
    // Multi-period results
    growth1to2: 0,
    growth2to3: 0,
    avgGrowth: 0,
    trend: 'up' as 'up' | 'down' | 'flat'
  });

  const [shareUrl, setShareUrl] = useState('');
  const [isSharedCopied, setIsSharedCopied] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    if (currentUrl.startsWith('blob:') || currentUrl.startsWith('about:')) {
        setShareUrl('https://perfxads.com/tools/ebitda-calculator');
    } else {
        setShareUrl(currentUrl);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      netIncome, interestExpense, taxExpense, depreciation, amortization, 
      totalRevenue, cogs, operatingExpenses,
      period1Ebitda, period2Ebitda, period3Ebitda 
    } = inputs;

    let calculatedEbitda = 0;
    let calculatedMargin = 0;
    let calculatedNetIncome = netIncome;

    if (activeTab === 'basic') {
      // Method 1: From Net Income
      // EBITDA = Net Income + Interest + Taxes + Depreciation + Amortization
      calculatedEbitda = netIncome + interestExpense + taxExpense + depreciation + amortization;
      calculatedMargin = totalRevenue > 0 ? (calculatedEbitda / totalRevenue) * 100 : 0;
    } else if (activeTab === 'revenue') {
      // Method 2: From Revenue
      // Gross Profit = Revenue - COGS
      // Operating Income (EBIT) = Gross Profit - Operating Expenses
      // Note: Typically Operating Expenses in this context includes SG&A. 
      // If OpEx includes D&A, we add it back. If OpEx is "Cash OpEx", we don't need to add it back to get EBITDA, but standard accounting subtracts it to get EBIT.
      // Formula: EBITDA = (Revenue - COGS - Operating Expenses) + Depreciation + Amortization
      // Assumes 'Operating Expenses' input includes the D&A amount entered.
      
      const grossProfit = totalRevenue - cogs;
      const ebit = grossProfit - operatingExpenses;
      calculatedEbitda = ebit + depreciation + amortization;
      
      // Calculate Net Income for reference: EBIT - Interest - Taxes
      calculatedNetIncome = ebit - interestExpense - taxExpense;
      calculatedMargin = totalRevenue > 0 ? (calculatedEbitda / totalRevenue) * 100 : 0;
    } else if (activeTab === 'multi') {
      // Method 3: Multi-Period Analysis
      calculatedEbitda = period3Ebitda; // Use most recent for main display
      calculatedMargin = totalRevenue > 0 ? (period3Ebitda / totalRevenue) * 100 : 0;
      
      const growth1 = period1Ebitda > 0 ? ((period2Ebitda - period1Ebitda) / period1Ebitda) * 100 : 0;
      const growth2 = period2Ebitda > 0 ? ((period3Ebitda - period2Ebitda) / period2Ebitda) * 100 : 0;
      const avg = (growth1 + growth2) / 2;
      
      let trend: 'up' | 'down' | 'flat' = 'flat';
      if (avg > 2) trend = 'up';
      if (avg < -2) trend = 'down';

      setResults(prev => ({
        ...prev,
        growth1to2: growth1,
        growth2to3: growth2,
        avgGrowth: avg,
        trend
      }));
    }

    // Performance Classification
    let performance = 'Average';
    let performanceColor = 'text-yellow-600 dark:text-yellow-400';
    let message = 'Your EBITDA margin is within standard ranges.';

    if (calculatedMargin < 10) {
        performance = 'Below Average';
        performanceColor = 'text-red-600 dark:text-red-400';
        message = 'Margins are tight. Consider cost reduction or pricing optimization strategies.';
    } else if (calculatedMargin >= 10 && calculatedMargin < 20) {
        performance = 'Average';
        performanceColor = 'text-blue-600 dark:text-blue-400';
        message = 'Healthy operational efficiency for most traditional industries.';
    } else if (calculatedMargin >= 20) {
        performance = 'Excellent';
        performanceColor = 'text-green-600 dark:text-green-400';
        message = 'Strong operational performance indicating competitive advantage.';
    }

    setResults(prev => ({
      ...prev,
      ebitda: calculatedEbitda,
      ebitdaMargin: calculatedMargin,
      netIncome: calculatedNetIncome,
      performance,
      performanceColor,
      message
    }));

  }, [inputs, activeTab]);

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* Main Calculator Area */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          
          {/* Inputs Column */}
          <div className="w-full lg:w-5/12 bg-brand-surface p-6 md:p-8 rounded-2xl border border-brand-medium/30 shadow-sm h-fit">
             <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold text-lg border-b border-brand-medium/10 pb-4">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h3>EBITDA Calculator</h3>
             </div>

             {/* Tabs */}
             <div className="flex border-b border-brand-medium/20 mb-6">
                <button 
                  onClick={() => setActiveTab('basic')}
                  className={`pb-2 px-4 text-sm font-bold transition-colors relative ${activeTab === 'basic' ? 'text-green-600 dark:text-green-400' : 'text-brand-dark/60 hover:text-brand-dark'}`}
                >
                  Basic Calculator
                  {activeTab === 'basic' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 dark:bg-green-400"></div>}
                </button>
                <button 
                  onClick={() => setActiveTab('revenue')}
                  className={`pb-2 px-4 text-sm font-bold transition-colors relative ${activeTab === 'revenue' ? 'text-green-600 dark:text-green-400' : 'text-brand-dark/60 hover:text-brand-dark'}`}
                >
                  From Revenue
                  {activeTab === 'revenue' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 dark:bg-green-400"></div>}
                </button>
                <button 
                  onClick={() => setActiveTab('multi')}
                  className={`pb-2 px-4 text-sm font-bold transition-colors relative ${activeTab === 'multi' ? 'text-green-600 dark:text-green-400' : 'text-brand-dark/60 hover:text-brand-dark'}`}
                >
                  Multi-Period
                  {activeTab === 'multi' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 dark:bg-green-400"></div>}
                </button>
             </div>
             
             <div className="space-y-6">
                
                {/* BASIC CALCULATOR INPUTS */}
                {activeTab === 'basic' && (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                     <div className="mb-4">
                       <label className="block text-sm font-semibold text-brand-dark mb-1">Net Income ($)</label>
                       <input
                          type="number"
                          name="netIncome"
                          value={inputs.netIncome}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                       />
                       <p className="text-xs text-brand-dark/40 mt-1">Bottom-line profit after all expenses</p>
                     </div>

                     <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                              <label className="block text-sm font-semibold text-brand-dark mb-1">Interest ($)</label>
                              <input
                                  type="number"
                                  name="interestExpense"
                                  value={inputs.interestExpense}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-semibold text-brand-dark mb-1">Taxes ($)</label>
                              <input
                                  type="number"
                                  name="taxExpense"
                                  value={inputs.taxExpense}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                              />
                          </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                              <label className="block text-sm font-semibold text-brand-dark mb-1">Depreciation ($)</label>
                              <input
                                  type="number"
                                  name="depreciation"
                                  value={inputs.depreciation}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-semibold text-brand-dark mb-1">Amortization ($)</label>
                              <input
                                  type="number"
                                  name="amortization"
                                  value={inputs.amortization}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                              />
                          </div>
                     </div>
                     
                     <div className="mb-4">
                       <label className="block text-sm font-semibold text-brand-dark mb-1">Total Revenue ($) <span className="text-brand-dark/40 font-normal">(Optional for Margin)</span></label>
                       <input
                          type="number"
                          name="totalRevenue"
                          value={inputs.totalRevenue}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-brand-light/50 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                       />
                     </div>
                  </div>
                )}

                {/* FROM REVENUE INPUTS */}
                {activeTab === 'revenue' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                           <label className="block text-sm font-semibold text-brand-dark mb-1">Total Revenue</label>
                           <input
                              type="number"
                              name="totalRevenue"
                              value={inputs.totalRevenue}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                           />
                           <p className="text-xs text-brand-dark/40 mt-1">Total sales/revenue</p>
                        </div>
                        <div>
                           <label className="block text-sm font-semibold text-brand-dark mb-1">COGS</label>
                           <input
                              type="number"
                              name="cogs"
                              value={inputs.cogs}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                           />
                           <p className="text-xs text-brand-dark/40 mt-1">Cost of goods sold</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                           <label className="block text-sm font-semibold text-brand-dark mb-1">Operating Expenses</label>
                           <input
                              type="number"
                              name="operatingExpenses"
                              value={inputs.operatingExpenses}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                           />
                           <p className="text-xs text-brand-dark/40 mt-1">Salaries, rent, marketing, etc.</p>
                        </div>
                        <div>
                           <label className="block text-sm font-semibold text-brand-dark mb-1">Interest Expense</label>
                           <input
                              type="number"
                              name="interestExpense"
                              value={inputs.interestExpense}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                           />
                           <p className="text-xs text-brand-dark/40 mt-1">Interest on debt</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                           <label className="block text-sm font-semibold text-brand-dark mb-1">Tax Expense</label>
                           <input
                              type="number"
                              name="taxExpense"
                              value={inputs.taxExpense}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                           />
                           <p className="text-xs text-brand-dark/40 mt-1">Income taxes</p>
                        </div>
                        <div>
                           <label className="block text-sm font-semibold text-brand-dark mb-1">Depreciation & Amortization</label>
                           <input
                              type="number"
                              name="depreciation" // Using depreciation field for combined D&A in this view simplicity or logic
                              value={inputs.depreciation}
                              onChange={(e) => {
                                  handleInputChange(e);
                                  // Zero out amortization if user uses this combined field, or split logically. 
                                  // For this specific input, we'll treat it as Depreciation in state, set Amortization to 0 for calc simplicity
                                  setInputs(prev => ({...prev, amortization: 0}));
                              }}
                              className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                           />
                           <p className="text-xs text-brand-dark/40 mt-1">Combined D&A expenses</p>
                        </div>
                     </div>
                  </div>
                )}

                {/* MULTI PERIOD INPUTS */}
                {activeTab === 'multi' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                     <p className="text-sm text-brand-dark/70 mb-4">Enter EBITDA for multiple periods to analyze trends:</p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                           <label className="block text-sm font-semibold text-brand-dark mb-1">Period 1 EBITDA</label>
                           <input
                              type="number"
                              name="period1Ebitda"
                              value={inputs.period1Ebitda}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                           />
                           <p className="text-xs text-brand-dark/40 mt-1">Oldest period</p>
                        </div>
                        <div>
                           <label className="block text-sm font-semibold text-brand-dark mb-1">Period 2 EBITDA</label>
                           <input
                              type="number"
                              name="period2Ebitda"
                              value={inputs.period2Ebitda}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                           />
                           <p className="text-xs text-brand-dark/40 mt-1">Second period</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                           <label className="block text-sm font-semibold text-brand-dark mb-1">Period 3 EBITDA</label>
                           <input
                              type="number"
                              name="period3Ebitda"
                              value={inputs.period3Ebitda}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                           />
                           <p className="text-xs text-brand-dark/40 mt-1">Most recent period</p>
                        </div>
                        <div>
                           <label className="block text-sm font-semibold text-brand-dark mb-1">Current Revenue</label>
                           <input
                              type="number"
                              name="totalRevenue"
                              value={inputs.totalRevenue}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                           />
                           <p className="text-xs text-brand-dark/40 mt-1">Revenue for most recent period</p>
                        </div>
                     </div>
                  </div>
                )}

                {/* Analyze Button (Visual mainly, logic is reactive) */}
                <button 
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md transition-all active:scale-95 flex justify-center items-center gap-2"
                >
                  {activeTab === 'multi' ? 'ANALYZE TRENDS' : 'CALCULATE EBITDA'}
                </button>

             </div>
          </div>

          {/* Results Column */}
          <div className="w-full lg:w-7/12">
             <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-xl overflow-hidden sticky top-24">
                <div className="p-6 md:p-8 bg-brand-light border-b border-brand-medium/20">
                    <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold">
                       <BarChart3 className="w-5 h-5 text-blue-600" />
                       <h3>Performance Results</h3>
                    </div>

                    {/* Conditional Result Display based on Tab */}
                    {activeTab === 'multi' ? (
                      <div className="space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                                <p className="text-sm text-brand-dark font-medium mb-1">Average Growth</p>
                                <div className={`text-3xl font-extrabold ${results.avgGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {results.avgGrowth > 0 ? '+' : ''}{results.avgGrowth.toFixed(1)}%
                                </div>
                                <p className="text-xs text-brand-dark/60 mt-2">Per period</p>
                            </div>
                            <div className="bg-brand-surface rounded-xl p-6 border border-brand-medium/20 flex flex-col justify-center items-center">
                                <p className="text-sm text-brand-dark font-medium mb-2">Trend Direction</p>
                                {results.trend === 'up' && <ArrowUpRight className="w-12 h-12 text-green-500" />}
                                {results.trend === 'down' && <ArrowDownRight className="w-12 h-12 text-red-500" />}
                                {results.trend === 'flat' && <Minus className="w-12 h-12 text-gray-400" />}
                                <p className="text-xs text-brand-dark/60 mt-1 font-bold uppercase">{results.trend}</p>
                            </div>
                         </div>
                         
                         <div className="space-y-2">
                            <p className="text-xs font-bold text-brand-dark/50 uppercase">Period Breakdown</p>
                            <div className="flex justify-between items-center bg-brand-surface p-3 rounded border border-brand-medium/10">
                               <span className="text-sm text-brand-dark/70">Period 1 to 2 Growth</span>
                               <span className={`font-mono font-bold ${results.growth1to2 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                 {results.growth1to2 > 0 ? '+' : ''}{results.growth1to2.toFixed(1)}%
                               </span>
                            </div>
                            <div className="flex justify-between items-center bg-brand-surface p-3 rounded border border-brand-medium/10">
                               <span className="text-sm text-brand-dark/70">Period 2 to 3 Growth</span>
                               <span className={`font-mono font-bold ${results.growth2to3 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                 {results.growth2to3 > 0 ? '+' : ''}{results.growth2to3.toFixed(1)}%
                               </span>
                            </div>
                         </div>
                      </div>
                    ) : (
                      <>
                        {/* Standard Results for Basic & Revenue */}
                        <div className="bg-blue-50/50 dark:bg-blue-900/30 rounded-xl p-6 mb-6 border border-blue-100 dark:border-blue-800 text-center md:text-left">
                          <p className="text-sm text-brand-dark font-medium mb-1">EBITDA (Operating Cash Flow Proxy)</p>
                          <div className="text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-blue-400">{formatCurrency(results.ebitda)}</div>
                          <p className="text-xs text-brand-dark/60 mt-2">Earnings Before Interest, Taxes, Depreciation, and Amortization</p>
                        </div>

                        {inputs.totalRevenue > 0 && (
                            <div className={`rounded-lg border p-4 mb-6 flex items-center justify-between ${
                                results.ebitdaMargin >= 20 ? 'bg-green-50 dark:bg-green-900/30 border-green-100 dark:border-green-800' : 
                                results.ebitdaMargin >= 10 ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800' : 
                                'bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-800'
                            }`}>
                                <div>
                                    <p className="text-xs font-bold opacity-70 mb-1 uppercase">EBITDA Margin</p>
                                    <p className="text-2xl font-extrabold text-brand-dark">{results.ebitdaMargin.toFixed(1)}%</p>
                                </div>
                                <div className="text-right max-w-[200px]">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold mb-1 ${
                                        results.ebitdaMargin >= 20 ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                                        results.ebitdaMargin >= 10 ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : 
                                        'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                    }`}>
                                        {results.performance}
                                    </span>
                                    <p className="text-xs opacity-70">{results.message}</p>
                                </div>
                            </div>
                        )}

                        {/* Breakdown Visualization */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-brand-dark/50 uppercase">Calculation Breakdown</p>
                            {activeTab === 'basic' ? (
                              <>
                                <div className="flex justify-between text-sm border-b border-brand-medium/10 pb-2">
                                    <span className="text-brand-dark/70">Net Income</span>
                                    <span className="font-mono font-medium">{formatCurrency(inputs.netIncome)}</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-brand-medium/10 pb-2">
                                    <span className="text-brand-dark/70">+ Interest</span>
                                    <span className="font-mono font-medium text-green-600 dark:text-green-400">{formatCurrency(inputs.interestExpense)}</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-brand-medium/10 pb-2">
                                    <span className="text-brand-dark/70">+ Taxes</span>
                                    <span className="font-mono font-medium text-green-600 dark:text-green-400">{formatCurrency(inputs.taxExpense)}</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-brand-medium/10 pb-2">
                                    <span className="text-brand-dark/70">+ Depreciation & Amortization</span>
                                    <span className="font-mono font-medium text-green-600 dark:text-green-400">{formatCurrency(inputs.depreciation + inputs.amortization)}</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex justify-between text-sm border-b border-brand-medium/10 pb-2">
                                    <span className="text-brand-dark/70">Total Revenue</span>
                                    <span className="font-mono font-medium">{formatCurrency(inputs.totalRevenue)}</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-brand-medium/10 pb-2">
                                    <span className="text-brand-dark/70">- COGS</span>
                                    <span className="font-mono font-medium text-red-500">{formatCurrency(inputs.cogs)}</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-brand-medium/10 pb-2">
                                    <span className="text-brand-dark/70">- Operating Expenses</span>
                                    <span className="font-mono font-medium text-red-500">{formatCurrency(inputs.operatingExpenses)}</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-brand-medium/10 pb-2">
                                    <span className="text-brand-dark/70">+ Depreciation & Amortization (Add-back)</span>
                                    <span className="font-mono font-medium text-green-600 dark:text-green-400">{formatCurrency(inputs.depreciation + inputs.amortization)}</span>
                                </div>
                              </>
                            )}
                            <div className="flex justify-between text-base font-bold pt-1">
                                <span>= EBITDA</span>
                                <span className="text-blue-600 dark:text-blue-400">{formatCurrency(results.ebitda)}</span>
                            </div>
                        </div>
                      </>
                    )}
                </div>

                <div className="p-6 bg-brand-surface">
                   <h4 className="flex items-center gap-2 text-sm font-bold text-brand-dark mb-4">
                      <Info className="w-4 h-4 text-brand-medium" />
                      Why EBITDA Matters:
                   </h4>
                   <ul className="space-y-2 text-xs text-brand-dark/70">
                      <li className="flex gap-2 text-blue-600 dark:text-blue-400">
                         <span>•</span>
                         Strips away financing decisions to show core profitability
                      </li>
                      <li className="flex gap-2 text-blue-600 dark:text-blue-400">
                         <span>•</span>
                         Key metric for business valuation (e.g. 5x EBITDA multiple)
                      </li>
                      <li className="flex gap-2 text-blue-600 dark:text-blue-400">
                         <span>•</span>
                         Standard for comparing companies with different capital structures
                      </li>
                   </ul>
                </div>
             </div>
          </div>
        </div>

        {/* Benchmarks Section */}
        <div className="mb-16">
           <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">Industry EBITDA Margin Benchmarks</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                 {
                    title: "Technology (Software)",
                    range: "17% - 35%",
                    desc: "High margins due to scalability and low variable costs.",
                    color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                 },
                 {
                    title: "Healthcare",
                    range: "15% - 26%",
                    desc: "Driven by high margins in specialized services and pharma.",
                    color: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                 },
                 {
                    title: "Retail",
                    range: "7% - 15%",
                    desc: "Lower margins due to high inventory and competition.",
                    color: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
                 },
                 {
                    title: "Manufacturing",
                    range: "20% - 31%",
                    desc: "Varies by efficiency, scale economies, and premium positioning.",
                    color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                 },
                 {
                    title: "Construction",
                    range: "11% - 22%",
                    desc: "Project-based revenue, dependent on operational efficiency.",
                    color: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
                 },
                 {
                    title: "Professional Services",
                    range: "21% - 40%",
                    desc: "Human capital intensive but high value-add services.",
                    color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20"
                 }
              ].map((card, i) => (
                 <div key={i} className="bg-brand-surface p-6 rounded-xl border border-brand-medium/30 hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-brand-dark mb-1">{card.title}</h3>
                    <div className={`rounded-lg p-3 my-3 w-fit ${card.color}`}>
                       <p className="text-lg font-bold">{card.range}</p>
                    </div>
                    <p className="text-xs text-brand-dark/60">{card.desc}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* Strategy Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 p-8">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Improving Revenue Strategies</h3>
                <ul className="space-y-4">
                    {[
                        { title: "Pricing Power", text: "Analyze price elasticity. Small price increases often flow directly to EBITDA." },
                        { title: "Customer Lifetime Value", text: "Focus on retention. Increasing LTV/CAC ratio boosts margins." },
                        { title: "Revenue Mix", text: "Shift focus to higher-margin products or services." }
                    ].map((item, i) => (
                        <li key={i} className="flex gap-3">
                            <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded text-green-600 dark:text-green-400 h-fit">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-brand-dark">{item.title}</p>
                                <p className="text-xs text-brand-dark/60">{item.text}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 p-8">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Cost Reduction Strategies</h3>
                <ul className="space-y-4">
                    {[
                        { title: "Operational Efficiency", text: "Automate repetitive processes to reduce labor costs." },
                        { title: "Vendor Negotiation", text: "Regularly review supplier contracts and terms." },
                        { title: "Inventory Management", text: "Optimize levels to reduce carrying costs and waste (JIT)." }
                    ].map((item, i) => (
                        <li key={i} className="flex gap-3">
                            <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-1 rounded text-blue-600 dark:text-blue-400 h-fit">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-brand-dark">{item.title}</p>
                                <p className="text-xs text-brand-dark/60">{item.text}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* Found This Calculator Helpful Section */}
        <div className="max-w-2xl mx-auto mb-16">
           <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-dark mb-2">Found This Calculator Helpful?</h2>
              <p className="text-brand-dark/70">Share it with business owners and finance teams</p>
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
                       href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check%20out%20this%20EBITDA%20Calculator`}
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
                       href={`https://wa.me/?text=${encodeURIComponent('Check out this EBITDA Calculator: ' + shareUrl)}`}
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
                 href={`mailto:?subject=EBITDA Calculator&body=Check out this EBITDA Calculator: ${shareUrl}`}
                 className="flex items-center justify-center gap-2 w-full py-2.5 border border-brand-medium/30 rounded-lg hover:bg-brand-light transition-colors mb-6 text-brand-dark"
              >
                 <Mail className="w-4 h-4" />
                 <span className="text-sm font-medium">Share via Email</span>
              </a>

               <button 
                  onClick={() => {
                      if (navigator.share) {
                          navigator.share({
                              title: 'EBITDA Calculator',
                              text: 'Check out this EBITDA Calculator!',
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
                  Suggested hashtags: #EBITDA #Finance #BusinessValuation #Profitability #Calculator
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default EbitdaCalculator;
