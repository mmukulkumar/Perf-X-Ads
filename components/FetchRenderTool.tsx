
import React, { useState } from 'react';
import { Monitor, Play, Globe, Server, Code, Image as ImageIcon, Terminal, AlertCircle, CheckCircle, Clock, Shield } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface FetchResult {
  status: number;
  statusText: string;
  fetchTimeMs: number;
  renderedHtml: string;
  screenshotDesc: string;
  resources: { url: string; type: string; status: string }[];
  consoleLogs: { type: 'log' | 'warn' | 'error'; message: string }[];
}

const FetchRenderTool = () => {
  const [inputs, setInputs] = useState({
    url: '',
    userAgent: 'Googlebot Smartphone',
    obeyRobots: true,
    render: true,
    timeout: 5,
    browser: 'Chrome (Headless)',
    language: 'en-US',
    region: 'US',
    username: '',
    password: ''
  });

  const [isFetching, setIsFetching] = useState(false);
  const [result, setResult] = useState<FetchResult | null>(null);
  const [activeTab, setActiveTab] = useState<'status' | 'html' | 'screenshot' | 'logs'>('status');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = e.target.checked;
    setInputs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFetch = async () => {
    if (!inputs.url) {
        alert("Please enter a URL");
        return;
    }
    if (!process.env.API_KEY) {
        alert("API Key not configured.");
        return;
    }

    setIsFetching(true);
    setResult(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = 'gemini-2.5-flash';
        
        const prompt = `
            Act as a Technical SEO Crawler (like Googlebot).
            Perform a simulated "Fetch & Render" for this URL: ${inputs.url}
            
            Configuration:
            - User Agent: ${inputs.userAgent}
            - Obey Robots.txt: ${inputs.obeyRobots}
            - Execute JavaScript (Render): ${inputs.render}
            - Accept-Language: ${inputs.language}
            - Region: ${inputs.region}
            
            Generate a realistic simulation JSON response containing:
            1. "status": HTTP status code (e.g., 200, 404, 301).
            2. "statusText": "OK", "Not Found", etc.
            3. "fetchTimeMs": Simulated time in ms.
            4. "renderedHtml": A snippet of the HTML (first 500 chars) as seen AFTER simulated rendering.
            5. "screenshotDesc": A detailed text description of what the rendered page visually looks like (above the fold).
            6. "resources": An array of 3-5 critical resources (CSS, JS, Images) and their status (e.g., "200 OK", "404 Not Found", "Blocked by robots.txt").
            7. "consoleLogs": An array of potential console messages (simulated errors or warnings typical for this type of site).

            Return ONLY the raw JSON.
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
        console.error("Fetch failed:", error);
        alert("Simulation failed. Please try again.");
    } finally {
        setIsFetching(false);
    }
  };

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* Tool Header */}
        <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-sm mb-8 overflow-hidden">
            <div className="px-8 py-6 border-b border-brand-medium/20 bg-brand-light/10">
                <h2 className="text-2xl font-bold text-brand-dark flex items-center gap-3">
                    <Monitor className="w-7 h-7 text-brand-primary" />
                    Fetch & Render
                </h2>
            </div>
            
            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                    {/* URL Line */}
                    <div className="md:col-span-12">
                        <label className="block text-xs font-bold text-brand-dark/60 uppercase mb-2">URL</label>
                        <input 
                            type="text" 
                            name="url"
                            value={inputs.url}
                            onChange={handleInputChange}
                            placeholder="https://example.com" 
                            className="w-full px-4 py-3 bg-white dark:bg-brand-surface border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                        />
                    </div>

                    {/* Row 2 */}
                    <div className="md:col-span-4">
                        <label className="block text-xs font-bold text-brand-dark/60 uppercase mb-2">User Agent</label>
                        <select name="userAgent" value={inputs.userAgent} onChange={handleInputChange} className="w-full px-3 py-2.5 bg-white dark:bg-brand-surface border border-brand-medium/40 rounded-lg text-brand-dark text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none">
                            <option>Googlebot Smartphone</option>
                            <option>Googlebot Desktop</option>
                            <option>Bingbot</option>
                            <option>Chrome User</option>
                        </select>
                    </div>

                    <div className="md:col-span-3 flex items-center gap-6 pt-6">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" name="obeyRobots" checked={inputs.obeyRobots} onChange={handleInputChange} className="w-4 h-4 rounded border-brand-medium text-brand-primary focus:ring-brand-primary" />
                            <span className="text-sm text-brand-dark">Obey robots.txt</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" name="render" checked={inputs.render} onChange={handleInputChange} className="w-4 h-4 rounded border-brand-medium text-brand-primary focus:ring-brand-primary" />
                            <span className="text-sm text-brand-dark">Render</span>
                        </label>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-brand-dark/60 uppercase mb-2">Timeout (s)</label>
                        <input type="number" name="timeout" value={inputs.timeout} onChange={handleInputChange} className="w-full px-3 py-2.5 bg-white dark:bg-brand-surface border border-brand-medium/40 rounded-lg text-brand-dark text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" />
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-brand-dark/60 uppercase mb-2">Headless Browser</label>
                        <select name="browser" value={inputs.browser} onChange={handleInputChange} className="w-full px-3 py-2.5 bg-white dark:bg-brand-surface border border-brand-medium/40 rounded-lg text-brand-dark text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none">
                            <option>Chrome (Headless)</option>
                            <option>Firefox (Headless)</option>
                        </select>
                    </div>

                    {/* Row 3 */}
                    <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-brand-dark/60 uppercase mb-2">Accept-Language</label>
                        <select name="language" value={inputs.language} onChange={handleInputChange} className="w-full px-3 py-2.5 bg-white dark:bg-brand-surface border border-brand-medium/40 rounded-lg text-brand-dark text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none">
                            <option value="en-US">en-US</option>
                            <option value="en-GB">en-GB</option>
                            <option value="es-ES">es-ES</option>
                            <option value="fr-FR">fr-FR</option>
                        </select>
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-brand-dark/60 uppercase mb-2">Region</label>
                        <select name="region" value={inputs.region} onChange={handleInputChange} className="w-full px-3 py-2.5 bg-white dark:bg-brand-surface border border-brand-medium/40 rounded-lg text-brand-dark text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none">
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="EU">Europe</option>
                            <option value="ASIA">Asia</option>
                        </select>
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-brand-dark/60 uppercase mb-2">Username</label>
                        <input type="text" name="username" value={inputs.username} onChange={handleInputChange} placeholder="(Optional)" className="w-full px-3 py-2.5 bg-white dark:bg-brand-surface border border-brand-medium/40 rounded-lg text-brand-dark text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" />
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-brand-dark/60 uppercase mb-2">Password</label>
                        <input type="password" name="password" value={inputs.password} onChange={handleInputChange} placeholder="(Optional)" className="w-full px-3 py-2.5 bg-white dark:bg-brand-surface border border-brand-medium/40 rounded-lg text-brand-dark text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" />
                    </div>
                </div>

                <div className="flex justify-end border-t border-brand-medium/20 pt-6">
                    <button 
                        onClick={handleFetch}
                        disabled={isFetching}
                        className={`px-8 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-md transition-all flex items-center gap-2 ${isFetching ? 'opacity-70 cursor-wait' : 'hover:bg-brand-primary/90 active:scale-95'}`}
                    >
                        {isFetching ? <Monitor className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                        FETCH
                    </button>
                </div>
            </div>
        </div>

        {/* Results Area */}
        {result && (
            <div className="bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-brand-light/30 px-6 py-4 border-b border-brand-medium/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${result.status === 200 ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-red-100 text-red-700 border-red-200'}`}>
                            {result.status} {result.statusText}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-brand-dark/60">
                            <Clock className="w-3.5 h-3.5" /> {result.fetchTimeMs}ms
                        </div>
                    </div>
                    <div className="flex gap-1 bg-brand-light p-1 rounded-lg border border-brand-medium/20">
                        <button onClick={() => setActiveTab('status')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'status' ? 'bg-white shadow-sm text-brand-dark' : 'text-brand-dark/60 hover:text-brand-dark'}`}>Summary</button>
                        <button onClick={() => setActiveTab('html')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'html' ? 'bg-white shadow-sm text-brand-dark' : 'text-brand-dark/60 hover:text-brand-dark'}`}>HTML</button>
                        <button onClick={() => setActiveTab('screenshot')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'screenshot' ? 'bg-white shadow-sm text-brand-dark' : 'text-brand-dark/60 hover:text-brand-dark'}`}>Screenshot</button>
                        <button onClick={() => setActiveTab('logs')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'logs' ? 'bg-white shadow-sm text-brand-dark' : 'text-brand-dark/60 hover:text-brand-dark'}`}>Logs</button>
                    </div>
                </div>

                <div className="p-6 min-h-[300px]">
                    {activeTab === 'status' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 bg-brand-light/20 rounded-xl border border-brand-medium/20">
                                    <h4 className="text-xs font-bold text-brand-dark/60 uppercase mb-3 flex items-center gap-2"><Server className="w-4 h-4" /> Response Headers</h4>
                                    <div className="space-y-2 text-xs font-mono text-brand-dark/80">
                                        <div className="flex justify-between"><span>content-type:</span> <span>text/html; charset=utf-8</span></div>
                                        <div className="flex justify-between"><span>server:</span> <span>nginx</span></div>
                                        <div className="flex justify-between"><span>x-powered-by:</span> <span>Next.js</span></div>
                                        <div className="flex justify-between"><span>vary:</span> <span>Accept-Encoding</span></div>
                                    </div>
                                </div>
                                <div className="col-span-2 p-4 bg-brand-light/20 rounded-xl border border-brand-medium/20">
                                    <h4 className="text-xs font-bold text-brand-dark/60 uppercase mb-3 flex items-center gap-2"><Shield className="w-4 h-4" /> Page Resources</h4>
                                    <div className="space-y-2">
                                        {result.resources.map((res, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-xs p-2 bg-white dark:bg-brand-surface rounded border border-brand-medium/10">
                                                <span className="truncate max-w-[60%] font-mono text-brand-dark">{res.url}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-brand-dark/50 uppercase text-[10px]">{res.type}</span>
                                                    <span className={`font-bold ${res.status.includes('200') ? 'text-green-600' : 'text-red-500'}`}>{res.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'html' && (
                        <div className="relative bg-[#1E1E1E] p-4 rounded-xl border border-gray-800 font-mono text-xs overflow-x-auto">
                            <pre className="text-gray-300 whitespace-pre-wrap break-all">
                                {result.renderedHtml}
                                <br/>
                                <span className="text-gray-500 italic">... (truncated for simulation)</span>
                            </pre>
                        </div>
                    )}

                    {activeTab === 'screenshot' && (
                        <div className="flex flex-col items-center justify-center h-full py-8">
                            <div className="w-full max-w-md bg-gray-100 dark:bg-gray-800 aspect-[9/16] rounded-lg border-8 border-gray-900 shadow-xl flex items-center justify-center p-8 text-center">
                                <div>
                                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Simulated Render Description</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{result.screenshotDesc}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <div className="space-y-2 font-mono text-xs">
                            {result.consoleLogs.length > 0 ? result.consoleLogs.map((log, idx) => (
                                <div key={idx} className={`p-2 rounded border flex gap-2 ${log.type === 'error' ? 'bg-red-50 text-red-800 border-red-100' : log.type === 'warn' ? 'bg-yellow-50 text-yellow-800 border-yellow-100' : 'bg-gray-50 text-gray-800 border-gray-200'}`}>
                                    <span className="uppercase font-bold text-[10px] w-10 shrink-0 opacity-70">{log.type}</span>
                                    <span className="break-all">{log.message}</span>
                                </div>
                            )) : (
                                <div className="text-center text-gray-400 py-10">
                                    <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>No console messages logged.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default FetchRenderTool;
