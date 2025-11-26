
import React, { useState, useRef } from 'react';
import { Smartphone, Play, Download, Upload, AlertCircle, CheckCircle, XCircle, RefreshCw, FileJson } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface TestResult {
  url: string;
  status: 'Pass' | 'Fail' | 'Warning';
  score: number;
  issues: string[];
}

const MobileFriendlyTest = () => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (urls.length > 50) {
        alert("Please limit to 50 URLs per test.");
        return;
    }

    setIsAnalyzing(true);
    setResults([]); // Clear previous results

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = 'gemini-2.5-flash';
        
        const prompt = `
            Act as a Google Mobile-Friendly Test validator. 
            Analyze the following URLs and simulate a mobile usability report for each.
            
            URLs to analyze:
            ${urls.map(u => `- ${u}`).join('\n')}

            For each URL, determine if it is likely "Mobile Friendly" based on its domain type and standard modern web practices.
            Identify potential common issues like "Clickable elements too close together", "Text too small to read", "Content wider than screen", or "Viewport not set".

            Return ONLY a raw JSON array (no markdown formatting) with objects containing:
            - "url": The URL analyzed
            - "status": "Pass" or "Fail"
            - "score": Integer 0-100 representing mobile readiness
            - "issues": Array of strings listing specific errors (empty if Pass)
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

  const handleExport = () => {
    if (results.length === 0) return;
    const dataStr = JSON.stringify(results, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "mobile-friendly-results.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const json = JSON.parse(event.target?.result as string);
            if (Array.isArray(json)) {
                setResults(json);
            } else {
                alert("Invalid JSON format. Expected an array of results.");
            }
        } catch (err) {
            alert("Failed to parse JSON file.");
        }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* Tool Container */}
        <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-sm overflow-hidden">
            
            {/* Header */}
            <div className="p-8 border-b border-brand-medium/20">
                <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                    <Smartphone className="w-8 h-8 text-blue-600" />
                    Mobile-Friendly Test (Bulk Testing Tool)
                </h2>
                <p className="text-brand-dark/70 leading-relaxed max-w-4xl">
                    Using Google's API criteria (simulated via AI), check if your pages are mobile-friendly or if they have mobile-usability errors. Bulk Mobile-Friendly test, up to 50 URLs at the time.
                </p>
            </div>

            {/* Input Area */}
            <div className="p-8 bg-brand-light/20">
                <label className="block text-sm font-bold text-brand-dark mb-2 text-red-600">URLs (one per line)</label>
                <div className="flex flex-col md:flex-row gap-4 items-start">
                    <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        rows={6}
                        className="flex-1 w-full p-4 bg-white dark:bg-brand-surface border border-brand-medium/40 rounded-xl text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono text-sm resize-y"
                        placeholder="https://example.com&#10;https://example.com/blog&#10;https://example.com/contact"
                    />
                    <button 
                        onClick={handleTest}
                        disabled={isAnalyzing}
                        className={`px-8 py-4 bg-brand-dark text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap ${isAnalyzing ? 'opacity-70 cursor-wait' : 'hover:bg-brand-dark/90 active:scale-95'}`}
                    >
                        {isAnalyzing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                        TEST
                    </button>
                </div>

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-brand-medium/20 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
                            <Upload className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-brand-dark">Saved results (.json)</p>
                            <p className="text-xs text-brand-dark/50">Upload previous test data</p>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden"
                            accept=".json"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={handleImportClick}
                            className="px-6 py-2.5 bg-brand-surface border border-brand-medium/30 text-brand-dark font-bold text-sm rounded-lg hover:bg-brand-light transition-colors"
                        >
                            IMPORT
                        </button>
                        <button 
                            onClick={handleExport}
                            disabled={results.length === 0}
                            className="px-6 py-2.5 bg-brand-surface border border-brand-medium/30 text-brand-dark font-bold text-sm rounded-lg hover:bg-brand-light transition-colors disabled:opacity-50"
                        >
                            EXPORT
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
                                    <th className="p-4 text-xs font-bold text-brand-dark uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-bold text-brand-dark uppercase tracking-wider">URL</th>
                                    <th className="p-4 text-xs font-bold text-brand-dark uppercase tracking-wider">Score</th>
                                    <th className="p-4 text-xs font-bold text-brand-dark uppercase tracking-wider">Issues Detected</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-medium/10">
                                {results.map((res, idx) => (
                                    <tr key={idx} className="hover:bg-brand-light/30 transition-colors">
                                        <td className="p-4">
                                            {res.status === 'Pass' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Mobile Friendly
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                                                    <XCircle className="w-3.5 h-3.5" /> Not Friendly
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm font-mono text-brand-dark break-all max-w-xs">
                                            <a href={res.url} target="_blank" rel="noreferrer" className="hover:underline hover:text-blue-600">{res.url}</a>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-brand-dark">{res.score}/100</span>
                                                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${res.score >= 80 ? 'bg-green-500' : res.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                                        style={{ width: `${res.score}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {res.issues && res.issues.length > 0 ? (
                                                <ul className="space-y-1">
                                                    {res.issues.map((issue, i) => (
                                                        <li key={i} className="text-xs text-red-600 dark:text-red-400 flex items-start gap-1.5">
                                                            <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" /> {issue}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No issues detected</span>
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

export default MobileFriendlyTest;
