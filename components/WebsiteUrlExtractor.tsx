import React, { useState } from 'react';
import ToolHeader from './ToolHeader';
import { Link, ExternalLink, Download, Loader, AlertTriangle } from 'lucide-react';

interface ExtractedUrl {
  url: string;
  type: 'internal' | 'external';
  text: string;
  tag: string;
}

const WebsiteUrlExtractor = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [results, setResults] = useState<{
    totalUrls: number;
    internalUrls: number;
    externalUrls: number;
    urls: ExtractedUrl[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractUrls = async () => {
    if (!websiteUrl.trim()) return;

    setIsExtracting(true);
    setResults(null);
    setError(null);

    try {
      // Note: This will only work for sites that allow CORS or same-origin
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(websiteUrl)}`);
      if (!response.ok) throw new Error('Failed to fetch website content');

      const data = await response.json();
      const html = data.contents;

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const links = doc.querySelectorAll('a[href]');
      const baseUrl = new URL(websiteUrl);

      const extractedUrls: ExtractedUrl[] = Array.from(links).map(link => {
        const href = link.getAttribute('href') || '';
        let fullUrl: string;

        try {
          fullUrl = new URL(href, baseUrl).href;
        } catch {
          fullUrl = href;
        }

        const isInternal = fullUrl.startsWith(baseUrl.origin);
        const text = link.textContent?.trim() || '';

        return {
          url: fullUrl,
          type: isInternal ? 'internal' : 'external',
          text: text || '[No text]',
          tag: 'a',
        };
      });

      // Remove duplicates
      const uniqueUrls = extractedUrls.filter((url, index, self) =>
        index === self.findIndex(u => u.url === url.url)
      );

      const internalUrls = uniqueUrls.filter(u => u.type === 'internal').length;
      const externalUrls = uniqueUrls.filter(u => u.type === 'external').length;

      setResults({
        totalUrls: uniqueUrls.length,
        internalUrls,
        externalUrls,
        urls: uniqueUrls,
      });
    } catch (err) {
      setError('Unable to extract URLs. This may be due to CORS restrictions or the website blocking requests. Try using a CORS proxy or check the website directly.');
      console.error(err);
    } finally {
      setIsExtracting(false);
    }
  };

  const downloadCsv = () => {
    if (!results) return;

    const csv = [
      'URL,Type,Text,Tag',
      ...results.urls.map(url => `"${url.url}","${url.type}","${url.text}","${url.tag}"`)
    ].join('\n');

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
    <div className="max-w-6xl mx-auto p-6">
      <ToolHeader
        title="Website URL Extractor"
        description="Extract all URLs from a website for comprehensive link analysis and SEO audits."
        icon={Link}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="Enter website URL (e.g., https://example.com)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={extractUrls}
            disabled={isExtracting || !websiteUrl.trim()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExtracting ? <Loader className="w-4 h-4 animate-spin" /> : <Link className="w-4 h-4" />}
            Extract URLs
          </button>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800 text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>

      {results && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <Link className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{results.totalUrls}</div>
              <div className="text-sm text-gray-600">Total URLs</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <Link className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{results.internalUrls}</div>
              <div className="text-sm text-gray-600">Internal URLs</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <ExternalLink className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{results.externalUrls}</div>
              <div className="text-sm text-gray-600">External URLs</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Extracted URLs ({results.urls.length})</h3>
              <button
                onClick={downloadCsv}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.urls.slice(0, 100).map((url, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {url.type === 'internal' ? (
                    <Link className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ExternalLink className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{url.url}</div>
                    <div className="text-xs text-gray-500">Text: {url.text}</div>
                  </div>
                  <div className="text-xs text-gray-400 uppercase">{url.type}</div>
                </div>
              ))}
              {results.urls.length > 100 && (
                <div className="text-center text-gray-500 text-sm">
                  ... and {results.urls.length - 100} more URLs
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteUrlExtractor;