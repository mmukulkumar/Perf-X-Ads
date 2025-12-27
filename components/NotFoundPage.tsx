import React from 'react';
import { Home, Search, ArrowLeft, RefreshCw } from 'lucide-react';

interface NotFoundPageProps {
  onNavigateHome: () => void;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-brand-light via-brand-surface to-brand-light relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Animated 404 Number */}
        <div className="mb-8 relative">
          <div className="text-[180px] sm:text-[220px] font-extrabold text-brand-dark/5 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Animated magnifying glass */}
              <div className="animate-bounce">
                <Search className="w-24 h-24 sm:w-32 sm:h-32 text-brand-primary" strokeWidth={1.5} />
              </div>
              {/* Rotating circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-dark tracking-tight">
            Page Not Found
          </h1>
          <p className="text-lg sm:text-xl text-brand-dark/60 max-w-md mx-auto">
            Oops! The page you're looking for seems to have wandered off. Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onNavigateHome}
            className="group flex items-center gap-3 px-8 py-4 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-3 px-8 py-4 bg-brand-surface hover:bg-brand-light text-brand-dark font-bold rounded-xl border-2 border-brand-medium/20 hover:border-brand-primary/40 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-brand-medium/20">
          <p className="text-sm text-brand-dark/50 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => { onNavigateHome(); }}
              className="px-4 py-2 bg-brand-surface hover:bg-brand-light text-brand-dark text-sm font-medium rounded-lg border border-brand-medium/20 transition-all hover:border-brand-primary/40"
            >
              Social Media Specs
            </button>
            <button
              onClick={() => { onNavigateHome(); }}
              className="px-4 py-2 bg-brand-surface hover:bg-brand-light text-brand-dark text-sm font-medium rounded-lg border border-brand-medium/20 transition-all hover:border-brand-primary/40"
            >
              Marketing Tools
            </button>
            <button
              onClick={() => { onNavigateHome(); }}
              className="px-4 py-2 bg-brand-surface hover:bg-brand-light text-brand-dark text-sm font-medium rounded-lg border border-brand-medium/20 transition-all hover:border-brand-primary/40"
            >
              Calculators
            </button>
          </div>
        </div>

        {/* Floating Elements Animation */}
        <div className="absolute -z-10 inset-0 overflow-hidden opacity-20">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-brand-primary rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-500 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-blue-500 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-brand-primary rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1.5s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
