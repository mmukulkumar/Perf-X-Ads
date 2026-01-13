import React, { useState } from 'react';
import ToolHeader from './ToolHeader';
import { BarChart3, TrendingUp, Calendar, Clock, Loader } from 'lucide-react';

interface SitemapStats {
  totalUrls: number;
  changefreq: Record<string, number>;
  priority: Record<string, number>;
  lastmodDates: string[];
  avgPriority: number;
  oldestLastmod: string | null;
  newestLastmod: string | null;
}

const SitemapAnalytics = () => {
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stats, setStats] = useState<SitemapStats | null>(null);

  const analyzeSitemap = async () => {
    if (!sitemapUrl.trim()) return;

    setIsAnalyzing(true);
    setStats(null);

    try {
      const response = await fetch(sitemapUrl);
      if (!response.ok) throw new Error(`Failed to fetch sitemap`);
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const urlElements = xmlDoc.querySelectorAll('url');

      const changefreq: Record<string, number> = {};
      const priority: Record<string, number> = {};
      const lastmodDates: string[] = [];
      let totalPriority = 0;

      urlElements.forEach(url => {
        const freq = url.querySelector('changefreq')?.textContent || 'not specified';
        changefreq[freq] = (changefreq[freq] || 0) + 1;

        const pri = parseFloat(url.querySelector('priority')?.textContent || '0.5');
        const priKey = pri.toString();
        priority[priKey] = (priority[priKey] || 0) + 1;
        totalPriority += pri;

        const lastmod = url.querySelector('lastmod')?.textContent;
        if (lastmod) lastmodDates.push(lastmod);
      });

      const sortedDates = lastmodDates.sort();
      const oldestLastmod = sortedDates.length > 0 ? sortedDates[0] : null;
      const newestLastmod = sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null;

      setStats({
        totalUrls: urlElements.length,
        changefreq,
        priority,
        lastmodDates,
        avgPriority: totalPriority / urlElements.length,
        oldestLastmod,
        newestLastmod,
      });
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToolHeader
        title="Sitemap Analytics"
        description="Analyze sitemap data for insights on URL distribution, update frequencies, and optimization opportunities."
        icon={BarChart3}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="url"
            value={sitemapUrl}
            onChange={(e) => setSitemapUrl(e.target.value)}
            placeholder="Enter sitemap URL (e.g., https://example.com/sitemap.xml)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={analyzeSitemap}
            disabled={isAnalyzing || !sitemapUrl.trim()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAnalyzing ? <Loader className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
            Analyze Sitemap
          </button>
        </div>
      </div>

      {stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <BarChart3 className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-indigo-600">{stats.totalUrls}</div>
              <div className="text-sm text-gray-600">Total URLs</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{stats.avgPriority.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Avg Priority</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-600">{stats.lastmodDates.length}</div>
              <div className="text-sm text-gray-600">URLs with Lastmod</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-purple-600">{Object.keys(stats.changefreq).length}</div>
              <div className="text-sm text-gray-600">Change Freq Types</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Change Frequency Distribution</h3>
              <div className="space-y-3">
                {Object.entries(stats.changefreq).map(([freq, count]) => (
                  <div key={freq} className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">{freq}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${(count / stats.totalUrls) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Priority Distribution</h3>
              <div className="space-y-3">
                {Object.entries(stats.priority).sort(([a], [b]) => parseFloat(b) - parseFloat(a)).map(([pri, count]) => (
                  <div key={pri} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{pri}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(count / stats.totalUrls) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {(stats.oldestLastmod || stats.newestLastmod) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Last Modified Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.oldestLastmod && (
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Oldest</div>
                    <div className="text-lg font-semibold text-red-600">{new Date(stats.oldestLastmod).toLocaleDateString()}</div>
                  </div>
                )}
                {stats.newestLastmod && (
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Newest</div>
                    <div className="text-lg font-semibold text-green-600">{new Date(stats.newestLastmod).toLocaleDateString()}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SitemapAnalytics;