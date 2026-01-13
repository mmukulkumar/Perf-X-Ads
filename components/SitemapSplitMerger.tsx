import React, { useState } from 'react';
import ToolHeader from './ToolHeader';
import { Split, Merge, Download, Loader } from 'lucide-react';

const SitemapSplitMerger = () => {
  const [mode, setMode] = useState<'split' | 'merge'>('split');
  const [sitemapUrls, setSitemapUrls] = useState<string[]>(['']);
  const [maxUrlsPerFile, setMaxUrlsPerFile] = useState(50000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<string[] | null>(null);

  const fetchSitemap = async (url: string): Promise<string[]> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const urlElements = xmlDoc.querySelectorAll('url');
    return Array.from(urlElements).map(url => url.querySelector('loc')?.textContent || '');
  };

  const generateSitemapXml = (urls: string[], index?: number): string => {
    const urlElements = urls.map(url => `
    <url>
      <loc>${url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.5</priority>
    </url>`).join('');

    const sitemapIndex = index !== undefined ? `-${index + 1}` : '';
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
  };

  const handleSplit = async () => {
    const url = sitemapUrls[0];
    if (!url.trim()) return;

    setIsProcessing(true);
    try {
      const urls = await fetchSitemap(url);
      const chunks = [];
      for (let i = 0; i < urls.length; i += maxUrlsPerFile) {
        chunks.push(urls.slice(i, i + maxUrlsPerFile));
      }
      const xmlFiles = chunks.map((chunk, index) => generateSitemapXml(chunk, index));
      setResults(xmlFiles);
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMerge = async () => {
    const validUrls = sitemapUrls.filter(url => url.trim());
    if (validUrls.length < 2) return;

    setIsProcessing(true);
    try {
      const allUrls: string[] = [];
      for (const url of validUrls) {
        const urls = await fetchSitemap(url);
        allUrls.push(...urls);
      }
      // Remove duplicates
      const uniqueUrls = [...new Set(allUrls)];
      const xml = generateSitemapXml(uniqueUrls);
      setResults([xml]);
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addUrl = () => {
    setSitemapUrls([...sitemapUrls, '']);
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...sitemapUrls];
    newUrls[index] = value;
    setSitemapUrls(newUrls);
  };

  const removeUrl = (index: number) => {
    if (sitemapUrls.length > 1) {
      setSitemapUrls(sitemapUrls.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToolHeader
        title="Sitemap Split & Merger"
        description="Split large sitemaps into smaller ones or merge multiple sitemaps into a single file."
        icon={Split}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode('split')}
            className={`px-4 py-2 rounded-lg font-medium ${mode === 'split' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <Split className="w-4 h-4 inline mr-2" />
            Split Sitemap
          </button>
          <button
            onClick={() => setMode('merge')}
            className={`px-4 py-2 rounded-lg font-medium ${mode === 'merge' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <Merge className="w-4 h-4 inline mr-2" />
            Merge Sitemaps
          </button>
        </div>

        {mode === 'split' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sitemap URL</label>
              <input
                type="url"
                value={sitemapUrls[0]}
                onChange={(e) => updateUrl(0, e.target.value)}
                placeholder="https://example.com/sitemap.xml"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max URLs per file</label>
              <input
                type="number"
                value={maxUrlsPerFile}
                onChange={(e) => setMaxUrlsPerFile(Number(e.target.value))}
                min="1"
                max="50000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSplit}
              disabled={isProcessing || !sitemapUrls[0].trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessing ? <Loader className="w-4 h-4 animate-spin" /> : <Split className="w-4 h-4" />}
              Split Sitemap
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sitemap URLs</label>
              {sitemapUrls.map((url, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                    placeholder="https://example.com/sitemap.xml"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {sitemapUrls.length > 1 && (
                    <button
                      onClick={() => removeUrl(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addUrl}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add URL
              </button>
            </div>
            <button
              onClick={handleMerge}
              disabled={isProcessing || sitemapUrls.filter(url => url.trim()).length < 2}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessing ? <Loader className="w-4 h-4 animate-spin" /> : <Merge className="w-4 h-4" />}
              Merge Sitemaps
            </button>
          </div>
        )}
      </div>

      {results && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Results</h3>
          <div className="space-y-4">
            {results.map((xml, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">
                    {mode === 'split' ? `sitemap-${index + 1}.xml` : 'merged-sitemap.xml'}
                  </span>
                  <button
                    onClick={() => downloadFile(xml, mode === 'split' ? `sitemap-${index + 1}.xml` : 'merged-sitemap.xml')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-40">
                  {xml.substring(0, 500)}...
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SitemapSplitMerger;