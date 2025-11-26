
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Grid, TrendingUp, ArrowLeft, Monitor, PieChart, RotateCcw, Copy, ChevronDown, Globe, Briefcase } from 'lucide-react';
import { platforms } from './data';
import { AdSpec } from './types';
import { TOOLS_CONFIG } from './tools';
import PlatformSection from './components/PlatformSection';
import PreviewModal from './components/PreviewModal';
import ToolHeader from './components/ToolHeader';
import MultiSelect from './components/MultiSelect';
import Header from './components/Header';
import RocketCursor from './components/RocketCursor';

// Tool Components
import UTMGenerator from './components/UTMGenerator';
import AdBudgetPlanner from './components/AdBudgetPlanner';
import ROICalculator from './components/ROICalculator';
import SaasCalculator from './components/SaasCalculator';
import ChurnCalculator from './components/ChurnCalculator';
import SoftwareRoiCalculator from './components/SoftwareRoiCalculator';
import ClvCalculator from './components/ClvCalculator';
import LandingPageImpactCalculator from './components/LandingPageImpactCalculator';
import EbitdaCalculator from './components/EbitdaCalculator';
import EnterpriseSeoCalculator from './components/EnterpriseSeoCalculator';
import GoogleAdMockup from './components/GoogleAdMockup';
import FacebookAdMockup from './components/FacebookAdMockup';
import TikTokAdMockup from './components/TikTokAdMockup';
import SchemaMarkupGenerator from './components/SchemaMarkupGenerator';
import GoogleSerpSimulator from './components/GoogleSerpSimulator';
import MobileFirstIndexTool from './components/MobileFirstIndexTool';
import MobileFriendlyTest from './components/MobileFriendlyTest';
import AmpValidator from './components/AmpValidator';
import FetchRenderTool from './components/FetchRenderTool';
import PreRenderingTool from './components/PreRenderingTool';
import RichResultsTest from './components/RichResultsTest';
import VatCalculator from './components/VatCalculator';
import CorporateTaxCalculator from './components/CorporateTaxCalculator';
import AusCompanyTaxCalculator from './components/AusCompanyTaxCalculator';
import AusSimpleTaxCalculator from './components/AusSimpleTaxCalculator';

// Mapping IDs to Components
const TOOL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'utm': UTMGenerator,
  'budget': AdBudgetPlanner,
  'roi': ROICalculator,
  'saas': SaasCalculator,
  'churn': ChurnCalculator,
  'software-roi': SoftwareRoiCalculator,
  'clv': ClvCalculator,
  'landing-page': LandingPageImpactCalculator,
  'ebitda': EbitdaCalculator,
  'enterprise-seo': EnterpriseSeoCalculator,
  'google-mockup': GoogleAdMockup,
  'facebook-mockup': FacebookAdMockup,
  'tiktok-mockup': TikTokAdMockup,
  'schema-generator': SchemaMarkupGenerator,
  'serp-simulator': GoogleSerpSimulator,
  'mobile-index': MobileFirstIndexTool,
  'mobile-friendly': MobileFriendlyTest,
  'amp-validator': AmpValidator,
  'fetch-render': FetchRenderTool,
  'pre-rendering': PreRenderingTool,
  'rich-results': RichResultsTest,
  'vat-calculator': VatCalculator,
  'us-corporate-tax': CorporateTaxCalculator,
  'aus-company-tax': AusCompanyTaxCalculator,
  'aus-simple-tax': AusSimpleTaxCalculator,
};

const App = () => {
  const [currentView, setCurrentView] = useState<'home' | 'tools'>('home');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [toolSearchQuery, setToolSearchQuery] = useState('');
  
  // Global State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    platform: [] as string[],
    contentType: [] as string[],
    format: [] as string[],
    aspectRatio: [] as string[],
    lastUpdated: 'Any Time'
  });

  const [selectedSpec, setSelectedSpec] = useState<AdSpec | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Derived unique values
  const uniquePlatforms = useMemo(() => platforms.map(p => p.name).sort(), []);
  const uniqueAspectRatios = useMemo(() => {
    const ratios = new Set<string>();
    platforms.forEach(p => p.specs.forEach(s => ratios.add(s.aspectRatio)));
    return Array.from(ratios).sort();
  }, []);
  const uniqueFileTypes = useMemo(() => {
    const types = new Set<string>();
    platforms.forEach(p => p.specs.forEach(s => s.fileType.forEach(t => types.add(t))));
    return Array.from(types).sort();
  }, []);
  const uniqueContentTypes = useMemo(() => {
    const types = new Set<string>();
    platforms.forEach(p => p.specs.forEach(s => types.add(s.format)));
    return Array.from(types).sort();
  }, []);

  const filteredPlatforms = useMemo(() => {
    return platforms.map(platform => {
      const matchingSpecs = platform.specs.filter(spec => {
        const matchesSearch = 
          searchQuery === '' ||
          spec.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          spec.notes.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesQuickFilter = true;
        if (quickFilter === 'Stories') matchesQuickFilter = spec.title.toLowerCase().includes('story');
        if (quickFilter === 'Feed Posts') matchesQuickFilter = spec.title.toLowerCase().includes('feed') || spec.title.toLowerCase().includes('post');
        if (quickFilter === 'Ads Only') matchesQuickFilter = spec.title.toLowerCase().includes('ad') || spec.title.toLowerCase().includes('sponsored');
        if (quickFilter === 'Square Content') matchesQuickFilter = spec.aspectRatio === '1:1';
        if (quickFilter === 'Recently Updated') {
           const year = parseInt(platform.lastUpdated.split('-')[0]);
           matchesQuickFilter = year >= 2025;
        }

        const matchesPlatform = filters.platform.length === 0 || filters.platform.includes(platform.name);
        const matchesContentType = filters.contentType.length === 0 || filters.contentType.includes(spec.format);
        const matchesFormat = filters.format.length === 0 || spec.fileType.some(t => filters.format.includes(t));
        const matchesAspectRatio = filters.aspectRatio.length === 0 || filters.aspectRatio.includes(spec.aspectRatio);
        
        let matchesDate = true;
        if (filters.lastUpdated === '2025') matchesDate = platform.lastUpdated.startsWith('2025');
        if (filters.lastUpdated === '2024') matchesDate = platform.lastUpdated.startsWith('2024');

        return matchesSearch && matchesQuickFilter && matchesPlatform && matchesContentType && matchesFormat && matchesAspectRatio && matchesDate;
      });

      return { ...platform, specs: matchingSpecs };
    }).filter(p => p.specs.length > 0); 
  }, [searchQuery, quickFilter, filters]);

  const isFiltering = useMemo(() => {
    return searchQuery !== '' || quickFilter !== null || filters.platform.length > 0 || 
           filters.contentType.length > 0 || filters.format.length > 0 || 
           filters.aspectRatio.length > 0 || filters.lastUpdated !== 'Any Time';
  }, [searchQuery, quickFilter, filters]);

  const totalSpecs = filteredPlatforms.reduce((acc, p) => acc + p.specs.length, 0);
  const totalPlatforms = filteredPlatforms.length;

  const handlePreview = (spec: AdSpec) => {
    setSelectedSpec(spec);
    setIsModalOpen(true);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setQuickFilter(null);
    setFilters({ platform: [], contentType: [], format: [], aspectRatio: [], lastUpdated: 'Any Time' });
  };

  const copyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const navigateTo = (view: 'home' | 'tools') => {
    setCurrentView(view);
    if (view === 'tools') setActiveToolId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlatformSelect = (platformId: string) => {
    navigateTo('home');
    setTimeout(() => {
        const element = document.getElementById(platformId);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    }, 100);
  };

  const handleToolSelect = (toolId: string) => {
    setActiveToolId(toolId);
    setCurrentView('tools');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic Group Tools
  const groupedTools = useMemo(() => {
    const filtered = TOOLS_CONFIG.filter(tool => 
      tool.title.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(toolSearchQuery.toLowerCase())
    );

    // Get unique categories from config while preserving order if possible
    // We prefer specific order: SEO, Digital Marketing, Ad Mockups, Business Tools
    const preferredOrder = ['SEO Tools', 'Digital Marketing', 'Ad Mockups', 'Business Tools'];
    const allCategories = Array.from(new Set(TOOLS_CONFIG.map(t => t.category)));
    
    // Sort categories based on preferred order
    const sortedCategories = allCategories.sort((a, b) => {
        const indexA = preferredOrder.indexOf(a);
        const indexB = preferredOrder.indexOf(b);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });

    const groups: Record<string, typeof TOOLS_CONFIG[number][]> = {};
    sortedCategories.forEach(cat => {
        const tools = filtered.filter(t => t.category === cat);
        if (tools.length > 0) groups[cat] = tools;
    });
    
    return groups;
  }, [toolSearchQuery]);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string, text: string, border: string }> = {
      blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'dark:hover:border-blue-500/30' },
      purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'dark:hover:border-purple-500/30' },
      pink: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400', border: 'dark:hover:border-pink-500/30' },
      emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'dark:hover:border-emerald-500/30' },
      teal: { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400', border: 'dark:hover:border-teal-500/30' },
      indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400', border: 'dark:hover:border-indigo-500/30' },
      orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', border: 'dark:hover:border-orange-500/30' },
      red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', border: 'dark:hover:border-red-500/30' },
      green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', border: 'dark:hover:border-green-500/30' },
    };
    return colors[color] || colors.blue;
  };

  const getCategoryIcon = (category: string) => {
      switch(category) {
          case 'SEO Tools': return Globe;
          case 'Digital Marketing': return TrendingUp;
          case 'Ad Mockups': return Monitor;
          case 'Business Tools': return PieChart;
          default: return Grid;
      }
  };

  // Active Tool Logic
  const activeToolConfig = activeToolId ? TOOLS_CONFIG.find(t => t.id === activeToolId) : null;
  const ActiveToolComponent = activeToolId ? TOOL_COMPONENTS[activeToolId] : null;

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark font-inter transition-colors duration-300">
      
      <Header 
        currentView={currentView}
        onNavigate={navigateTo}
        onPlatformSelect={handlePlatformSelect}
        onToolSelect={handleToolSelect}
        toggleTheme={toggleTheme}
        theme={theme}
      />

      <main className="transition-opacity duration-300">
        {currentView === 'tools' ? (
          <div className="min-h-[calc(100vh-64px)]">
            
            {/* Tool View */}
            {activeToolConfig && ActiveToolComponent ? (
               <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                 {/* Tool Sticky Nav */}
                 <div className="bg-brand-surface border-b border-brand-medium/20 sticky top-20 z-30 shadow-sm transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex items-center justify-between py-4">
                        <button onClick={() => setActiveToolId(null)} className="flex items-center gap-2 text-sm font-medium text-brand-dark/60 hover:text-brand-primary transition-colors">
                          <ArrowLeft className="w-4 h-4" /> Back to Tools
                        </button>
                      </div>
                    </div>
                 </div>
                 
                 {/* Tool Content */}
                 <ToolHeader 
                    title={activeToolConfig.title}
                    description={activeToolConfig.description}
                    icon={activeToolConfig.icon}
                    category={activeToolConfig.category}
                    features={activeToolConfig.features}
                 />
                 <ActiveToolComponent currency={currency} />
               </div>
            ) : (
                /* Tools Dashboard */
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-dark rounded-xl text-brand-light mb-6 transition-colors duration-300">
                            <Grid className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-brand-dark mb-4 tracking-tight">Marketing Tools Suite</h1>
                        <p className="text-lg text-brand-dark/60 leading-relaxed mb-8">
                            A collection of powerful calculators and generators designed for performance marketers, media buyers, and growth teams.
                        </p>
                        <div className="relative max-w-md mx-auto">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-brand-medium" />
                            </div>
                            <input type="text" className="block w-full pl-11 pr-4 py-3 bg-brand-surface border border-brand-medium/40 rounded-xl text-brand-dark placeholder-brand-dark/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all duration-200 shadow-sm" placeholder="Find a tool..." value={toolSearchQuery} onChange={(e) => setToolSearchQuery(e.target.value)} />
                        </div>
                    </div>

                    {Object.entries(groupedTools).map(([category, tools]) => {
                        const categoryTools = tools as typeof TOOLS_CONFIG[number][];
                        const CategoryIcon = getCategoryIcon(category);
                        return categoryTools.length > 0 && (
                            <div key={category} className="mb-16 last:mb-0">
                                <h2 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                                    <CategoryIcon className="w-5 h-5 text-brand-dark/60" />
                                    {category}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {categoryTools.map((tool: any) => {
                                        const style = getColorClasses(tool.color);
                                        return (
                                            <div key={tool.id} onClick={() => setActiveToolId(tool.id)} className={`group bg-brand-surface rounded-2xl p-6 border border-brand-medium/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full ${style.border}`}>
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${style.bg} ${style.text}`}>
                                                    <tool.icon className="w-6 h-6" />
                                                </div>
                                                <h3 className={`text-lg font-bold text-brand-dark mb-2 transition-colors ${style.text.replace('text-', 'group-hover:text-')}`}>{tool.title}</h3>
                                                <p className="text-sm text-brand-dark/60 mb-6 flex-grow leading-relaxed line-clamp-3">{tool.description}</p>
                                                <div className={`flex items-center font-bold text-xs ${style.text}`}>
                                                    Open Tool <ArrowLeft className="w-3.5 h-3.5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
          </div>
        ) : (
          // Home View Logic (Unchanged)
          <>
            <RocketCursor />
            <div className="relative bg-brand-light border-b border-brand-medium/20 transition-colors duration-300">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-10"></div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#AAC0E120_1px,transparent_1px),linear-gradient(to_bottom,#AAC0E120_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
                <div className="text-center max-w-3xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-surface shadow-sm text-brand-dark text-xs font-semibold mb-6 border border-brand-medium/30 transition-colors duration-300">
                    Updated for 2025
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight mb-4 transition-colors duration-300">
                    Social Media & Ad Specs Cheat Sheet
                  </h1>
                  <p className="text-lg text-brand-dark/70 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
                    Instantly find the latest social media & ad specs in this searchable directory. 
                    Download ready-to-use templates with safe zones for any size.
                  </p>
                </div>
                {/* Filter Card */}
                <div className="bg-brand-surface rounded-2xl shadow-xl shadow-brand-dark/5 border border-brand-medium/20 p-6 max-w-5xl mx-auto transition-all duration-300">
                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-brand-medium" />
                    </div>
                    <input id="search-input" type="text" className="block w-full pl-11 pr-4 py-3.5 bg-brand-surface border border-brand-medium/40 rounded-xl text-brand-dark placeholder-brand-dark/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all duration-200" placeholder="Search platforms, formats, dimensions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-brand-light transition-colors duration-300">
                    <span className="text-sm font-semibold text-brand-dark/50 mr-1">Quick Filters:</span>
                    {['Stories', 'Feed Posts', 'Ads Only', 'Square Content', 'Recently Updated'].map((filter) => (
                      <button key={filter} onClick={() => setQuickFilter(quickFilter === filter ? null : filter)} className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${quickFilter === filter ? 'bg-brand-primary text-white border-brand-primary shadow-md' : 'bg-brand-surface text-brand-dark/80 border-brand-medium/40 hover:bg-brand-light hover:border-brand-medium'}`}>{filter}</button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <MultiSelect label="Platform" options={uniquePlatforms} selectedValues={filters.platform} onChange={(values) => setFilters({ ...filters, platform: values })} placeholder="All Platforms" />
                    <MultiSelect label="Content Type" options={uniqueContentTypes} selectedValues={filters.contentType} onChange={(values) => setFilters({ ...filters, contentType: values })} placeholder="All Types" />
                    <MultiSelect label="Format" options={uniqueFileTypes} selectedValues={filters.format} onChange={(values) => setFilters({ ...filters, format: values })} placeholder="All Formats" />
                    <MultiSelect label="Aspect Ratio" options={uniqueAspectRatios} selectedValues={filters.aspectRatio} onChange={(values) => setFilters({ ...filters, aspectRatio: values })} placeholder="All Ratios" />
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-brand-dark/50 ml-1">Last Updated</label>
                      <div className="relative">
                        <select value={filters.lastUpdated} onChange={(e) => setFilters({...filters, lastUpdated: e.target.value})} className="w-full appearance-none bg-brand-surface border border-brand-medium/40 text-brand-dark text-sm rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary block p-2.5 pr-8 transition-all duration-200">
                          <option>Any Time</option>
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-3 w-4 h-4 text-brand-medium pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-4">
                    <p className="text-sm text-brand-dark/60 transition-colors duration-300">Showing <span className="font-bold text-brand-dark">{totalSpecs}</span> specifications across <span className="font-bold text-brand-dark">{totalPlatforms}</span> platforms</p>
                    <div className="flex items-center gap-3">
                      <button onClick={resetFilters} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-dark/80 bg-brand-surface border border-brand-medium/40 rounded-lg hover:bg-brand-light hover:text-brand-dark transition-colors duration-200"><RotateCcw className="w-4 h-4" /> Reset Filters</button>
                      <button onClick={copyUrl} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-dark/80 bg-brand-surface border border-brand-medium/40 rounded-lg hover:bg-brand-light hover:text-brand-dark transition-colors duration-200 relative"><Copy className="w-4 h-4" /> {isCopied ? 'Copied!' : 'Copy URL'}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {filteredPlatforms.length > 0 ? (
                filteredPlatforms.map(platform => (<PlatformSection key={platform.id} platform={platform} onPreview={handlePreview} forceExpand={isFiltering} />))
              ) : (
                <div className="text-center py-20 bg-brand-surface rounded-2xl border border-brand-medium/20 shadow-sm transition-colors duration-300">
                  <h3 className="text-lg font-bold text-brand-dark">No specs match your filters</h3>
                  <button onClick={resetFilters} className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-lg font-medium hover:opacity-90 transition-all duration-200 mt-6">Clear All Filters</button>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <footer className="bg-brand-surface border-t border-brand-medium/20 py-12 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-dark rounded-md flex items-center justify-center text-brand-light text-xs font-bold transition-colors duration-300">P</div>
            <span className="font-bold text-brand-dark transition-colors duration-300">Perf X Ads</span>
          </div>
          <p className="text-sm text-brand-dark/50 transition-colors duration-300">© 2025 Perf X Ads. All rights reserved.</p>
        </div>
      </footer>
      {selectedSpec && (<PreviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} spec={selectedSpec} />)}
    </div>
  );
};

export default App;
