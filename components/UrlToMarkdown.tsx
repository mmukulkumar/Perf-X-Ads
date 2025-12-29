import React, { useState } from 'react';
import { FileText, Download, Copy, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import ToolHeader from './ToolHeader';

const UrlToMarkdown: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [markdown, setMarkdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const validateUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString.match(/^https?:\/\//) ? urlString : `https://${urlString}`);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const htmlToMarkdown = (html: string): string => {
    let md = html;
    
    // Convert headings
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
    md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
    md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');
    
    // Convert links
    md = md.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    
    // Convert images
    md = md.replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi, '![$2]($1)');
    md = md.replace(/<img[^>]*src=["']([^"']*)["'][^>]*>/gi, '![]($1)');
    
    // Convert bold and italic
    md = md.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '**$2**');
    md = md.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '*$2*');
    
    // Convert code
    md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
    md = md.replace(/<pre[^>]*>(.*?)<\/pre>/gis, '```\n$1\n```\n\n');
    
    // Convert lists
    md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
    md = md.replace(/<\/?[uo]l[^>]*>/gi, '\n');
    
    // Convert paragraphs
    md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    
    // Convert line breaks
    md = md.replace(/<br\s*\/?>/gi, '\n');
    
    // Remove remaining HTML tags
    md = md.replace(/<[^>]+>/g, '');
    
    // Decode HTML entities
    md = md.replace(/&nbsp;/g, ' ');
    md = md.replace(/&amp;/g, '&');
    md = md.replace(/&lt;/g, '<');
    md = md.replace(/&gt;/g, '>');
    md = md.replace(/&quot;/g, '"');
    md = md.replace(/&#39;/g, "'");
    
    // Clean up extra whitespace
    md = md.replace(/\n{3,}/g, '\n\n');
    md = md.trim();
    
    return md;
  };

  const handleConvert = async () => {
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
    setMarkdown('');

    try {
      const normalizedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
      
      // Fetch the webpage
      const response = await fetch(normalizedUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch webpage: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      const converted = htmlToMarkdown(html);
      
      setMarkdown(converted);
      setStatus({ type: 'success', message: 'Successfully converted to Markdown!' });
    } catch (error: any) {
      setStatus({ 
        type: 'error', 
        message: `Error: ${error.message || 'Failed to convert URL. The page might be protected or unreachable.'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-light/50 dark:from-brand-dark dark:via-brand-surface dark:to-brand-dark py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <ToolHeader
          title="URL to Markdown"
          description="Convert webpages to clean Markdown format for documentation, notes, and content archiving."
          icon={FileText}
        />

        {/* Status Message */}
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

        {/* Input Section */}
        <div className="bg-white dark:bg-brand-surface rounded-2xl shadow-lg border border-brand-border p-6 sm:p-8 mb-6">
          <label className="block text-sm font-bold text-brand-dark mb-3">
            Enter URL
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleConvert()}
              placeholder="https://example.com/article"
              className="flex-1 px-4 py-3 rounded-xl border border-brand-border bg-brand-light dark:bg-brand-dark/50 text-brand-dark placeholder-brand-dark/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
            <button
              onClick={handleConvert}
              disabled={isLoading || !url.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-brand-medium/30 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl disabled:shadow-none flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Convert
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        {markdown && (
          <div className="bg-white dark:bg-brand-surface rounded-2xl shadow-lg border border-brand-border p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-brand-dark">Markdown Output</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-brand-light dark:bg-brand-dark/50 hover:bg-brand-medium/20 text-brand-dark rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
                >
                  {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
            
            <textarea
              value={markdown}
              readOnly
              className="w-full h-96 px-4 py-3 rounded-xl border border-brand-border bg-brand-light dark:bg-brand-dark/50 text-brand-dark font-mono text-sm resize-none focus:outline-none"
            />
            
            <p className="text-xs text-brand-dark/50 mt-2">
              {markdown.length} characters • {markdown.split('\n').length} lines
            </p>
          </div>
        )}

        {/* Features Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-brand-surface rounded-xl border border-brand-border p-5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-brand-dark mb-1">Clean Formatting</h3>
            <p className="text-xs text-brand-dark/60">Get well-structured Markdown with proper formatting for all elements.</p>
          </div>

          <div className="bg-white dark:bg-brand-surface rounded-xl border border-brand-border p-5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
              <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-sm font-bold text-brand-dark mb-1">Easy Export</h3>
            <p className="text-xs text-brand-dark/60">Download as .md file or copy to clipboard with one click.</p>
          </div>

          <div className="bg-white dark:bg-brand-surface rounded-xl border border-brand-border p-5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-brand-dark mb-1">Instant Conversion</h3>
            <p className="text-xs text-brand-dark/60">Fast processing with support for most public webpages.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlToMarkdown;
