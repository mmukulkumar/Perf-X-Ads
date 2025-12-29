import React, { useState } from 'react';
import { ExternalLink, Trash2, Plus, AlertCircle, CheckCircle2, Copy, Upload } from 'lucide-react';
import ToolHeader from './ToolHeader';

const BulkUrlOpener: React.FC = () => {
  const [urls, setUrls] = useState<string>('');
  const [delay, setDelay] = useState<number>(500);
  const [openInNewWindow, setOpenInNewWindow] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info' | null; message: string }>({ type: null, message: '' });
  const [isOpening, setIsOpening] = useState<boolean>(false);

  const parseUrls = (text: string): string[] => {
    return text
      .split(/[\n,]/)
      .map(url => url.trim())
      .filter(url => url.length > 0);
  };

  const validateUrl = (url: string): boolean => {
    try {
      // Add protocol if missing
      const urlToValidate = url.match(/^https?:\/\//) ? url : `https://${url}`;
      new URL(urlToValidate);
      return true;
    } catch {
      return false;
    }
  };

  const normalizeUrl = (url: string): string => {
    return url.match(/^https?:\/\//) ? url : `https://${url}`;
  };

  const handleOpenUrls = async () => {
    const urlList = parseUrls(urls);
    
    if (urlList.length === 0) {
      setStatus({ type: 'error', message: 'Please enter at least one URL.' });
      return;
    }

    const invalidUrls = urlList.filter(url => !validateUrl(url));
    if (invalidUrls.length > 0) {
      setStatus({ 
        type: 'error', 
        message: `Invalid URLs found: ${invalidUrls.slice(0, 3).join(', ')}${invalidUrls.length > 3 ? '...' : ''}`
      });
      return;
    }

    if (urlList.length > 50) {
      if (!confirm(`You're about to open ${urlList.length} tabs. This may slow down your browser. Continue?`)) {
        return;
      }
    }

    setIsOpening(true);
    setStatus({ type: 'info', message: `Opening ${urlList.length} URLs...` });

    try {
      for (let i = 0; i < urlList.length; i++) {
        const normalizedUrl = normalizeUrl(urlList[i]);
        
        if (openInNewWindow) {
          window.open(normalizedUrl, '_blank', 'noopener,noreferrer');
        } else {
          window.open(normalizedUrl, '_blank');
        }

        // Add delay between opening tabs to prevent browser blocking
        if (i < urlList.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      setStatus({ 
        type: 'success', 
        message: `Successfully opened ${urlList.length} URLs in new tabs.`
      });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: 'Error opening URLs. Please check your browser popup settings.'
      });
    } finally {
      setIsOpening(false);
    }
  };

  const handleClear = () => {
    setUrls('');
    setStatus({ type: null, message: '' });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrls(prev => prev ? `${prev}\n${text}` : text);
      setStatus({ type: 'success', message: 'URLs pasted from clipboard.' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to read from clipboard.' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setUrls(text);
      setStatus({ type: 'success', message: `Loaded ${parseUrls(text).length} URLs from file.` });
    };
    reader.readAsText(file);
  };

  const urlCount = parseUrls(urls).length;
  const validCount = parseUrls(urls).filter(url => validateUrl(url)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-light/50 dark:from-brand-dark dark:via-brand-surface dark:to-brand-dark py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <ToolHeader
          title="Bulk URL Opener"
          description="Open multiple URLs at once in separate tabs for SEO audits, link verification, and batch checking."
          icon={ExternalLink}
        />

        {/* Status Message */}
        {status.type && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
            status.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' :
            status.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800' :
            'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
          }`}>
            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" /> :
             status.type === 'error' ? <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" /> :
             <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
            <span className="text-sm font-medium">{status.message}</span>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white dark:bg-brand-surface rounded-2xl shadow-lg border border-brand-border p-6 sm:p-8">
          {/* URL Input */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-brand-dark">
                Enter URLs (one per line or comma-separated)
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handlePaste}
                  className="text-xs font-semibold text-brand-primary hover:text-brand-primary/80 transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Paste
                </button>
                <label className="text-xs font-semibold text-brand-primary hover:text-brand-primary/80 transition-colors flex items-center gap-1 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  Upload
                  <input
                    type="file"
                    accept=".txt,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="https://example.com&#10;https://google.com&#10;https://github.com"
              className="w-full h-64 px-4 py-3 rounded-xl border border-brand-border bg-brand-light dark:bg-brand-dark/50 text-brand-dark placeholder-brand-dark/40 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all resize-none font-mono text-sm"
            />
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-brand-dark/60">
                {urlCount} URLs • {validCount} valid • {urlCount - validCount > 0 ? `${urlCount - validCount} invalid` : 'All valid'}
              </span>
              <button
                onClick={handleClear}
                className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-brand-light/50 dark:bg-brand-dark/30 rounded-xl">
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-2">
                Delay Between Tabs (ms)
              </label>
              <input
                type="number"
                value={delay}
                onChange={(e) => setDelay(Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                step="100"
                className="w-full px-4 py-2.5 rounded-lg border border-brand-border bg-white dark:bg-brand-surface text-brand-dark focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
              />
              <p className="text-xs text-brand-dark/50 mt-1">Recommended: 500ms to prevent browser blocking</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-dark mb-2">
                Opening Mode
              </label>
              <div className="flex items-center gap-3 h-[42px]">
                <input
                  type="checkbox"
                  id="newWindow"
                  checked={openInNewWindow}
                  onChange={(e) => setOpenInNewWindow(e.target.checked)}
                  className="w-4 h-4 text-teal-600 border-brand-border rounded focus:ring-2 focus:ring-teal-500/20"
                />
                <label htmlFor="newWindow" className="text-sm text-brand-dark cursor-pointer">
                  Open in new windows (not tabs)
                </label>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleOpenUrls}
            disabled={urlCount === 0 || validCount === 0 || isOpening}
            className="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:bg-brand-medium/30 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-600/25 hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-5 h-5" />
            {isOpening ? 'Opening URLs...' : `Open ${urlCount} URL${urlCount !== 1 ? 's' : ''}`}
          </button>

          {/* Tips */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Pro Tips
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1.5">
              <li>• Allow popups for this site if tabs don't open automatically</li>
              <li>• Use delay to prevent browser from blocking multiple tabs</li>
              <li>• Supports URLs with or without http:// or https://</li>
              <li>• Upload a .txt or .csv file with URLs for bulk processing</li>
              <li>• Maximum recommended: 50 URLs at once for best performance</li>
            </ul>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-brand-surface rounded-xl border border-brand-border p-5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-3">
              <ExternalLink className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-sm font-bold text-brand-dark mb-1">SEO Audits</h3>
            <p className="text-xs text-brand-dark/60">Quickly open multiple pages for manual inspection and quality checks.</p>
          </div>

          <div className="bg-white dark:bg-brand-surface rounded-xl border border-brand-border p-5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-brand-dark mb-1">Link Verification</h3>
            <p className="text-xs text-brand-dark/60">Test multiple backlinks or internal links to ensure they're working properly.</p>
          </div>

          <div className="bg-white dark:bg-brand-surface rounded-xl border border-brand-border p-5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
              <Plus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-brand-dark mb-1">Research Tasks</h3>
            <p className="text-xs text-brand-dark/60">Open multiple competitor sites or research sources simultaneously.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUrlOpener;
