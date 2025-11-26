
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const UTMGenerator = () => {
  const [formData, setFormData] = useState({
    url: '',
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: ''
  });
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateUrl = () => {
    if (!formData.url) return;
    let baseUrl = formData.url.trim();
    if (!baseUrl.startsWith('http')) baseUrl = 'https://' + baseUrl;

    try {
      const url = new URL(baseUrl);
      if (formData.source) url.searchParams.set('utm_source', formData.source);
      if (formData.medium) url.searchParams.set('utm_medium', formData.medium);
      if (formData.campaign) url.searchParams.set('utm_campaign', formData.campaign);
      if (formData.term) url.searchParams.set('utm_term', formData.term);
      if (formData.content) url.searchParams.set('utm_content', formData.content);
      setGeneratedUrl(url.toString());
    } catch (error) {
      console.error('Invalid URL');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-brand-surface rounded-2xl p-8 md:p-12 shadow-sm border border-brand-medium/20">
          <p className="text-brand-dark/80 mb-10 leading-relaxed text-lg">
            Easily create UTM links to track and analyze your online marketing efforts. Customize URLs with UTM parameters to monitor traffic sources and optimize your campaigns.
          </p>

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">Website URL *</label>
              <input type="text" name="url" value={formData.url} onChange={handleChange} placeholder="https://example.com" className="w-full px-4 py-3 bg-brand-light/50 rounded-lg border border-brand-medium/40 focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark outline-none transition-all placeholder-brand-dark/30 text-brand-dark" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">UTM Source *</label>
              <input type="text" name="source" value={formData.source} onChange={handleChange} placeholder="e.g. newsletter, facebook, twitter" className="w-full px-4 py-3 bg-brand-light/50 rounded-lg border border-brand-medium/40 focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark outline-none transition-all placeholder-brand-dark/30 text-brand-dark" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">UTM Medium</label>
              <input type="text" name="medium" value={formData.medium} onChange={handleChange} placeholder="e.g. banner, email, social" className="w-full px-4 py-3 bg-brand-light/50 rounded-lg border border-brand-medium/40 focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark outline-none transition-all placeholder-brand-dark/30 text-brand-dark" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">UTM Campaign</label>
              <input type="text" name="campaign" value={formData.campaign} onChange={handleChange} placeholder="e.g. promotion, sale" className="w-full px-4 py-3 bg-brand-light/50 rounded-lg border border-brand-medium/40 focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark outline-none transition-all placeholder-brand-dark/30 text-brand-dark" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">UTM Term</label>
              <input type="text" name="term" value={formData.term} onChange={handleChange} placeholder="keywords for paid search" className="w-full px-4 py-3 bg-brand-light/50 rounded-lg border border-brand-medium/40 focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark outline-none transition-all placeholder-brand-dark/30 text-brand-dark" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">UTM Content</label>
              <input type="text" name="content" value={formData.content} onChange={handleChange} placeholder="e.g. buy-now, v1" className="w-full px-4 py-3 bg-brand-light/50 rounded-lg border border-brand-medium/40 focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark outline-none transition-all placeholder-brand-dark/30 text-brand-dark" />
            </div>

            <div className="pt-4">
              <button onClick={generateUrl} className="px-6 py-2.5 bg-brand-dark border border-brand-dark text-white font-medium rounded-lg hover:bg-brand-dark/90 transition-all shadow-sm active:scale-95 text-sm">Generate URL</button>
            </div>

            {generatedUrl && (
              <div className="mt-8 pt-8 border-t border-brand-medium/20 animate-in fade-in slide-in-from-bottom-2">
                <label className="block text-sm font-medium text-brand-dark mb-3">Generated URL</label>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-brand-light border border-brand-medium/30 rounded-lg text-brand-dark font-mono text-sm break-all">{generatedUrl}</div>
                  <button onClick={copyToClipboard} className={`flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-all shrink-0 border ${copied ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-brand-surface text-brand-dark border-brand-medium/40 hover:bg-brand-light'}`}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UTMGenerator;
