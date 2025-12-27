import React, { useEffect, useState } from 'react';
import { Check, Home, ArrowRight, Sparkles, Mail, Gift } from 'lucide-react';

interface ThankYouPageProps {
  onNavigateHome: () => void;
  onNavigateToDashboard?: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ onNavigateHome, onNavigateToDashboard }) => {
  const [showContent, setShowContent] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Show content after mount
    setTimeout(() => setShowContent(true), 100);

    // Generate confetti
    const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    }));
    setConfetti(confettiPieces);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-300/30 dark:bg-green-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-300/30 dark:bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-300/20 dark:bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      </div>

      {/* Confetti Animation */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-sm animate-confetti"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}

      {/* Main Content */}
      <div className={`relative z-10 max-w-2xl w-full transform transition-all duration-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-green-200/50 dark:border-green-700/50">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Pulsing Rings */}
              <div className="absolute inset-0 rounded-full bg-green-400/30 dark:bg-green-500/30 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-green-400/20 dark:bg-green-500/20 animate-pulse" style={{ animationDuration: '2s' }} />
              
              {/* Icon Container */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Check className="w-12 h-12 text-white stroke-[3]" />
              </div>

              {/* Sparkles */}
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-pulse" />
              <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-green-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
            Thank You! 🎉
          </h1>

          <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-8">
            Your subscription has been successfully activated!
          </p>

          {/* Success Details */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 mb-8 border border-green-200/50 dark:border-green-700/50">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500/10 dark:bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    Confirmation Email Sent
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Check your inbox for a confirmation email with your receipt and account details.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500/10 dark:bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    Premium Access Unlocked
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You now have full access to all premium tools and features!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500/10 dark:bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    30% Holiday Discount Applied
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You've saved with our special Christmas & New Year promotion!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-green-600 dark:text-green-400" />
              What's Next?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                <span>Access your dashboard to explore all premium tools</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                <span>Start creating high-performing ad campaigns with AI-powered tools</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                <span>Track your SEO performance and optimize your content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                <span>Need help? Contact our support team anytime</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {onNavigateToDashboard && (
              <button
                onClick={onNavigateToDashboard}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            
            <button
              onClick={onNavigateHome}
              className="flex-1 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Questions? Email us at{' '}
          <a href="mailto:support@perfxads.com" className="text-green-600 dark:text-green-400 hover:underline">
            support@perfxads.com
          </a>
        </p>
      </div>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
};
