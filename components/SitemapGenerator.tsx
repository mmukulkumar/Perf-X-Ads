import React, { useState } from 'react';
import { FileCode, Plus, Trash2, Download, AlertCircle, CheckCircle, Link2, Calendar, TrendingUp } from 'lucide-react';

interface SitemapUrl {
  id: string;
  loc: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  lastmod?: string;
}

const SitemapGenerator = () => {
  const [urls, setUrls] = useState<SitemapUrl[]>([
    {
      id: '1',
      loc: 'https://example.com/',
      changefreq: 'daily',
      priority: '1.0',
      lastmod: new Date().toISOString().split('T')[0]
    }
  ]);
  const [baseUrl, setBaseUrl] = useState('https://example.com');

  const addUrl = () => {
    const newUrl: SitemapUrl = {
      id: Date.now().toString(),
      loc: `${baseUrl}/`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: new Date().toISOString().split('T')[0]
    };
    setUrls([...urls, newUrl]);
  };

  const removeUrl = (id: string) => {
    setUrls(urls.filter(url => url.id !== id));
  };

  const updateUrl = (id: string, field: keyof SitemapUrl, value: string) => {
    setUrls(urls.map(url => 
      url.id === id ? { ...url, [field]: value } : url
    ));
  };

  const generateXml = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    return xml;
  };

  const handleExport = () => {
    const xml = generateXml();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const xml = generateXml();
    navigator.clipboard.writeText(xml);
    alert('Sitemap XML copied to clipboard!');
  };

  const addBulkUrls = () => {
    const input = prompt('Enter URLs (one per line):');
    if (!input) return;

    const newUrls = input.split('\n')
      .filter(line => line.trim())
      .map(loc => ({
        id: Date.now().toString() + Math.random(),
        loc: loc.trim(),
        changefreq: 'weekly' as const,
        priority: '0.8',
        lastmod: new Date().toISOString().split('T')[0]
      }));

    setUrls([...urls, ...newUrls]);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-2xl shadow-lg">
            <FileCode className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-brand-dark dark:text-white">XML Sitemap Generator</h1>
        <p className="text-brand-dark/70 dark:text-white/70 max-w-2xl mx-auto">
          Create professional XML sitemaps for your website. Add URLs, set priorities, and export as sitemap.xml 
          to help search engines discover and crawl your pages efficiently.
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-300">What is a Sitemap?</h3>
          </div>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            A file listing all pages on your site, helping search engines discover and index your content.
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900 dark:text-purple-300">Priority Values</h3>
          </div>
          <p className="text-sm text-purple-800 dark:text-purple-200">
            Range from 0.0 to 1.0. Higher values indicate more important pages (e.g., homepage = 1.0).
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-900 dark:text-green-300">Change Frequency</h3>
          </div>
          <p className="text-sm text-green-800 dark:text-green-200">
            Tells search engines how often the page content changes (daily, weekly, monthly, etc.).
          </p>
        </div>
      </div>

      {/* Base URL */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-brand-medium/20 hover:shadow-xl transition-all duration-300">
        <label className="block text-sm font-semibold text-brand-dark dark:text-white mb-2">
          Base URL (Domain)
        </label>
        <input
          type="url"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-4 py-3 border border-brand-medium/30 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white transition-all hover:border-brand-medium/50"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={addUrl}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4" />
          Add URL
        </button>
        <button
          onClick={addBulkUrls}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4" />
          Bulk Add URLs
        </button>
        <button
          onClick={handleExport}
          disabled={urls.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <Download className="w-4 h-4" />
          Export sitemap.xml
        </button>
        <button
          onClick={copyToClipboard}
          disabled={urls.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <FileCode className="w-4 h-4" />
          Copy XML
        </button>
      </div>

      {/* URL List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-brand-medium/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-brand-dark dark:text-white">URLs ({urls.length})</h2>
          {urls.length > 0 && (
            <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Ready to export
            </span>
          )}
        </div>

        {urls.length === 0 ? (
          <div className="text-center py-8 text-brand-dark/50 dark:text-white/50">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No URLs added yet. Click "Add URL" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {urls.map((url) => (
              <div
                key={url.id}
                className="bg-brand-light/50 dark:bg-slate-700/50 p-4 rounded-xl border border-brand-medium/20 space-y-3"
              >
                {/* URL Location */}
                <div>
                  <label className="block text-xs font-medium text-brand-dark/60 dark:text-white/60 mb-1">
                    <Link2 className="w-3 h-3 inline mr-1" />
                    URL
                  </label>
                  <input
                    type="url"
                    value={url.loc}
                    onChange={(e) => updateUrl(url.id, 'loc', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-brand-medium/30 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    placeholder="https://example.com/page"
                  />
                </div>

                {/* Row with selects and date */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Last Modified */}
                  <div>
                    <label className="block text-xs font-medium text-brand-dark/60 dark:text-white/60 mb-1">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Last Modified
                    </label>
                    <input
                      type="date"
                      value={url.lastmod}
                      onChange={(e) => updateUrl(url.id, 'lastmod', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-brand-medium/30 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    />
                  </div>

                  {/* Change Frequency */}
                  <div>
                    <label className="block text-xs font-medium text-brand-dark/60 dark:text-white/60 mb-1">
                      Change Frequency
                    </label>
                    <select
                      value={url.changefreq}
                      onChange={(e) => updateUrl(url.id, 'changefreq', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-brand-medium/30 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    >
                      <option value="always">Always</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="never">Never</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-xs font-medium text-brand-dark/60 dark:text-white/60 mb-1">
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      Priority
                    </label>
                    <select
                      value={url.priority}
                      onChange={(e) => updateUrl(url.id, 'priority', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-brand-medium/30 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    >
                      <option value="1.0">1.0 (Highest)</option>
                      <option value="0.9">0.9</option>
                      <option value="0.8">0.8</option>
                      <option value="0.7">0.7</option>
                      <option value="0.6">0.6</option>
                      <option value="0.5">0.5 (Medium)</option>
                      <option value="0.4">0.4</option>
                      <option value="0.3">0.3</option>
                      <option value="0.2">0.2</option>
                      <option value="0.1">0.1</option>
                      <option value="0.0">0.0 (Lowest)</option>
                    </select>
                  </div>

                  {/* Remove Button */}
                  <div className="flex items-end">
                    <button
                      onClick={() => removeUrl(url.id)}
                      className="w-full px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* XML Preview */}
      {urls.length > 0 && (
        <div className="bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileCode className="w-5 h-5" />
              XML Preview
            </h2>
            <button
              onClick={copyToClipboard}
              className="text-sm px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
            >
              Copy
            </button>
          </div>
          <pre className="text-xs text-green-400 font-mono overflow-x-auto bg-slate-950 p-4 rounded-lg max-h-[400px] overflow-y-auto">
            {generateXml()}
          </pre>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          How to Use Your Sitemap
        </h3>
        <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200 list-decimal list-inside">
          <li>Export your sitemap.xml file using the button above</li>
          <li>Upload it to your website's root directory (e.g., https://yourdomain.com/sitemap.xml)</li>
          <li>Submit your sitemap URL to Google Search Console and Bing Webmaster Tools</li>
          <li>Update your robots.txt file with: <code className="bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">Sitemap: https://yourdomain.com/sitemap.xml</code></li>
        </ol>
      </div>
    </div>
  );
};

export default SitemapGenerator;
