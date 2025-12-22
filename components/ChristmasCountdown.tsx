import React, { useState, useEffect } from 'react';
import { Gift, Sparkles } from 'lucide-react';

interface ChristmasCountdownProps {
  onClaimOffer?: () => void;
}

const ChristmasCountdown: React.FC<ChristmasCountdownProps> = ({ onClaimOffer }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const newYear = new Date('2026-01-01T00:00:00');
      const now = new Date();
      const difference = newYear.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Don't show after New Year
  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white py-3 px-4 shadow-lg relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
          animation: 'slide 20s linear infinite'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 relative z-10">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 animate-bounce" />
          <span className="font-bold text-lg">🎄 Christmas Offer!</span>
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-semibold">Get 30% OFF Premium Plans</span>
          <span className="hidden md:inline">•</span>
          <span className="font-medium">Ends in:</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 min-w-[60px] text-center">
            <div className="text-xl font-bold">{timeLeft.days}</div>
            <div className="text-xs uppercase">Days</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 min-w-[60px] text-center">
            <div className="text-xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-xs uppercase">Hours</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 min-w-[60px] text-center">
            <div className="text-xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-xs uppercase">Min</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 min-w-[60px] text-center">
            <div className="text-xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-xs uppercase">Sec</div>
          </div>
        </div>

        <button 
          onClick={onClaimOffer}
          className="bg-white text-red-600 hover:bg-red-50 px-6 py-2 rounded-full font-bold transition-all hover:scale-105 shadow-lg"
        >
          Claim Offer 🎁
        </button>
      </div>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(70px); }
        }
      `}</style>
    </div>
  );
};

export default ChristmasCountdown;
