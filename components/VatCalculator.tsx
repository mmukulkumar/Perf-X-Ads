
import React, { useState, useEffect } from 'react';
import { Calculator, RefreshCw, Percent, TrendingUp, Minus, Plus } from 'lucide-react';

const VatCalculator = () => {
  const [amount, setAmount] = useState<string>('');
  const [rate, setRate] = useState<number>(20);
  const [customRate, setCustomRate] = useState<string>('');
  const [operation, setOperation] = useState<'add' | 'remove'>('add');
  
  const [results, setResults] = useState({
    net: 0,
    vat: 0,
    gross: 0
  });

  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    const activeRate = customRate ? parseFloat(customRate) : rate;
    const safeRate = isNaN(activeRate) ? 0 : activeRate;

    let net = 0;
    let vat = 0;
    let gross = 0;

    if (operation === 'add') {
      // Input is Net
      net = numAmount;
      vat = net * (safeRate / 100);
      gross = net + vat;
    } else {
      // Input is Gross
      gross = numAmount;
      // Gross = Net * (1 + rate/100)
      // Net = Gross / (1 + rate/100)
      net = gross / (1 + (safeRate / 100));
      vat = gross - net;
    }

    setResults({ net, vat, gross });
  }, [amount, rate, customRate, operation]);

  const handleRateClick = (r: number) => {
    setRate(r);
    setCustomRate('');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 }).format(val);
  };

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Input Section */}
          <div className="w-full lg:w-1/2 bg-brand-surface p-6 md:p-8 rounded-2xl border border-brand-medium/30 shadow-sm h-fit">
             <div className="flex justify-between items-center mb-6 border-b border-brand-medium/10 pb-4">
                <h3 className="font-bold text-lg text-brand-dark flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    VAT Calculator
                </h3>
                <button 
                    onClick={() => { setAmount(''); setCustomRate(''); setRate(20); setOperation('add'); }} 
                    className="text-xs font-medium text-brand-dark/60 hover:text-brand-dark flex items-center gap-1 px-3 py-1.5 rounded-lg border border-transparent hover:bg-brand-light transition-colors"
                >
                   <RefreshCw className="w-3 h-3" /> Reset
                </button>
             </div>

             <div className="space-y-8">
                {/* Operation Toggle */}
                <div className="bg-brand-light/50 p-1 rounded-xl flex relative">
                    <div 
                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-brand-surface shadow-sm rounded-lg transition-all duration-300 ease-out ${operation === 'add' ? 'left-1' : 'left-[calc(50%+3px)]'}`}
                    />
                    <button 
                        onClick={() => setOperation('add')}
                        className={`flex-1 relative z-10 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${operation === 'add' ? 'text-blue-600' : 'text-brand-dark/60 hover:text-brand-dark'}`}
                    >
                        <Plus className="w-4 h-4" /> Add VAT
                    </button>
                    <button 
                        onClick={() => setOperation('remove')}
                        className={`flex-1 relative z-10 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${operation === 'remove' ? 'text-blue-600' : 'text-brand-dark/60 hover:text-brand-dark'}`}
                    >
                        <Minus className="w-4 h-4" /> Remove VAT
                    </button>
                </div>

                {/* Amount Input */}
                <div>
                   <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-2">
                       {operation === 'add' ? 'Net Amount (excl. VAT)' : 'Gross Amount (incl. VAT)'}
                   </label>
                   <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40 font-bold">£</span>
                       <input 
                          type="number" 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00" 
                          className="w-full pl-10 pr-4 py-4 bg-brand-light/30 border border-brand-medium/40 rounded-xl text-brand-dark text-xl font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-brand-dark/20"
                       />
                   </div>
                </div>

                {/* VAT Rate */}
                <div>
                    <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-3">VAT Rate</label>
                    <div className="grid grid-cols-4 gap-3">
                        {[20, 5, 0].map((r) => (
                            <button
                                key={r}
                                onClick={() => handleRateClick(r)}
                                className={`py-3 px-2 rounded-lg text-sm font-bold border transition-all ${rate === r && !customRate ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' : 'bg-brand-surface text-brand-dark border-brand-medium/30 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                            >
                                {r}%
                            </button>
                        ))}
                        <div className="relative">
                            <input 
                                type="number" 
                                value={customRate}
                                onChange={(e) => setCustomRate(e.target.value)}
                                onClick={() => setRate(0)} // Reset standard selection visually
                                placeholder="Custom"
                                className={`w-full h-full px-2 py-3 text-center bg-brand-surface border rounded-lg text-sm font-bold outline-none transition-all ${customRate ? 'border-blue-600 ring-1 ring-blue-600' : 'border-brand-medium/30 focus:border-blue-500'}`}
                            />
                            {!customRate && <span className="absolute inset-0 flex items-center justify-center pointer-events-none text-brand-dark/40 text-xs font-bold">Custom</span>}
                            {customRate && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-brand-dark/40">%</span>}
                        </div>
                    </div>
                </div>
             </div>
          </div>

          {/* Result Section */}
          <div className="w-full lg:w-1/2">
             <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-xl overflow-hidden sticky top-24">
                <div className="p-8 bg-brand-light/10">
                    <h4 className="text-sm font-bold text-brand-dark/50 uppercase mb-6 text-center">Calculation Results</h4>
                    
                    <div className="space-y-4">
                        {/* Net */}
                        <div className={`p-5 rounded-xl border flex justify-between items-center transition-all ${operation === 'add' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 scale-[1.02] shadow-sm' : 'bg-brand-surface border-brand-medium/20 opacity-70'}`}>
                            <div>
                                <p className="text-xs font-bold text-brand-dark/60 uppercase mb-1">Net Amount</p>
                                <p className="text-sm text-brand-dark/40">Excluding VAT</p>
                            </div>
                            <p className="text-2xl font-mono font-bold text-brand-dark">{formatCurrency(results.net)}</p>
                        </div>

                        {/* VAT */}
                        <div className="p-5 rounded-xl bg-brand-surface border border-brand-medium/20 flex justify-between items-center relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                            <div>
                                <p className="text-xs font-bold text-brand-dark/60 uppercase mb-1">VAT Amount</p>
                                <p className="text-sm text-brand-dark/40">At {customRate || rate}%</p>
                            </div>
                            <p className="text-2xl font-mono font-bold text-orange-600 dark:text-orange-400">{formatCurrency(results.vat)}</p>
                        </div>

                        {/* Gross */}
                        <div className={`p-5 rounded-xl border flex justify-between items-center transition-all ${operation === 'remove' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 scale-[1.02] shadow-sm' : 'bg-brand-surface border-brand-medium/20 opacity-70'}`}>
                            <div>
                                <p className="text-xs font-bold text-brand-dark/60 uppercase mb-1">Gross Amount</p>
                                <p className="text-sm text-brand-dark/40">Including VAT</p>
                            </div>
                            <p className="text-2xl font-mono font-bold text-brand-dark">{formatCurrency(results.gross)}</p>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 bg-brand-light/30 border-t border-brand-medium/10">
                    <div className="flex gap-3 text-xs text-brand-dark/60 justify-center">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span>Standard Rate (20%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <span>Reduced Rate (5%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-brand-dark"></div>
                            <span>Zero Rate (0%)</span>
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

export default VatCalculator;
