import React from 'react';

const TriangleLogoWithSantaHat: React.FC = () => {
  return (
    <div className="relative inline-block">
      {/* Original Triangle Logo */}
      <svg
        width="76"
        height="65"
        viewBox="0 0 76 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="#000000" />
      </svg>

      {/* Santa Hat positioned on top of triangle */}
      <div 
        className="absolute pointer-events-none z-10"
        style={{
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%) rotate(-5deg)',
          transformOrigin: 'bottom center'
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="santaHatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="50%" stopColor="#B91C1C" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
            <filter id="santaHatShadow">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.4"/>
            </filter>
            <filter id="pompomGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="#FFFFFF" floodOpacity="0.6"/>
            </filter>
          </defs>
          
          {/* Hat cone body */}
          <path 
            d="M 9 12 L 10 7 Q 11 4 14 3 Q 17 4 18 7 L 19 12 L 21 19 Q 21 21 14 21 Q 7 21 7 19 Z" 
            fill="url(#santaHatGrad)" 
            filter="url(#santaHatShadow)" 
          />
          
          {/* Darker shading on left side for depth */}
          <path 
            d="M 9 12 L 10 7 Q 11 4 14 3 L 14 21 Q 7 21 7 19 Z" 
            fill="#991B1B" 
            opacity="0.3"
          />
          
          {/* White fur trim at bottom - layered for realism */}
          <ellipse cx="14" cy="19" rx="7" ry="2" fill="#FFFFFF"/>
          <ellipse cx="14" cy="18.5" rx="6.5" ry="1.5" fill="#F8FAFC" />
          <ellipse cx="14" cy="18.2" rx="6" ry="1.2" fill="#FEFEFE" />
          
          {/* White pom-pom at top - with glow */}
          <circle cx="14" cy="3" r="3" fill="#FFFFFF" filter="url(#pompomGlow)"/>
          <circle cx="14" cy="3" r="2.3" fill="#FEFEFE" />
          <circle cx="14" cy="3" r="1.5" fill="#FFFFFF" opacity="0.8"/>
          
          {/* Highlight on hat for dimension */}
          <path 
            d="M 11.5 9 Q 12.5 5.5 14 4 Q 15.5 5.5 16.5 9" 
            stroke="#EF4444" 
            strokeWidth="0.4" 
            fill="none" 
            opacity="0.6" 
            strokeLinecap="round"
          />
          
          {/* Additional subtle texture lines */}
          <path 
            d="M 10 13 L 11 18" 
            stroke="#B91C1C" 
            strokeWidth="0.3" 
            opacity="0.3"
          />
          <path 
            d="M 18 13 L 17 18" 
            stroke="#7F1D1D" 
            strokeWidth="0.3" 
            opacity="0.3"
          />
        </svg>
      </div>
    </div>
  );
};

export default TriangleLogoWithSantaHat;
