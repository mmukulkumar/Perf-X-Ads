import React, { useState } from 'react';
import ToolHeader from './ToolHeader';
import { Code, Download, Copy, Check } from 'lucide-react';

const SitemapRobotsGenerator = () => {
  const [domain, setDomain] = useState('');
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [disallowedPaths, setDisallowedPaths] = useState<string[]>(['/admin/', '/private/']);
  const [crawlDelay, setCrawlDelay] = useState(1);
  const [allowAll, setAllowAll] = useState(true);
  const [generatedRobots, setGeneratedRobots] = useState('');
  const [copied, setCopied] = useState(false);

  const addDisallowedPath = () => {
    setDisallowedPaths([...disallowedPaths, '']);
  };

  const updateDisallowedPath = (index: number, value: string) => {
    const newPaths = [...disallowedPaths];
    newPaths[index] = value;
    setDisallowedPaths(newPaths);
  };

  const removeDisallowedPath = (index: number) => {
    setDisallowedPaths(disallowedPaths.filter((_, i) => i !== index));
  };

  const generateRobots = () => {
    let robots = 'User-agent: *\n';

    if (allowAll) {
      robots += 'Allow: /\n';
    }

    disallowedPaths.filter(path => path.trim()).forEach(path => {
      robots += `Disallow: ${path}\n`;
    });

    if (crawlDelay > 0) {
      robots += `Crawl-delay: ${crawlDelay}\n`;
    }

    if (sitemapUrl.trim()) {
      robots += `\nSitemap: ${sitemapUrl}\n`;
    }

    setGeneratedRobots(robots);
  };

  const downloadRobots = () => {
    const blob = new Blob([generatedRobots], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedRobots);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToolHeader
        title="Sitemap Robots.txt Generator"
        description="Generate robots.txt files with sitemap references for proper crawler guidance."
        icon={Code}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Domain (for reference)</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sitemap URL</label>
              <input
                type="url"
                value={sitemapUrl}
                onChange={(e) => setSitemapUrl(e.target.value)}
                placeholder="https://example.com/sitemap.xml"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Crawl Delay (seconds)</label>
              <input
                type="number"
                value={crawlDelay}
                onChange={(e) => setCrawlDelay(Number(e.target.value))}
                min="0"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allowAll}
                  onChange={(e) => setAllowAll(e.target.checked)}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-700">Allow all crawlers by default</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Disallowed Paths</label>
              {disallowedPaths.map((path, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={path}
                    onChange={(e) => updateDisallowedPath(index, e.target.value)}
                    placeholder="/admin/"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => removeDisallowedPath(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addDisallowedPath}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Path
              </button>
            </div>

            <button
              onClick={generateRobots}
              className="w-full px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center gap-2"
            >
              <Code className="w-4 h-4" />
              Generate Robots.txt
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Generated Robots.txt</h3>
            {generatedRobots && (
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={downloadRobots}
                  className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Download
                </button>
              </div>
            )}
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            {generatedRobots ? (
              <pre className="text-sm font-mono whitespace-pre-wrap text-gray-800">
                {generatedRobots}
              </pre>
            ) : (
              <div className="text-gray-500 text-center py-8">
                Configure options and click "Generate Robots.txt" to see the result here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapRobotsGenerator;