
import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, X, Sun, Moon, ChevronDown, 
  Layout, TrendingUp, PieChart, Search, Globe,
  Settings, ArrowRight, Command, Zap,
  Facebook, Instagram, Twitter, Linkedin, Youtube, Twitch, Music, ShoppingBag, MessageCircle, Cloud
} from 'lucide-react';
import { platforms } from '../data';
import { TOOLS_CONFIG } from '../tools';

interface HeaderProps {
  currentView: 'home' | 'tools';
  onNavigate: (view: 'home' | 'tools') => void;
  onPlatformSelect: (platformId: string) => void;
  onToolSelect: (toolId: string) => void;
  toggleTheme: () => void;
  theme: string;
}

const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onNavigate, 
  onPlatformSelect, 
  onToolSelect, 
  toggleTheme, 
  theme 
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>('specs');
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Search Logic ---
  const filteredTools = searchQuery 
    ? TOOLS_CONFIG.filter(t => 
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

  // --- Menu Hover Logic ---
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

  // --- Render Helpers ---
  const getIconColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
      purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
      pink: 'bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300',
      emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
      teal: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300',
      indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
      orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
      red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300',
      green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300',
    };
    return colors[color] || colors.blue;
  };

  const getTools = (category: string) => TOOLS_CONFIG.filter(t => t.category === category);

  // --- Platform Icon Mapper ---
  const getPlatformIcon = (id: string) => {
    const className = "w-5 h-5 stroke-[1.5]";
    switch (id) {
      case 'google-ads':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.14-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        );
      case 'instagram': 
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ig_grad" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFC107"/>
                <stop offset="0.505" stopColor="#F44336"/>
                <stop offset="1" stopColor="#9C27B0"/>
              </linearGradient>
            </defs>
            <rect width="24" height="24" rx="6" fill="url(#ig_grad)"/>
            <path d="M12 6.5C8.962 6.5 6.5 8.962 6.5 12S8.962 17.5 12 17.5 17.5 15.038 17.5 12 15.038 6.5 12 6.5zm0 9c-1.93 0-3.5-1.57-3.5-3.5S10.07 8.5 12 8.5 15.5 10.07 15.5 12 13.93 15.5 12 15.5z" fill="white"/>
            <circle cx="17.25" cy="6.75" r="1.25" fill="white"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M16 2H8C4.686 2 2 4.686 2 8v8c0 3.314 2.686 6 6 6h8c3.314 0 6-2.686 6-6V8c0-3.314-2.686-6-6-6zm4 14c0 2.209-1.791 4-4 4H8c-2.209 0-4-1.791-4-4V8c0-2.209 1.791-4 4-4h8c2.209 0 4 1.791 4 4v8z" fill="white"/>
          </svg>
        );
      case 'facebook': 
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#1877F2"/>
            <path d="M15.5 12.5H13V21H10.5V12.5H9.5V10.5H10.5V8.5C10.5 6.5 11.5 5.5 13.5 5.5H15.5V7.5H14C13.5 7.5 13 7.5 13 8.5V10.5H15.5L15.5 12.5Z" fill="white"/>
          </svg>
        );
      case 'twitter': // X
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="5" fill="#000000"/>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="white"/>
          </svg>
        );
      case 'tiktok': 
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="6" fill="#000000"/>
            <path d="M16.88 8.13c-.66-.17-1.27-.48-1.8-.89-.53-.41-1.33-1.3-1.33-2.24h-2.65v10.84c0 1.63-1.32 2.96-2.95 2.96S5.2 17.47 5.2 15.84c0-1.63 1.32-2.96 2.95-2.96.17 0 .33.02.49.05v-2.7c-.16-.02-.32-.03-.49-.03-3.11 0-5.63 2.52-5.63 5.63s2.52 5.63 5.63 5.63 5.63-2.52 5.63-5.63V8.77c1.14.82 2.52 1.3 4 1.36v-2.8c-.57-.02-1.12-.24-1.59-.61z" fill="white"/>
          </svg>
        );
      case 'linkedin': 
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#0077B5"/>
            <path d="M5.5 9h3v9h-3V9zM7 7.5c.83 0 1.5-.67 1.5-1.5S7.83 4.5 7 4.5 5.5 5.17 5.5 6 6.17 7.5 7 7.5zM10.5 9h3v1.3h.04c.42-.79 1.44-1.62 2.96-1.62 3.16 0 3.75 2.08 3.75 4.79V18h-3v-4.69c0-1.12-.02-2.56-1.56-2.56-1.56 0-1.8 1.22-1.8 2.48V18h-3V9z" fill="white"/>
          </svg>
        );
      case 'threads': 
        return (
          <svg className="w-5 h-5" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
            <rect width="192" height="192" rx="36" fill="#000000"/>
            <path d="M141.537 89.4061C139.553 68.8387 126.779 59.5 108.628 59.5C83.1937 59.5 63.8444 78.7797 63.8444 101.375C63.8444 124.188 83.4075 143.467 108.841 143.467C119.606 143.467 129.152 139.674 138.392 131.876L143.561 142.626C132.531 152.222 120.983 157 108.841 157C76.8216 157 49.5 130.329 49.5 101.375C49.5 72.2034 76.6097 45.9625 108.628 45.9625C138.977 45.9625 162.311 66.795 164.138 95.8375V137.962H153.338V95.8375C151.511 79.0387 138.818 69.7031 123.338 69.7031C104.231 69.7031 89.7656 82.8609 89.7656 100.95C89.7656 118.731 104.178 131.889 122.778 131.889C133.453 131.889 142.306 127.673 148.247 119.134L140.372 112.384C136.644 117.797 130.744 121.034 122.884 121.034C110.803 121.034 101.091 112.603 101.091 100.781C101.091 88.125 110.591 80.4469 123.338 80.4469C136.238 80.4469 145.044 86.2781 145.765 99.5344V137.962H156.566V89.4061H141.537Z" fill="#FFFFFF"/>
          </svg>
        );
      case 'pinterest': 
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#E60023"/>
            <path d="M13.028 15.357c-1.221 0-2.275-.629-2.665-1.337-.02.057-.354 1.397-.437 1.735-.252 1.022-1.003 2.04-1.039 2.087-.063.084-.204.102-.28.025-.062-.063-.018-.252.005-.377.06-.321.833-3.52.833-3.52s-.205-.41-.205-1.015c0-.952.552-1.663 1.239-1.663.584 0 .866.438.866.963 0 .587-.374 1.464-.567 2.277-.161.68.342 1.234 1.014 1.234 1.217 0 2.04-1.557 2.04-3.403 0-1.408-1.013-2.46-2.867-2.46-2.089 0-3.406 1.562-3.406 3.307 0 .603.178 1.033.457 1.364.128.152.145.213.107.365-.035.141-.116.47-.151.602-.05.19-.201.258-.464.132-1.295-.603-1.907-2.182-1.907-3.512 0-2.609 2.196-5.007 6.538-5.007 3.492 0 5.803 2.513 5.803 5.202 0 3.554-1.982 6.192-4.954 6.192z" fill="white"/>
          </svg>
        ); 
      case 'youtube': 
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="16" rx="4" fill="#FF0000"/>
            <path d="M10 15l6-3-6-3v6z" fill="white"/>
          </svg>
        );
      case 'twitch': 
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#9146FF"/>
            <path d="M6 5l-2 4v10h5v3l3-3h3l5-5V5H6zm11 8l-3 3h-3l-2 2v-2H7V6h10v7zm-5-4h2v4h-2V9zm-4 0h2v4H8V9z" fill="white"/>
          </svg>
        );
      case 'snapchat': 
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="5" fill="#FFFC00"/>
            <path d="M12 4.5c-2.2 0-4 1.6-4 4 0 .9.3 1.7.8 2.3-.2.5-.4 1.2-.2 2 .1.4.4.7.8.7.3 0 .6-.1.8.2.2.3.1.7-.1 1-.3.3-1 .4-1.4.4-.5 0-.9.3-1 .8 0 .4.2.8.6 1 .4.2 1 .3 1.5.3.3.4.1 1-.1 1.3-.2.4-.5.8-.7 1.1.4.1.9.1 1.3.1 1.6 0 2.8-1.1 2.8-2.5 0 1.4 1.2 2.5 2.8 2.5.4 0 .9 0 1.3-.1-.2-.3-.5-.7-.7-1.1-.2-.3-.4-.9.1-1.3.5 0 1.1-.1 1.5-.3.4-.2.6-.6.6-1-.1-.5-.5-.8-1-.8-.4 0-1.1-.1-1.4-.4-.2-.3-.3-.7-.1-1 .2-.3.5-.2.8-.2.4 0 .7-.3.8-.7.2-.8 0-1.5-.2-2 .5-.6.8-1.4.8-2.3 0-2.4-1.8-4-4-4z" fill="white" stroke="black" strokeWidth="0.5"/>
          </svg>
        );
      case 'etsy': 
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="6" fill="#F1641E"/>
            <path d="M16.5 7.5h-6.5v3.5h5v2h-5v4.5h6.5v2h-9v-14h9v2z" fill="white"/>
          </svg>
        );
      case 'reddit': 
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FF4500"/>
            <path d="M19.2 10.8c-.5-.3-1.1-.3-1.6 0-1.3-1-3.1-1.6-5.1-1.7l.9-4.1 2.8.6c.1 1 .9 1.7 1.9 1.7 1.1 0 1.9-.9 1.9-1.9s-.9-1.9-1.9-1.9c-.8 0-1.5.5-1.8 1.2l-3.1-.7c-.2 0-.4.1-.5.3l-1 4.7c-2.1.1-4 1-5.2 2.3-.2-.1-.5-.1-.7-.1-1.7 0-3 1.3-3 3 0 1.1.6 2 1.5 2.6-.1.3-.1.7-.1 1 0 3 3.4 5.5 7.6 5.5s7.6-2.5 7.6-5.5c0-.3 0-.7-.1-1 .9-.5 1.5-1.5 1.5-2.6 0-1.7-1.3-3-3-3.3z" fill="white"/>
          </svg>
        );
      case 'spotify': 
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#1DB954"/>
            <path d="M17.5 17c-.2.3-.5.4-.8.2-2.5-1.5-5.7-1.8-9.4-1-2.7.2-5.4.8-8 2-.3.1-.6 0-.7-.3-.1-.3 0-.6.3-.7 2.8-1.3 5.8-2 8.8-2.2 4-.8 7.5-.5 10.2 1.1.3.2.4.5.2.8zm1.1-2.5c-.3.4-.7.5-1.1.3-2.9-1.8-7.2-2.3-10.6-1.3-3.2 1-6.4 2.5-9.2 4.5-.4.3-.9.2-1.2-.2-.3-.4-.2-.9.2-1.2 3.1-2.2 6.6-3.8 10.2-4.9 3.9-1.1 8.7-.5 12 1.5.4.2.5.8.3 1.3zm.1-2.6C15.1 9.9 8.8 9.8 5.1 10.9c-.6.2-1.2-.2-1.4-.7-.2-.6.2-1.2.7-1.4 4.3-1.3 11.3-1.1 15.3 1.3.5.3.7 1 .4 1.5-.3.5-1 .7-1.5.3z" fill="white" />
          </svg>
        );
      case 'bluesky': 
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#1185FE"/>
            <path d="M12 13.8c2-2.5 4.5-5 6.5-6.2 2-1.2 3.5-1 3.5-1s.2 2.8-1.5 5.5c-1.5 2.5-3.5 3-3.5 3s2.5.2 4.2 2.5c1.8 2.2 1.8 5.2 1.8 5.2s-2.5-1-5.5-4c-2.2-2.2-4-4.5-5.5-6.5-1.5 2-3.2 4.2-5.5 6.5-3 3-5.5 4-5.5 4s0-3 1.8-5.2c1.8-2.2 4.2-2.5 4.2-2.5s-2-.5-3.5-3c-1.8-2.8-1.5-5.5-1.5-5.5s1.5-.2 3.5 1c2 1.2 4.5 3.8 6.5 6.2z" fill="white"/>
          </svg>
        );
      case 'discord': 
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="5" fill="#5865F2"/>
            <path d="M16.8 7.5c-1.2-.5-2.5-.9-3.8-1-.2.4-.4.8-.6 1.2-1.4-.2-2.8-.2-4.2 0-.2-.4-.4-.8-.6-1.2-1.4.1-2.7.5-3.8 1-2.3 3.4-3 6.7-2.6 9.9 1.6 1.2 3.1 1.9 4.6 2.4l1.1-1.5c-.5-.2-1-.4-1.5-.6.1-.1.2-.2.3-.3 3.1 1.4 6.5 1.4 9.6 0 .1.1.2.2.3.3-.5.3-1 .5-1.5.6l1.1 1.5c1.5-.5 3-1.2 4.6-2.4.5-3.3-.3-6.6-2.6-9.9zM8.5 14.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm7 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" fill="white"/>
          </svg>
        );
      case 'mastodon': 
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="5" fill="#6364FF"/>
            <path d="M17.7 6.9c-.6-.4-1.3-.6-2.1-.7-1.1-.2-3.2-.2-3.6-.2-1.7 0-3.5.1-3.6.2-.8.1-1.5.4-2.1.7-1.2.8-1.5 2.6-1.5 2.6 0 2.8.1 5.6.3 8.4.1 1.5.5 2.9 1.5 3.9 1.1 1 2.7 1.1 4.7 1 .9 0 1.8-.1 2.6-.3v-1.8c-1 .3-2.5.4-2.7.4-.9 0-1.8-.2-1.9-1.3v-.1c.5.1 1 .2 1.5.2 2.1 0 4.1-.3 4.1-.3.7 0 1.3-.1 1.3-.1.6-.2 1.2-.7 1.5-1.2.3-.6.4-1.3.4-2 0 0-.3-1.8-1.5-2.6zm-3.1 5.9V8.7l-2.6 3.3-2.6-3.3v4.1H7.9V7.6h2.2l2.5 3 2.5-3h2.2v5.2h-1.5z" fill="white"/>
          </svg>
        );
      default: return <Layout className={className} />;
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-[100] w-full bg-brand-light/80 backdrop-blur-xl border-b border-brand-medium/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group shrink-0" onClick={() => onNavigate('home')}>
              <div className="w-9 h-9 bg-brand-dark rounded-xl flex items-center justify-center text-brand-light font-bold shadow-sm group-hover:scale-105 transition-transform duration-300">P</div>
              <span className="font-bold text-xl tracking-tight text-brand-dark group-hover:text-brand-primary transition-colors duration-300 hidden sm:block">Perf X Ads</span>
            </div>

            {/* Global Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md relative" ref={searchRef}>
                <div className={`flex items-center w-full bg-brand-surface border rounded-xl px-3 py-2 transition-all duration-300 ${isSearchFocused ? 'border-brand-primary ring-2 ring-brand-primary/10 shadow-lg' : 'border-brand-medium/30 hover:border-brand-medium/60'}`}>
                    <Search className={`w-4 h-4 mr-2 ${isSearchFocused ? 'text-brand-primary' : 'text-brand-dark/40'}`} />
                    <input 
                        type="text" 
                        placeholder="Find tools, platforms, or specs..." 
                        className="bg-transparent border-none outline-none text-sm w-full text-brand-dark placeholder-brand-dark/40"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                    />
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-brand-medium/20 bg-brand-light text-[10px] text-brand-dark/40 font-medium">
                        <Command className="w-3 h-3" /> K
                    </div>
                </div>

                {/* Search Results Dropdown */}
                {isSearchFocused && searchQuery && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-brand-surface rounded-xl border border-brand-medium/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {hasResults ? (
                            <div className="py-2">
                                {filteredTools.length > 0 && (
                                    <div className="px-2 mb-2">
                                        <div className="text-[10px] font-bold text-brand-dark/40 uppercase px-3 py-2">Tools</div>
                                        {filteredTools.map(tool => (
                                            <button key={tool.id} onClick={() => handleSearchResultClick('tool', tool.id)} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-brand-light rounded-lg group transition-colors text-left">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getIconColor(tool.color)}`}>
                                                    <tool.icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-brand-dark group-hover:text-brand-primary">{tool.title}</div>
                                                    <div className="text-[10px] text-brand-dark/50 line-clamp-1">{tool.description}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {filteredPlatforms.length > 0 && (
                                    <div className="px-2">
                                        <div className="text-[10px] font-bold text-brand-dark/40 uppercase px-3 py-2 border-t border-brand-medium/10">Platforms</div>
                                        {filteredPlatforms.map(platform => (
                                            <button key={platform.id} onClick={() => handleSearchResultClick('platform', platform.id)} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-brand-light rounded-lg group transition-colors text-left">
                                                <div className="w-8 h-8 rounded-lg bg-brand-light border border-brand-medium/20 flex items-center justify-center text-brand-dark/60 group-hover:text-brand-primary group-hover:border-brand-primary/30 shrink-0">
                                                    <Layout className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium text-brand-dark group-hover:text-brand-primary">{platform.name}</span>
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
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 h-full">
              
              {/* 1. Social Ad Specs Mega Menu */}
              <div className="relative h-full flex items-center px-2" onMouseEnter={() => handleMouseEnter('specs')} onMouseLeave={handleMouseLeave}>
                <button 
                    className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-full transition-all duration-200 ${activeMenu === 'specs' ? 'bg-brand-dark/5 text-brand-primary' : 'text-brand-dark/70 hover:text-brand-dark hover:bg-brand-dark/5'}`} 
                    onClick={() => onNavigate('home')}
                >
                  Social Specs
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'specs' ? 'rotate-180 text-brand-primary' : 'opacity-50'}`} />
                </button>
                
                <div className={`absolute top-[calc(100%-10px)] right-[-200px] w-[600px] bg-brand-surface border border-brand-medium/20 rounded-2xl shadow-xl shadow-brand-dark/5 p-1 transition-all duration-300 transform origin-top-left z-50 ${activeMenu === 'specs' ? 'opacity-100 scale-100 visible translate-y-0' : 'opacity-0 scale-95 invisible -translate-y-2'}`}>
                  <div className="bg-brand-light/30 p-6 rounded-xl">
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-brand-medium/10">
                          <Layout className="w-4 h-4 text-brand-primary" />
                          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark/60">Platform Guides</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {platforms.map((platform) => (
                          <button key={platform.id} onClick={() => { onPlatformSelect(platform.id); setActiveMenu(null); }} className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-brand-surface hover:shadow-sm hover:ring-1 hover:ring-brand-medium/20 cursor-pointer transition-all">
                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-brand-dark/10 flex items-center justify-center text-brand-dark/60 group-hover:text-brand-primary group-hover:scale-110 transition-all shadow-sm">
                                {getPlatformIcon(platform.id)}
                            </div>
                            <span className="text-sm font-medium text-brand-dark/80 group-hover:text-brand-primary transition-colors">{platform.name}</span>
                          </button>
                        ))}
                      </div>
                  </div>
                </div>
              </div>

              {/* 2. SEO Tools Mega Menu */}
              <div className="relative h-full flex items-center px-2" onMouseEnter={() => handleMouseEnter('seo')} onMouseLeave={handleMouseLeave}>
                <button className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-full transition-all duration-200 ${activeMenu === 'seo' ? 'bg-brand-dark/5 text-brand-primary' : 'text-brand-dark/70 hover:text-brand-dark hover:bg-brand-dark/5'}`} onClick={() => onNavigate('tools')}>
                  SEO
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'seo' ? 'rotate-180 text-brand-primary' : 'opacity-50'}`} />
                </button>
                <div className={`absolute top-[calc(100%-10px)] left-0 w-[380px] bg-brand-surface border border-brand-medium/20 rounded-2xl shadow-xl shadow-brand-dark/5 p-1 transition-all duration-300 transform origin-top-left z-50 ${activeMenu === 'seo' ? 'opacity-100 scale-100 visible translate-y-0' : 'opacity-0 scale-95 invisible -translate-y-2'}`}>
                   <div className="p-2 space-y-1">
                      {getTools('SEO Tools').map(tool => (
                         <button key={tool.id} onClick={() => { onToolSelect(tool.id); setActiveMenu(null); }} className="w-full group flex items-start gap-3 p-3 rounded-xl hover:bg-brand-light/50 transition-colors text-left">
                            <div className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getIconColor(tool.color)} group-hover:scale-110 transition-transform duration-300 shadow-sm`}><tool.icon className="w-5 h-5" /></div>
                            <div>
                               <div className="flex items-center gap-2">
                                   <p className="text-sm font-bold text-brand-dark group-hover:text-brand-primary transition-colors">{tool.title}</p>
                                   {/* Example badge logic */}
                                   {tool.id === 'mobile-index' && <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">AI NEW</span>}
                               </div>
                               <p className="text-[11px] text-brand-dark/50 leading-tight mt-1 line-clamp-2">{tool.description}</p>
                            </div>
                         </button>
                      ))}
                   </div>
                   <div className="bg-brand-light/30 p-3 rounded-b-xl border-t border-brand-medium/10">
                        <button onClick={() => { onNavigate('tools'); setActiveMenu(null); }} className="w-full text-center text-xs font-bold text-brand-primary flex items-center justify-center gap-1 hover:underline">
                            View All SEO Tools <ArrowRight className="w-3 h-3" />
                        </button>
                   </div>
                </div>
              </div>

              {/* 3. Marketing Tools Mega Menu */}
              <div className="relative h-full flex items-center px-2" onMouseEnter={() => handleMouseEnter('marketing')} onMouseLeave={handleMouseLeave}>
                <button className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-full transition-all duration-200 ${activeMenu === 'marketing' ? 'bg-brand-dark/5 text-brand-primary' : 'text-brand-dark/70 hover:text-brand-dark hover:bg-brand-dark/5'}`} onClick={() => onNavigate('tools')}>
                  Marketing
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'marketing' ? 'rotate-180 text-brand-primary' : 'opacity-50'}`} />
                </button>
                <div className={`absolute top-[calc(100%-10px)] left-1/2 -translate-x-1/2 w-[700px] bg-brand-surface border border-brand-medium/20 rounded-2xl shadow-xl shadow-brand-dark/5 p-6 transition-all duration-300 transform origin-top z-50 ${activeMenu === 'marketing' ? 'opacity-100 scale-100 visible translate-y-0' : 'opacity-0 scale-95 invisible -translate-y-2'}`}>
                   <div className="grid grid-cols-2 gap-8">
                      <div>
                         <h3 className="text-xs font-extrabold text-brand-dark/40 uppercase tracking-wider mb-4 flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5" /> Calculators & Growth</h3>
                         <div className="space-y-2">
                            {getTools('Digital Marketing').map(tool => (
                               <button key={tool.id} onClick={() => { onToolSelect(tool.id); setActiveMenu(null); }} className="w-full group flex items-center gap-3 p-2 rounded-lg hover:bg-brand-light/50 transition-colors text-left">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getIconColor(tool.color)} bg-opacity-20 group-hover:scale-110 transition-transform`}><tool.icon className="w-4 h-4" /></div>
                                  <div>
                                      <p className="text-sm font-semibold text-brand-dark group-hover:text-brand-primary">{tool.title}</p>
                                      <p className="text-[10px] text-brand-dark/40 line-clamp-1">{tool.description}</p>
                                  </div>
                               </button>
                            ))}
                         </div>
                      </div>
                      <div className="border-l border-brand-medium/10 pl-8">
                         <h3 className="text-xs font-extrabold text-brand-dark/40 uppercase tracking-wider mb-4 flex items-center gap-2"><Layout className="w-3.5 h-3.5" /> Ad Creative Mockups</h3>
                         <div className="space-y-2">
                            {getTools('Ad Mockups').map(tool => (
                               <button key={tool.id} onClick={() => { onToolSelect(tool.id); setActiveMenu(null); }} className="w-full group flex items-center gap-3 p-2 rounded-lg hover:bg-brand-light/50 transition-colors text-left">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getIconColor(tool.color)} bg-opacity-20 group-hover:scale-110 transition-transform`}><tool.icon className="w-4 h-4" /></div>
                                  <div>
                                      <p className="text-sm font-semibold text-brand-dark group-hover:text-brand-primary">{tool.title}</p>
                                      <p className="text-[10px] text-brand-dark/40 line-clamp-1">{tool.description}</p>
                                  </div>
                               </button>
                            ))}
                         </div>
                         <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                            <p className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">Pro Tip</p>
                            <p className="text-[11px] text-blue-600 dark:text-blue-400">Use the mockup tools to visualize your ad copy before launching campaigns.</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* 4. Business Tools Mega Menu */}
              <div className="relative h-full flex items-center px-2" onMouseEnter={() => handleMouseEnter('business')} onMouseLeave={handleMouseLeave}>
                <button className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-full transition-all duration-200 ${activeMenu === 'business' ? 'bg-brand-dark/5 text-brand-primary' : 'text-brand-dark/70 hover:text-brand-dark hover:bg-brand-dark/5'}`} onClick={() => onNavigate('tools')}>
                  Business
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'business' ? 'rotate-180 text-brand-primary' : 'opacity-50'}`} />
                </button>
                <div className={`absolute top-[calc(100%-10px)] left-1/2 -translate-x-1/2 w-[380px] bg-brand-surface border border-brand-medium/20 rounded-2xl shadow-xl shadow-brand-dark/5 p-1 transition-all duration-300 transform origin-top z-50 ${activeMenu === 'business' ? 'opacity-100 scale-100 visible translate-y-0' : 'opacity-0 scale-95 invisible -translate-y-2'}`}>
                   <div className="p-2 space-y-1">
                      {getTools('Business Tools').map(tool => (
                         <button key={tool.id} onClick={() => { onToolSelect(tool.id); setActiveMenu(null); }} className="w-full group flex items-start gap-3 p-3 rounded-xl hover:bg-brand-light/50 transition-colors text-left">
                            <div className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getIconColor(tool.color)} group-hover:scale-110 transition-transform duration-300 shadow-sm`}><tool.icon className="w-5 h-5" /></div>
                            <div>
                               <p className="text-sm font-bold text-brand-dark group-hover:text-brand-primary transition-colors">{tool.title}</p>
                               <p className="text-[11px] text-brand-dark/50 leading-tight mt-1 line-clamp-2">{tool.description}</p>
                            </div>
                         </button>
                      ))}
                   </div>
                </div>
              </div>

            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 z-[101]">
               <button 
                 onClick={toggleTheme} 
                 className="p-2.5 rounded-xl text-brand-dark/60 hover:text-brand-primary hover:bg-brand-light border border-transparent hover:border-brand-medium/20 transition-all duration-200 hidden lg:block"
                 aria-label="Toggle theme"
               >
                 {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
               </button>
               
               <button 
                 className="lg:hidden p-2.5 rounded-xl text-brand-dark hover:bg-brand-light transition-colors z-50"
                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
               >
                 {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
               </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 z-[90] bg-white dark:bg-[#0B1121] transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-x-4'}`}>
        <div className="h-20 shrink-0" />
        <div className="flex flex-col h-[calc(100vh-80px)] px-6 pb-10 overflow-y-auto">
          
          {/* Mobile Search */}
          <div className="relative mt-4 mb-6">
             <div className="flex items-center w-full bg-brand-light border border-brand-medium/30 rounded-xl px-4 py-3">
                <Search className="w-5 h-5 text-brand-dark/40 mr-3" />
                <input 
                    type="text" 
                    placeholder="Search tools..." 
                    className="bg-transparent border-none outline-none text-base w-full text-brand-dark"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             {searchQuery && (
                 <div className="absolute top-full left-0 w-full mt-2 bg-brand-surface rounded-xl border border-brand-medium/20 shadow-xl z-50 overflow-hidden">
                     {filteredTools.map(tool => (
                         <button key={tool.id} onClick={() => handleSearchResultClick('tool', tool.id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-light border-b border-brand-medium/10 last:border-0 text-left">
                             <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getIconColor(tool.color)}`}><tool.icon className="w-4 h-4" /></div>
                             <span className="text-sm font-medium text-brand-dark">{tool.title}</span>
                         </button>
                     ))}
                     {filteredTools.length === 0 && <div className="p-4 text-center text-brand-dark/50 text-sm">No results</div>}
                 </div>
             )}
          </div>

          <div className="flex-1 space-y-3">
             
             {/* Social Ad Specs Section */}
             <div className="rounded-2xl overflow-hidden border border-brand-medium/20 bg-brand-surface">
                <button onClick={() => toggleMobileSection('specs')} className={`w-full flex items-center justify-between p-4 transition-colors ${mobileExpandedSection === 'specs' ? 'bg-brand-light/50' : 'hover:bg-brand-light/30'}`}>
                   <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${mobileExpandedSection === 'specs' ? 'bg-brand-primary text-white' : 'bg-brand-light text-brand-dark/70'}`}><Layout className="w-5 h-5" /></div>
                      <span className="font-bold text-brand-dark">Social Ad Specs</span>
                   </div>
                   <ChevronDown className={`w-5 h-5 text-brand-dark/40 transition-transform ${mobileExpandedSection === 'specs' ? 'rotate-180' : ''}`} />
                </button>
                <div className={`transition-all duration-300 ease-in-out ${mobileExpandedSection === 'specs' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                   <div className="p-2 grid grid-cols-2 gap-2 bg-brand-light/20 border-t border-brand-medium/10">
                         {platforms.map(platform => (
                            <button key={platform.id} onClick={() => { onPlatformSelect(platform.id); setMobileMenuOpen(false); }} className="flex items-center gap-2 p-2 rounded-lg hover:bg-brand-surface border border-transparent hover:border-brand-medium/10 transition-all group">
                               <div className="w-6 h-6 rounded-md bg-white dark:bg-brand-dark/10 flex items-center justify-center text-brand-dark/60 group-hover:text-brand-primary shadow-sm">
                                  {getPlatformIcon(platform.id)}
                                </div>
                               <span className="text-xs font-bold text-brand-dark/80">{platform.name}</span>
                            </button>
                         ))}
                   </div>
                </div>
             </div>

             {/* SEO Tools Section */}
             <div className="rounded-2xl overflow-hidden border border-brand-medium/20 bg-brand-surface">
                <button onClick={() => toggleMobileSection('seo')} className={`w-full flex items-center justify-between p-4 transition-colors ${mobileExpandedSection === 'seo' ? 'bg-brand-light/50' : 'hover:bg-brand-light/30'}`}>
                   <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${mobileExpandedSection === 'seo' ? 'bg-indigo-600 text-white' : 'bg-brand-light text-brand-dark/70'}`}><Globe className="w-5 h-5" /></div>
                      <span className="font-bold text-brand-dark">SEO Tools</span>
                   </div>
                   <ChevronDown className={`w-5 h-5 text-brand-dark/40 transition-transform ${mobileExpandedSection === 'seo' ? 'rotate-180' : ''}`} />
                </button>
                <div className={`transition-all duration-300 ease-in-out ${mobileExpandedSection === 'seo' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                   <div className="p-2 space-y-1 bg-brand-light/20 border-t border-brand-medium/10">
                         {getTools('SEO Tools').map(tool => (
                            <button key={tool.id} onClick={() => { onToolSelect(tool.id); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-brand-surface text-left transition-colors">
                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getIconColor(tool.color)} bg-opacity-20`}><tool.icon className="w-4 h-4" /></div>
                               <span className="text-sm font-medium text-brand-dark/90">{tool.title}</span>
                            </button>
                         ))}
                   </div>
                </div>
             </div>

             {/* Marketing Section */}
             <div className="rounded-2xl overflow-hidden border border-brand-medium/20 bg-brand-surface">
                <button onClick={() => toggleMobileSection('marketing')} className={`w-full flex items-center justify-between p-4 transition-colors ${mobileExpandedSection === 'marketing' ? 'bg-brand-light/50' : 'hover:bg-brand-light/30'}`}>
                   <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${mobileExpandedSection === 'marketing' ? 'bg-blue-600 text-white' : 'bg-brand-light text-brand-dark/70'}`}><TrendingUp className="w-5 h-5" /></div>
                      <span className="font-bold text-brand-dark">Marketing & Ads</span>
                   </div>
                   <ChevronDown className={`w-5 h-5 text-brand-dark/40 transition-transform ${mobileExpandedSection === 'marketing' ? 'rotate-180' : ''}`} />
                </button>
                <div className={`transition-all duration-300 ease-in-out ${mobileExpandedSection === 'marketing' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                   <div className="p-2 space-y-1 bg-brand-light/20 border-t border-brand-medium/10">
                         {getTools('Digital Marketing').concat(getTools('Ad Mockups')).map(tool => (
                            <button key={tool.id} onClick={() => { onToolSelect(tool.id); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-brand-surface text-left transition-colors">
                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getIconColor(tool.color)} bg-opacity-20`}><tool.icon className="w-4 h-4" /></div>
                               <span className="text-sm font-medium text-brand-dark/90">{tool.title}</span>
                            </button>
                         ))}
                   </div>
                </div>
             </div>

             {/* Business Section */}
             <div className="rounded-2xl overflow-hidden border border-brand-medium/20 bg-brand-surface">
                <button onClick={() => toggleMobileSection('business')} className={`w-full flex items-center justify-between p-4 transition-colors ${mobileExpandedSection === 'business' ? 'bg-brand-light/50' : 'hover:bg-brand-light/30'}`}>
                   <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${mobileExpandedSection === 'business' ? 'bg-purple-600 text-white' : 'bg-brand-light text-brand-dark/70'}`}><PieChart className="w-5 h-5" /></div>
                      <span className="font-bold text-brand-dark">Business Tools</span>
                   </div>
                   <ChevronDown className={`w-5 h-5 text-brand-dark/40 transition-transform ${mobileExpandedSection === 'business' ? 'rotate-180' : ''}`} />
                </button>
                <div className={`transition-all duration-300 ease-in-out ${mobileExpandedSection === 'business' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                   <div className="p-2 space-y-1 bg-brand-light/20 border-t border-brand-medium/10">
                         {getTools('Business Tools').map(tool => (
                            <button key={tool.id} onClick={() => { onToolSelect(tool.id); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-brand-surface text-left transition-colors">
                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getIconColor(tool.color)} bg-opacity-20`}><tool.icon className="w-4 h-4" /></div>
                               <span className="text-sm font-medium text-brand-dark/90">{tool.title}</span>
                            </button>
                         ))}
                   </div>
                </div>
             </div>

             <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-brand-medium/20 bg-brand-surface hover:bg-brand-light/30 transition-colors mt-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-brand-light text-brand-dark/70"><Settings className="w-5 h-5" /></div>
                   <span className="font-bold text-brand-dark">Settings</span>
                </div>
             </button>

          </div>

          {/* Footer Actions */}
          <div className="mt-auto pt-6">
             <button onClick={toggleTheme} className="flex items-center justify-between w-full p-4 bg-brand-surface dark:bg-white/5 rounded-2xl border border-brand-medium/20 active:scale-98 transition-transform">
                <div className="flex items-center gap-3">
                   <div className="w-9 h-9 rounded-full bg-brand-light dark:bg-brand-dark/10 flex items-center justify-center shadow-sm text-brand-dark border border-brand-medium/10">{theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</div>
                   <span className="font-bold text-brand-dark text-base">Appearance</span>
                </div>
                <span className="text-xs font-bold text-brand-dark/60 uppercase tracking-wide px-3 py-1 rounded-full bg-brand-light border border-brand-medium/20">{theme}</span>
             </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Header;
