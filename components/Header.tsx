
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Moon, Sun, Monitor, LogIn, ChevronDown, Plus, LayoutGrid, Zap, Shield, User, 
  Building2, Cookie, Search, Instagram, Facebook, Twitter, Linkedin, Youtube, 
  Twitch, Ghost, ShoppingBag, Music, Cloud, Gamepad2, Server, Pin, Video, 
  MessageSquare, AtSign, Globe, Smartphone, BarChart3, PieChart, Sparkles,
  Command, X, ArrowRight, FileText, Menu, ChevronRight, Grid
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { platforms } from '../data';
import { TOOLS_CONFIG } from '../tools';

interface HeaderProps {
  currentView: 'home' | 'tools' | 'dashboard' | 'admin' | 'about' | 'settings';
  onNavigate: (view: 'home' | 'tools' | 'dashboard' | 'admin' | 'about' | 'settings') => void;
  onPlatformSelect: (platformId: string) => void;
  onToolSelect: (toolId: string) => void;
  toggleTheme: () => void;
  theme: string;
  currency: string;
  setCurrency: (currency: string) => void;
  onOpenLogin: () => void;
  onOpenPricing: () => void;
  onOpenPrivacy: () => void;
  onOpenSubmitTool: () => void;
}

const platformCategories = {
  'Major Networks': ['facebook', 'instagram', 'twitter', 'linkedin', 'snapchat'],
  'Video & Audio': ['youtube', 'tiktok', 'twitch', 'spotify'],
  'Community & Interest': ['reddit', 'pinterest', 'discord', 'etsy'],
  'Business & Tech': ['google-ads', 'threads', 'bluesky', 'mastodon']
};

const platformIcons: Record<string, any> = {
  'facebook': Facebook,
  'instagram': Instagram,
  'twitter': Twitter,
  'linkedin': Linkedin,
  'snapchat': Ghost,
  'youtube': Youtube,
  'tiktok': Video,
  'twitch': Twitch,
  'spotify': Music,
  'reddit': MessageSquare,
  'pinterest': Pin,
  'discord': Gamepad2,
  'etsy': ShoppingBag,
  'google-ads': Search,
  'threads': AtSign,
  'bluesky': Cloud,
  'mastodon': Server
};

const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onNavigate, 
  onPlatformSelect,
  onToolSelect,
  toggleTheme, 
  theme, 
  currency, 
  setCurrency, 
  onOpenLogin,
  onOpenPricing,
  onOpenPrivacy,
  onOpenSubmitTool
}) => {
  const { user, isPro } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mega Menu State
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const timeoutRef = useRef<any>(null);

  // Advanced Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Search Logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { tools: [], platforms: [], specs: [] };
    const q = searchQuery.toLowerCase();

    // Search Tools
    const matchedTools = TOOLS_CONFIG.filter(t => 
        t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    ).slice(0, 3);

    // Search Platforms
    const matchedPlatforms = platforms.filter(p => 
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    ).slice(0, 2);

    // Search Specs
    const matchedSpecs = [];
    for (const p of platforms) {
        for (const s of p.specs) {
            if (s.title.toLowerCase().includes(q) || s.notes.toLowerCase().includes(q)) {
                matchedSpecs.push({ ...s, platformName: p.name, platformId: p.id });
            }
        }
    }
    
    return {
        tools: matchedTools,
        platforms: matchedPlatforms,
        specs: matchedSpecs.slice(0, 4)
    };
  }, [searchQuery]);

  const hasResults = searchResults.tools.length > 0 || searchResults.platforms.length > 0 || searchResults.specs.length > 0;

  // Keyboard Shortcut for Search (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchActive(true);
      }
      if (e.key === 'Escape') {
        setIsSearchActive(false);
        searchInputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 200);
  };

  const toggleMobileSection = (section: string) => {
    setMobileExpandedSection(mobileExpandedSection === section ? null : section);
  };

  const handleMobileNavigate = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  // Group tools for menu display
  const toolCategories = Array.from(new Set(TOOLS_CONFIG.map(t => t.category)));

  // Reusable Search Results Component
  const SearchResultsList = ({ onItemClick }: { onItemClick: () => void }) => (
    <>
        {searchResults.tools.length > 0 && (
            <div className="mb-2">
                <h4 className="px-4 py-2 text-xs font-bold text-brand-dark/40 uppercase tracking-wider flex items-center gap-2">
                    <Monitor className="w-3 h-3" /> Tools
                </h4>
                {searchResults.tools.map(tool => (
                    <button 
                        key={tool.id}
                        onClick={() => { onToolSelect(tool.id); onItemClick(); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-brand-light flex items-center gap-3 group transition-colors"
                    >
                        <div className={`p-1.5 rounded-md bg-brand-light group-hover:bg-white transition-colors text-brand-primary`}>
                            <tool.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-brand-dark">{tool.title}</div>
                            <div className="text-xs text-brand-dark/50 truncate">{tool.description}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-brand-dark/30 group-hover:text-brand-dark opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </button>
                ))}
            </div>
        )}

        {searchResults.platforms.length > 0 && (
            <div className="mb-2">
                <h4 className="px-4 py-2 text-xs font-bold text-brand-dark/40 uppercase tracking-wider flex items-center gap-2 border-t border-brand-medium/10 mt-2 pt-3">
                    <Globe className="w-3 h-3" /> Platforms
                </h4>
                {searchResults.platforms.map(platform => {
                    const Icon = platformIcons[platform.id] || Globe;
                    return (
                        <button 
                            key={platform.id}
                            onClick={() => { onPlatformSelect(platform.id); onItemClick(); }}
                            className="w-full text-left px-4 py-2.5 hover:bg-brand-light flex items-center gap-3 group transition-colors"
                        >
                            <div className={`p-1.5 rounded-md bg-brand-light group-hover:bg-white transition-colors text-brand-medium group-hover:text-brand-primary`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm text-brand-dark">{platform.name}</span>
                        </button>
                    );
                })}
            </div>
        )}

        {searchResults.specs.length > 0 && (
            <div>
                <h4 className="px-4 py-2 text-xs font-bold text-brand-dark/40 uppercase tracking-wider flex items-center gap-2 border-t border-brand-medium/10 mt-2 pt-3">
                    <FileText className="w-3 h-3" /> Ad Specs
                </h4>
                {searchResults.specs.map((spec: any) => (
                    <button 
                        key={spec.id}
                        onClick={() => { 
                            onPlatformSelect(spec.platformId);
                            setTimeout(() => {
                                const el = document.getElementById(spec.platformId);
                                if(el) el.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                            onItemClick();
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-brand-light flex items-center gap-3 group transition-colors"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-brand-dark flex items-center gap-2">
                                {spec.title}
                                <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-brand-light text-brand-dark/60 border border-brand-medium/20">
                                    {spec.platformName}
                                </span>
                            </div>
                            <div className="text-xs text-brand-dark/50 font-mono mt-0.5">{spec.dimensions} • {spec.aspectRatio}</div>
                        </div>
                    </button>
                ))}
            </div>
        )}
    </>
  );

  return (
    <>
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-brand-surface/80 border-b border-brand-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        
        {/* Left: Logo & Nav */}
        <div className="flex items-center gap-4 lg:gap-8">
            {/* Mobile Menu Button */}
            <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light rounded-lg transition-colors"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center cursor-pointer group shrink-0 select-none" onClick={() => onNavigate('home')}>
              <span className="font-serif text-xl lg:text-2xl font-black tracking-tighter text-brand-dark group-hover:text-brand-primary transition-colors">
                Perfxads
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 h-16">
                
                {/* Social Specs Mega Menu */}
                <div 
                    className="relative h-full flex items-center"
                    onMouseEnter={() => handleMouseEnter('specs')}
                    onMouseLeave={handleMouseLeave}
                >
                    <button 
                        onClick={() => onNavigate('home')}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold transition-all ${currentView === 'home' || activeMenu === 'specs' ? 'bg-brand-light text-brand-dark' : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light/50'}`}
                    >
                        Social Specs <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeMenu === 'specs' ? 'rotate-180' : ''}`} />
                    </button>

                    {activeMenu === 'specs' && (
                        <div className="absolute top-full left-0 w-[800px] bg-brand-surface border border-brand-border rounded-xl shadow-xl p-6 grid grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            {Object.entries(platformCategories).map(([category, ids]) => (
                                <div key={category} className="space-y-3">
                                    <h3 className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider border-b border-brand-border pb-2">{category}</h3>
                                    <div className="space-y-1">
                                        {ids.map(id => {
                                            const platform = platforms.find(p => p.id === id);
                                            if (!platform) return null;
                                            const Icon = platformIcons[id] || Globe;
                                            return (
                                                <button 
                                                    key={platform.id}
                                                    onClick={() => { onPlatformSelect(platform.id); setActiveMenu(null); }}
                                                    className="w-full text-left p-2 rounded-lg hover:bg-brand-light transition-colors text-sm font-medium text-brand-dark flex items-center gap-2.5 group"
                                                >
                                                    <div className="text-brand-medium group-hover:text-brand-primary transition-colors">
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    {platform.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tools Mega Menu */}
                <div 
                    className="relative h-full flex items-center"
                    onMouseEnter={() => handleMouseEnter('tools')}
                    onMouseLeave={handleMouseLeave}
                >
                    <button 
                        onClick={() => onNavigate('tools')}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold transition-all ${currentView === 'tools' || activeMenu === 'tools' ? 'bg-brand-light text-brand-dark' : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light/50'}`}
                    >
                        Tools <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeMenu === 'tools' ? 'rotate-180' : ''}`} />
                    </button>

                    {activeMenu === 'tools' && (
                        <div className="absolute top-full left-0 w-[700px] bg-brand-surface border border-brand-border rounded-xl shadow-xl p-0 grid grid-cols-5 animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden">
                            <div className="col-span-2 bg-brand-light/30 p-6 border-r border-brand-border">
                                <h3 className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-4">Categories</h3>
                                <div className="space-y-1">
                                    {toolCategories.map((cat, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => { onNavigate('tools'); setActiveMenu(null); }}
                                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-brand-light transition-colors text-sm font-medium text-brand-dark flex items-center gap-2 group"
                                        >
                                            {cat === 'AI & Trends' && <Sparkles className="w-3.5 h-3.5 text-brand-medium group-hover:text-brand-primary" />}
                                            {cat === 'Technical SEO' && <Globe className="w-3.5 h-3.5 text-brand-medium group-hover:text-brand-primary" />}
                                            {cat === 'Marketing Calculators' && <BarChart3 className="w-3.5 h-3.5 text-brand-medium group-hover:text-brand-primary" />}
                                            {cat === 'Ad Mockups' && <Smartphone className="w-3.5 h-3.5 text-brand-medium group-hover:text-brand-primary" />}
                                            {cat === 'SaaS & Business' && <PieChart className="w-3.5 h-3.5 text-brand-medium group-hover:text-brand-primary" />}
                                            {cat === 'Tax & Finance' && <Building2 className="w-3.5 h-3.5 text-brand-medium group-hover:text-brand-primary" />}
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="col-span-3 p-6">
                                <h3 className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-4">Featured Tools</h3>
                                <div className="space-y-1">
                                    {TOOLS_CONFIG.slice(0, 6).map(tool => (
                                        <button 
                                            key={tool.id}
                                            onClick={() => { onToolSelect(tool.id); setActiveMenu(null); }}
                                            className="block w-full text-left p-2 rounded-lg hover:bg-brand-light transition-colors text-sm font-medium text-brand-dark flex items-center gap-3 group"
                                        >
                                            <div className="p-1.5 rounded-md bg-brand-light group-hover:bg-white dark:group-hover:bg-brand-dark/20 transition-colors">
                                                <tool.icon className="w-4 h-4 text-brand-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span>{tool.title}</span>
                                                <span className="text-[10px] text-brand-dark/40 font-normal line-clamp-1">{tool.description}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-brand-border">
                                    <button 
                                        onClick={() => { onNavigate('tools'); setActiveMenu(null); }}
                                        className="text-xs font-bold text-brand-primary hover:text-brand-dark transition-colors flex items-center gap-1"
                                    >
                                        View All Tools <ChevronDown className="w-3 h-3 -rotate-90" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Resources Mega Menu */}
                <div 
                    className="relative h-full flex items-center"
                    onMouseEnter={() => handleMouseEnter('resources')}
                    onMouseLeave={handleMouseLeave}
                >
                    <button 
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold transition-all ${activeMenu === 'resources' || currentView === 'about' ? 'bg-brand-light text-brand-dark' : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light/50'}`}
                    >
                        Resources <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeMenu === 'resources' ? 'rotate-180' : ''}`} />
                    </button>

                    {activeMenu === 'resources' && (
                        <div className="absolute top-full left-0 w-[260px] bg-brand-surface border border-brand-border rounded-xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50 flex flex-col gap-1">
                            <button 
                                onClick={() => { onNavigate('about'); setActiveMenu(null); }}
                                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-brand-light transition-colors text-sm font-medium text-brand-dark flex items-center gap-3 group"
                            >
                                <div className="p-1.5 rounded-md bg-brand-light group-hover:bg-white dark:group-hover:bg-brand-dark/20 transition-colors text-brand-primary">
                                    <Building2 className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="leading-none mb-0.5 font-bold">About Us</span>
                                    <span className="text-[10px] text-brand-dark/50">Our mission & story</span>
                                </div>
                            </button>
                            <button 
                                onClick={() => { onOpenPrivacy(); setActiveMenu(null); }}
                                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-brand-light transition-colors text-sm font-medium text-brand-dark flex items-center gap-3 group"
                            >
                                <div className="p-1.5 rounded-md bg-brand-light group-hover:bg-white dark:group-hover:bg-brand-dark/20 transition-colors text-brand-primary">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="leading-none mb-0.5 font-bold">Privacy Policy</span>
                                    <span className="text-[10px] text-brand-dark/50">Data protection</span>
                                </div>
                            </button>
                            <button 
                                onClick={() => { onOpenPrivacy(); setActiveMenu(null); }}
                                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-brand-light transition-colors text-sm font-medium text-brand-dark flex items-center gap-3 group"
                            >
                                <div className="p-1.5 rounded-md bg-brand-light group-hover:bg-white dark:group-hover:bg-brand-dark/20 transition-colors text-brand-primary">
                                    <Cookie className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="leading-none mb-0.5 font-bold">Cookie Policy</span>
                                    <span className="text-[10px] text-brand-dark/50">Preferences</span>
                                </div>
                            </button>
                            
                            <div className="my-1 border-t border-brand-border/50"></div>
                            
                            <button 
                                onClick={() => { onOpenSubmitTool(); setActiveMenu(null); }}
                                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-brand-light transition-colors text-sm font-medium text-brand-dark flex items-center gap-3 group"
                            >
                                <div className="p-1.5 rounded-md bg-brand-light group-hover:bg-white dark:group-hover:bg-brand-dark/20 transition-colors text-brand-primary">
                                    <Plus className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="leading-none mb-0.5 font-bold">Submit a Tool</span>
                                    <span className="text-[10px] text-brand-dark/50">Contribute to library</span>
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                {user && (
                    <button 
                        onClick={() => onNavigate('dashboard')}
                        className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${currentView === 'dashboard' ? 'bg-brand-light text-brand-dark' : 'text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light/50'}`}
                    >
                        Dashboard
                    </button>
                )}
            </nav>
        </div>

        {/* Center: Advanced Search (Desktop) */}
        <div ref={searchContainerRef} className="hidden lg:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className={`h-4 w-4 transition-colors ${isSearchActive ? 'text-brand-primary' : 'text-brand-dark/40'}`} />
                </div>
                <input 
                    ref={searchInputRef}
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchActive(true)}
                    className={`
                        w-full pl-10 pr-12 py-2 rounded-lg text-sm font-medium transition-all duration-200 outline-none
                        ${isSearchActive 
                            ? 'bg-brand-surface ring-2 ring-brand-primary/20 border-brand-primary text-brand-dark shadow-lg' 
                            : 'bg-brand-light/50 border border-brand-medium/20 text-brand-dark/70 hover:bg-brand-light hover:border-brand-medium/40 focus:bg-brand-surface'
                        }
                    `}
                    placeholder="Search tools, specs, platforms..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {!searchQuery ? (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-brand-medium/20 bg-brand-surface/50">
                            <Command className="w-3 h-3 text-brand-dark/40" />
                            <span className="text-[10px] font-bold text-brand-dark/40">K</span>
                        </div>
                    ) : (
                        <button onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }} className="text-brand-dark/40 hover:text-brand-dark">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Search Dropdown (Desktop) */}
            {isSearchActive && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-brand-surface rounded-xl shadow-2xl border border-brand-medium/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[70vh] overflow-y-auto">
                    {!hasResults ? (
                        <div className="p-8 text-center text-brand-dark/50">
                            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No results found for "{searchQuery}"</p>
                        </div>
                    ) : (
                        <div className="py-2">
                            <SearchResultsList onItemClick={() => setIsSearchActive(false)} />
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
            
            {/* Theme Toggle (Desktop Only to save space) */}
            <button 
                onClick={toggleTheme}
                className="hidden lg:block p-2 rounded-lg text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light transition-colors"
            >
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <div className="h-6 w-px bg-brand-border mx-1 hidden lg:block"></div>

            {/* Auth / Profile (Desktop) */}
            {user ? (
                <div className="relative hidden lg:block">
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 p-1 pl-2 rounded-full border border-brand-border hover:border-brand-medium/50 hover:bg-brand-light transition-all"
                    >
                        <span className="text-xs font-bold text-brand-dark max-w-[100px] truncate">{user.name}</span>
                        <div className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center overflow-hidden border border-brand-surface">
                            {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-4 h-4" />}
                        </div>
                    </button>

                    {isProfileOpen && (
                        <div className="absolute top-full right-0 mt-2 w-56 bg-brand-surface border border-brand-border rounded-xl shadow-xl overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 py-3 border-b border-brand-border bg-brand-light/30">
                                <p className="text-sm font-bold text-brand-dark truncate">{user.name}</p>
                                <p className="text-xs text-brand-dark/50 truncate">{user.email}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isPro ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {user.subscription.tier}
                                    </span>
                                    {isPro && <Shield className="w-3 h-3 text-indigo-600" />}
                                </div>
                            </div>
                            
                            <div className="p-1">
                                <button onClick={() => { onNavigate('dashboard'); setIsProfileOpen(false); }} className="w-full text-left px-3 py-2 text-sm font-medium text-brand-dark hover:bg-brand-light rounded-lg flex items-center gap-2">
                                    <LayoutGrid className="w-4 h-4 text-brand-medium" /> Dashboard
                                </button>
                                <button onClick={() => { onNavigate('tools'); setIsProfileOpen(false); }} className="w-full text-left px-3 py-2 text-sm font-medium text-brand-dark hover:bg-brand-light rounded-lg flex items-center gap-2">
                                    <Monitor className="w-4 h-4 text-brand-medium" /> Tools
                                </button>
                                {!isPro && (
                                    <button onClick={() => { onOpenPricing(); setIsProfileOpen(false); }} className="w-full text-left px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-2">
                                        <Zap className="w-4 h-4" /> Upgrade to Pro
                                    </button>
                                )}
                                {user.role === 'admin' && (
                                    <button onClick={() => { onNavigate('admin'); setIsProfileOpen(false); }} className="w-full text-left px-3 py-2 text-sm font-medium text-brand-dark hover:bg-brand-light rounded-lg flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-brand-medium" /> Admin
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <button 
                        onClick={onOpenLogin}
                        className="text-sm font-bold text-brand-dark hover:text-brand-primary transition-colors hidden sm:block"
                    >
                        Sign In
                    </button>
                    <button 
                        onClick={onOpenPricing}
                        className="px-4 py-2 bg-brand-dark text-brand-light text-sm font-bold rounded-lg shadow-md hover:bg-brand-dark/90 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
                    >
                        Get Pro <Zap className="w-3 h-3" />
                    </button>
                </>
            )}
        </div>
      </div>
    </header>

    {/* MOBILE MENU OVERLAY */}
    {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <div className="absolute top-0 bottom-0 left-0 w-[85%] max-w-[320px] bg-brand-surface border-r border-brand-border shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                <div className="p-5 border-b border-brand-border flex items-center justify-between">
                    <button 
                        onClick={() => handleMobileNavigate(() => onNavigate('home'))}
                        className="flex items-center gap-2"
                    >
                        <span className="font-serif text-2xl font-black tracking-tighter text-brand-dark">
                            Perfxads
                        </span>
                    </button>
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light rounded-xl transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    
                    {/* Mobile Advanced Search */}
                    <div className="mb-6 relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-brand-medium" />
                            <input 
                                type="text" 
                                placeholder="Search tools, platforms..." 
                                className="w-full pl-10 pr-10 py-3 bg-brand-light border border-brand-medium/20 rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder-brand-dark/40"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-3 text-brand-dark/40 hover:text-brand-dark"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Mobile Search Results */}
                        {searchQuery && (
                            <div className="mt-3 bg-brand-surface rounded-xl border border-brand-medium/20 shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {hasResults ? (
                                    <div className="py-2 max-h-[60vh] overflow-y-auto">
                                        <SearchResultsList onItemClick={() => setIsMobileMenuOpen(false)} />
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-brand-dark/50">
                                        <p className="text-xs">No results found</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navigation Group */}
                    <div className="space-y-1 mb-6">
                        <p className="px-4 text-xs font-bold text-brand-dark/40 uppercase tracking-wider mb-2">Menu</p>

                        {/* Platforms Accordion */}
                        <div className="overflow-hidden rounded-xl">
                            <button 
                                onClick={() => toggleMobileSection('platforms')}
                                className={`w-full text-left px-4 py-3 font-bold flex items-center justify-between transition-colors ${mobileExpandedSection === 'platforms' ? 'bg-brand-light text-brand-dark' : 'text-brand-dark/70 hover:bg-brand-light'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Globe className="w-5 h-5" /> Platforms
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform ${mobileExpandedSection === 'platforms' ? 'rotate-90' : ''}`} />
                            </button>
                            
                            {mobileExpandedSection === 'platforms' && (
                                <div className="bg-brand-light/30 space-y-1 p-2">
                                    {platforms.slice(0, 10).map(p => {
                                        const Icon = platformIcons[p.id] || Globe;
                                        return (
                                            <button 
                                                key={p.id}
                                                onClick={() => handleMobileNavigate(() => onPlatformSelect(p.id))}
                                                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-brand-dark/80 hover:text-brand-primary hover:bg-brand-light flex items-center gap-3 transition-colors"
                                            >
                                                <Icon className="w-4 h-4 opacity-70" />
                                                {p.name}
                                            </button>
                                        );
                                    })}
                                    <button 
                                        onClick={() => handleMobileNavigate(() => onNavigate('home'))}
                                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-brand-primary uppercase tracking-wide hover:bg-brand-light rounded-lg flex items-center gap-2"
                                    >
                                        <ArrowRight className="w-3 h-3" /> View All Platforms
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Tools Accordion */}
                        <div className="overflow-hidden rounded-xl">
                            <button 
                                onClick={() => toggleMobileSection('tools')}
                                className={`w-full text-left px-4 py-3 font-bold flex items-center justify-between transition-colors ${mobileExpandedSection === 'tools' || currentView === 'tools' ? 'bg-brand-light text-brand-dark' : 'text-brand-dark/70 hover:bg-brand-light'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Monitor className="w-5 h-5" /> Tools
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform ${mobileExpandedSection === 'tools' ? 'rotate-90' : ''}`} />
                            </button>
                            
                            {mobileExpandedSection === 'tools' && (
                                <div className="bg-brand-light/30 space-y-1 p-2">
                                    <button 
                                        onClick={() => handleMobileNavigate(() => onNavigate('tools'))}
                                        className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 flex items-center gap-3 mb-2"
                                    >
                                        <Grid className="w-4 h-4" /> All Tools Library
                                    </button>
                                    
                                    {/* Categories and Tools */}
                                    {toolCategories.map((category) => {
                                        const categoryTools = TOOLS_CONFIG.filter(t => t.category === category);
                                        return (
                                            <div key={category} className="mb-2">
                                                <div className="px-4 py-1.5 text-[10px] font-bold text-brand-dark/40 uppercase tracking-wider flex items-center gap-2">
                                                    {category}
                                                </div>
                                                <div className="space-y-0.5">
                                                    {categoryTools.map(tool => (
                                                        <button
                                                            key={tool.id}
                                                            onClick={() => handleMobileNavigate(() => onToolSelect(tool.id))}
                                                            className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-brand-dark/80 hover:text-brand-primary hover:bg-brand-light flex items-center gap-3 transition-colors pl-6"
                                                        >
                                                            <tool.icon className="w-3.5 h-3.5 opacity-70 shrink-0" />
                                                            <span className="truncate">{tool.title}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {user && (
                            <button 
                                onClick={() => handleMobileNavigate(() => onNavigate('dashboard'))}
                                className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors ${currentView === 'dashboard' ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-dark/70 hover:bg-brand-light'}`}
                            >
                                <User className="w-5 h-5" /> Dashboard
                            </button>
                        )}
                    </div>

                    {/* Resources Group */}
                    <div className="space-y-1">
                        <p className="px-4 text-xs font-bold text-brand-dark/40 uppercase tracking-wider mb-2 mt-6">Resources</p>
                        
                        <button 
                            onClick={() => handleMobileNavigate(() => onNavigate('about'))} 
                            className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-brand-dark/70 hover:text-brand-dark hover:bg-brand-light flex items-center gap-3"
                        >
                            <Building2 className="w-5 h-5" /> About Us
                        </button>
                        <button 
                            onClick={() => handleMobileNavigate(onOpenPrivacy)} 
                            className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-brand-dark/70 hover:text-brand-dark hover:bg-brand-light flex items-center gap-3"
                        >
                            <Shield className="w-5 h-5" /> Privacy Policy
                        </button>
                        <button 
                            onClick={() => handleMobileNavigate(onOpenSubmitTool)} 
                            className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-brand-dark/70 hover:text-brand-dark hover:bg-brand-light flex items-center gap-3"
                        >
                            <Plus className="w-5 h-5" /> Submit Tool
                        </button>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-5 border-t border-brand-border bg-brand-light/30">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between mb-5 bg-brand-surface p-1 rounded-xl border border-brand-border shadow-sm">
                        <button 
                            onClick={() => theme === 'dark' && toggleTheme()}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${theme !== 'dark' ? 'bg-brand-light text-brand-dark shadow-sm' : 'text-brand-dark/50'}`}
                        >
                            <Sun className="w-4 h-4" /> Light
                        </button>
                        <button 
                            onClick={() => theme !== 'dark' && toggleTheme()}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${theme === 'dark' ? 'bg-brand-light text-brand-dark shadow-sm' : 'text-brand-dark/50'}`}
                        >
                            <Moon className="w-4 h-4" /> Dark
                        </button>
                    </div>
                    
                    {!user ? (
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => handleMobileNavigate(onOpenLogin)}
                                className="py-3 bg-brand-surface border border-brand-border text-brand-dark font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-brand-light transition-colors"
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={() => handleMobileNavigate(onOpenPricing)}
                                className="py-3 bg-brand-dark text-brand-light font-bold rounded-xl shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                            >
                                <Zap className="w-4 h-4" /> Get Pro
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-3 bg-brand-surface border border-brand-border rounded-xl shadow-sm">
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-brand-border object-cover" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-brand-dark truncate">{user.name}</p>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${isPro ? 'bg-indigo-500' : 'bg-green-500'}`}></span>
                                    <p className="text-xs text-brand-dark/50 truncate capitalize">{user.subscription.tier} Plan</p>
                                </div>
                            </div>
                            {isPro && <Shield className="w-5 h-5 text-indigo-500" />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )}
    </>
  );
};

export default Header;
