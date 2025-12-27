import React from 'react';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

interface ServerErrorPageProps {
  onNavigateHome: () => void;
  onRetry?: () => void;
}

const ServerErrorPage: React.FC<ServerErrorPageProps> = ({ onNavigateHome, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-red-50 via-brand-surface to-orange-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Animated 500 Number */}
        <div className="mb-8 relative">
          <div className="text-[180px] sm:text-[220px] font-extrabold text-red-500/5 leading-none select-none">
            500
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Animated warning icon */}
              <div className="animate-bounce">
                <AlertTriangle className="w-24 h-24 sm:w-32 sm:h-32 text-red-500" strokeWidth={1.5} />
              </div>
              {/* Pulsing circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-red-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 sm:w-48 sm:h-48 border-4 border-orange-500/10 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-dark tracking-tight">
            Server Error
          </h1>
          <p className="text-lg sm:text-xl text-brand-dark/60 max-w-md mx-auto">
            Something went wrong on our end. We're working on fixing it. Please try again in a moment.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="group flex items-center gap-3 px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
            >
              <RefreshCw className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" />
              <span>Try Again</span>
            </button>
          )}
          
          <button
            onClick={onNavigateHome}
            className="group flex items-center gap-3 px-8 py-4 bg-brand-surface hover:bg-brand-light text-brand-dark font-bold rounded-xl border-2 border-brand-medium/20 hover:border-brand-primary/40 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Status Information */}
        <div className="mt-12 p-6 bg-brand-surface/50 backdrop-blur-sm border border-brand-medium/20 rounded-xl">
          <h3 className="text-sm font-bold text-brand-dark mb-3">What happened?</h3>
          <ul className="text-sm text-brand-dark/60 space-y-2 text-left max-w-md mx-auto">
            <li className="flex items-start gap-2">
              <span className="text-brand-primary mt-0.5">•</span>
              <span>Our servers encountered an unexpected error</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-primary mt-0.5">•</span>
              <span>The issue has been automatically reported to our team</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-primary mt-0.5">•</span>
              <span>Try refreshing the page or come back in a few minutes</span>
            </li>
          </ul>
        </div>

        {/* Floating Elements Animation */}
        <div className="absolute -z-10 inset-0 overflow-hidden opacity-20">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-500 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-orange-500 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-red-500 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;
