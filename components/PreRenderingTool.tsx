
import React, { useState } from 'react';
import { Split, Play, Globe, Bot, FileCode, AlertTriangle, CheckCircle, Info, ArrowRightLeft } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface RenderResult {
  isDynamicRendering: boolean;
  differenceScore: number; // 0-100
  summary: string;
  userView: {
    title: string;
    contentLength: string;
    htmlSnippet: string;
  };
  botView: {
    title: string;
    contentLength: string;
    htmlSnippet: string;
  };
  keyDifferences: string[];
}

const PreRenderingTool = () => {
  const [url, setUrl] = useState('');
  const [userAgent, setUserAgent] = useState('Googlebot Smartphone');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<RenderResult | null>(null);

  const handleTest = async () => {
    if (!url.trim()) {
        alert("Please enter a URL.");
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
            Act as a Technical SEO Pre-rendering Validator.
            Target URL: ${url}
            Target Bot User Agent: ${userAgent}
            Comparison User Agent: Standard Chrome Desktop Browser

            Task: Simulate fetching the URL with both the Bot User Agent and the Standard Browser. Compare the HTML responses to detect "Dynamic Rendering" or "Pre-rendering" (where bots are served different static HTML than users).

            Analyze for:
            1. Differences in critical content (Titles, H1s, main body text).
            2. Differences in JavaScript dependency (does the bot get fully rendered HTML while the user gets a JS shell?).
            3. Meta tag discrepancies.

            Return a raw JSON object (no markdown) with this structure:
            {
              "isDynamicRendering": boolean, // true if significant intentional differences detected
              "differenceScore": number, // 0 to 100 (0 = identical, 100 = completely different)
              "summary": "Brief explanation of findings...",
              "userView": {
                "title": "Page Title seen by user",
                "contentLength": "Estimated character count",
                "htmlSnippet": "First ~300 chars of HTML body"
              },
              "botView": {
                "title": "Page Title seen by bot",
                "contentLength": "Estimated character count",
                "htmlSnippet": "First ~300 chars of HTML body"
              },
              "keyDifferences": ["List of specific differences found, e.g. 'Bot received pre-rendered static HTML', 'User received JS app shell'"]
            }
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
            setResult(data);
        }
    } catch (error) {
        console.error("Analysis failed:", error);
        alert("Analysis failed. Please try again.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* Tool Header */}
        <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-sm overflow-hidden mb-8">
            <div className="px-8 py-6 border-b border-brand-medium/20 bg-brand-light/10">
                <h2 className="text-2xl font-bold text-brand-dark flex items-center gap-3">
                    <Split className="w-7 h-7 text-brand-primary" />
                    Pre-rendering Testing Tool
                </h2>
            </div>
            
            <div className="p-8">
                <p className="text-brand-dark/70 mb-8 text-sm leading-relaxed max-w-4xl">
                    HTML snapshots, pre-rendering, dynamic rendering... regardless the name and specifics of the implementation, the result is usually a different HTML response based on the user agent making the request. Use this tool to check what content is being served to different user agents.
                </p>

                <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-brand-dark/60 uppercase mb-2">URL</label>
                        <input 
                            type="text" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com" 
                            className="w-full px-4 py-3 bg-white dark:bg-brand-surface border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                        />
                    </div>

                    <div className="w-full md:w-72">
                        <label className="block text-xs font-bold text-brand-dark/60 uppercase mb-2">User Agent</label>
                        <select 
                            value={userAgent}
                            onChange={(e) => setUserAgent(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-brand-surface border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                        >
                            <option>Googlebot Smartphone</option>
                            <option>Googlebot Desktop</option>
                            <option>Bingbot</option>
                            <option>Facebook Crawler</option>
                            <option>Twitterbot</option>
                        </select>
                    </div>

                    <button 
                        onClick={handleTest}
                        disabled={isAnalyzing}
                        className={`px-8 py-3 bg-brand-dark dark:bg-purple-600 text-white font-bold rounded-lg shadow-md transition-all flex items-center gap-2 h-[48px] whitespace-nowrap ${isAnalyzing ? 'opacity-70 cursor-wait' : 'hover:bg-brand-dark/90 dark:hover:bg-purple-700 active:scale-95'}`}
                    >
                        {isAnalyzing ? <ArrowRightLeft className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                        TEST
                    </button>
                </div>
            </div>
        </div>

        {/* Results Area */}
        {result && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                
                {/* Status Card */}
                <div className={`rounded-2xl border p-6 flex items-start gap-4 ${result.isDynamicRendering ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-brand-surface border-brand-medium/30'}`}>
                    <div className={`p-3 rounded-full shrink-0 ${result.isDynamicRendering ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                        {result.isDynamicRendering ? <Split className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-brand-dark mb-1">
                            {result.isDynamicRendering ? 'Dynamic Rendering / Pre-rendering Detected' : 'No Significant Differences Detected'}
                        </h3>
                        <p className="text-brand-dark/70 text-sm leading-relaxed">
                            {result.summary}
                        </p>
                        <div className="mt-4 flex gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-dark/5 text-brand-dark border border-brand-dark/10">
                                Difference Score: {result.differenceScore}/100
                            </span>
                        </div>
                    </div>
                </div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* User View */}
                    <div className="bg-brand-surface rounded-xl border border-brand-medium/30 overflow-hidden">
                        <div className="bg-brand-light/30 px-4 py-3 border-b border-brand-medium/20 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-green-600" />
                            <span className="font-bold text-sm text-brand-dark">Standard User (Browser)</span>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <span className="text-xs font-bold text-brand-dark/50 uppercase block mb-1">Page Title</span>
                                <p className="text-sm font-medium text-brand-dark">{result.userView.title}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-brand-dark/50 uppercase block mb-1">Content Length</span>
                                <p className="text-sm text-brand-dark">{result.userView.contentLength} characters</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-brand-dark/50 uppercase block mb-1">Raw HTML Snippet</span>
                                <div className="bg-brand-light/20 p-3 rounded-lg border border-brand-medium/10 font-mono text-xs text-brand-dark/70 break-all max-h-32 overflow-y-auto">
                                    {result.userView.htmlSnippet}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bot View */}
                    <div className="bg-brand-surface rounded-xl border border-brand-medium/30 overflow-hidden">
                        <div className="bg-brand-light/30 px-4 py-3 border-b border-brand-medium/20 flex items-center gap-2">
                            <Bot className="w-4 h-4 text-purple-600" />
                            <span className="font-bold text-sm text-brand-dark">{userAgent}</span>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <span className="text-xs font-bold text-brand-dark/50 uppercase block mb-1">Page Title</span>
                                <p className="text-sm font-medium text-brand-dark">{result.botView.title}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-brand-dark/50 uppercase block mb-1">Content Length</span>
                                <p className="text-sm text-brand-dark">{result.botView.contentLength} characters</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-brand-dark/50 uppercase block mb-1">Raw HTML Snippet</span>
                                <div className="bg-brand-light/20 p-3 rounded-lg border border-brand-medium/10 font-mono text-xs text-brand-dark/70 break-all max-h-32 overflow-y-auto">
                                    {result.botView.htmlSnippet}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Differences */}
                {result.keyDifferences.length > 0 && (
                    <div className="bg-brand-surface rounded-xl border border-brand-medium/30 p-6">
                        <h4 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                            Key Differences Observed
                        </h4>
                        <ul className="space-y-2">
                            {result.keyDifferences.map((diff, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-brand-dark/80">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                                    {diff}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

            </div>
        )}

      </div>
    </div>
  );
};

export default PreRenderingTool;
