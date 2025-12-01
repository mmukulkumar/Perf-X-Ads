
import React, { useState } from 'react';
import { Smartphone, Monitor, Search, RefreshCw, AlertTriangle, CheckCircle, FileText, Settings, ArrowRight, Globe, Info } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useAuth } from '../contexts/AuthContext';

const MobileFirstIndexTool = () => {
  const { consumeCredits } = useAuth();
  const [url, setUrl] = useState('');
  const [userAgent, setUserAgent] = useState('Googlebot Smartphone');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url) {
        alert("Please enter a URL");
        return;
    }
    
    // CREDIT CHECK: Medium Cost Tool (10 Credits)
    if (!consumeCredits(10)) return;

    if (!process.env.API_KEY) {
        alert("API Key not configured.");
        return;
    }

    setIsAnalyzing(true);
    setReport(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = 'gemini-2.5-flash';
        
        const prompt = `
            Act as a Senior Technical SEO Specialist. Perform a simulated Mobile-First Indexing audit for the website: ${url}.
            User Agent Context: ${userAgent}.

            Provide a comprehensive, structured report. Use the following format (Markdown):

            ## 📱 Mobile-First Readiness Score: [Estimate High/Medium/Low based on domain type]

            ### 1. Executive Summary
            [Brief overview of what this site typically looks like and common mobile pitfalls for this industry]

            ### 2. Technical Parity Check
            *   **Canonical Tags:** [Advice on self-referencing mobile canoncials]
            *   **Meta Robots:** [Check for consistent index/noindex tags]
            *   **Hreflang:** [Consistency check advice]

            ### 3. Content & Metadata
            *   **Headlines & Copy:** [Ensure H1s match on mobile/desktop]
            *   **Images & Media:** [Alt text and quality checks]
            *   **Structured Data:** [Schema markup parity advice]

            ### 4. Performance & UX Signals
            *   **Core Web Vitals:** [General advice on LCP/CLS for mobile]
            *   **Tap Targets:** [UX sizing advice]

            ### 5. Action Plan
            [Bulleted list of 3-5 immediate steps to ensure mobile-first compliance]

            *Disclaimer: This is an AI-generated simulation based on best practices for the provided URL structure. For a live technical crawl, use Google Search Console.*
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        setReport(response.text || "No analysis generated.");
    } catch (error) {
        console.error("Analysis failed:", error);
        setReport("Failed to generate report. Please check your API key or try again later.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  // Simple Markdown renderer since we don't have a library imported in the examples
  const FormattedReport = ({ text }: { text: string }) => {
    return (
        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-brand-dark">
            {text.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-6 mb-3 text-blue-600 dark:text-blue-400">{line.replace('## ', '')}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-5 mb-2 text-brand-dark">{line.replace('### ', '')}</h3>;
                if (line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-brand-dark/80 mb-1">{line.replace('* ', '')}</li>;
                if (line.startsWith('**')) return <p key={i} className="font-bold mt-2 mb-1">{line.replace(/\*\*/g, '')}</p>;
                return <p key={i} className="mb-2 leading-relaxed text-brand-dark/80">{line}</p>;
            })}
        </div>
    );
  };

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* Tool Header */}
        <div className="bg-brand-surface p-8 rounded-2xl border border-brand-medium/30 shadow-sm mb-8">
            <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                    <Smartphone className="w-8 h-8 text-blue-600" />
                    Mobile-First Index Tool
                </h2>
                <p className="text-brand-dark/70 leading-relaxed mb-6">
                    Is your site ready for Google's mobile-first index? This tool helps you prepare by analyzing discrepancies between your mobile and desktop signals (canonical, meta robots, structured data) and providing a readiness assessment.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-2">
                    <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5" /> Content Parity
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg text-xs font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5" /> Structured Data
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-lg text-xs font-medium text-purple-700 dark:text-purple-300 flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5" /> Technical Signals
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
            {/* Input Section */}
            <div className="w-full lg:w-1/3 space-y-6">
                <div className="bg-brand-surface p-6 rounded-2xl border border-brand-medium/30 shadow-sm">
                    <h3 className="font-bold text-brand-dark mb-6 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-brand-medium" /> Test Configuration
                    </h3>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-2">Primary / Desktop URL</label>
                            <div className="relative">
                                <input 
                                    type="url" 
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://example.com" 
                                    className="w-full pl-9 pr-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                />
                                <Globe className="absolute left-3 top-3 w-4 h-4 text-brand-medium" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-2">User Agent</label>
                            <div className="relative">
                                <select 
                                    value={userAgent}
                                    onChange={(e) => setUserAgent(e.target.value)}
                                    className="w-full pl-9 pr-4 py-3 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm appearance-none"
                                >
                                    <option>Googlebot Smartphone</option>
                                    <option>Googlebot Desktop</option>
                                    <option>iPhone X</option>
                                    <option>Samsung Galaxy</option>
                                </select>
                                <Smartphone className="absolute left-3 top-3 w-4 h-4 text-brand-medium pointer-events-none" />
                            </div>
                        </div>

                        <button 
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !url}
                            className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md ${isAnalyzing ? 'bg-brand-medium cursor-wait' : 'bg-brand-dark dark:bg-blue-600 hover:bg-brand-dark/90 dark:hover:bg-blue-700 active:scale-95'}`}
                        >
                            {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            {isAnalyzing ? 'Analyzing...' : 'TEST URL'}
                        </button>
                    </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                    <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4" /> Mobile-First Tips
                    </h4>
                    <ul className="space-y-2 text-sm text-blue-900/70 dark:text-blue-200/70">
                        <li className="flex gap-2">• Ensure primary content is identical on mobile & desktop.</li>
                        <li className="flex gap-2">• Verify structured data is present on mobile version.</li>
                        <li className="flex gap-2">• Check that meta robots tags allow indexing on mobile.</li>
                        <li className="flex gap-2">• Ensure images have alt text and are high quality on mobile.</li>
                    </ul>
                </div>
            </div>

            {/* Results Section */}
            <div className="w-full lg:w-2/3">
                <div className="bg-brand-surface p-8 rounded-2xl border border-brand-medium/30 shadow-sm min-h-[500px]">
                    {report ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-brand-medium/20">
                                <div>
                                    <h3 className="text-xl font-bold text-brand-dark">Analysis Report</h3>
                                    <p className="text-sm text-brand-dark/60 mt-1">Target: <span className="font-mono text-blue-600">{url}</span></p>
                                </div>
                                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Complete
                                </div>
                            </div>
                            <FormattedReport text={report} />
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-60">
                            <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mb-6">
                                <Monitor className="w-10 h-10 text-brand-medium" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-2">Ready to Test</h3>
                            <p className="max-w-sm text-brand-dark/70">
                                Enter a URL to simulate a Mobile-First Indexing audit. Our AI will analyze potential issues based on the domain type and best practices.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFirstIndexTool;
