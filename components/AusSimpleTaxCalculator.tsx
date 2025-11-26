
import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, User, Calendar, Info, HelpCircle } from 'lucide-react';

type ResidencyStatus = 'resident' | 'non-resident' | 'part-year';

const AusSimpleTaxCalculator = () => {
  const [year, setYear] = useState('2024-2025');
  const [income, setIncome] = useState<string>('');
  const [residency, setResidency] = useState<ResidencyStatus>('resident');
  const [months, setMonths] = useState<string>('12'); // For part-year

  const [results, setResults] = useState({
    taxOnIncome: 0,
    medicareLevy: 0,
    totalTax: 0,
    netIncome: 0,
    effectiveRate: 0
  });

  useEffect(() => {
    const taxableIncome = parseFloat(income) || 0;
    let tax = 0;
    let medicare = 0;

    if (year === '2024-2025') {
      if (residency === 'resident') {
        // Stage 3 Tax Cuts
        if (taxableIncome <= 18200) {
          tax = 0;
        } else if (taxableIncome <= 45000) {
          tax = (taxableIncome - 18200) * 0.16;
        } else if (taxableIncome <= 135000) {
          tax = 4288 + (taxableIncome - 45000) * 0.30;
        } else if (taxableIncome <= 190000) {
          tax = 31288 + (taxableIncome - 135000) * 0.37;
        } else {
          tax = 51638 + (taxableIncome - 190000) * 0.45;
        }
        
        // Medicare Levy (Simple 2% for residents earning > threshold)
        // Note: Low income thresholds exist but simplifying to standard 2% for this "Simple" calc
        if (taxableIncome > 26000) { // Approx low income threshold
             medicare = taxableIncome * 0.02;
        }

      } else if (residency === 'non-resident') {
        // Foreign residents 2024-25
        if (taxableIncome <= 135000) {
          tax = taxableIncome * 0.30;
        } else if (taxableIncome <= 190000) {
          tax = 40500 + (taxableIncome - 135000) * 0.37;
        } else {
          tax = 60850 + (taxableIncome - 190000) * 0.45;
        }
        // No Medicare Levy for non-residents
      } else if (residency === 'part-year') {
         // Simplified Part-year: Tax-free threshold is adjusted
         // Adjusted threshold = 13,464 + (4,736 * months / 12)
         // Note: This is a complex calc in reality involving pro-rata. 
         // For this simple tool, we'll simulate by adjusting the first bracket 
         // or providing a generic disclaimer estimate as per basic ATO tool logic
         
         // Implementing basic adjusted threshold logic for 2024-25
         const numMonths = parseFloat(months) || 0;
         const adjustedThreshold = 13464 + (4736 * (numMonths / 12));
         
         // This is an approximation as brackets shift
         if (taxableIncome <= adjustedThreshold) {
             tax = 0;
         } else {
             // Fallback to resident rates but subtract the difference in tax-free threshold benefit
             // Calculate as full resident first
             let residentTax = 0;
             if (taxableIncome <= 18200) residentTax = 0;
             else if (taxableIncome <= 45000) residentTax = (taxableIncome - 18200) * 0.16;
             else if (taxableIncome <= 135000) residentTax = 4288 + (taxableIncome - 45000) * 0.30;
             else if (taxableIncome <= 190000) residentTax = 31288 + (taxableIncome - 135000) * 0.37;
             else residentTax = 51638 + (taxableIncome - 190000) * 0.45;

             // Add back tax on the missing threshold portion
             // (18200 - adjusted) * 0.16 roughly
             const thresholdDiff = Math.max(0, 18200 - adjustedThreshold);
             tax = residentTax + (thresholdDiff * 0.16); // Approx adjustment
         }
         
         if (taxableIncome > 26000) medicare = taxableIncome * 0.02;
      }
    } else {
      // 2023-2024 Rates
      if (residency === 'resident') {
        if (taxableIncome <= 18200) {
          tax = 0;
        } else if (taxableIncome <= 45000) {
          tax = (taxableIncome - 18200) * 0.19;
        } else if (taxableIncome <= 120000) {
          tax = 5092 + (taxableIncome - 45000) * 0.325;
        } else if (taxableIncome <= 180000) {
          tax = 29467 + (taxableIncome - 120000) * 0.37;
        } else {
          tax = 51667 + (taxableIncome - 180000) * 0.45;
        }
        if (taxableIncome > 24276) { 
             medicare = taxableIncome * 0.02;
        }
      } else if (residency === 'non-resident') {
        // Foreign residents 2023-24
        if (taxableIncome <= 120000) {
          tax = taxableIncome * 0.325;
        } else if (taxableIncome <= 180000) {
          tax = 39000 + (taxableIncome - 120000) * 0.37;
        } else {
          tax = 61200 + (taxableIncome - 180000) * 0.45;
        }
      } else if (residency === 'part-year') {
         // Similar approximation for 2023-24
         const numMonths = parseFloat(months) || 0;
         const adjustedThreshold = 13464 + (4736 * (numMonths / 12));
         
         let residentTax = 0;
         if (taxableIncome <= 18200) residentTax = 0;
         else if (taxableIncome <= 45000) residentTax = (taxableIncome - 18200) * 0.19;
         else if (taxableIncome <= 120000) residentTax = 5092 + (taxableIncome - 45000) * 0.325;
         else if (taxableIncome <= 180000) residentTax = 29467 + (taxableIncome - 120000) * 0.37;
         else residentTax = 51667 + (taxableIncome - 180000) * 0.45;

         const thresholdDiff = Math.max(0, 18200 - adjustedThreshold);
         tax = residentTax + (thresholdDiff * 0.19); // 19% lowest rate in 23-24
         
         if (taxableIncome > 24276) medicare = taxableIncome * 0.02;
      }
    }

    const totalTax = tax + medicare;
    const netIncome = taxableIncome - totalTax;
    const effectiveRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;

    setResults({
      taxOnIncome: tax,
      medicareLevy: medicare,
      totalTax,
      netIncome,
      effectiveRate
    });
  }, [year, income, residency, months]);

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
                <User className="w-5 h-5 text-blue-600" />
                <h3>Simple Tax Calculator (Australia)</h3>
             </div>
             <p className="text-brand-dark/60 text-sm mb-6">Estimate your individual income tax and Medicare levy.</p>
             
             <div className="space-y-6">
                <div>
                   <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-2">Income Year</label>
                   <div className="relative">
                       <select 
                          value={year} 
                          onChange={(e) => setYear(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                       >
                          <option value="2024-2025">2024 - 2025 (Stage 3 Cuts)</option>
                          <option value="2023-2024">2023 - 2024</option>
                       </select>
                       <Calendar className="absolute left-3 top-3 w-4 h-4 text-brand-medium" />
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-2">Taxable Income ($)</label>
                   <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40 font-bold">$</span>
                       <input 
                          type="number" 
                          value={income}
                          onChange={(e) => setIncome(e.target.value)}
                          placeholder="e.g. 90000" 
                          className="w-full pl-9 pr-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                       />
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-3">Residency Status</label>
                   <div className="space-y-3">
                       <label className="flex items-center gap-3 p-3 rounded-lg border border-brand-medium/20 cursor-pointer hover:bg-brand-light/30 transition-colors">
                           <input 
                               type="radio" 
                               name="residency"
                               value="resident"
                               checked={residency === 'resident'}
                               onChange={() => setResidency('resident')}
                               className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                           />
                           <span className="text-sm text-brand-dark">Resident for full year</span>
                       </label>
                       <label className="flex items-center gap-3 p-3 rounded-lg border border-brand-medium/20 cursor-pointer hover:bg-brand-light/30 transition-colors">
                           <input 
                               type="radio" 
                               name="residency"
                               value="non-resident"
                               checked={residency === 'non-resident'}
                               onChange={() => setResidency('non-resident')}
                               className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                           />
                           <span className="text-sm text-brand-dark">Non-resident for full year</span>
                       </label>
                       <label className="flex items-center gap-3 p-3 rounded-lg border border-brand-medium/20 cursor-pointer hover:bg-brand-light/30 transition-colors">
                           <input 
                               type="radio" 
                               name="residency"
                               value="part-year"
                               checked={residency === 'part-year'}
                               onChange={() => setResidency('part-year')}
                               className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                           />
                           <span className="text-sm text-brand-dark">Part-year resident</span>
                       </label>
                   </div>
                </div>

                {residency === 'part-year' && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                       <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-2">Months as Resident</label>
                       <input 
                          type="number" 
                          min="1"
                          max="12"
                          value={months}
                          onChange={(e) => setMonths(e.target.value)}
                          className="w-full px-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                       />
                       <p className="text-xs text-brand-dark/50 mt-1">Used to calculate tax-free threshold adjustment.</p>
                    </div>
                )}
             </div>
          </div>

          {/* Results Column */}
          <div className="w-full lg:w-7/12">
             <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-xl overflow-hidden sticky top-24">
                <div className="p-6 md:p-8 bg-brand-light border-b border-brand-medium/20">
                    <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold">
                       <Calculator className="w-5 h-5 text-blue-600" />
                       <h3>Estimated Tax Payable</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="p-5 bg-brand-surface rounded-xl border border-brand-medium/20">
                            <p className="text-xs font-bold text-brand-dark/60 uppercase mb-1">Tax on Income</p>
                            <p className="text-2xl font-bold text-brand-dark">{formatCurrency(results.taxOnIncome)}</p>
                            <p className="text-[10px] text-brand-dark/40">Excluding Medicare</p>
                        </div>
                        <div className="p-5 bg-brand-surface rounded-xl border border-brand-medium/20">
                            <p className="text-xs font-bold text-brand-dark/60 uppercase mb-1">Medicare Levy</p>
                            <p className="text-2xl font-bold text-brand-dark">{formatCurrency(results.medicareLevy)}</p>
                            <p className="text-[10px] text-brand-dark/40">2% of taxable income</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800 flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <div>
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">Total Estimated Tax</p>
                            <div className="text-4xl font-extrabold text-blue-700 dark:text-blue-400">{formatCurrency(results.totalTax)}</div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-blue-800/60 dark:text-blue-300/60 uppercase font-bold mb-1">Net Income (After Tax)</p>
                            <p className="text-xl font-bold text-blue-800 dark:text-blue-300">{formatCurrency(results.netIncome)}</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2 items-start p-4 bg-brand-light/20 border border-brand-medium/20 rounded-lg">
                        <Info className="w-4 h-4 text-brand-medium mt-0.5 shrink-0" />
                        <div className="space-y-2">
                            <p className="text-xs text-brand-dark/70 leading-relaxed">
                                <strong>Effective Tax Rate:</strong> {results.effectiveRate.toFixed(2)}% (Total Tax ÷ Gross Income)
                            </p>
                            <p className="text-[10px] text-brand-dark/50">
                                Disclaimer: This simple calculator provides an estimate based on standard ATO tax rates for the selected year. It does not account for rebates (like LITO), Medicare Levy Surcharge, HECS/HELP repayments, or other specific offsets.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <h4 className="text-sm font-bold text-brand-dark mb-4 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-brand-medium" /> Quick Facts
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-brand-dark/70">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span>Tax-free threshold: $18,200 (Residents)</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span>Medicare Levy is 2% for most residents</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span>Non-residents pay tax on all Australian income</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span>2024-25 rates include Stage 3 tax cuts</span>
                        </li>
                    </ul>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AusSimpleTaxCalculator;
