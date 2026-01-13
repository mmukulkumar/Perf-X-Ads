import React, { useState } from 'react';
import ToolHeader from './ToolHeader';
import { BarChart3, Plus, Minus, RefreshCw, Loader } from 'lucide-react';

const SitemapUrlsComparison = () => {
  const [sitemap1, setSitemap1] = useState('');
  const [sitemap2, setSitemap2] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [results, setResults] = useState<{
    added: string[];
    removed: string[];
    common: string[];
  } | null>(null);

  const fetchSitemapUrls = async (url: string): Promise<string[]> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const urlElements = xmlDoc.querySelectorAll('url');
    return Array.from(urlElements).map(url => url.querySelector('loc')?.textContent || '').filter(Boolean);
  };

  const handleCompare = async () => {
    if (!sitemap1.trim() || !sitemap2.trim()) return;

    setIsComparing(true);
    setResults(null);

    try {
      const [urls1, urls2] = await Promise.all([
        fetchSitemapUrls(sitemap1),
        fetchSitemapUrls(sitemap2)
      ]);

      const set1 = new Set(urls1);
      const set2 = new Set(urls2);

      const added = urls2.filter(url => !set1.has(url));
      const removed = urls1.filter(url => !set2.has(url));
      const common = urls1.filter(url => set2.has(url));

      setResults({ added, removed, common });
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToolHeader
        title="Sitemap URLs Comparison"
        description="Compare two sitemaps to find added, removed, or changed URLs."
        icon={BarChart3}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Sitemap URL</label>
            <input
              type="url"
              value={sitemap1}
              onChange={(e) => setSitemap1(e.target.value)}
              placeholder="https://example.com/sitemap.xml"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Second Sitemap URL</label>
            <input
              type="url"
              value={sitemap2}
              onChange={(e) => setSitemap2(e.target.value)}
              placeholder="https://example.com/sitemap.xml"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={handleCompare}
          disabled={isComparing || !sitemap1.trim() || !sitemap2.trim()}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isComparing ? <Loader className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
          Compare Sitemaps
        </button>
      </div>

      {results && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <Plus className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{results.added.length}</div>
              <div className="text-sm text-green-800">Added URLs</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <Minus className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{results.removed.length}</div>
              <div className="text-sm text-red-800">Removed URLs</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{results.common.length}</div>
              <div className="text-sm text-blue-800">Common URLs</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Added URLs ({results.added.length})
              </h4>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {results.added.slice(0, 20).map((url, index) => (
                  <div key={index} className="text-sm text-gray-700 py-1 px-2 bg-green-50 rounded">
                    {url}
                  </div>
                ))}
                {results.added.length > 20 && (
                  <div className="text-xs text-gray-500 text-center">
                    ... and {results.added.length - 20} more
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                <Minus className="w-4 h-4" />
                Removed URLs ({results.removed.length})
              </h4>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {results.removed.slice(0, 20).map((url, index) => (
                  <div key={index} className="text-sm text-gray-700 py-1 px-2 bg-red-50 rounded">
                    {url}
                  </div>
                ))}
                {results.removed.length > 20 && (
                  <div className="text-xs text-gray-500 text-center">
                    ... and {results.removed.length - 20} more
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h4 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Common URLs ({results.common.length})
              </h4>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {results.common.slice(0, 20).map((url, index) => (
                  <div key={index} className="text-sm text-gray-700 py-1 px-2 bg-blue-50 rounded">
                    {url}
                  </div>
                ))}
                {results.common.length > 20 && (
                  <div className="text-xs text-gray-500 text-center">
                    ... and {results.common.length - 20} more
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SitemapUrlsComparison;