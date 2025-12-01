
import React, { useState, useEffect } from 'react';
import { Calculator, Building2, DollarSign, TrendingDown, Info, Search, Globe, Coins } from 'lucide-react';

const STATE_RATES: Record<string, number> = {
  "Alabama": 6.500,
  "Alaska": 9.400,
  "Arizona": 4.900,
  "Arkansas": 4.300,
  "California": 8.840,
  "Colorado": 4.400,
  "Connecticut": 7.500,
  "Delaware": 8.700,
  "District of Columbia": 8.250,
  "Florida": 5.500,
  "Georgia": 5.390,
  "Hawaii": 6.400,
  "Idaho": 5.695,
  "Illinois": 9.500,
  "Indiana": 4.900,
  "Iowa": 7.100,
  "Kansas": 6.500,
  "Kentucky": 5.000,
  "Louisiana": 5.500,
  "Maine": 8.930,
  "Maryland": 8.250,
  "Massachusetts": 8.000,
  "Michigan": 6.000,
  "Minnesota": 9.800,
  "Mississippi": 5.000,
  "Missouri": 4.000,
  "Montana": 6.750,
  "Nebraska": 5.200,
  "Nevada": 0.000,
  "New Hampshire": 7.500,
  "New Jersey": 11.500,
  "New Mexico": 5.900,
  "New York": 7.250,
  "North Carolina": 2.250,
  "North Dakota": 4.310,
  "Ohio": 0.000,
  "Oklahoma": 4.000,
  "Oregon": 7.600,
  "Pennsylvania": 7.990,
  "Rhode Island": 7.000,
  "South Carolina": 5.000,
  "South Dakota": 0.000,
  "Tennessee": 6.500,
  "Texas": 0.000,
  "Utah": 4.550,
  "Vermont": 8.500,
  "Virginia": 6.000,
  "Washington": 0.000,
  "West Virginia": 6.500,
  "Wisconsin": 7.900,
  "Wyoming": 0.000
};

const FEDERAL_RATE = 21.0;

const TRANSLATIONS = {
  en: {
    title: "US Corporate Tax Calculator",
    description: "Estimate federal and state corporate income taxes for 2025.",
    incomeLabel: "Annual Corporate Income",
    stateLabel: "State",
    searchPlaceholder: "Search state...",
    fedRateLabel: "Federal Tax Rate",
    stateRateLabel: "Tax Rate",
    summaryTitle: "Tax Summary",
    fedTax: "Federal Tax",
    stateTax: "State Tax",
    totalLiability: "Total Tax Liability",
    combined: "Combined",
    netIncome: "Net Income After Tax",
    effectiveRate: "Effective Tax Rate",
    tableTitle: "State Corporate Tax Rates Reference (2025)",
    disclaimer: "* Note: Tax rates are estimates based on 2025 projections. Some states may have graduated rates or gross receipts taxes not fully reflected here. Consult a tax professional for official filings."
  },
  es: {
    title: "Calculadora de Impuestos Corporativos EE. UU.",
    description: "Estime los impuestos sobre la renta corporativos federales y estatales para 2025.",
    incomeLabel: "Ingresos Corporativos Anuales",
    stateLabel: "Estado",
    searchPlaceholder: "Buscar estado...",
    fedRateLabel: "Tasa de Impuesto Federal",
    stateRateLabel: "Tasa de Impuesto",
    summaryTitle: "Resumen de Impuestos",
    fedTax: "Impuesto Federal",
    stateTax: "Impuesto Estatal",
    totalLiability: "Responsabilidad Fiscal Total",
    combined: "Combinado",
    netIncome: "Ingreso Neto Después de Impuestos",
    effectiveRate: "Tasa Impositiva Efectiva",
    tableTitle: "Referencia de Tasas Estatales (2025)",
    disclaimer: "* Nota: Las tasas son estimaciones basadas en proyecciones de 2025. Algunos estados pueden tener tasas graduadas. Consulte a un profesional para presentaciones oficiales."
  },
  fr: {
    title: "Calculateur d'Impôt Sociétés US",
    description: "Estimez les impôts sur le revenu des sociétés fédéraux et étatiques pour 2025.",
    incomeLabel: "Revenu Annuel de l'Entreprise",
    stateLabel: "État",
    searchPlaceholder: "Rechercher un état...",
    fedRateLabel: "Taux d'Impôt Fédéral",
    stateRateLabel: "Taux d'Impôt",
    summaryTitle: "Résumé Fiscal",
    fedTax: "Impôt Fédéral",
    stateTax: "Impôt d'État",
    totalLiability: "Obligation Fiscale Totale",
    combined: "Combiné",
    netIncome: "Revenu Net Après Impôt",
    effectiveRate: "Taux Effectif",
    tableTitle: "Référence des Taux par État (2025)",
    disclaimer: "* Note: Les taux sont des estimations pour 2025. Certains états peuvent avoir des taux progressifs. Consultez un fiscaliste pour les déclarations officielles."
  },
  de: {
    title: "US-Körperschaftsteuer-Rechner",
    description: "Schätzen Sie die Bundes- und Landeskörperschaftsteuern für 2025.",
    incomeLabel: "Jährliches Unternehmenseinkommen",
    stateLabel: "Staat",
    searchPlaceholder: "Staat suchen...",
    fedRateLabel: "Bundessteuersatz",
    stateRateLabel: "Steuersatz",
    summaryTitle: "Steuerübersicht",
    fedTax: "Bundessteuer",
    stateTax: "Landessteuer",
    totalLiability: "Gesamtsteuerschuld",
    combined: "Kombiniert",
    netIncome: "Nettoeinkommen nach Steuern",
    effectiveRate: "Effektiver Steuersatz",
    tableTitle: "Referenz für staatliche Steuersätze (2025)",
    disclaimer: "* Hinweis: Steuersätze sind Schätzungen für 2025. Einige Staaten haben möglicherweise gestaffelte Sätze. Konsultieren Sie einen Steuerberater."
  }
};

const CURRENCIES = {
  USD: { symbol: '$', locale: 'en-US', name: 'USD' },
  EUR: { symbol: '€', locale: 'de-DE', name: 'EUR' },
  GBP: { symbol: '£', locale: 'en-GB', name: 'GBP' },
  CAD: { symbol: 'C$', locale: 'en-CA', name: 'CAD' },
  AUD: { symbol: 'A$', locale: 'en-AU', name: 'AUD' },
  JPY: { symbol: '¥', locale: 'ja-JP', name: 'JPY' }
};

const CorporateTaxCalculator = () => {
  const [income, setIncome] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('California');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStateList, setShowStateList] = useState(false);
  
  // Localization State
  const [lang, setLang] = useState<keyof typeof TRANSLATIONS>('en');
  const [currency, setCurrency] = useState<keyof typeof CURRENCIES>('USD');

  const [results, setResults] = useState({
    federalTax: 0,
    stateTax: 0,
    totalTax: 0,
    netIncome: 0,
    effectiveRate: 0
  });

  const t = TRANSLATIONS[lang];
  const curr = CURRENCIES[currency];

  useEffect(() => {
    const numIncome = parseFloat(income) || 0;
    const stateRate = STATE_RATES[selectedState] || 0;

    const federalTax = numIncome * (FEDERAL_RATE / 100);
    const stateTax = numIncome * (stateRate / 100);
    const totalTax = federalTax + stateTax;
    const netIncome = numIncome - totalTax;
    const effectiveRate = numIncome > 0 ? (totalTax / numIncome) * 100 : 0;

    setResults({
      federalTax,
      stateTax,
      totalTax,
      netIncome,
      effectiveRate
    });
  }, [income, selectedState]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(curr.locale, { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(val);
  };

  const filteredStates = Object.keys(STATE_RATES).filter(state => 
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* Controls Header */}
        <div className="flex justify-end gap-3 mb-4">
            <div className="relative group">
                <div className="flex items-center gap-2 bg-brand-surface border border-brand-medium/30 rounded-lg px-3 py-1.5 cursor-pointer hover:border-brand-medium/60 transition-colors">
                    <Globe className="w-4 h-4 text-brand-dark/60" />
                    <span className="text-xs font-bold text-brand-dark uppercase">{lang}</span>
                </div>
                <div className="absolute right-0 top-full mt-2 bg-brand-surface border border-brand-medium/20 rounded-lg shadow-xl p-1 z-20 hidden group-hover:block min-w-[120px]">
                    {Object.keys(TRANSLATIONS).map((k) => (
                        <button 
                            key={k} 
                            onClick={() => setLang(k as keyof typeof TRANSLATIONS)}
                            className={`w-full text-left px-3 py-2 text-xs rounded-md hover:bg-brand-light transition-colors ${lang === k ? 'font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-brand-dark'}`}
                        >
                            {k === 'en' ? 'English' : k === 'es' ? 'Español' : k === 'fr' ? 'Français' : 'Deutsch'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative group">
                <div className="flex items-center gap-2 bg-brand-surface border border-brand-medium/30 rounded-lg px-3 py-1.5 cursor-pointer hover:border-brand-medium/60 transition-colors">
                    <Coins className="w-4 h-4 text-brand-dark/60" />
                    <span className="text-xs font-bold text-brand-dark">{currency}</span>
                </div>
                <div className="absolute right-0 top-full mt-2 bg-brand-surface border border-brand-medium/20 rounded-lg shadow-xl p-1 z-20 hidden group-hover:block min-w-[100px]">
                    {Object.keys(CURRENCIES).map((c) => (
                        <button 
                            key={c} 
                            onClick={() => setCurrency(c as keyof typeof CURRENCIES)}
                            className={`w-full text-left px-3 py-2 text-xs rounded-md hover:bg-brand-light transition-colors ${currency === c ? 'font-bold text-green-600 bg-green-50 dark:bg-green-900/30' : 'text-brand-dark'}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Input Section */}
          <div className="w-full lg:w-5/12 bg-brand-surface p-6 md:p-8 rounded-2xl border border-brand-medium/30 shadow-sm h-fit">
             <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold text-lg border-b border-brand-medium/10 pb-4">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3>{t.title}</h3>
             </div>
             <p className="text-brand-dark/60 text-sm mb-6">{t.description}</p>
             
             <div className="space-y-6">
                <div>
                   <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-2">{t.incomeLabel} ({curr.symbol})</label>
                   <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40 font-bold">{curr.symbol}</span>
                       <input 
                          type="number" 
                          value={income}
                          onChange={(e) => setIncome(e.target.value)}
                          placeholder="500000" 
                          className="w-full pl-9 pr-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                       />
                   </div>
                </div>

                <div className="relative">
                   <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-2">{t.stateLabel}</label>
                   <button 
                      onClick={() => setShowStateList(!showStateList)}
                      className="w-full px-4 py-3 bg-brand-light/30 dark:bg-brand-surface/50 border border-brand-medium/40 rounded-lg text-brand-dark text-left flex justify-between items-center hover:border-blue-500/50 transition-all"
                   >
                      <span>{selectedState} ({STATE_RATES[selectedState].toFixed(3)}%)</span>
                      <Search className="w-4 h-4 text-brand-dark/40" />
                   </button>
                   
                   {showStateList && (
                       <div className="absolute top-full left-0 right-0 mt-2 bg-brand-surface border border-brand-medium/20 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                           <div className="p-2 sticky top-0 bg-brand-surface border-b border-brand-medium/10">
                               <input 
                                  type="text" 
                                  placeholder={t.searchPlaceholder}
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  className="w-full px-3 py-2 bg-brand-light/50 rounded-md text-sm outline-none border border-transparent focus:border-blue-500/30 text-brand-dark"
                                  autoFocus
                               />
                           </div>
                           {filteredStates.map(state => (
                               <button
                                  key={state}
                                  onClick={() => {
                                      setSelectedState(state);
                                      setShowStateList(false);
                                      setSearchTerm('');
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-brand-light/50 flex justify-between items-center text-brand-dark"
                               >
                                   <span>{state}</span>
                                   <span className="text-brand-dark/50 font-mono text-xs">{STATE_RATES[state].toFixed(3)}%</span>
                               </button>
                           ))}
                       </div>
                   )}
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                    <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-brand-dark/70">{t.fedRateLabel}</span>
                        <span className="font-bold text-brand-dark">21.00%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-brand-dark/70">{selectedState} {t.stateRateLabel}</span>
                        <span className="font-bold text-brand-dark">{STATE_RATES[selectedState].toFixed(3)}%</span>
                    </div>
                </div>
             </div>
          </div>

          {/* Results Column */}
          <div className="w-full lg:w-7/12">
             <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-xl overflow-hidden sticky top-24">
                <div className="p-6 md:p-8 bg-brand-light border-b border-brand-medium/20">
                    <div className="flex items-center gap-2 mb-6 text-brand-dark font-bold">
                       <Calculator className="w-5 h-5 text-blue-600" />
                       <h3>{t.summaryTitle}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-brand-surface rounded-xl border border-brand-medium/20">
                            <p className="text-xs font-bold text-brand-dark/60 uppercase mb-1">{t.fedTax}</p>
                            <p className="text-lg font-bold text-brand-dark">{formatCurrency(results.federalTax)}</p>
                            <p className="text-[10px] text-brand-dark/40">Rate: 21%</p>
                        </div>
                        <div className="p-4 bg-brand-surface rounded-xl border border-brand-medium/20">
                            <p className="text-xs font-bold text-brand-dark/60 uppercase mb-1">{t.stateTax}</p>
                            <p className="text-lg font-bold text-brand-dark">{formatCurrency(results.stateTax)}</p>
                            <p className="text-[10px] text-brand-dark/40">Rate: {STATE_RATES[selectedState].toFixed(3)}%</p>
                        </div>
                        <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-100 dark:border-red-800">
                            <p className="text-xs font-bold text-red-800 dark:text-red-300 uppercase mb-1">{t.totalLiability}</p>
                            <p className="text-lg font-bold text-red-700 dark:text-red-400">{formatCurrency(results.totalTax)}</p>
                            <p className="text-[10px] text-red-800/60 dark:text-red-300/60">{t.combined}</p>
                        </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-6 border border-green-100 dark:border-green-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <p className="text-sm font-medium text-green-900 dark:text-green-300 mb-1">{t.netIncome}</p>
                            <div className="text-3xl font-extrabold text-green-700 dark:text-green-400">{formatCurrency(results.netIncome)}</div>
                        </div>
                        <div className="text-right bg-white dark:bg-brand-surface px-4 py-2 rounded-lg border border-green-200 dark:border-green-800/50">
                            <p className="text-xs text-brand-dark/50 uppercase font-bold mb-1">{t.effectiveRate}</p>
                            <p className="text-xl font-bold text-brand-dark">{results.effectiveRate.toFixed(2)}%</p>
                        </div>
                    </div>
                </div>

                {/* State Reference Table */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-brand-dark flex items-center gap-2">
                            <Info className="w-4 h-4 text-brand-medium" /> {t.tableTitle}
                        </h4>
                    </div>
                    <div className="border border-brand-medium/20 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-brand-light sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 font-bold text-brand-dark border-b border-brand-medium/20">{t.stateLabel}</th>
                                    <th className="px-4 py-2 font-bold text-brand-dark border-b border-brand-medium/20 text-right">{t.stateRateLabel}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-medium/10">
                                {Object.entries(STATE_RATES).map(([state, rate]) => (
                                    <tr 
                                        key={state} 
                                        className={`hover:bg-brand-light/30 transition-colors cursor-pointer ${selectedState === state ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                                        onClick={() => setSelectedState(state)}
                                    >
                                        <td className="px-4 py-2 text-brand-dark/80">{state}</td>
                                        <td className="px-4 py-2 text-brand-dark font-mono text-right">{rate.toFixed(3)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-[10px] text-brand-dark/40 mt-3 text-center">
                        {t.disclaimer}
                    </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CorporateTaxCalculator;
