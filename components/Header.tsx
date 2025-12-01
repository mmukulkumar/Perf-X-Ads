
import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, X, Sun, Moon, ChevronDown, 
  Layout, TrendingUp, PieChart, Search, Globe,
  Settings, ArrowRight, Command, Zap, Sparkles,
  Facebook, Instagram, Twitter, Linkedin, Youtube, Twitch, Music, ShoppingBag, MessageCircle, Cloud, User, LogIn, Crown, Shield, DollarSign,
  Grid, Monitor, Info, Briefcase, Landmark, Cookie, Plus
} from 'lucide-react';
import { platforms } from '../data';
import { useAuth } from '../contexts/AuthContext';

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
  tools: any[]; // Dynamic tools list
}

const BrandIcon = ({ id, className }: { id: string, className?: string }) => {
  switch(id) {
    case 'google-mockup':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
           <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
        </svg>
      );
    case 'facebook-mockup':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
           <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case 'tiktok-mockup':
       return (
         <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
         </svg>
       );
    default:
      return null;
  }
};

const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onNavigate, 
  onPlatformSelect, 
  onToolSelect, 
  toggleTheme, 
  theme, 
  onOpenLogin,
  onOpenPricing,
  onOpenPrivacy,
  onOpenSubmitTool,
  tools
}) => {
  const { user, logout, isPro, isAdmin } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>('specs');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Group Tools dynamically from props
  const toolsByCategory = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, any[]>);

  const CATEGORY_ORDER = ['AI & Trends', 'Ad Mockups', 'Technical SEO', 'Marketing Calculators', 'SaaS & Business', 'Tax & Finance'];

  // Search Logic
  const filteredTools = searchQuery 
    ? tools.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const filteredPlatforms = searchQuery
    ? platforms.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasResults = filteredTools.length > 0 || filteredPlatforms.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchResultClick = (type: 'platform' | 'tool', id: string) => {
    if (type === 'platform') {
      onPlatformSelect(id);
    } else {
      onToolSelect(id);
    }
    setSearchQuery('');
    setIsSearchFocused(false);
    setMobileMenuOpen(false);
  };

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const toggleMobileSection = (section: string) => {
    setMobileExpandedSection(mobileExpandedSection === section ? null : section);
  };

  const getPlatformIcon = (id: string) => {
    const className = "w-5 h-5 stroke-[1.5]";
    switch (id) {
      case 'google-ads': return <Search className={className} />;
      case 'facebook': return <Facebook className={className} />;
      case 'instagram': return <Instagram className={className} />;
      case 'twitter': return <Twitter className={className} />;
      case 'linkedin': return <Linkedin className={className} />;
      case 'tiktok': return <Music className={className} />;
      case 'youtube': return <Youtube className={className} />;
      case 'pinterest': return <Layout className={className} />;
      case 'snapchat': return <MessageCircle className={className} />;
      case 'twitch': return <Twitch className={className} />;
      case 'reddit': return <MessageCircle className={className} />;
      case 'spotify': return <Music className={className} />;
      case 'discord': return <MessageCircle className={className} />;
      case 'etsy': return <ShoppingBag className={className} />;
      case 'bluesky': return <Cloud className={className} />;
      case 'mastodon': return <MessageCircle className={className} />;
      case 'threads': return <MessageCircle className={className} />;
      default: return <Layout className={className} />;
    }
  };

  const NavButton = ({ label, id, onClick, hasDropdown = false }: { label: string, id: string, onClick: () => void, hasDropdown?: boolean }) => (
    <div className="relative h-full flex items-center px-1" onMouseEnter={() => handleMouseEnter(id)} onMouseLeave={handleMouseLeave}>
      <button 
          className={`
            flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full transition-all duration-200
            ${activeMenu === id 
              ? 'bg-brand-surface dark:bg-white/10 text-brand-primary dark:text-white shadow-sm' 
              : (currentView === 'tools' && id === 'tools') || (currentView === 'about' && id === 'resources') 
                ? 'text-brand-dark hover:bg-brand-surface/50' 
                : 'text-brand-dark/70 hover:text-brand-dark hover:bg-brand-surface/50'
            }
          `}
          onClick={onClick}
      >
        {label}
        {hasDropdown && (
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === id ? 'rotate-180' : 'opacity-50'}`} />
        )}
      </button>
      
      {hasDropdown && activeMenu === 'specs' && id === 'specs' && (
        <div className="absolute top-[calc(100%+0.5rem)] left-0 w-[640px] -ml-4 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="bg-brand-surface dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-brand-border p-6 overflow-hidden ring-1 ring-black/5">
            <div className="grid grid-cols-2 gap-3">
              {platforms.slice(0, 10).map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => {
                    onPlatformSelect(platform.id);
                    setActiveMenu(null);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-light transition-all group text-left border border-transparent hover:border-brand-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-light border border-brand-border flex items-center justify-center text-brand-dark/70 group-hover:text-brand-primary group-hover:scale-110 transition-all shrink-0 shadow-sm">
                    {getPlatformIcon(platform.id)}
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-brand-dark group-hover:text-brand-primary transition-colors">
                      {platform.name}
                    </span>
                    <span className="block text-[10px] text-brand-dark/50 group-hover:text-brand-dark/70">
                      {platform.specs.length} ad formats
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-brand-border flex justify-between items-center -mx-6 -mb-6 px-6 py-4 bg-brand-light/30">
               <span className="text-xs text-brand-dark/50 font-bold flex items-center gap-1.5">
                 <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> 
                 Updated for 2025
               </span>
               <button 
                  onClick={() => { onNavigate('home'); setActiveMenu(null); }}
                  className="text-xs font-bold text-brand-primary flex items-center gap-1 hover:underline decoration-2 underline-offset-2"
               >
                  View All <ArrowRight className="w-3 h-3" />
               </button>
            </div>
          </div>
        </div>
      )}

      {hasDropdown && activeMenu === 'tools' && id === 'tools' && (
        <div className="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 w-[900px] z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="bg-brand-surface dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-brand-border p-6 overflow-hidden ring-1 ring-black/5">
            <div className="grid grid-cols-3 gap-8">
              {['AI & Trends', 'Ad Mockups', 'Technical SEO'].map((cat) => (
                  <div className="space-y-6" key={cat}>
                     <div>
                        <h4 className="text-xs font-bold text-brand-dark/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                            {cat === 'AI & Trends' ? <Sparkles className="w-3 h-3" /> : cat === 'Ad Mockups' ? <Monitor className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                            {cat}
                        </h4>
                        <div className="space-y-1">
                            {toolsByCategory[cat]?.map(tool => (
                                <button key={tool.id} onClick={() => { onToolSelect(tool.id); setActiveMenu(null); }} className="w-full text-left p-2 rounded-lg hover:bg-brand-light flex items-center gap-3 group transition-colors">
                                    <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 bg-brand-light border border-brand-border group-hover:border-brand-primary/30 shadow-sm`}>
                                        <tool.icon className="w-4 h-4 text-brand-dark group-hover:text-brand-primary transition-colors" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-brand-dark group-hover:text-brand-primary truncate">{tool.title}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                     </div>
                  </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-brand-border flex justify-end items-center bg-brand-light/30 -mx-6 -mb-6 px-6 py-4">
               <button 
                  onClick={() => { onNavigate('tools'); setActiveMenu(null); }}
                  className="text-xs font-bold text-brand-primary flex items-center gap-1 hover:underline decoration-2 underline-offset-2"
               >
                  Browse All Tools <ArrowRight className="w-3 h-3" />
               </button>
            </div>
          </div>
        </div>
      )}

      {/* RESOURCES MENU */}
      {hasDropdown && activeMenu === 'resources' && id === 'resources' && (
        <div className="absolute top-[calc(100%+0.5rem)] right-0 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="bg-brand-surface dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-brand-border p-2 overflow-hidden ring-1 ring-black/5">
                <button onClick={() => { onNavigate('about'); setActiveMenu(null); }} className="w-full text-left p-3 rounded-xl hover:bg-brand-light flex items-center gap-3 group transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-brand-light border border-brand-border flex items-center justify-center text-brand-dark/70 group-hover:text-brand-primary group-hover:scale-110 transition-all shadow-sm">
                        <Info className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="block text-sm font-bold text-brand-dark group-hover:text-brand-primary transition-colors">About Us</span>
                    </div>
                </button>
                 <button onClick={() => { onOpenPrivacy(); setActiveMenu(null); }} className="w-full text-left p-3 rounded-xl hover:bg-brand-light flex items-center gap-3 group transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-brand-light border border-brand-border flex items-center justify-center text-brand-dark/70 group-hover:text-brand-primary group-hover:scale-110 transition-all shadow-sm">
                        <Shield className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="block text-sm font-bold text-brand-dark group-hover:text-brand-primary transition-colors">Privacy Policy</span>
                    </div>
                </button>
                 <button onClick={() => { onOpenPrivacy(); setActiveMenu(null); }} className="w-full text-left p-3 rounded-xl hover:bg-brand-light flex items-center gap-3 group transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-brand-light border border-brand-border flex items-center justify-center text-brand-dark/70 group-hover:text-brand-primary group-hover:scale-110 transition-all shadow-sm">
                        <Cookie className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="block text-sm font-bold text-brand-dark group-hover:text-brand-primary transition-colors">Cookie Policy</span>
                    </div>
                </button>
                
                <div className="my-1 border-t border-brand-border opacity-50"></div>
                
                <button onClick={() => { onOpenSubmitTool(); setActiveMenu(null); }} className="w-full text-left p-3 rounded-xl hover:bg-brand-light flex items-center gap-3 group transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-brand-light border border-brand-border flex items-center justify-center text-brand-dark/70 group-hover:text-brand-primary group-hover:scale-110 transition-all shadow-sm">
                        <Plus className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="block text-sm font-bold text-brand-dark group-hover:text-brand-primary transition-colors">Submit New Tool</span>
                    </div>
                </button>
            </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <nav className="sticky top-0 z-[100] w-full bg-white/90 dark:bg-[#020617]/90 backdrop-blur-xl border-b border-brand-border transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center gap-4">
            
            {/* Logo */}
            <div className="flex items-center cursor-pointer group shrink-0 select-none" onClick={() => onNavigate('home')}>
              <img 
                src="https://i.ibb.co/7jRB122/Perf-X-Ads-3.png" 
                alt="Perf X Ads" 
                className="h-8 w-auto dark:hidden transition-transform duration-300 group-hover:scale-105"
              />
              <img 
                src="https://i.ibb.co/3ykJF5h/Perf-X-Ads-2.png" 
                alt="Perf X Ads" 
                className="h-8 w-auto hidden dark:block transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 h-full mx-6">
              <NavButton label="Social Specs" id="specs" onClick={() => onNavigate('home')} hasDropdown={true} />
              <NavButton label="Tools" id="tools" onClick={() => onNavigate('tools')} hasDropdown={true} />
              <NavButton label="Pricing" id="pricing" onClick={onOpenPricing} />
              <NavButton label="Resources" id="resources" onClick={() => setActiveMenu(activeMenu === 'resources' ? null : 'resources')} hasDropdown={true} />
            </div>

            {/* Global Search Bar (Desktop) */}
            <div className="hidden xl:flex flex-1 max-w-sm relative" ref={searchRef}>
                <div className={`glossy-input flex items-center w-full rounded-full px-4 py-2 transition-all duration-300 group ${isSearchFocused ? 'ring-2 ring-brand-primary/30' : ''}`}>
                    <Search className={`w-4 h-4 mr-2 transition-colors ${isSearchFocused ? 'text-brand-primary' : 'text-brand-dark/40'}`} />
                    <input 
                        type="text" 
                        placeholder="Search tools..." 
                        className="bg-transparent border-none outline-none text-sm w-full text-brand-dark placeholder-brand-dark/40"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                    />
                    <div className="hidden 2xl:flex items-center gap-1 px-1.5 py-0.5 rounded border border-brand-border bg-brand-light text-[10px] text-brand-dark/50 font-bold">
                        <Command className="w-3 h-3" /> K
                    </div>
                </div>

                {/* Search Results Dropdown */}
                {isSearchFocused && searchQuery && (
                    <div className="absolute top-full right-0 w-[400px] mt-2 bg-brand-surface rounded-xl border border-brand-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[120]">
                        {hasResults ? (
                            <div className="py-2">
                                {filteredTools.length > 0 && (
                                    <div className="px-2 mb-2">
                                        <div className="text-[10px] font-bold text-brand-dark/40 uppercase px-3 py-2">Tools</div>
                                        {filteredTools.map(tool => (
                                            <button key={tool.id} onClick={() => handleSearchResultClick('tool', tool.id)} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-brand-light rounded-lg group transition-colors text-left">
                                                <div className="w-8 h-8 rounded-lg bg-brand-light flex items-center justify-center shrink-0 shadow-sm border border-brand-border">
                                                    <tool.icon className="w-4 h-4 text-brand-dark/70" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-brand-dark group-hover:text-brand-primary">{tool.title}</div>
                                                    <div className="text-[10px] text-brand-dark/50 line-clamp-1">{tool.description}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {filteredPlatforms.length > 0 && (
                                    <div className="px-2">
                                        <div className="text-[10px] font-bold text-brand-dark/40 uppercase px-3 py-2 border-t border-brand-border">Platforms</div>
                                        {filteredPlatforms.map(platform => (
                                            <button key={platform.id} onClick={() => handleSearchResultClick('platform', platform.id)} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-brand-light rounded-lg group transition-colors text-left">
                                                <div className="w-8 h-8 rounded-lg bg-brand-light border border-brand-border flex items-center justify-center text-brand-dark/60 group-hover:text-brand-primary group-hover:border-brand-primary/30 shrink-0 shadow-sm">
                                                    <Layout className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-bold text-brand-dark group-hover:text-brand-primary">{platform.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-brand-dark/50">
                                <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No results found for "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 z-[101]">
               <button 
                 onClick={toggleTheme} 
                 className="p-2.5 rounded-full text-brand-dark/60 hover:text-brand-primary hover:bg-brand-light transition-all duration-200 hidden lg:flex items-center justify-center"
                 aria-label="Toggle theme"
               >
                 {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
               </button>

               {user ? (
                   <div className="relative" ref={profileMenuRef}>
                       <button 
                           onClick={() => setShowProfileMenu(!showProfileMenu)}
                           className="flex items-center gap-2 p-1 pr-3 rounded-full bg-brand-light/50 border border-brand-border hover:border-brand-medium/60 transition-all shadow-sm group"
                       >
                           <div className="w-8 h-8 rounded-full bg-brand-dark/10 overflow-hidden border border-brand-border">
                               <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                           </div>
                           <span className="text-sm font-bold text-brand-dark max-w-[80px] truncate hidden sm:block group-hover:text-brand-primary transition-colors">{user.name.split(' ')[0]}</span>
                           <ChevronDown className={`w-3 h-3 text-brand-dark/60 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                       </button>

                       {/* Profile Dropdown */}
                       {showProfileMenu && (
                           <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-brand-surface border border-brand-border rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                               <div className="px-4 py-3 border-b border-brand-border">
                                   <p className="font-bold text-brand-dark truncate">{user.name}</p>
                                   <p className="text-xs text-brand-dark/60 truncate">{user.email}</p>
                                   <div className="mt-2 flex items-center gap-2">
                                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isPro ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                           {user.subscription.tier}
                                       </span>
                                       {isAdmin && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 uppercase">ADMIN</span>}
                                   </div>
                               </div>
                               
                               <div className="py-1">
                                   <button onClick={() => { onNavigate('dashboard'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-brand-dark hover:bg-brand-light flex items-center gap-2 transition-colors">
                                       <Layout className="w-4 h-4 text-brand-dark/60" /> Dashboard
                                   </button>
                                   {isAdmin && (
                                       <button onClick={() => { onNavigate('admin'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-brand-dark hover:bg-brand-light flex items-center gap-2 transition-colors">
                                           <Shield className="w-4 h-4 text-red-500" /> Admin Panel
                                       </button>
                                   )}
                                   {!isPro && (
                                       <button onClick={() => { onOpenPricing(); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-indigo-600 hover:bg-brand-light flex items-center gap-2 font-bold transition-colors">
                                           <Crown className="w-4 h-4" /> Upgrade to Pro
                                       </button>
                                   )}
                               </div>
                               
                               <div className="border-t border-brand-border pt-1 mt-1">
                                   <button onClick={() => { setShowProfileMenu(false); logout(); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                                       <LogIn className="w-4 h-4 rotate-180" /> Sign out
                                   </button>
                               </div>
                           </div>
                       )}
                   </div>
               ) : (
                   <button 
                       onClick={onOpenLogin}
                       className="hidden sm:flex items-center gap-2 px-5 py-2 bg-brand-dark text-white text-sm font-bold rounded-full hover:bg-brand-dark/90 transition-all shadow-md active:scale-95"
                   >
                       <User className="w-4 h-4" /> Sign In
                   </button>
               )}
               
               <button 
                 className="lg:hidden p-2 text-brand-dark hover:bg-brand-light rounded-lg transition-colors z-50"
                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
               >
                 {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
               </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-[90] bg-brand-surface transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-x-4'}`}>
        <div className="h-16 shrink-0" />
        <div className="flex flex-col h-[calc(100vh-64px)] px-6 pb-10 overflow-y-auto">
          
          <div className="mb-6 mt-4">
              {user ? (
                  <div className="bg-brand-light/50 border border-brand-border rounded-xl p-4 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                          <img src={user.avatar} className="w-10 h-10 rounded-full" alt="Avatar" />
                          <div>
                              <p className="font-bold text-brand-dark">{user.name}</p>
                              <p className="text-xs text-brand-dark/60">{user.email}</p>
                          </div>
                      </div>
                  </div>
              ) : (
                  <button onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }} className="w-full py-3 bg-brand-dark text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md">
                      <User className="w-5 h-5" /> Sign In / Register
                  </button>
              )}
          </div>

          <div className="flex-1 space-y-3">
             <div className="rounded-2xl overflow-hidden border border-brand-border bg-brand-surface shadow-sm">
                <button onClick={() => toggleMobileSection('specs')} className="w-full flex items-center justify-between p-4 hover:bg-brand-light/30 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"><Layout className="w-5 h-5" /></div>
                      <span className="font-bold text-brand-dark">Social Ad Specs</span>
                   </div>
                   <ChevronDown className={`w-5 h-5 text-brand-dark/40 transition-transform ${mobileExpandedSection === 'specs' ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpandedSection === 'specs' && (
                    <div className="bg-brand-light/20 border-t border-brand-border p-2 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1">
                        {platforms.slice(0, 8).map(p => (
                            <button key={p.id} onClick={() => { onPlatformSelect(p.id); setMobileMenuOpen(false); }} className="flex items-center gap-2 p-2 rounded-lg hover:bg-brand-light text-left">
                                <div className="w-6 h-6 rounded flex items-center justify-center bg-white dark:bg-brand-surface border border-brand-border text-brand-dark/60 scale-75">
                                    {getPlatformIcon(p.id)}
                                </div>
                                <span className="text-sm font-medium text-brand-dark">{p.name}</span>
                            </button>
                        ))}
                        <button onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }} className="col-span-2 text-center py-2 text-xs font-bold text-brand-primary">View All Platforms</button>
                    </div>
                )}
             </div>
             
             <div className="rounded-2xl overflow-hidden border border-brand-border bg-brand-surface shadow-sm">
                <button onClick={() => toggleMobileSection('tools')} className="w-full flex items-center justify-between p-4 hover:bg-brand-light/30 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"><Grid className="w-5 h-5" /></div>
                      <span className="font-bold text-brand-dark">Tools</span>
                   </div>
                   <ChevronDown className={`w-5 h-5 text-brand-dark/40 transition-transform ${mobileExpandedSection === 'tools' ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpandedSection === 'tools' && (
                    <div className="bg-brand-light/20 border-t border-brand-border p-2 space-y-1 animate-in fade-in slide-in-from-top-1">
                        {CATEGORY_ORDER.map(cat => (
                            <div key={cat} className="mb-2">
                                <div className="px-2 py-1 text-xs font-bold text-brand-dark/40 uppercase">{cat}</div>
                                {toolsByCategory[cat]?.slice(0, 3).map(tool => (
                                    <button key={tool.id} onClick={() => { onToolSelect(tool.id); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-brand-light text-left">
                                        <div className={`w-6 h-6 rounded flex items-center justify-center bg-brand-light scale-75`}>
                                            <tool.icon className="w-4 h-4 text-brand-dark" />
                                        </div>
                                        <span className="text-sm font-medium text-brand-dark truncate">{tool.title}</span>
                                    </button>
                                ))}
                            </div>
                        ))}
                        <button onClick={() => { onNavigate('tools'); setMobileMenuOpen(false); }} className="w-full text-center py-2 text-xs font-bold text-brand-primary">View All Tools</button>
                    </div>
                )}
             </div>

             <button onClick={() => { onOpenPricing(); setMobileMenuOpen(false); }} className="w-full flex items-center justify-between p-4 bg-brand-surface rounded-2xl border border-brand-border hover:bg-brand-light/30 shadow-sm">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"><DollarSign className="w-5 h-5" /></div>
                   <span className="font-bold text-brand-dark">Pricing</span>
                </div>
             </button>

             <button onClick={() => { onOpenSubmitTool(); setMobileMenuOpen(false); }} className="w-full flex items-center justify-between p-4 bg-brand-surface rounded-2xl border border-brand-border hover:bg-brand-light/30 shadow-sm">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"><Plus className="w-5 h-5" /></div>
                   <span className="font-bold text-brand-dark">Submit New Tool</span>
                </div>
             </button>

             <button onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }} className="w-full flex items-center justify-between p-4 bg-brand-surface rounded-2xl border border-brand-border hover:bg-brand-light/30 shadow-sm">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"><Info className="w-5 h-5" /></div>
                   <span className="font-bold text-brand-dark">About Us</span>
                </div>
             </button>
          </div>

          <div className="mt-auto pt-6">
             <button onClick={toggleTheme} className="flex items-center justify-between w-full p-4 bg-brand-surface dark:bg-white/5 rounded-2xl border border-brand-border active:scale-98 transition-transform shadow-sm">
                <div className="flex items-center gap-3">
                   <div className="w-9 h-9 rounded-full bg-brand-light dark:bg-brand-dark/10 flex items-center justify-center shadow-sm text-brand-dark border border-brand-medium/10">{theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</div>
                   <span className="font-bold text-brand-dark text-base">Appearance</span>
                </div>
                <span className="text-xs font-bold text-brand-dark/60 uppercase tracking-wide px-3 py-1 rounded-full bg-brand-light border border-brand-border">{theme}</span>
             </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Header;
