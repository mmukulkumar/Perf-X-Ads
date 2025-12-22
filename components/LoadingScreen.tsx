import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center z-[9999]">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="mb-8 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-32 h-32 mx-auto">
            <defs>
              <linearGradient id="loadingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#E0E7FF', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            
            {/* Background circle */}
            <circle cx="256" cy="256" r="220" fill="rgba(255,255,255,0.1)" />
            
            {/* P Letter */}
            <path d="M 160 140 L 240 140 Q 360 140 360 220 Q 360 300 240 300 L 200 300 L 200 372 L 160 372 Z M 200 180 L 200 260 L 240 260 Q 320 260 320 220 Q 320 180 240 180 Z" 
                  fill="url(#loadingGrad)" 
                  stroke="#FFFFFF" 
                  strokeWidth="3"/>
            
            {/* Accent Circle */}
            <circle cx="380" cy="180" r="28" fill="#F97316">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="380" cy="180" r="16" fill="#FFFFFF">
              <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* Loading Text */}
        <h2 className="text-3xl font-bold text-white mb-4">Perfxads</h2>
        <p className="text-white/80 text-sm uppercase tracking-widest mb-6">Loading Your Premium Experience</p>
        
        {/* Progress Bar */}
        <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-white rounded-full animate-loading-bar"></div>
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(0); }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
