
import React, { useState, useEffect } from 'react';
import { Calculator, Building, DollarSign, Info, TrendingDown, Landmark, HelpCircle } from 'lucide-react';

const AusCompanyTaxCalculator = () => {
  const [year, setYear] = useState('2025');
  const [residency, setResidency] = useState('Resident');
  const [grossIncome, setGrossIncome] = useState<string>('');
  const [deductions, setDeductions] = useState<string>('');
  const [isBaseRateEntity, setIsBaseRateEntity] = useState(true);

  const [results, setResults] = useState({
    taxableIncome: 0,
    taxRate: 0.25,
    taxPayable: 0,
    netIncome: 0
  });

  useEffect(() => {
    const income = parseFloat(grossIncome) || 0;
    const deduct = parseFloat(deductions) || 0;
    
    const taxable = Math.max(0, income - deduct);
    
    // Determine Tax Rate
    // For 2021-22 onwards:
    // Base Rate Entity (Turnover < $50m and <= 80% passive income) = 25%
    // Otherwise = 30%
    const rate = isBaseRateEntity ? 0.25 : 0.30;
    
    const tax = taxable * rate;
    const net = taxable - tax;

    setResults({
      taxableIncome: taxable,
      taxRate: rate,
      taxPayable: tax,
      netIncome: net
    });
  }, [grossIncome, deductions, isBaseRateEntity, year]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 2 }).format(val);
  };

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Input Section */}
          <div className="w-full lg:w-5/12 bg-brand-surface p-6 md:p-8 rounded-2xl border border-brand-medium/30 shadow-sm h-fit">
             <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold text-lg border-b border-brand-medium/10 pb-4">
                <Landmark className="w-5 h-5 text-teal-600" />
                <h3>Company Tax Calculator (Australia)</h3>
             </div>
             <p className="text-brand-dark/60 text-sm mb-6">Estimate your company tax liability for Australian businesses.</p>
             
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-2">Tax Year</label>
                       <select 
                          value={year} 
                          onChange={(e) => setYear(e.target.value)}
                          className="w-full px-3 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                       >
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-2">Tax Residency</label>
                       <select 
                          value={residency} 
                          onChange={(e) => setResidency(e.target.value)}
                          className="w-full px-3 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                       >
                          <option value="Resident">Resident</option>
                          <option value="Non-Resident">Non-Resident</option>
                       </select>
                    </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-2">Gross Income (AUD)</label>
                   <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40 font-bold">$</span>
                       <input 
                          type="number" 
                          value={grossIncome}
                          onChange={(e) => setGrossIncome(e.target.value)}
                          placeholder="e.g. 200000" 
                          className="w-full pl-9 pr-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark font-bold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                       />
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-2">Deductions (AUD)</label>
                   <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40 font-bold">$</span>
                       <input 
                          type="number" 
                          value={deductions}
                          onChange={(e) => setDeductions(e.target.value)}
                          placeholder="e.g. 50000" 
                          className="w-full pl-9 pr-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark font-bold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                       />
                   </div>
                </div>

                <div className="bg-teal-50 dark:bg-teal-900/10 p-4 rounded-lg border border-teal-100 dark:border-teal-800/30">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={isBaseRateEntity} 
                            onChange={(e) => setIsBaseRateEntity(e.target.checked)}
                            className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <div>
                            <span className="block text-sm font-bold text-brand-dark">Base Rate Entity (Small Business)</span>
                            <span className="text-xs text-brand-dark/60 mt-1 block leading-snug">
                                Tick if aggregated turnover is under $50m AND 80% or less of assessable income is passive (e.g. rent, interest).
                            </span>
                        </div>
                    </label>
                </div>
             </div>
          </div>

          {/* Results Column */}
          <div className="w-full lg:w-7/12">
             <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-xl overflow-hidden sticky top-24">
                <div className="p-6 md:p-8 bg-brand-light border-b border-brand-medium/20">
                    <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold">
                       <Calculator className="w-5 h-5 text-teal-600" />
                       <h3>Estimated Tax Liability</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="p-5 bg-brand-surface rounded-xl border border-brand-medium/20">
                            <p className="text-xs font-bold text-brand-dark/60 uppercase mb-1">Taxable Income</p>
                            <p className="text-2xl font-bold text-brand-dark">{formatCurrency(results.taxableIncome)}</p>
                            <p className="text-[10px] text-brand-dark/40">Gross - Deductions</p>
                        </div>
                        <div className="p-5 bg-brand-surface rounded-xl border border-brand-medium/20">
                            <p className="text-xs font-bold text-brand-dark/60 uppercase mb-1">Tax Rate</p>
                            <p className="text-2xl font-bold text-brand-dark">{(results.taxRate * 100).toFixed(1)}%</p>
                            <p className="text-[10px] text-brand-dark/40">{isBaseRateEntity ? 'Base Rate Entity' : 'Standard Corporate Rate'}</p>
                        </div>
                    </div>

                    <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6 border border-teal-100 dark:border-teal-800 flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <div>
                            <p className="text-sm font-medium text-teal-900 dark:text-teal-300 mb-1">Estimated Tax Payable</p>
                            <div className="text-4xl font-extrabold text-teal-700 dark:text-teal-400">{formatCurrency(results.taxPayable)}</div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-teal-800/60 dark:text-teal-300/60 uppercase font-bold mb-1">Net Profit After Tax</p>
                            <p className="text-xl font-bold text-teal-800 dark:text-teal-300">{formatCurrency(results.netIncome)}</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2 items-start p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-lg">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                            <strong>Note:</strong> This calculator provides an estimate for Australian resident companies. 
                            Base Rate Entities (turnover &lt;$50m) are taxed at 25%. Other companies are taxed at 30%.
                            Actual tax liability may vary based on specific circumstances, tax offsets, and credits.
                        </p>
                    </div>
                </div>

                {/* Strategy Section */}
                <div className="p-6">
                    <h4 className="text-sm font-bold text-brand-dark mb-4 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-brand-medium" /> Strategies to Reduce Tax Liability
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: "Pre-pay Expenses", desc: "Pay for upcoming expenses before June 30 to claim deduction in current year." },
                            { title: "Write-off Bad Debts", desc: "Review debtors and write off unrecoverable debts before year end." },
                            { title: "Instant Asset Write-off", desc: "Check eligibility for immediate deduction of business assets." },
                            { title: "Superannuation", desc: "Ensure employee super is paid and cleared by June 30 to be deductible." }
                        ].map((item, i) => (
                            <div key={i} className="p-3 rounded-lg border border-brand-medium/20 bg-brand-surface hover:border-teal-500/30 transition-colors">
                                <p className="text-xs font-bold text-brand-dark mb-1">{item.title}</p>
                                <p className="text-[11px] text-brand-dark/60">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AusCompanyTaxCalculator;
