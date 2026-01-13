import React, { useState } from 'react';
import ToolHeader from './ToolHeader';
import { Activity, TrendingUp, Clock, Loader } from 'lucide-react';

interface FrequencyAnalysis {
  totalUrls: number;
  urlsWithLastmod: number;
  averageDaysBetweenUpdates: number;
  updateFrequency: Record<string, number>;
  recommendations: string[];
}

const SitemapFrequencyAnalyzer = () => {
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FrequencyAnalysis | null>(null);

  const analyzeFrequency = async () => {
    if (!sitemapUrl.trim()) return;

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const response = await fetch(sitemapUrl);
      if (!response.ok) throw new Error(`Failed to fetch sitemap`);
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const urlElements = xmlDoc.querySelectorAll('url');

      const lastmodDates: Date[] = [];
      const changefreq: Record<string, number> = {};

      urlElements.forEach(url => {
        const lastmod = url.querySelector('lastmod')?.textContent;
        if (lastmod) {
          lastmodDates.push(new Date(lastmod));
        }

        const freq = url.querySelector('changefreq')?.textContent || 'not specified';
        changefreq[freq] = (changefreq[freq] || 0) + 1;
      });

      const sortedDates = lastmodDates.sort((a, b) => a.getTime() - b.getTime());
      let totalDays = 0;
      let intervals = 0;

      for (let i = 1; i < sortedDates.length; i++) {
        const diff = sortedDates[i].getTime() - sortedDates[i - 1].getTime();
        totalDays += diff / (1000 * 60 * 60 * 24);
        intervals++;
      }

      const averageDays = intervals > 0 ? totalDays / intervals : 0;

      const recommendations: string[] = [];
      if (averageDays < 1) {
        recommendations.push('Your content updates very frequently. Consider using "hourly" or "daily" change frequency.');
      } else if (averageDays < 7) {
        recommendations.push('Content updates weekly. "weekly" change frequency is appropriate.');
      } else if (averageDays < 30) {
        recommendations.push('Content updates monthly. "monthly" change frequency is recommended.');
      } else {
        recommendations.push('Content updates infrequently. Consider "yearly" or "never" for static content.');
      }

      if (changefreq['not specified'] > urlElements.length * 0.5) {
        recommendations.push('Many URLs lack change frequency specification. Add appropriate changefreq values.');
      }

      setAnalysis({
        totalUrls: urlElements.length,
        urlsWithLastmod: lastmodDates.length,
        averageDaysBetweenUpdates: averageDays,
        updateFrequency: changefreq,
        recommendations,
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
        title="Sitemap Frequency Analyzer"
        description="Analyze how often URLs in your sitemap are updated and suggest optimal change frequencies."
        icon={Activity}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="url"
            value={sitemapUrl}
            onChange={(e) => setSitemapUrl(e.target.value)}
            placeholder="Enter sitemap URL (e.g., https://example.com/sitemap.xml)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            onClick={analyzeFrequency}
            disabled={isAnalyzing || !sitemapUrl.trim()}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAnalyzing ? <Loader className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
            Analyze Frequency
          </button>
        </div>
      </div>

      {analysis && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{analysis.totalUrls}</div>
              <div className="text-sm text-gray-600">Total URLs</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{analysis.urlsWithLastmod}</div>
              <div className="text-sm text-gray-600">URLs with Lastmod</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{analysis.averageDaysBetweenUpdates.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Days Between Updates</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{Object.keys(analysis.updateFrequency).length}</div>
              <div className="text-sm text-gray-600">Frequency Types</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Current Change Frequencies</h3>
              <div className="space-y-3">
                {Object.entries(analysis.updateFrequency).map(([freq, count]) => (
                  <div key={freq} className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">{freq}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{ width: `${(count / analysis.totalUrls) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-blue-800">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SitemapFrequencyAnalyzer;