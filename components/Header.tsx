import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Moon, Sun, Monitor, LogIn, ChevronDown, Plus, LayoutGrid, Zap, Shield, User, 
  Building2, Cookie, Search, Instagram, Facebook, Twitter, Linkedin, Youtube, 
  Twitch, Ghost, ShoppingBag, Music, Cloud, Gamepad2, Server, Pin, Video, 
  MessageSquare, AtSign, Globe, Smartphone, BarChart3, PieChart, Sparkles,
  Command, X, ArrowRight, FileText, Menu, LogOut
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
  const { user, isPro, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
  
  // Mega Menu State
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
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
        setIsMobileMenuOpen(false);
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

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 200);
  };

  // Group tools for menu display
  const toolCategories = Array.from(new Set(TOOLS_CONFIG.map(t => t.category)));

  // Mobile menu expanded sections state
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);

  // Mobile Menu Content - rendered via Portal
  const mobileMenuContent = isMobileMenuOpen ? (
    <div 
      className="fixed inset-0 top-16 bg-brand-surface overflow-y-auto"
      style={{ zIndex: 9999 }}
    >
      <nav className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        
        {/* Search Bar for Mobile */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-brand-dark/40" />
          </div>
          <input 
            type="text" 
            className="w-full pl-10 pr-4 py-3 rounded-lg text-sm font-medium bg-brand-light border border-brand-medium/20 text-brand-dark placeholder:text-brand-dark/40 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            placeholder="Search tools, specs, platforms..."
          />
        </div>

        {/* Social Specs - Expandable Section */}
        <div className="bg-brand-light/30 rounded-xl overflow-hidden">
          <button 
            onClick={() => setMobileExpandedSection(mobileExpandedSection === 'specs' ? null : 'specs')}
            className={`w-full text-left px-4 py-3.5 text-base font-bold transition-all flex items-center justify-between ${currentView === 'home' ? 'text-brand-primary' : 'text-brand-dark'}`}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-brand-primary" />
              Social Specs
            </div>
            <ChevronDown className={`w-4 h-4 text-brand-medium transition-transform duration-200 ${mobileExpandedSection === 'specs' ? 'rotate-180' : ''}`} />
          </button>
          
          {mobileExpandedSection === 'specs' && (
            <div className="px-4 pb-4 space-y-4">
              {/* View All Specs Button */}
              <button 
                onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
                className="w-full px-3 py-2 bg-brand-primary/10 text-brand-primary text-sm font-bold rounded-lg flex items-center justify-center gap-2"
              >
                View All Specs <ArrowRight className="w-3.5 h-3.5" />
              </button>
              
              {/* Platform Categories */}
              {Object.entries(platformCategories).map(([category, ids]) => (
                <div key={category}>
                  <h4 className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-wider mb-2 px-1">{category}</h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {ids.map(id => {
                      const platform = platforms.find(p => p.id === id);
                      if (!platform) return null;
                      const Icon = platformIcons[id] || Globe;
                      return (
                        <button 
                          key={platform.id}
                          onClick={() => { onPlatformSelect(platform.id); setIsMobileMenuOpen(false); }}
                          className="text-left px-3 py-2 rounded-lg bg-brand-surface hover:bg-brand-light transition-colors text-sm font-medium text-brand-dark flex items-center gap-2"
                        >
                          <Icon className="w-4 h-4 text-brand-medium" />
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

        {/* Tools - Expandable Section */}
        <div className="bg-brand-light/30 rounded-xl overflow-hidden">
          <button 
            onClick={() => setMobileExpandedSection(mobileExpandedSection === 'tools' ? null : 'tools')}
            className={`w-full text-left px-4 py-3.5 text-base font-bold transition-all flex items-center justify-between ${currentView === 'tools' ? 'text-brand-primary' : 'text-brand-dark'}`}
          >
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-brand-primary" />
              Tools
            </div>
            <ChevronDown className={`w-4 h-4 text-brand-medium transition-transform duration-200 ${mobileExpandedSection === 'tools' ? 'rotate-180' : ''}`} />
          </button>
          
          {mobileExpandedSection === 'tools' && (
            <div className="px-4 pb-4 space-y-4">
              {/* View All Tools Button */}
              <button 
                onClick={() => { onNavigate('tools'); setIsMobileMenuOpen(false); }}
                className="w-full px-3 py-2 bg-brand-primary/10 text-brand-primary text-sm font-bold rounded-lg flex items-center justify-center gap-2"
              >
                View All Tools <ArrowRight className="w-3.5 h-3.5" />
              </button>
              
              {/* Tool Categories */}
              <div>
                <h4 className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-wider mb-2 px-1">Categories</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {toolCategories.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => { onNavigate('tools'); setIsMobileMenuOpen(false); }}
                      className="text-left px-3 py-2 rounded-lg bg-brand-surface hover:bg-brand-light transition-colors text-sm font-medium text-brand-dark flex items-center gap-2"
                    >
                      {cat === 'AI & Trends' && <Sparkles className="w-4 h-4 text-brand-medium" />}
                      {cat === 'Technical SEO' && <Globe className="w-4 h-4 text-brand-medium" />}
                      {cat === 'Marketing Calculators' && <BarChart3 className="w-4 h-4 text-brand-medium" />}
                      {cat === 'Ad Mockups' && <Smartphone className="w-4 h-4 text-brand-medium" />}
                      {cat === 'SaaS & Business' && <PieChart className="w-4 h-4 text-brand-medium" />}
                      {cat === 'Tax & Finance' && <Building2 className="w-4 h-4 text-brand-medium" />}
                      <span className="truncate">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Featured Tools */}
              <div>
                <h4 className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-wider mb-2 px-1">Featured Tools</h4>
                <div className="space-y-1">
                  {TOOLS_CONFIG.slice(0, 6).map(tool => (
                    <button 
                      key={tool.id}
                      onClick={() => { onToolSelect(tool.id); setIsMobileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2.5 rounded-lg bg-brand-surface hover:bg-brand-light transition-colors text-sm font-medium text-brand-dark flex items-center gap-3"
                    >
                      <div className="p-1.5 rounded-md bg-brand-light">
                        <tool.icon className="w-4 h-4 text-brand-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block truncate">{tool.title}</span>
                        <span className="text-[10px] text-brand-dark/40 truncate block">{tool.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resources - Expandable Section */}
        <div className="bg-brand-light/30 rounded-xl overflow-hidden">
          <button 
            onClick={() => setMobileExpandedSection(mobileExpandedSection === 'resources' ? null : 'resources')}
            className={`w-full text-left px-4 py-3.5 text-base font-bold transition-all flex items-center justify-between ${currentView === 'about' ? 'text-brand-primary' : 'text-brand-dark'}`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-brand-primary" />
              Resources
            </div>
            <ChevronDown className={`w-4 h-4 text-brand-medium transition-transform duration-200 ${mobileExpandedSection === 'resources' ? 'rotate-180' : ''}`} />
          </button>
          
          {mobileExpandedSection === 'resources' && (
            <div className="px-4 pb-4 space-y-1">
              <button 
                onClick={() => { onNavigate('about'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2.5 rounded-lg bg-brand-surface hover:bg-brand-light transition-colors text-sm font-medium text-brand-dark flex items-center gap-3"
              >
                <div className="p-1.5 rounded-md bg-brand-light">
                  <Building2 className="w-4 h-4 text-brand-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">About Us</span>
                  <span className="text-[10px] text-brand-dark/50">Our mission & story</span>
                </div>
              </button>
              
              <button 
                onClick={() => { onOpenPrivacy(); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2.5 rounded-lg bg-brand-surface hover:bg-brand-light transition-colors text-sm font-medium text-brand-dark flex items-center gap-3"
              >
                <div className="p-1.5 rounded-md bg-brand-light">
                  <Shield className="w-4 h-4 text-brand-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Privacy Policy</span>
                  <span className="text-[10px] text-brand-dark/50">Data protection</span>
                </div>
              </button>
              
              <button 
                onClick={() => { onOpenPrivacy(); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2.5 rounded-lg bg-brand-surface hover:bg-brand-light transition-colors text-sm font-medium text-brand-dark flex items-center gap-3"
              >
                <div className="p-1.5 rounded-md bg-brand-light">
                  <Cookie className="w-4 h-4 text-brand-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Cookie Policy</span>
                  <span className="text-[10px] text-brand-dark/50">Preferences</span>
                </div>
              </button>
              
              <div className="my-2 border-t border-brand-border/50"></div>
              
              <a 
                href="https://dmsprism.com/blog/" 
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-left px-3 py-2.5 rounded-lg bg-brand-surface hover:bg-brand-light transition-colors text-sm font-medium text-brand-dark flex items-center gap-3"
              >
                <div className="p-1.5 rounded-md bg-brand-light">
                  <FileText className="w-4 h-4 text-brand-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Blog</span>
                  <span className="text-[10px] text-brand-dark/50">Latest insights & tips</span>
                </div>
              </a>
              
              <button 
                onClick={() => { onOpenSubmitTool(); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2.5 rounded-lg bg-brand-surface hover:bg-brand-light transition-colors text-sm font-medium text-brand-dark flex items-center gap-3"
              >
                <div className="p-1.5 rounded-md bg-brand-light">
                  <Plus className="w-4 h-4 text-brand-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Submit a Tool</span>
                  <span className="text-[10px] text-brand-dark/50">Contribute to library</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Dashboard - Only for logged in users */}
        {user && (
          <button 
            onClick={() => { onNavigate('dashboard'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3.5 rounded-xl text-base font-bold transition-all flex items-center gap-3 ${currentView === 'dashboard' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-brand-light/30 text-brand-dark hover:bg-brand-light/50'}`}
          >
            <LayoutGrid className="w-5 h-5 text-brand-primary" />
            Dashboard
          </button>
        )}

        {/* Admin - Only for admin users */}
        {user?.role === 'admin' && (
          <button 
            onClick={() => { onNavigate('admin'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3.5 rounded-xl text-base font-bold transition-all flex items-center gap-3 ${currentView === 'admin' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-brand-light/30 text-brand-dark hover:bg-brand-light/50'}`}
          >
            <Shield className="w-5 h-5 text-brand-primary" />
            Admin Panel
          </button>
        )}

        {/* Divider */}
        <div className="border-t border-brand-border"></div>

        {/* Auth Actions */}
        <div className="space-y-3 pt-2 pb-8">
          {user ? (
            <>
              {/* User Profile Card */}
              <div className="px-4 py-3 bg-brand-light/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center overflow-hidden">
                    {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-brand-dark truncate">{user.name}</p>
                    <p className="text-xs text-brand-dark/50 truncate">{user.email}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isPro ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                    {user.subscription.tier}
                  </span>
                </div>
              </div>
              
              {/* Upgrade to Pro - Only for non-Pro users */}
              {!isPro && (
                <button 
                  onClick={() => { onOpenPricing(); setIsMobileMenuOpen(false); }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Upgrade to Pro
                </button>
              )}
            </>
          ) : (
            <>
              <button 
                onClick={() => { onOpenLogin(); setIsMobileMenuOpen(false); }}
                className="w-full px-4 py-3 text-center text-sm font-bold text-brand-dark border border-brand-border rounded-xl hover:bg-brand-light transition-all"
              >
                Sign In
              </button>
              <button 
                onClick={() => { onOpenPricing(); setIsMobileMenuOpen(false); }}
                className="w-full px-4 py-3 bg-brand-dark text-brand-light text-sm font-bold rounded-xl shadow-md hover:bg-brand-dark/90 transition-all flex items-center justify-center gap-2"
              >
                Get Pro <Zap className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  ) : null;

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-brand-surface/80 border-b border-brand-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
          
          {/* Left: Logo & Nav */}
          <div className="flex items-center gap-8">
              <div className="flex items-center cursor-pointer group shrink-0 select-none relative" onClick={() => onNavigate('home')}>
                {/* Logo - switches based on theme */}
                <img 
                  src={theme === 'dark' ? '/perfxads-logo-dark.svg' : '/perfxads-logo-light.svg'} 
                  alt="Perfxads - The Ultimate Ad Specs Library" 
                  className="h-7 sm:h-8 md:h-10 w-auto object-contain transition-all duration-300 hover:opacity-90 hover:scale-[1.02]"
                />
                {/* Santa Hat - Christmas decoration - centered on P icon */}
                <div className="absolute" style={{ top: '-8px', left: '14px', transform: 'rotate(-15deg)', pointerEvents: 'none', zIndex: 10 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="hatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#DC2626" />
                        <stop offset="50%" stopColor="#B91C1C" />
                        <stop offset="100%" stopColor="#991B1B" />
                      </linearGradient>
                      <filter id="hatShadow">
                        <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.4"/>
                      </filter>
                      <filter id="pompomGlow">
                        <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="#FFFFFF" floodOpacity="0.6"/>
                      </filter>
                    </defs>
                    
                    {/* Hat cone body */}
                    <path 
                      d="M 8 11 L 9 7 Q 10 4 12 3.5 Q 14 4 15 7 L 16 11 L 17.5 17 Q 17.5 18.5 12 18.5 Q 6.5 18.5 6.5 17 Z" 
                      fill="url(#hatGrad)" 
                      filter="url(#hatShadow)" 
                    />
                    
                    {/* Shading for depth */}
                    <path 
                      d="M 8 11 L 9 7 Q 10 4 12 3.5 L 12 18.5 Q 6.5 18.5 6.5 17 Z" 
                      fill="#991B1B" 
                      opacity="0.25"
                    />
                    
                    {/* White fur trim - triple layer */}
                    <ellipse cx="12" cy="17" rx="6" ry="1.8" fill="#FFFFFF"/>
                    <ellipse cx="12" cy="16.7" rx="5.5" ry="1.4" fill="#F8FAFC" />
                    <ellipse cx="12" cy="16.5" rx="5" ry="1.2" fill="#FEFEFE" />
                    
                    {/* Pom-pom with glow */}
                    <circle cx="12" cy="3.5" r="2.5" fill="#FFFFFF" filter="url(#pompomGlow)"/>
                    <circle cx="12" cy="3.5" r="2" fill="#FEFEFE" />
                    <circle cx="12" cy="3.5" r="1.3" fill="#FFFFFF" opacity="0.9"/>
                    
                    {/* Highlight */}
                    <path 
                      d="M 10 8.5 Q 11 5.5 12 4.5 Q 13 5.5 14 8.5" 
                      stroke="#EF4444" 
                      strokeWidth="0.4" 
                      fill="none" 
                      opacity="0.5" 
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

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
                              
                              <a 
                                  href="https://dmsprism.com/blog/" 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setActiveMenu(null)}
                                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-brand-light transition-colors text-sm font-medium text-brand-dark flex items-center gap-3 group"
                              >
                                  <div className="p-1.5 rounded-md bg-brand-light group-hover:bg-white dark:group-hover:bg-brand-dark/20 transition-colors text-brand-primary">
                                      <FileText className="w-4 h-4" />
                                  </div>
                                  <div className="flex flex-col">
                                      <span className="leading-none mb-0.5 font-bold">Blog</span>
                                      <span className="text-[10px] text-brand-dark/50">Latest insights & tips</span>
                                  </div>
                              </a>
                              
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
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md mx-4 relative">
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

              {/* Search Dropdown */}
              {isSearchActive && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-brand-surface rounded-xl shadow-2xl border border-brand-medium/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[70vh] overflow-y-auto">
                      {!hasResults ? (
                          <div className="p-8 text-center text-brand-dark/50">
                              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No results found for "{searchQuery}"</p>
                          </div>
                      ) : (
                          <div className="py-2">
                              {/* Tools Section */}
                              {searchResults.tools.length > 0 && (
                                  <div className="mb-2">
                                      <h4 className="px-4 py-2 text-xs font-bold text-brand-dark/40 uppercase tracking-wider flex items-center gap-2">
                                          <Monitor className="w-3 h-3" /> Tools
                                      </h4>
                                      {searchResults.tools.map(tool => (
                                          <button 
                                              key={tool.id}
                                              onClick={() => { onToolSelect(tool.id); setIsSearchActive(false); }}
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

                              {/* Platforms Section */}
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
                                                  onClick={() => { onPlatformSelect(platform.id); setIsSearchActive(false); }}
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

                              {/* Specs Section */}
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
                                                  setIsSearchActive(false); 
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
                          </div>
                      )}
                  </div>
              )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
              
              {/* Mobile Menu Toggle */}
              <button 
                  className="lg:hidden p-2 text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle mobile menu"
              >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Theme Toggle */}
              <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-brand-dark/60 hover:text-brand-dark hover:bg-brand-light transition-colors"
              >
                  {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              <div className="h-6 w-px bg-brand-border mx-1 hidden sm:block"></div>

              {/* Auth / Profile */}
              {user ? (
                  <div className="relative">
                      <button 
                          onClick={() => setIsProfileOpen(!isProfileOpen)}
                          className="flex items-center gap-2 p-1 pl-2 rounded-full border border-brand-border hover:border-brand-medium/50 hover:bg-brand-light transition-all"
                      >
                          <span className="text-xs font-bold text-brand-dark hidden sm:block max-w-[100px] truncate">{user.name}</span>
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
                              
                              <div className="border-t border-brand-border mt-1 pt-1 p-1">
                                  <button 
                                      onClick={() => { logout(); setIsProfileOpen(false); }} 
                                      className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                                  >
                                      <LogOut className="w-4 h-4" /> Sign Out
                                  </button>
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
                          className="px-4 py-2 bg-brand-dark text-brand-light text-sm font-bold rounded-lg shadow-md hover:bg-brand-dark/90 transition-all active:scale-95 flex items-center gap-2"
                      >
                          Get Pro <Zap className="w-3 h-3" />
                      </button>
                  </>
              )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Portal - renders to document.body */}
      {typeof document !== 'undefined' && mobileMenuContent && createPortal(mobileMenuContent, document.body)}
    </>
  );
};

export default Header;
