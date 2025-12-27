
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Grid, TrendingUp, ArrowLeft, Monitor, PieChart, RotateCcw, Copy, ChevronDown, Globe, Briefcase, Sparkles, Landmark, Check, AlertCircle, X, Share2, Facebook, Linkedin, Mail } from 'lucide-react';
import { platforms } from '../data';
import { AdSpec } from '../types';
import { TOOLS_CONFIG } from '../tools';
import PlatformSection from './PlatformSection';
import PreviewModal from './PreviewModal';
import ToolHeader from './ToolHeader';
import MultiSelect from './MultiSelect';
import Header from './Header';
import RocketCursor from './RocketCursor';
import AboutUs from './AboutUs';
import SEO from './SEO';

// Auth & Dashboard
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import LoginModal from './auth/LoginModal';
import PricingModal from './pricing/PricingModal';
import SubmitToolModal from './SubmitToolModal';
import UserDashboard from './dashboard/UserDashboard';
import AdminDashboard from './dashboard/AdminDashboard';

// Legal
import CookieConsent from './legal/CookieConsent';
import PrivacyPolicyModal from './legal/PrivacyPolicyModal';

// Tool Components
import UTMGenerator from './UTMGenerator';
import AdBudgetPlanner from './AdBudgetPlanner';
import ROICalculator from './ROICalculator';
import SaasCalculator from './SaasCalculator';
import ChurnCalculator from './ChurnCalculator';
import SoftwareRoiCalculator from './SoftwareRoiCalculator';
import ClvCalculator from './ClvCalculator';
import LandingPageImpactCalculator from './LandingPageImpactCalculator';
import EbitdaCalculator from './EbitdaCalculator';
import EnterpriseSeoCalculator from './EnterpriseSeoCalculator';
import GoogleAdMockup from './GoogleAdMockup';
import FacebookAdMockup from './FacebookAdMockup';
import TikTokAdMockup from './TikTokAdMockup';
import SchemaMarkupGenerator from './SchemaMarkupGenerator';
import GoogleSerpSimulator from './GoogleSerpSimulator';
import MobileFirstIndexTool from './MobileFirstIndexTool';
import MobileFriendlyTest from './MobileFriendlyTest';
import AmpValidator from './AmpValidator';
import FetchRenderTool from './FetchRenderTool';
import PreRenderingTool from './PreRenderingTool';
import RichResultsTest from './RichResultsTest';
import VatCalculator from './VatCalculator';
import CorporateTaxCalculator from './CorporateTaxCalculator';
import AusCompanyTaxCalculator from './AusCompanyTaxCalculator';
import AusSimpleTaxCalculator from './AusSimpleTaxCalculator';
import AiKeywordResearch from './AiKeywordResearch';
import AiSearchVisibility from './AiSearchVisibility';
import URLInspectionTool from './URLInspectionTool';
import SitemapGenerator from './SitemapGenerator';

// Christmas Components
import ChristmasCountdown from './ChristmasCountdown';
import SnowAnimation from './SnowAnimation';

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
  'sitemap-generator': SitemapGenerator,
  'url-inspection': URLInspectionTool,
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
  'keyword-research': AiKeywordResearch,
  'ai-search-visibility': AiSearchVisibility,
};

const AppContent = () => {
  const { isPricingModalOpen, setPricingModalOpen, authError, clearError } = useAuth(); // Use Global State
  const [currentView, setCurrentView] = useState<'home' | 'tools' | 'dashboard' | 'admin' | 'about' | 'settings'>('home');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [toolSearchQuery, setToolSearchQuery] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isSubmitToolOpen, setIsSubmitToolOpen] = useState(false);
  const [paymentNotification, setPaymentNotification] = useState<{ type: 'success' | 'cancelled' | null; message: string }>({ type: null, message: '' });
  
  // Global State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });
  const [currency, setCurrency] = useState('USD');

  // Scroll to top when tool changes
  useEffect(() => {
    if (activeToolId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeToolId]);

  // --- SECURITY FEATURES ---
  useEffect(() => {
    // 1. Prevent Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Prevent DevTools Shortcuts & Copying
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Prevent Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (DevTools)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        e.preventDefault();
      }
      // Prevent Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
      }
      // Prevent Ctrl+C (Copy) - Optional, but requested for "no body can copy"
      if (e.ctrlKey && e.key === 'c') {
        // Allow copy only if user is focused on an input/textarea
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
           e.preventDefault();
        }
      }
    };

    // 3. Inject CSS to prevent text selection (visually)
    const style = document.createElement('style');
    style.id = 'security-style';
    style.innerHTML = `
      body {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      /* Allow selection in inputs so forms work */
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
    `;
    document.head.appendChild(style);

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      const existingStyle = document.getElementById('security-style');
      if (existingStyle) existingStyle.remove();
    };
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    // Add transition class for smooth theme change
    const root = document.documentElement;
    root.classList.add('theme-transition');
    
    // Toggle the theme
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    
    // Remove transition class after animation completes
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);
  };

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
  const [isShareOpen, setIsShareOpen] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // Close share dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setIsShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle payment success/cancel URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success') {
      setPaymentNotification({
        type: 'success',
        message: 'Payment successful! Your subscription is now active. Welcome to Pro!'
      });
      // Navigate to dashboard to show updated subscription
      setCurrentView('dashboard');
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
      // Auto-dismiss after 8 seconds
      setTimeout(() => setPaymentNotification({ type: null, message: '' }), 8000);
    } else if (paymentStatus === 'cancelled') {
      setPaymentNotification({
        type: 'cancelled',
        message: 'Payment was cancelled. No charges were made. Feel free to try again when ready.'
      });
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
      // Auto-dismiss after 6 seconds
      setTimeout(() => setPaymentNotification({ type: null, message: '' }), 6000);
    }
  }, []);

  // Derived unique values (Memoized)
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

  const navigateTo = (view: 'home' | 'tools' | 'dashboard' | 'admin' | 'about' | 'settings') => {
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

  // Static Grouping for Sidebar (Persistent Order)
  const allToolsByCategory = useMemo(() => {
    const groups: Record<string, typeof TOOLS_CONFIG[number][]> = {};
    const preferredOrder = ['AI & Trends', 'Ad Mockups', 'Technical SEO', 'Marketing Calculators', 'SaaS & Business', 'Tax & Finance'];
    
    // Initialize with preferred order
    preferredOrder.forEach(cat => groups[cat] = []);
    
    TOOLS_CONFIG.forEach(tool => {
        if (!groups[tool.category]) groups[tool.category] = [];
        groups[tool.category].push(tool);
    });
    
    return groups;
  }, []);

  // Filtered Tools for Grid View
  const groupedTools = useMemo(() => {
    const filtered = TOOLS_CONFIG.filter(tool => 
      tool.title.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(toolSearchQuery.toLowerCase())
    );

    const preferredOrder = ['AI & Trends', 'Ad Mockups', 'Technical SEO', 'Marketing Calculators', 'SaaS & Business', 'Tax & Finance'];
    const groups: Record<string, typeof TOOLS_CONFIG[number][]> = {};
    
    preferredOrder.forEach(cat => {
        const tools = filtered.filter(t => t.category === cat);
        if (tools.length > 0) groups[cat] = tools;
    });
    
    // Add remaining categories that might not be in preferredOrder
    filtered.forEach(tool => {
        if (!preferredOrder.includes(tool.category)) {
            if (!groups[tool.category]) groups[tool.category] = [];
            if (!groups[tool.category].includes(tool)) groups[tool.category].push(tool);
        }
    });
    
    return groups;
  }, [toolSearchQuery]);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string, text: string, border: string }> = {
      blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'dark:hover:border-blue-500/50' },
      purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'dark:hover:border-purple-500/50' },
      pink: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400', border: 'dark:hover:border-pink-500/50' },
      emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'dark:hover:border-emerald-500/50' },
      teal: { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400', border: 'dark:hover:border-teal-500/50' },
      indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400', border: 'dark:hover:border-indigo-500/50' },
      orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', border: 'dark:hover:border-orange-500/50' },
      red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', border: 'dark:hover:border-red-500/50' },
      green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', border: 'dark:hover:border-green-500/50' },
    };
    return colors[color] || colors.blue;
  };

  const activeToolConfig = activeToolId ? TOOLS_CONFIG.find(t => t.id === activeToolId) : null;
  const ActiveToolComponent = activeToolId ? TOOL_COMPONENTS[activeToolId] : null;

  // View Routing Logic
  const renderView = () => {
    if (currentView === 'dashboard') {
        return (
            <>
                <SEO 
                    title="User Dashboard" 
                    description="Manage your Perf X Ads subscription, view usage credits, and update your profile settings."
                    type="website"
                />
                <UserDashboard onShowPricing={() => setPricingModalOpen(true)} theme={theme} toggleTheme={toggleTheme} initialTab="overview" />
            </>
        );
    }
    if (currentView === 'settings') {
        return (
            <>
                <SEO 
                    title="Settings" 
                    description="Configure your Perf X Ads account preferences and security settings."
                    type="website"
                />
                <UserDashboard onShowPricing={() => setPricingModalOpen(true)} theme={theme} toggleTheme={toggleTheme} initialTab="settings" />
            </>
        );
    }
    if (currentView === 'admin') {
        return (
            <>
                <SEO 
                    title="Admin Portal" 
                    description="Perf X Ads Administrative Control Panel."
                    type="website"
                />
                <AdminDashboard />
            </>
        );
    }
    if (currentView === 'about') {
        return (
            <>
                <SEO 
                    title="About Us" 
                    description="Learn about the mission behind Perf X Ads and our technology partner DMSPrism."
                    type="article"
                />
                <AboutUs />
            </>
        );
    }
    
    if (currentView === 'tools') {
        const Sidebar = () => (
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pr-2 custom-scrollbar">
                <div className="mb-6">
                    <button 
                        onClick={() => setActiveToolId(null)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all text-left mb-4 ${!activeToolId ? 'bg-brand-dark text-brand-light shadow-md' : 'bg-brand-surface border border-brand-medium/20 text-brand-dark hover:bg-brand-light'}`}
                    >
                        <Grid className="w-4 h-4" /> All Tools
                    </button>
                    
                    {activeToolId && (
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-brand-medium" />
                            <input 
                                type="text" 
                                placeholder="Find tool..." 
                                className="w-full pl-9 pr-3 py-2 bg-brand-surface border border-brand-medium/20 rounded-lg text-xs focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-brand-dark placeholder-brand-dark/40"
                                value={toolSearchQuery}
                                onChange={(e) => {
                                    setToolSearchQuery(e.target.value);
                                    if(e.target.value) setActiveToolId(null); // Switch to grid view on search
                                }}
                            />
                        </div>
                    )}
                </div>

                {Object.entries(allToolsByCategory).map(([category, tools]) => {
                    const toolsList = tools as typeof TOOLS_CONFIG[number][];
                    const visibleTools = toolSearchQuery 
                        ? toolsList.filter(t => t.title.toLowerCase().includes(toolSearchQuery.toLowerCase()))
                        : toolsList;
                    
                    if (visibleTools.length === 0) return null;

                    return (
                        <div key={category} className="mb-6 animate-in fade-in slide-in-from-left-2 duration-300">
                            <h4 className="px-3 mb-2 text-[10px] font-bold text-brand-dark/40 uppercase tracking-wider flex items-center gap-2">
                                {category}
                            </h4>
                            <div className="space-y-0.5">
                                {visibleTools.map((tool: any) => (
                                    <button
                                        key={tool.id}
                                        onClick={() => handleToolSelect(tool.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left group ${activeToolId === tool.id ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-dark/70 hover:bg-brand-surface hover:text-brand-dark'}`}
                                    >
                                        <div className={`p-1 rounded-md ${activeToolId === tool.id ? 'bg-brand-primary/20' : 'bg-brand-light group-hover:bg-white'} transition-colors`}>
                                            <tool.icon className={`w-3.5 h-3.5 ${activeToolId === tool.id ? 'text-brand-primary' : 'text-brand-medium group-hover:text-brand-dark'}`} />
                                        </div>
                                        <span className="truncate">{tool.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </aside>
        );

        return (
            <div className="min-h-screen bg-brand-light/20 flex flex-col">
                {/* Dynamic SEO for Tools Page or Specific Tool */}
                {activeToolId && activeToolConfig ? (
                    <SEO 
                        title={activeToolConfig.title} 
                        description={activeToolConfig.description}
                        keywords={activeToolConfig.features}
                        type="website"
                        schema={{
                            "@type": "SoftwareApplication",
                            "name": activeToolConfig.title,
                            "applicationCategory": "BusinessApplication",
                            "operatingSystem": "Web",
                            "description": activeToolConfig.description,
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD"
                            }
                        }}
                    />
                ) : (
                    <SEO 
                        title="Marketing Tools Suite" 
                        description="Access free calculators, SEO validators, and ad mockups to optimize your digital marketing campaigns."
                        type="website"
                    />
                )}

                {/* Conditional Hero: Only show on main listing */}
                {!activeToolId && (
                    <div className="bg-brand-surface border-b border-brand-medium/20 pt-12 pb-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h1 className="text-3xl font-extrabold text-brand-dark mb-4 tracking-tight">Tools Suite</h1>
                            <p className="text-brand-dark/60 max-w-2xl mx-auto mb-8">
                                Professional calculators, generators, and validators.
                            </p>
                            <div className="relative max-w-lg mx-auto">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-brand-medium" />
                                </div>
                                <input 
                                  type="text" 
                                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-brand-light border border-brand-medium/20 text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all shadow-sm" 
                                  placeholder="Search tools (e.g. ROI, UTM, Tax)..." 
                                  value={toolSearchQuery} 
                                  onChange={(e) => setToolSearchQuery(e.target.value)} 
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <Sidebar />
                        
                        <div className="flex-1 min-w-0 w-full">
                            {activeToolId && activeToolConfig && ActiveToolComponent ? (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-brand-surface border border-brand-medium/20 rounded-2xl shadow-sm overflow-hidden min-h-[800px] hover:shadow-xl transition-shadow duration-300">
                                        <ToolHeader 
                                            title={activeToolConfig.title}
                                            description={activeToolConfig.description}
                                            icon={activeToolConfig.icon}
                                            category={activeToolConfig.category}
                                            features={activeToolConfig.features}
                                            onBack={() => setActiveToolId(null)}
                                        />
                                        <div className="p-0">
                                            <ActiveToolComponent currency={currency} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-12">
                                    {Object.entries(groupedTools).map(([category, tools]) => {
                                        const categoryTools = tools as typeof TOOLS_CONFIG[number][];
                                        if (categoryTools.length === 0) return null;
                                        
                                        return (
                                            <div key={category} className="scroll-mt-24">
                                                <h2 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                                                    {category} <span className="text-xs font-normal text-brand-dark/40 bg-brand-surface px-2 py-0.5 rounded-full border border-brand-medium/20">{categoryTools.length}</span>
                                                </h2>
                                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                                    {categoryTools.map((tool: any) => {
                                                        const style = getColorClasses(tool.color);
                                                        return (
                                                            <div 
                                                                key={tool.id} 
                                                                onClick={() => setActiveToolId(tool.id)} 
                                                                className="bg-brand-surface border border-brand-medium/20 rounded-xl p-5 hover:shadow-xl hover:border-brand-primary/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full relative overflow-hidden"
                                                            >
                                                                <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                                                                    <tool.icon className={`w-24 h-24 ${style.text}`} />
                                                                </div>
                                                                <div className="relative z-10">
                                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${style.bg} ${style.text} mb-4 group-hover:scale-110 transition-transform`}>
                                                                        <tool.icon className="w-5 h-5" />
                                                                    </div>
                                                                    <h3 className="font-bold text-brand-dark mb-1 group-hover:text-brand-primary transition-colors">
                                                                        {tool.title}
                                                                    </h3>
                                                                    <p className="text-sm text-brand-dark/60 line-clamp-2">
                                                                        {tool.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {Object.keys(groupedTools).length === 0 && (
                                        <div className="text-center py-20">
                                            <Search className="w-12 h-12 text-brand-medium/40 mx-auto mb-4" />
                                            <h3 className="text-lg font-bold text-brand-dark">No tools found</h3>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default Home View
    return (
      <>
        <SEO 
            title="Perf X Ads - Social Media Ad Specs & Marketing Tools" 
            description="The ultimate resource for digital marketers. Up-to-date social media ad specs, ROI calculators, mockups, and AI-powered SEO tools."
            keywords={['ad specs', 'marketing tools', 'roi calculator', 'social media guide', 'utm generator']}
            type="website"
        />
        <RocketCursor />
        <div className="relative bg-brand-light border-b border-brand-border transition-colors duration-300 overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,rgba(29,78,216,0.05),transparent)]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-surface shadow-sm text-brand-dark text-xs font-bold mb-8 border border-brand-border transition-colors duration-300 hover:border-brand-primary/30">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                Updated for 2025
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-brand-dark tracking-tight mb-6 leading-tight">
                The Ultimate <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Ad Specs Library</span>
              </h1>
              <p className="text-xl text-brand-dark/70 max-w-2xl mx-auto leading-relaxed mb-10">
                Instantly find the latest social media specifications. <br className="hidden md:block"/> No more outdated spreadsheets or endless searching.
              </p>
            </div>
            
            {/* Main Filter Card */}
            <div className="glass-card backdrop-blur-xl rounded-3xl p-8 max-w-5xl mx-auto transition-all duration-300">
              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-brand-medium" />
                </div>
                <input 
                  id="search-input" 
                  type="text" 
                  className="glossy-input block w-full pl-14 pr-4 py-4 rounded-2xl text-lg text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all duration-200" 
                  placeholder="Search platforms, formats, dimensions..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-brand-border transition-colors duration-300">
                <span className="text-xs font-bold text-brand-dark/50 mr-2 uppercase tracking-wide">Quick Filters:</span>
                {['Stories', 'Feed Posts', 'Ads Only', 'Square Content', 'Recently Updated'].map((filter) => (
                  <button 
                    key={filter} 
                    onClick={() => setQuickFilter(quickFilter === filter ? null : filter)} 
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 ${quickFilter === filter ? 'bg-brand-dark text-brand-light border-brand-dark shadow-md transform scale-105' : 'bg-brand-surface text-brand-dark/70 border-brand-border hover:bg-brand-light hover:border-brand-medium hover:text-brand-dark'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
                <MultiSelect label="Platform" options={uniquePlatforms} selectedValues={filters.platform} onChange={(values) => setFilters({ ...filters, platform: values })} placeholder="All Platforms" />
                <MultiSelect label="Content Type" options={uniqueContentTypes} selectedValues={filters.contentType} onChange={(values) => setFilters({ ...filters, contentType: values })} placeholder="All Types" />
                <MultiSelect label="Format" options={uniqueFileTypes} selectedValues={filters.format} onChange={(values) => setFilters({ ...filters, format: values })} placeholder="All Formats" />
                <MultiSelect label="Aspect Ratio" options={uniqueAspectRatios} selectedValues={filters.aspectRatio} onChange={(values) => setFilters({ ...filters, aspectRatio: values })} placeholder="All Ratios" />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-dark/50 ml-1 uppercase tracking-wide">Updated</label>
                  <div className="relative">
                    <select value={filters.lastUpdated} onChange={(e) => setFilters({...filters, lastUpdated: e.target.value})} className="glossy-input w-full appearance-none rounded-2xl text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 block py-3 pl-4 pr-8 transition-all duration-200 font-bold">
                      <option>Any Time</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-brand-medium pointer-events-none" />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-4">
                <p className="text-sm text-brand-dark/60 transition-colors duration-300 font-medium">
                  Showing <span className="font-bold text-brand-dark">{totalSpecs}</span> specifications across <span className="font-bold text-brand-dark">{totalPlatforms}</span> platforms
                </p>
                <div className="flex items-center gap-3 relative" ref={shareRef}>
                  <button onClick={resetFilters} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-brand-dark/70 bg-brand-surface border border-brand-border rounded-xl hover:bg-brand-light hover:text-brand-dark transition-all duration-200"><RotateCcw className="w-4 h-4" /> Reset Filters</button>
                  <div className="relative">
                    <button 
                        onClick={() => setIsShareOpen(!isShareOpen)} 
                        className="magic-btn group/share"
                    >
                        <div className={`magic-btn-content px-6 border transition-all duration-300 ${isShareOpen ? 'bg-brand-primary text-white border-brand-primary' : 'bg-brand-dark border-brand-dark text-brand-light hover:bg-brand-dark/90'}`}>
                            <Share2 className="w-4 h-4" />
                            <span className="font-bold">Share</span>
                        </div>
                    </button>

                    {isShareOpen && (
                        <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] bg-brand-surface rounded-2xl shadow-xl border border-brand-medium/20 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                            <h4 className="text-xs font-bold text-brand-dark/50 uppercase tracking-wide mb-3">Share via</h4>
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                <a 
                                   href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("Check out Perf X Ads - The Ultimate Ad Specs Library")}`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="flex items-center justify-center p-3 rounded-xl bg-brand-light hover:bg-black hover:text-white transition-colors text-brand-dark group" 
                                   title="X (Twitter)"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                </a>
                                <a 
                                   href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="flex items-center justify-center p-3 rounded-xl bg-brand-light hover:bg-[#1877F2] hover:text-white transition-colors text-brand-dark group" 
                                   title="Facebook"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a 
                                   href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="flex items-center justify-center p-3 rounded-xl bg-brand-light hover:bg-[#0A66C2] hover:text-white transition-colors text-brand-dark group" 
                                   title="LinkedIn"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a 
                                   href={`https://wa.me/?text=${encodeURIComponent(`Check out Perf X Ads: ${window.location.href}`)}`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="flex items-center justify-center p-3 rounded-xl bg-brand-light hover:bg-[#25D366] hover:text-white transition-colors text-brand-dark group" 
                                   title="WhatsApp"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                </a>
                            </div>
                            
                            <button 
                                onClick={copyUrl} 
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${isCopied ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-brand-light text-brand-dark hover:bg-brand-medium/20'}`}
                            >
                                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {isCopied ? 'Link Copied!' : 'Copy Link'}
                            </button>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {filteredPlatforms.length > 0 ? (
            <div className="space-y-4">
              {filteredPlatforms.map(platform => (<PlatformSection key={platform.id} platform={platform} onPreview={handlePreview} forceExpand={isFiltering} />))}
            </div>
          ) : (
            <div className="text-center py-24 bg-brand-surface rounded-3xl border border-brand-border border-dashed shadow-sm transition-colors duration-300">
              <Search className="w-16 h-16 text-brand-medium/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-2">No specs match your filters</h3>
              <p className="text-brand-dark/50 mb-8">Try adjusting your search or filters to find what you're looking for.</p>
              <button onClick={resetFilters} className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:opacity-90 transition-all duration-200 shadow-lg shadow-brand-primary/25">Clear All Filters</button>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark font-inter transition-colors duration-300 select-none">
      {/* Payment Success/Cancel Notification */}
      {paymentNotification.type && (
        <div className={`fixed top-24 right-8 z-[300] px-6 py-4 rounded-xl shadow-2xl flex items-start gap-3 animate-in slide-in-from-right-4 fade-in duration-300 max-w-sm border ${
          paymentNotification.type === 'success' 
            ? 'bg-green-600 text-white border-green-500' 
            : 'bg-yellow-500 text-white border-yellow-400'
        }`}>
            {paymentNotification.type === 'success' ? (
              <Check className="w-5 h-5 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            )}
            <div className="flex-1">
                <h4 className="font-bold text-sm mb-1">
                  {paymentNotification.type === 'success' ? 'Payment Successful!' : 'Payment Cancelled'}
                </h4>
                <p className="text-xs opacity-90 leading-relaxed">{paymentNotification.message}</p>
            </div>
            <button 
              onClick={() => setPaymentNotification({ type: null, message: '' })} 
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
        </div>
      )}

      {authError && (
        <div className="fixed top-24 right-8 z-[300] px-6 py-4 bg-red-600 text-white rounded-xl shadow-2xl flex items-start gap-3 animate-in slide-in-from-right-4 fade-in duration-300 max-w-sm border border-red-500">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div className="flex-1">
                <h4 className="font-bold text-sm mb-1">Authentication Error</h4>
                <p className="text-xs opacity-90 leading-relaxed">{authError}</p>
            </div>
            <button onClick={clearError} className="p-1 hover:bg-white/20 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
        </div>
      )}

      <Header 
        currentView={currentView}
        onNavigate={navigateTo}
        onPlatformSelect={handlePlatformSelect}
        onToolSelect={handleToolSelect}
        toggleTheme={toggleTheme}
        theme={theme}
        currency={currency}
        setCurrency={setCurrency}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenPricing={() => setPricingModalOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenSubmitTool={() => setIsSubmitToolOpen(true)}
      />

      {/* Christmas Countdown Banner */}
      <ChristmasCountdown onClaimOffer={() => setPricingModalOpen(true)} />

      <main className="transition-opacity duration-300">
        {renderView()}
      </main>

      <footer className="bg-brand-surface border-t border-brand-border py-12 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src={theme === 'dark' ? '/perfxads-logo-dark.svg' : '/perfxads-logo-light.svg'} 
                alt="Perfxads" 
                className="h-8 w-auto object-contain"
              />
            </div>
            <span className="hidden md:inline text-brand-medium/50">|</span>
            <a 
              href="https://dmsprism.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold text-brand-dark/40 uppercase tracking-wider hover:text-brand-primary transition-colors"
            >
              Powered by DMSPrism
            </a>
          </div>
          <div className="flex items-center gap-8 text-sm font-medium text-brand-dark/50">
             <button onClick={() => navigateTo('about')} className="hover:text-brand-dark transition-colors">About Us</button>
             <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-brand-dark transition-colors">Privacy Policy</button>
             <button onClick={() => {}} className="hover:text-brand-dark transition-colors">Terms of Service</button>
             <span>© 2025 Perf X Ads</span>
          </div>
        </div>
      </footer>
      
      {/* Modals */}
      {selectedSpec && (<PreviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} spec={selectedSpec} />)}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <PricingModal isOpen={isPricingModalOpen} onClose={() => setPricingModalOpen(false)} />
      <SubmitToolModal isOpen={isSubmitToolOpen} onClose={() => setIsSubmitToolOpen(false)} />
      
      {/* Legal & Consent */}
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <CookieConsent onOpenPrivacy={() => setIsPrivacyOpen(true)} />
      
      {/* Christmas Snow Animation */}
      <SnowAnimation />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
