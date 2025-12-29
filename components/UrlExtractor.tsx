import React, { useState } from 'react';
import { Link, Download, Copy, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import ToolHeader from './ToolHeader';

const UrlExtractor: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [extractedUrls, setExtractedUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [filterInternal, setFilterInternal] = useState<boolean>(false);
  const [filterExternal, setFilterExternal] = useState<boolean>(false);

  const validateUrl = (urlString: string): boolean => {
    try {
      new URL(urlString.match(/^https?:\/\//) ? urlString : `https://${urlString}`);
      return true;
    } catch {
      return false;
    }
  };

  const extractUrls = async () => {
    if (!url.trim()) {
      setStatus({ type: 'error', message: 'Please enter a URL' });
      return;
    }

    if (!validateUrl(url)) {
      setStatus({ type: 'error', message: 'Please enter a valid URL' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: null, message: '' });
    setExtractedUrls([]);

    try {
      const normalizedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
      const urlObj = new URL(normalizedUrl);
      const baseDomain = urlObj.hostname;
      
      const response = await fetch(normalizedUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch webpage: ${response.status}`);
      }

      const html = await response.text();
      
      // Extract URLs using regex
      const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
      const matches = html.match(urlPattern) || [];
      
      // Deduplicate URLs
      const uniqueUrls = Array.from(new Set(matches));
      
      // Filter based on internal/external preferences
      let filtered = uniqueUrls;
      if (filterInternal) {
        filtered = filtered.filter(u => {
          try {
            return new URL(u).hostname === baseDomain;
          } catch {
            return false;
          }
        });
      }
      if (filterExternal) {
        filtered = filtered.filter(u => {
          try {
            return new URL(u).hostname !== baseDomain;
          } catch {
            return true;
          }
        });
      }
      
      setExtractedUrls(filtered);
      setStatus({ type: 'success', message: `Found ${filtered.length} unique URLs` });
    } catch (error: any) {
      setStatus({ 
        type: 'error', 
        message: `Error: ${error.message || 'Failed to extract URLs. The page might be protected or unreachable.'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedUrls.join('\n'));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([extractedUrls.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-urls.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    const csv = 'URL\n' + extractedUrls.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-urls.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-light/50 dark:from-brand-dark dark:via-brand-surface dark:to-brand-dark py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <ToolHeader
          title="URL Extractor"
          description="Extract all URLs from websites instantly. Export as TXT or CSV for SEO audits and analysis."
          icon={Link}
        />

        {status.type && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
            status.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
          }`}>
            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
            <span className="text-sm font-medium">{status.message}</span>
          </div>
        )}

        <div className="bg-white dark:bg-brand-surface rounded-2xl shadow-lg border border-brand-border p-6 sm:p-8 mb-6">
          <label className="block text-sm font-bold text-brand-dark mb-3">Enter Website URL</label>
          
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && extractUrls()}
              placeholder="https://example.com"
              className="flex-1 px-4 py-3 rounded-xl border border-brand-border bg-brand-light dark:bg-brand-dark/50 text-brand-dark placeholder-brand-dark/40 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
            />
            <button
              onClick={extractUrls}
              disabled={isLoading || !url.trim()}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-brand-medium/30 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-green-600/25 hover:shadow-xl disabled:shadow-none flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <Link className="w-5 h-5" />
                  Extract URLs
                </>
              )}
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterInternal}
                onChange={(e) => {
                  setFilterInternal(e.target.checked);
                  if (e.target.checked && filterExternal) setFilterExternal(false);
                }}
                className="w-4 h-4 text-green-600 border-brand-border rounded focus:ring-2 focus:ring-green-500/20"
              />
              <span className="text-sm text-brand-dark">Internal links only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterExternal}
                onChange={(e) => {
                  setFilterExternal(e.target.checked);
                  if (e.target.checked && filterInternal) setFilterInternal(false);
                }}
                className="w-4 h-4 text-green-600 border-brand-border rounded focus:ring-2 focus:ring-green-500/20"
              />
              <span className="text-sm text-brand-dark">External links only</span>
            </label>
          </div>
        </div>

        {extractedUrls.length > 0 && (
          <div className="bg-white dark:bg-brand-surface rounded-2xl shadow-lg border border-brand-border p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-brand-dark">
                Extracted URLs ({extractedUrls.length})
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-brand-light dark:bg-brand-dark/50 hover:bg-brand-medium/20 text-brand-dark rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
                >
                  {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  TXT
                </button>
                <button
                  onClick={handleDownloadCsv}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              <ul className="space-y-2">
                {extractedUrls.map((extractedUrl, index) => (
                  <li 
                    key={index}
                    className="px-4 py-2 bg-brand-light dark:bg-brand-dark/30 rounded-lg text-sm text-brand-dark font-mono break-all hover:bg-brand-medium/10 transition-colors"
                  >
                    {extractedUrl}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Use Cases */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-brand-surface rounded-xl border border-brand-border p-5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
              <Link className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-sm font-bold text-brand-dark mb-1">SEO Audits</h3>
            <p className="text-xs text-brand-dark/60">Extract all links to analyze internal linking structure and find broken links.</p>
          </div>

          <div className="bg-white dark:bg-brand-surface rounded-xl border border-brand-border p-5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-brand-dark mb-1">Competitor Analysis</h3>
            <p className="text-xs text-brand-dark/60">Extract competitor backlinks and analyze their link building strategies.</p>
          </div>

          <div className="bg-white dark:bg-brand-surface rounded-xl border border-brand-border p-5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
              <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-brand-dark mb-1">Content Migration</h3>
            <p className="text-xs text-brand-dark/60">Extract all URLs before migrating to ensure proper redirects are in place.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlExtractor;
