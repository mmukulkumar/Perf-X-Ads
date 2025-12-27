import React from 'react';
import { ArrowRight, Home, Wrench, Target, TrendingUp, Code, Calculator, DollarSign, Building2 } from 'lucide-react';

interface SitemapPageProps {
  onNavigateHome: () => void;
  onNavigateTo: (view: string, toolId?: string) => void;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigateHome, onNavigateTo }) => {
  const sitemapSections = [
    {
      title: 'Main Pages',
      icon: Home,
      color: 'blue',
      links: [
        { label: 'Home', url: '/', onClick: () => onNavigateHome() },
        { label: 'All Tools', url: '/tools', onClick: () => onNavigateTo('tools') },
        { label: 'About Us', url: '/about', onClick: () => onNavigateTo('about') },
        { label: 'Thank You', url: '/thank-you', onClick: () => onNavigateTo('thank-you') },
      ]
    },
    {
      title: 'AI & Trends Tools',
      icon: TrendingUp,
      color: 'purple',
      links: [
        { label: 'AI Keyword Research', url: '/tools/keyword-research', onClick: () => onNavigateTo('tools', 'keyword-research') },
        { label: 'AI Search Visibility', url: '/tools/ai-search-visibility', onClick: () => onNavigateTo('tools', 'ai-search-visibility') },
      ]
    },
    {
      title: 'Technical SEO Tools',
      icon: Code,
      color: 'emerald',
      links: [
        { label: 'URL Inspection Tool', url: '/tools/url-inspection', onClick: () => onNavigateTo('tools', 'url-inspection') },
        { label: 'Fetch & Render Tool', url: '/tools/fetch-render', onClick: () => onNavigateTo('tools', 'fetch-render') },
        { label: 'Rich Results Test', url: '/tools/rich-results', onClick: () => onNavigateTo('tools', 'rich-results') },
        { label: 'Pre-rendering Tool', url: '/tools/pre-rendering', onClick: () => onNavigateTo('tools', 'pre-rendering') },
        { label: 'Schema Markup Generator', url: '/tools/schema-generator', onClick: () => onNavigateTo('tools', 'schema-generator') },
        { label: 'Google SERP Simulator', url: '/tools/serp-simulator', onClick: () => onNavigateTo('tools', 'serp-simulator') },
        { label: 'Sitemap Generator', url: '/tools/sitemap-generator', onClick: () => onNavigateTo('tools', 'sitemap-generator') },
        { label: 'Mobile-First Index Tool', url: '/tools/mobile-index', onClick: () => onNavigateTo('tools', 'mobile-index') },
        { label: 'Mobile-Friendly Test', url: '/tools/mobile-friendly', onClick: () => onNavigateTo('tools', 'mobile-friendly') },
        { label: 'AMP Validator', url: '/tools/amp-validator', onClick: () => onNavigateTo('tools', 'amp-validator') },
      ]
    },
    {
      title: 'Marketing Calculators',
      icon: Calculator,
      color: 'pink',
      links: [
        { label: 'ROI Calculator', url: '/tools/roi', onClick: () => onNavigateTo('tools', 'roi') },
        { label: 'Ad Budget Planner', url: '/tools/budget', onClick: () => onNavigateTo('tools', 'budget') },
        { label: 'Landing Page Impact Calculator', url: '/tools/landing-page', onClick: () => onNavigateTo('tools', 'landing-page') },
        { label: 'UTM Generator', url: '/tools/utm', onClick: () => onNavigateTo('tools', 'utm') },
        { label: 'CLV Calculator', url: '/tools/clv', onClick: () => onNavigateTo('tools', 'clv') },
        { label: 'Enterprise SEO Calculator', url: '/tools/enterprise-seo', onClick: () => onNavigateTo('tools', 'enterprise-seo') },
      ]
    },
    {
      title: 'Ad Mockups',
      icon: Target,
      color: 'indigo',
      links: [
        { label: 'Google Ad Mockup', url: '/tools/google-mockup', onClick: () => onNavigateTo('tools', 'google-mockup') },
        { label: 'Facebook Ad Mockup', url: '/tools/facebook-mockup', onClick: () => onNavigateTo('tools', 'facebook-mockup') },
        { label: 'TikTok Ad Mockup', url: '/tools/tiktok-mockup', onClick: () => onNavigateTo('tools', 'tiktok-mockup') },
      ]
    },
    {
      title: 'Tax & Finance Calculators',
      icon: DollarSign,
      color: 'orange',
      links: [
        { label: 'VAT Calculator', url: '/tools/vat-calculator', onClick: () => onNavigateTo('tools', 'vat-calculator') },
        { label: 'US Corporate Tax Calculator', url: '/tools/us-corporate-tax', onClick: () => onNavigateTo('tools', 'us-corporate-tax') },
        { label: 'Australian Company Tax Calculator', url: '/tools/aus-company-tax', onClick: () => onNavigateTo('tools', 'aus-company-tax') },
        { label: 'Australian Simple Tax Calculator', url: '/tools/aus-simple-tax', onClick: () => onNavigateTo('tools', 'aus-simple-tax') },
      ]
    },
    {
      title: 'SaaS & Business Calculators',
      icon: Building2,
      color: 'teal',
      links: [
        { label: 'SaaS Calculator', url: '/tools/saas', onClick: () => onNavigateTo('tools', 'saas') },
        { label: 'Churn Calculator', url: '/tools/churn', onClick: () => onNavigateTo('tools', 'churn') },
        { label: 'Software ROI Calculator', url: '/tools/software-roi', onClick: () => onNavigateTo('tools', 'software-roi') },
        { label: 'EBITDA Calculator', url: '/tools/ebitda', onClick: () => onNavigateTo('tools', 'ebitda') },
      ]
    },
    {
      title: 'Platform Specifications',
      icon: Wrench,
      color: 'red',
      links: [
        { label: 'Google Ads', url: '/platforms/google-ads', onClick: () => {} },
        { label: 'Facebook', url: '/platforms/facebook', onClick: () => {} },
        { label: 'Instagram', url: '/platforms/instagram', onClick: () => {} },
        { label: 'Twitter/X', url: '/platforms/twitter', onClick: () => {} },
        { label: 'LinkedIn', url: '/platforms/linkedin', onClick: () => {} },
        { label: 'YouTube', url: '/platforms/youtube', onClick: () => {} },
        { label: 'TikTok', url: '/platforms/tiktok', onClick: () => {} },
        { label: 'Snapchat', url: '/platforms/snapchat', onClick: () => {} },
        { label: 'Pinterest', url: '/platforms/pinterest', onClick: () => {} },
        { label: 'Reddit', url: '/platforms/reddit', onClick: () => {} },
        { label: 'Twitch', url: '/platforms/twitch', onClick: () => {} },
        { label: 'Spotify', url: '/platforms/spotify', onClick: () => {} },
        { label: 'Discord', url: '/platforms/discord', onClick: () => {} },
        { label: 'Threads', url: '/platforms/threads', onClick: () => {} },
        { label: 'Bluesky', url: '/platforms/bluesky', onClick: () => {} },
        { label: 'Mastodon', url: '/platforms/mastodon', onClick: () => {} },
        { label: 'Etsy', url: '/platforms/etsy', onClick: () => {} },
      ]
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; hover: string }> = {
      blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30' },
      purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30' },
      emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30' },
      pink: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800', hover: 'hover:bg-pink-100 dark:hover:bg-pink-900/30' },
      indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800', hover: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/30' },
      orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/30' },
      teal: { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800', hover: 'hover:bg-teal-100 dark:hover:bg-teal-900/30' },
      red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800', hover: 'hover:bg-red-100 dark:hover:bg-red-900/30' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent">
            Sitemap
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore all pages and tools available on PerfXAds. Find everything you need to optimize your ad campaigns and grow your business.
          </p>
        </div>

        {/* Sitemap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sitemapSections.map((section, index) => {
            const Icon = section.icon;
            const colors = getColorClasses(section.color);
            
            return (
              <div
                key={index}
                className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
              >
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${colors.text} p-2 rounded-lg bg-white/50 dark:bg-gray-800/50`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className={`text-xl font-bold ${colors.text}`}>
                    {section.title}
                  </h2>
                </div>

                {/* Links */}
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <button
                        onClick={link.onClick}
                        className={`w-full text-left flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 ${colors.hover} px-3 py-2 rounded-lg transition-all duration-200 group`}
                      >
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Link Count */}
                <div className={`mt-4 pt-4 border-t ${colors.border} text-xs ${colors.text} font-medium`}>
                  {section.links.length} page{section.links.length !== 1 ? 's' : ''}
                </div>
              </div>
            );
          })}
        </div>

        {/* Back to Home Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-primary to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* XML Sitemap Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Looking for the XML sitemap?{' '}
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary hover:underline font-medium"
            >
              View sitemap.xml
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
