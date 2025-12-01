
import React from 'react';
import { Building2, Target, Zap, Globe, Users, ArrowRight, ShieldCheck } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="relative bg-brand-light border-b border-brand-medium/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-5"></div>
        <div className="absolute top-0 right-0 p-12 opacity-5">
           <Building2 className="w-64 h-64 text-brand-dark" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface text-brand-dark text-xs font-bold mb-6 border border-brand-medium/30 shadow-sm animate-in slide-in-from-bottom-2 duration-700">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Powered by DMSPrism
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight mb-6 leading-tight">
            Empowering Performance Marketers
          </h1>
          <p className="text-lg md:text-xl text-brand-dark/70 max-w-2xl mx-auto leading-relaxed">
            Perf X Ads is the ultimate toolkit designed to help digital advertisers <span className="text-indigo-600 font-semibold">maximise</span> their campaign potential and <span className="text-indigo-600 font-semibold">optimise</span> their workflows.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Mission & DMSPrism Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
                <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                    <Target className="w-6 h-6 text-indigo-600" /> Our Mission
                </h2>
                <p className="text-brand-dark/70 leading-relaxed mb-6">
                    In the fast-paced world of digital marketing, keeping up with constantly changing ad specifications and complex calculations can be daunting. Our goal is to <span className="font-semibold text-brand-dark">centralise</span> this information.
                </p>
                <p className="text-brand-dark/70 leading-relaxed">
                    We built Perf X Ads to be the go-to resource for media buyers, providing precise ad mockups, reliable ROI calculators, and up-to-date technical specs—all in one place. We help you <span className="font-semibold text-brand-dark">realise</span> better results with less friction.
                </p>
            </div>
            <div className="bg-brand-surface p-8 rounded-2xl border border-brand-medium/30 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-brand-dark rounded-lg flex items-center justify-center text-white font-bold text-lg">D</div>
                    <div>
                        <h3 className="text-lg font-bold text-brand-dark">Powered by DMSPrism</h3>
                        <p className="text-xs text-brand-dark/50 font-medium uppercase tracking-wide">Technology Partner</p>
                    </div>
                </div>
                <p className="text-brand-dark/80 text-sm leading-relaxed mb-6">
                    This platform is driven by the robust technological infrastructure of <strong>DMSPrism</strong>. As a leader in digital solutions, DMSPrism specialises in creating scalable, high-performance applications that analyse complex data behaviours and deliver intuitive user experiences.
                </p>
                <div className="flex gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-brand-light border border-brand-medium/20 text-brand-dark/70">
                        Data Analytics
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-brand-light border border-brand-medium/20 text-brand-dark/70">
                        AI Integration
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-brand-light border border-brand-medium/20 text-brand-dark/70">
                        Digital Strategy
                    </span>
                </div>
            </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
            <h2 className="text-2xl font-bold text-brand-dark mb-8 text-center">Why Marketers Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-brand-surface p-6 rounded-xl border border-brand-medium/20 hover:border-indigo-500/30 transition-colors shadow-sm group">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="font-bold text-brand-dark mb-2">Efficiency & Speed</h3>
                    <p className="text-sm text-brand-dark/60 leading-relaxed">
                        Rapidly validate creatives and calculate budgets without switching between multiple browser tabs.
                    </p>
                </div>
                <div className="bg-brand-surface p-6 rounded-xl border border-brand-medium/20 hover:border-indigo-500/30 transition-colors shadow-sm group">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-bold text-brand-dark mb-2">Global Standards</h3>
                    <p className="text-sm text-brand-dark/60 leading-relaxed">
                        We maintain an updated database of specifications for all major global social platforms.
                    </p>
                </div>
                <div className="bg-brand-surface p-6 rounded-xl border border-brand-medium/20 hover:border-indigo-500/30 transition-colors shadow-sm group">
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-bold text-brand-dark mb-2">Privacy Focused</h3>
                    <p className="text-sm text-brand-dark/60 leading-relaxed">
                        We value your data privacy. Calculations are performed locally or securely processed.
                    </p>
                </div>
            </div>
        </div>

        {/* Contact / CTA */}
        <div className="bg-brand-dark rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to optimise your campaigns?</h2>
                <p className="text-white/70 mb-8 max-w-xl mx-auto">
                    Explore our suite of tools today and see the difference precision makes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-8 py-3 bg-white text-brand-dark font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                        Explore Tools
                    </button>
                    <button className="px-8 py-3 bg-transparent border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
