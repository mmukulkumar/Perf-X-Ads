
import React, { useState } from 'react';
import { Zap, Play, AlertCircle, CheckCircle, XCircle, RefreshCw, Smartphone, Monitor, Image as ImageIcon, Newspaper } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface TestResult {
  url: string;
  status: 'PASS' | 'FAIL';
  linkedAmpUrl?: string;
  errors: string[];
}

const AmpValidator = () => {
  const [input, setInput] = useState('');
  const [userAgent, setUserAgent] = useState('Googlebot Smartphone');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const handleTest = async () => {
    if (!input.trim()) {
        alert("Please enter at least one URL.");
        return;
    }
    if (!process.env.API_KEY) {
        alert("API Key not configured.");
        return;
    }

    const urls = input.split('\n').filter(u => u.trim().length > 0);
    if (urls.length > 100) {
        alert("Please limit to 100 URLs per test.");
        return;
    }

    setIsAnalyzing(true);
    setResults([]); 

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = 'gemini-2.5-flash';
        
        const prompt = `
            Act as the official AMP Project Validator. 
            Analyze the following URLs and simulate a validation report for Accelerated Mobile Pages (AMP).
            
            Context:
            - User Agent: ${userAgent}
            - Task: Check if URLs are valid AMP or contain a <link rel="amphtml"> tag pointing to a valid AMP version.
            - Verify: Disallowed tags, CSS size limits, boilerplate visibility, and required AMP markup.

            URLs to analyze:
            ${urls.map(u => `- ${u}`).join('\n')}

            Return ONLY a raw JSON array (no markdown) with objects containing:
            - "url": The input URL
            - "status": "PASS" or "FAIL"
            - "linkedAmpUrl": If the input URL is canonical, provide the discovered AMP URL. If input is AMP, same URL.
            - "errors": Array of strings listing specific AMP validation errors (e.g., "The tag 'img' is disallowed.", "CSS exceeds 75kb limit"). Empty if PASS.
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
            setResults(data);
        }
    } catch (error) {
        console.error("Analysis failed:", error);
        alert("Failed to generate report. Please try again.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const getUADescription = (ua: string) => {
      if (ua.includes('Smartphone')) return <span className="flex items-center gap-2"><Smartphone className="w-4 h-4" /> {ua}</span>;
      if (ua.includes('Images')) return <span className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> {ua}</span>;
      if (ua.includes('News')) return <span className="flex items-center gap-2"><Newspaper className="w-4 h-4" /> {ua}</span>;
      return <span className="flex items-center gap-2"><Monitor className="w-4 h-4" /> {ua}</span>;
  };

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* Tool Container */}
        <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-sm overflow-hidden">
            
            {/* Header */}
            <div className="p-8 border-b border-brand-medium/20">
                <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                    <Zap className="w-8 h-8 text-orange-500" />
                    Accelerated Mobile Pages (AMP) Validator
                </h2>
                <p className="text-brand-dark/70 leading-relaxed max-w-5xl text-sm">
                    Use this bulk validator to check if one or more URLs (up to 100) are valid Accelerated Mobile Pages (AMP). If a submitted URL is not AMP, the tool will look for an AMP URL linked to via the <code>rel="amphtml"</code> tag and test it. This testing tool simulates the official AMP Project validator logic.
                </p>
            </div>

            {/* Input Area */}
            <div className="p-8 bg-brand-light/20">
                <div className="flex flex-col lg:flex-row gap-6 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-brand-dark/60 uppercase mb-2">URLs (one per line)</label>
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            rows={6}
                            className="w-full p-4 bg-white dark:bg-brand-surface border border-brand-medium/40 rounded-xl text-brand-dark focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-mono text-sm resize-y"
                            placeholder="https://example.com/news/article-1&#10;https://example.com/blog/post-2"
                        />
                    </div>
                    
                    <div className="w-full lg:w-72 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-brand-dark/60 uppercase mb-2">User Agent</label>
                            <div className="relative">
                                <select 
                                    value={userAgent}
                                    onChange={(e) => setUserAgent(e.target.value)}
                                    className="w-full appearance-none bg-white dark:bg-brand-surface border border-brand-medium/40 text-brand-dark text-sm rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 block p-3.5 pr-8 transition-all"
                                >
                                    <option value="Googlebot Smartphone">Googlebot Smartphone</option>
                                    <option value="Googlebot Desktop">Googlebot Desktop</option>
                                    <option value="Googlebot News">Googlebot News</option>
                                    <option value="Googlebot Images">Googlebot Images</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-brand-dark/50">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleTest}
                            disabled={isAnalyzing}
                            className={`w-full px-6 py-3.5 bg-brand-dark text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${isAnalyzing ? 'opacity-70 cursor-wait' : 'hover:bg-brand-dark/90 active:scale-95'}`}
                        >
                            {isAnalyzing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                            TEST
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Area */}
            {results.length > 0 && (
                <div className="border-t border-brand-medium/30">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-brand-light/50 border-b border-brand-medium/20">
                                    <th className="p-4 text-xs font-bold text-brand-dark uppercase tracking-wider w-24">Status</th>
                                    <th className="p-4 text-xs font-bold text-brand-dark uppercase tracking-wider">URL Info</th>
                                    <th className="p-4 text-xs font-bold text-brand-dark uppercase tracking-wider">Validation Errors</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-medium/10">
                                {results.map((res, idx) => (
                                    <tr key={idx} className="hover:bg-brand-light/30 transition-colors">
                                        <td className="p-4 align-top">
                                            {res.status === 'PASS' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                                                    <CheckCircle className="w-3.5 h-3.5" /> PASS
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                                                    <XCircle className="w-3.5 h-3.5" /> FAIL
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium text-brand-dark break-all max-w-md">
                                                    {res.url}
                                                </div>
                                                {res.linkedAmpUrl && res.linkedAmpUrl !== res.url && (
                                                    <div className="flex items-center gap-1.5 text-xs text-brand-dark/60">
                                                        <Zap className="w-3 h-3 text-orange-500" />
                                                        Linked AMP: <a href={res.linkedAmpUrl} target="_blank" rel="noreferrer" className="hover:underline text-blue-600 break-all">{res.linkedAmpUrl}</a>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            {res.errors && res.errors.length > 0 ? (
                                                <ul className="space-y-1.5">
                                                    {res.errors.map((err, i) => (
                                                        <li key={i} className="text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                                                            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> 
                                                            <span>{err}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-xs text-green-600 dark:text-green-400 italic flex items-center gap-1.5">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Validation successful.
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AmpValidator;
