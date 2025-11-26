
import React, { useState } from 'react';
import { Search, Code, Smartphone, Monitor, CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp, Play, RefreshCw, Globe, FileCode, ArrowRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface SchemaItem {
  type: string;
  status: 'Valid' | 'Warning' | 'Error';
  itemsDetected: number;
  issues: string[];
}

interface TestResult {
  eligible: boolean;
  statusMessage: string;
  detectedItems: SchemaItem[];
  rawSource?: string;
}

const RichResultsTest = () => {
  const [mode, setMode] = useState<'url' | 'code'>('url');
  const [input, setInput] = useState('');
  const [userAgent, setUserAgent] = useState<'smartphone' | 'desktop'>('smartphone');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) {
        alert(mode === 'url' ? "Please enter a URL" : "Please enter code");
        return;
    }
    if (!process.env.API_KEY) {
        alert("API Key not configured.");
        return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = 'gemini-2.5-flash';
        
        const prompt = `
            Act as Google's Rich Results Test validator.
            
            Input Type: ${mode.toUpperCase()}
            User Agent: ${userAgent === 'smartphone' ? 'Googlebot Smartphone' : 'Googlebot Desktop'}
            Input Data:
            ${input}

            Task: Analyze the input for Schema.org structured data (JSON-LD, Microdata, or RDFa). 
            Determine if the page/code is eligible for Rich Results (e.g., Product, Article, Breadcrumb, FAQ, Recipe, Event).
            
            Strictly validate against Google's specific requirements for Rich Snippets.
            
            Return a JSON object with this exact structure:
            {
              "eligible": boolean, // true if at least one valid item exists
              "statusMessage": "Page is eligible for rich results" or "Page is not eligible for rich results",
              "detectedItems": [
                {
                  "type": "Product", // e.g., Article, Breadcrumbs, Merchant listings
                  "status": "Valid" | "Warning" | "Error",
                  "itemsDetected": 1,
                  "issues": ["Missing field 'price'", "Property 'image' is recommended"] // Empty if valid
                }
              ]
            }
            
            Return ONLY raw JSON.
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        const text = response.text;
        if (text) {
            const data = JSON.parse(text);
            setResult({
                ...data,
                rawSource: mode === 'code' ? input : undefined
            });
        }
    } catch (error) {
        console.error("Analysis failed:", error);
        alert("Validation failed. Please try again.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* Main Tool Container */}
        <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-sm overflow-hidden mb-8">
            
            {/* Header Section */}
            <div className="bg-[#455A64] text-white px-8 py-10 text-center">
                <h2 className="text-3xl font-light mb-2">Rich Results Test</h2>
                <p className="text-white/70 font-light text-lg">Does your page support rich results?</p>
            </div>

            {/* Input Section */}
            <div className="p-8">
                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-brand-light/50 p-1 rounded-xl border border-brand-medium/20">
                        <button 
                            onClick={() => setMode('url')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${mode === 'url' ? 'bg-white shadow-sm text-brand-dark' : 'text-brand-dark/60 hover:text-brand-dark'}`}
                        >
                            <Globe className="w-4 h-4" /> URL
                        </button>
                        <button 
                            onClick={() => setMode('code')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${mode === 'code' ? 'bg-white shadow-sm text-brand-dark' : 'text-brand-dark/60 hover:text-brand-dark'}`}
                        >
                            <Code className="w-4 h-4" /> CODE
                        </button>
                    </div>
                </div>

                {/* Input Field */}
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="relative">
                        {mode === 'url' ? (
                            <div className="relative">
                                <Globe className="absolute left-4 top-4 w-5 h-5 text-brand-medium" />
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Enter a URL to test" 
                                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-brand-surface border border-brand-medium/40 rounded-xl text-brand-dark focus:ring-2 focus:ring-[#455A64]/20 focus:border-[#455A64] outline-none transition-all shadow-sm"
                                />
                            </div>
                        ) : (
                            <div className="relative">
                                <FileCode className="absolute left-4 top-4 w-5 h-5 text-brand-medium" />
                                <textarea 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    rows={8}
                                    placeholder="Paste your HTML or JSON-LD code here..." 
                                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-brand-surface border border-brand-medium/40 rounded-xl text-brand-dark focus:ring-2 focus:ring-[#455A64]/20 focus:border-[#455A64] outline-none transition-all shadow-sm font-mono text-sm"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-brand-dark/60">
                            <span className="font-medium">User Agent:</span>
                            <div className="relative">
                                <select 
                                    value={userAgent}
                                    onChange={(e) => setUserAgent(e.target.value as 'smartphone' | 'desktop')}
                                    className="appearance-none bg-transparent font-bold text-brand-dark pr-6 cursor-pointer focus:outline-none"
                                >
                                    <option value="smartphone">Googlebot Smartphone</option>
                                    <option value="desktop">Googlebot Desktop</option>
                                </select>
                                {userAgent === 'smartphone' ? (
                                    <Smartphone className="absolute right-0 top-0.5 w-4 h-4 pointer-events-none text-brand-medium" />
                                ) : (
                                    <Monitor className="absolute right-0 top-0.5 w-4 h-4 pointer-events-none text-brand-medium" />
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className={`px-8 py-3 bg-[#455A64] text-white font-bold rounded-lg shadow-md transition-all flex items-center gap-2 ${isAnalyzing ? 'opacity-70 cursor-wait' : 'hover:bg-[#37474F] active:scale-95'}`}
                        >
                            {isAnalyzing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                            TEST {mode === 'url' ? 'URL' : 'CODE'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Info Section - Visible when no result */}
            {!result && !isAnalyzing && (
                <div className="px-8 pb-12 mt-4 border-t border-brand-medium/10 pt-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <h3 className="text-lg font-medium text-brand-dark mb-4">What are rich results?</h3>
                            <p className="text-brand-dark/70 text-sm leading-relaxed">
                                Rich results are experiences on Google surfaces, such as Search, that go beyond the standard blue link. Rich results can include carousels, images or other non-textual elements.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-brand-dark mb-4">What is this test?</h3>
                            <p className="text-brand-dark/70 text-sm leading-relaxed mb-4">
                                Test your publicly accessible page to see which rich results can be generated by the structured data it contains.
                            </p>
                            <a href="https://support.google.com/webmasters/answer/7445569" target="_blank" rel="noreferrer" className="inline-flex items-center text-xs font-bold text-[#455A64] hover:text-brand-primary hover:underline uppercase tracking-wider transition-colors">
                                LEARN MORE <ArrowRight className="w-4 h-4 ml-1" />
                            </a>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-brand-dark mb-4">Structured data gallery</h3>
                            <p className="text-brand-dark/70 text-sm leading-relaxed mb-4">
                                Reference documentation for Google-supported structured data.
                            </p>
                            <a href="https://developers.google.com/search/docs/appearance/structured-data/search-gallery" target="_blank" rel="noreferrer" className="inline-flex items-center text-xs font-bold text-[#455A64] hover:text-brand-primary hover:underline uppercase tracking-wider transition-colors">
                                READ THE DOCS <ArrowRight className="w-4 h-4 ml-1" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Results Section */}
        {result && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Status Banner */}
                <div className={`bg-brand-surface rounded-xl border-l-8 p-6 mb-6 shadow-sm flex items-start gap-4 ${result.eligible ? 'border-green-500' : 'border-red-500'}`}>
                    <div className={`mt-1 ${result.eligible ? 'text-green-600' : 'text-red-600'}`}>
                        {result.eligible ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-brand-dark mb-1">{result.statusMessage}</h3>
                        <p className="text-brand-dark/60 text-sm">
                            {result.eligible 
                                ? "Your page is eligible for rich results in Google Search." 
                                : "Some rich results may not be eligible for Google Search."}
                        </p>
                    </div>
                </div>

                {/* Detected Items */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-brand-surface rounded-xl border border-brand-medium/30 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-brand-medium/20 bg-brand-light/30">
                                <h4 className="font-bold text-brand-dark text-sm uppercase tracking-wide">Detected Items</h4>
                            </div>
                            <div className="divide-y divide-brand-medium/10">
                                {result.detectedItems.map((item, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setExpandedItem(expandedItem === idx ? null : idx)}
                                        className={`w-full text-left px-6 py-4 flex items-center justify-between hover:bg-brand-light/50 transition-colors ${expandedItem === idx ? 'bg-brand-light/50' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.status === 'Valid' && <CheckCircle className="w-5 h-5 text-green-500" />}
                                            {item.status === 'Warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                                            {item.status === 'Error' && <XCircle className="w-5 h-5 text-red-500" />}
                                            <div>
                                                <span className="font-bold text-brand-dark text-sm block">{item.type}</span>
                                                <span className="text-xs text-brand-dark/50">{item.itemsDetected} item{item.itemsDetected !== 1 ? 's' : ''}</span>
                                            </div>
                                        </div>
                                        {expandedItem === idx ? <ChevronUp className="w-4 h-4 text-brand-medium" /> : <ChevronDown className="w-4 h-4 text-brand-medium" />}
                                    </button>
                                ))}
                                {result.detectedItems.length === 0 && (
                                    <div className="p-6 text-center text-brand-dark/50 text-sm">
                                        No structured data detected.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        {expandedItem !== null ? (
                            <div className="bg-brand-surface rounded-xl border border-brand-medium/30 shadow-sm p-6 animate-in fade-in duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                                        {result.detectedItems[expandedItem].type}
                                        <span className={`text-xs px-2 py-0.5 rounded border ${
                                            result.detectedItems[expandedItem].status === 'Valid' ? 'bg-green-50 text-green-700 border-green-200' :
                                            result.detectedItems[expandedItem].status === 'Warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                            'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                            {result.detectedItems[expandedItem].status}
                                        </span>
                                    </h4>
                                </div>

                                {result.detectedItems[expandedItem].issues.length > 0 ? (
                                    <div className="space-y-3">
                                        {result.detectedItems[expandedItem].issues.map((issue, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-brand-light/30 border border-brand-medium/20">
                                                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                                                <span className="text-sm text-brand-dark/80">{issue}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <CheckCircle className="w-12 h-12 text-green-500 mb-3 opacity-50" />
                                        <p className="text-brand-dark font-medium">No issues detected</p>
                                        <p className="text-brand-dark/50 text-sm mt-1">This item is valid and eligible for rich results.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-brand-surface/50 border border-brand-medium/20 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center h-full">
                                <Search className="w-12 h-12 text-brand-medium/50 mb-4" />
                                <p className="text-brand-dark/60 font-medium">Select an item from the list to view details</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        )}

      </div>
    </div>
  );
};

export default RichResultsTest;
