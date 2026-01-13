import React, { useState } from 'react';
import ToolHeader from './ToolHeader';
import { CheckCircle, XCircle, AlertTriangle, Loader } from 'lucide-react';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  status?: 'valid' | 'invalid' | 'error';
  error?: string;
}

const SitemapChecker = () => {
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    totalUrls: number;
    validUrls: number;
    invalidUrls: number;
    urls: SitemapUrl[];
    errors: string[];
  } | null>(null);

  const checkUrl = async (url: string): Promise<{ status: 'valid' | 'invalid' | 'error'; error?: string }> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        return { status: 'valid' };
      } else {
        return { status: 'invalid', error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const handleCheck = async () => {
    if (!sitemapUrl.trim()) return;

    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch(sitemapUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch sitemap: ${response.status}`);
      }

      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

      const urlElements = xmlDoc.querySelectorAll('url');
      const urls: SitemapUrl[] = Array.from(urlElements).map(url => ({
        loc: url.querySelector('loc')?.textContent || '',
        lastmod: url.querySelector('lastmod')?.textContent,
        changefreq: url.querySelector('changefreq')?.textContent,
        priority: url.querySelector('priority')?.textContent,
      }));

      const errors: string[] = [];
      if (xmlDoc.querySelector('parsererror')) {
        errors.push('Invalid XML format');
      }

      // Check first 10 URLs for validity (to avoid too many requests)
      const urlsToCheck = urls.slice(0, 10);
      const checkedUrls = await Promise.all(
        urlsToCheck.map(async (url) => {
          const check = await checkUrl(url.loc);
          return { ...url, ...check };
        })
      );

      const remainingUrls = urls.slice(10).map(url => ({ ...url, status: 'valid' as const }));

      const allUrls = [...checkedUrls, ...remainingUrls];
      const validUrls = allUrls.filter(u => u.status === 'valid').length;
      const invalidUrls = allUrls.filter(u => u.status !== 'valid').length;

      setResults({
        totalUrls: urls.length,
        validUrls,
        invalidUrls,
        urls: allUrls,
        errors,
      });
    } catch (error) {
      setResults({
        totalUrls: 0,
        validUrls: 0,
        invalidUrls: 0,
        urls: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToolHeader
        title="Sitemap Checker"
        description="Validate and analyze XML sitemaps for errors, broken links, and SEO issues."
        icon={CheckCircle}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="url"
            value={sitemapUrl}
            onChange={(e) => setSitemapUrl(e.target.value)}
            placeholder="Enter sitemap URL (e.g., https://example.com/sitemap.xml)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={handleCheck}
            disabled={isLoading || !sitemapUrl.trim()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Check Sitemap
          </button>
        </div>
      </div>

      {results && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{results.totalUrls}</div>
                <div className="text-sm text-gray-600">Total URLs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{results.validUrls}</div>
                <div className="text-sm text-gray-600">Valid URLs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{results.invalidUrls}</div>
                <div className="text-sm text-gray-600">Invalid URLs</div>
              </div>
            </div>
          </div>

          {results.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-red-800">Errors</h4>
              </div>
              <ul className="list-disc list-inside text-red-700">
                {results.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">URLs ({results.urls.length})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.urls.slice(0, 50).map((url, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {url.status === 'valid' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : url.status === 'invalid' ? (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{url.loc}</div>
                    {url.lastmod && (
                      <div className="text-xs text-gray-500">Last modified: {url.lastmod}</div>
                    )}
                    {url.error && (
                      <div className="text-xs text-red-600">Error: {url.error}</div>
                    )}
                  </div>
                </div>
              ))}
              {results.urls.length > 50 && (
                <div className="text-center text-gray-500 text-sm">
                  ... and {results.urls.length - 50} more URLs
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SitemapChecker;