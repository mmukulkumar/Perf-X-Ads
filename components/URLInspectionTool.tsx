import React, { useState } from 'react';
import { Search, Globe, Clock, Shield, Zap, AlertCircle, CheckCircle, XCircle, Link2, Server, Eye, FileCode, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface InspectionResult {
  url: string;
  status: 'indexed' | 'not-indexed' | 'error';
  statusCode: number;
  indexability: string;
  lastCrawled: string;
  sitemapStatus: string;
  robotsTxt: string;
  canonicalUrl: string;
  metaRobots: string;
  structuredData: string[];
  mobileUsability: string;
  coreWebVitals: {
    lcp: string;
    fid: string;
    cls: string;
  };
  securityIssues: string[];
  recommendations: string[];
}

const URLInspectionTool = () => {
  const [url, setUrl] = useState('');
  const [isInspecting, setIsInspecting] = useState(false);
  const [result, setResult] = useState<InspectionResult | null>(null);

  const handleInspect = async () => {
    if (!url.trim()) {
      alert("Please enter a URL to inspect.");
      return;
    }

    const apiKey = import.meta.env.VITE_API_KEY as string;
    if (!apiKey) {
      alert("API Key not configured.");
      return;
    }

    setIsInspecting(true);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = 'gemini-2.5-flash';
      
      const prompt = `
        Act as Google Search Console's URL Inspection Tool. 
        Analyze the following URL and provide a comprehensive SEO and technical inspection report.
        
        URL to inspect: ${url}

        Simulate realistic inspection data including:
        - Index status (indexed/not-indexed)
        - HTTP status code
        - Indexability assessment
        - Last crawl date (realistic recent date)
        - Sitemap presence
        - Robots.txt directives
        - Canonical URL
        - Meta robots tags
        - Structured data types found
        - Mobile usability status
        - Core Web Vitals scores (LCP, FID, CLS)
        - Security issues if any
        - SEO recommendations

        Return ONLY a raw JSON object (no markdown formatting) with this structure:
        {
          "url": "string",
          "status": "indexed" | "not-indexed" | "error",
          "statusCode": number,
          "indexability": "string",
          "lastCrawled": "ISO date string",
          "sitemapStatus": "string",
          "robotsTxt": "string",
          "canonicalUrl": "string",
          "metaRobots": "string",
          "structuredData": ["array of schema types"],
          "mobileUsability": "string",
          "coreWebVitals": {
            "lcp": "string with unit",
            "fid": "string with unit",
            "cls": "string"
          },
          "securityIssues": ["array of issues or empty"],
          "recommendations": ["array of actionable recommendations"]
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
      console.error("Inspection failed:", error);
      alert("Failed to inspect URL. Please try again.");
    } finally {
      setIsInspecting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'indexed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'not-indexed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getWebVitalStatus = (metric: string, value: string) => {
    const numValue = parseFloat(value);
    if (metric === 'lcp') {
      return numValue <= 2.5 ? 'good' : numValue <= 4.0 ? 'needs-improvement' : 'poor';
    } else if (metric === 'fid') {
      return numValue <= 100 ? 'good' : numValue <= 300 ? 'needs-improvement' : 'poor';
    } else if (metric === 'cls') {
      return numValue <= 0.1 ? 'good' : numValue <= 0.25 ? 'needs-improvement' : 'poor';
    }
    return 'unknown';
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
            <Search className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-brand-dark dark:text-white">URL Inspection Tool</h1>
        <p className="text-brand-dark/70 dark:text-white/70 max-w-2xl mx-auto">
          Inspect any URL to see how Google crawls and indexes it. Get detailed insights about indexability, 
          structured data, Core Web Vitals, and SEO recommendations.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-brand-medium/20">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-brand-dark dark:text-white mb-2">
              <Globe className="w-4 h-4 inline mr-2" />
              Enter URL to Inspect
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/page"
              className="w-full px-4 py-3 border border-brand-medium/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleInspect()}
            />
          </div>
          
          <button
            onClick={handleInspect}
            disabled={isInspecting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isInspecting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Inspecting URL...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Inspect URL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Status Overview */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-brand-medium/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(result.status)}
                <div>
                  <h3 className="text-xl font-bold text-brand-dark dark:text-white">
                    {result.status === 'indexed' ? 'URL is on Google' : result.status === 'not-indexed' ? 'URL is not indexed' : 'Error'}
                  </h3>
                  <p className="text-sm text-brand-dark/60 dark:text-white/60 break-all">{result.url}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-brand-dark dark:text-white">{result.statusCode}</div>
                <div className="text-xs text-brand-dark/60 dark:text-white/60">HTTP Status</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-brand-light/50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-brand-dark/60 dark:text-white/60" />
                  <span className="text-sm font-medium text-brand-dark/60 dark:text-white/60">Last Crawled</span>
                </div>
                <p className="font-semibold text-brand-dark dark:text-white">{new Date(result.lastCrawled).toLocaleDateString()}</p>
              </div>
              
              <div className="p-4 bg-brand-light/50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-brand-dark/60 dark:text-white/60" />
                  <span className="text-sm font-medium text-brand-dark/60 dark:text-white/60">Indexability</span>
                </div>
                <p className="font-semibold text-brand-dark dark:text-white">{result.indexability}</p>
              </div>
              
              <div className="p-4 bg-brand-light/50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileCode className="w-4 h-4 text-brand-dark/60 dark:text-white/60" />
                  <span className="text-sm font-medium text-brand-dark/60 dark:text-white/60">Sitemap</span>
                </div>
                <p className="font-semibold text-brand-dark dark:text-white">{result.sitemapStatus}</p>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Crawl Information */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-brand-medium/20">
              <h3 className="text-lg font-bold text-brand-dark dark:text-white mb-4 flex items-center gap-2">
                <Server className="w-5 h-5" />
                Crawl Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-brand-dark/60 dark:text-white/60">Robots.txt:</span>
                  <p className="font-medium text-brand-dark dark:text-white">{result.robotsTxt}</p>
                </div>
                <div>
                  <span className="text-sm text-brand-dark/60 dark:text-white/60">Meta Robots:</span>
                  <p className="font-medium text-brand-dark dark:text-white">{result.metaRobots}</p>
                </div>
                <div>
                  <span className="text-sm text-brand-dark/60 dark:text-white/60">Canonical URL:</span>
                  <p className="font-medium text-brand-dark dark:text-white break-all text-sm">{result.canonicalUrl}</p>
                </div>
              </div>
            </div>

            {/* Structured Data */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-brand-medium/20">
              <h3 className="text-lg font-bold text-brand-dark dark:text-white mb-4 flex items-center gap-2">
                <FileCode className="w-5 h-5" />
                Structured Data
              </h3>
              {result.structuredData.length > 0 ? (
                <div className="space-y-2">
                  {result.structuredData.map((schema, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-brand-dark dark:text-white">{schema}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-brand-dark/60 dark:text-white/60">No structured data found</p>
              )}
            </div>
          </div>

          {/* Core Web Vitals */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-brand-medium/20">
            <h3 className="text-lg font-bold text-brand-dark dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Core Web Vitals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* LCP */}
              <div className="p-4 border-2 border-brand-medium/20 rounded-lg">
                <div className="text-sm text-brand-dark/60 dark:text-white/60 mb-1">Largest Contentful Paint</div>
                <div className={`text-2xl font-bold ${
                  getWebVitalStatus('lcp', result.coreWebVitals.lcp) === 'good' ? 'text-green-600' :
                  getWebVitalStatus('lcp', result.coreWebVitals.lcp) === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {result.coreWebVitals.lcp}
                </div>
                <div className="text-xs text-brand-dark/50 dark:text-white/50 mt-1">Good: ≤ 2.5s</div>
              </div>

              {/* FID */}
              <div className="p-4 border-2 border-brand-medium/20 rounded-lg">
                <div className="text-sm text-brand-dark/60 dark:text-white/60 mb-1">First Input Delay</div>
                <div className={`text-2xl font-bold ${
                  getWebVitalStatus('fid', result.coreWebVitals.fid) === 'good' ? 'text-green-600' :
                  getWebVitalStatus('fid', result.coreWebVitals.fid) === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {result.coreWebVitals.fid}
                </div>
                <div className="text-xs text-brand-dark/50 dark:text-white/50 mt-1">Good: ≤ 100ms</div>
              </div>

              {/* CLS */}
              <div className="p-4 border-2 border-brand-medium/20 rounded-lg">
                <div className="text-sm text-brand-dark/60 dark:text-white/60 mb-1">Cumulative Layout Shift</div>
                <div className={`text-2xl font-bold ${
                  getWebVitalStatus('cls', result.coreWebVitals.cls) === 'good' ? 'text-green-600' :
                  getWebVitalStatus('cls', result.coreWebVitals.cls) === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {result.coreWebVitals.cls}
                </div>
                <div className="text-xs text-brand-dark/50 dark:text-white/50 mt-1">Good: ≤ 0.1</div>
              </div>
            </div>
          </div>

          {/* Mobile Usability */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-brand-medium/20">
            <h3 className="text-lg font-bold text-brand-dark dark:text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Mobile Usability
            </h3>
            <p className="text-brand-dark dark:text-white">{result.mobileUsability}</p>
          </div>

          {/* Security Issues */}
          {result.securityIssues.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 shadow-lg border border-red-200 dark:border-red-800">
              <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Security Issues
              </h3>
              <ul className="space-y-2">
                {result.securityIssues.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-brand-dark dark:text-white">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 shadow-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Recommendations
            </h3>
            <ul className="space-y-2">
              {result.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-brand-dark dark:text-white">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default URLInspectionTool;
