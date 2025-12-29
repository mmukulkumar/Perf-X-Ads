import React, { useState } from 'react';
import { QrCode, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import ToolHeader from './ToolHeader';

const UrlToQRCode: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [size, setSize] = useState<number>(300);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const validateUrl = (urlString: string): boolean => {
    if (!urlString.trim()) return false;
    try {
      new URL(urlString.match(/^https?:\/\//) ? urlString : `https://${urlString}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleGenerate = () => {
    if (!url.trim()) {
      setStatus({ type: 'error', message: 'Please enter a URL' });
      return;
    }

    if (!validateUrl(url)) {
      setStatus({ type: 'error', message: 'Please enter a valid URL' });
      return;
    }

    const normalizedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(normalizedUrl)}`;
    
    setQrCodeUrl(qrUrl);
    setStatus({ type: 'success', message: 'QR Code generated successfully!' });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-light/50 dark:from-brand-dark dark:via-brand-surface dark:to-brand-dark py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <ToolHeader
          title="URL to QR Code"
          description="Generate QR codes from URLs for easy sharing on marketing materials, business cards, and events."
          icon={QrCode}
        />

        {status.type && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
            status.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
          }`}>
            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
            <span className="text-sm font-medium">{status.message}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white dark:bg-brand-surface rounded-2xl shadow-lg border border-brand-border p-6 sm:p-8">
            <label className="block text-sm font-bold text-brand-dark mb-3">
              Enter URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="https://example.com"
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-light dark:bg-brand-dark/50 text-brand-dark placeholder-brand-dark/40 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all mb-6"
            />

            <label className="block text-sm font-bold text-brand-dark mb-3">
              QR Code Size: {size}x{size} px
            </label>
            <input
              type="range"
              min="150"
              max="500"
              step="50"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full mb-6"
            />

            <button
              onClick={handleGenerate}
              disabled={!url.trim()}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-brand-medium/30 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/25 hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
            >
              <QrCode className="w-5 h-5" />
              Generate QR Code
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white dark:bg-brand-surface rounded-2xl shadow-lg border border-brand-border p-6 sm:p-8 flex flex-col items-center justify-center">
            {qrCodeUrl ? (
              <>
                <img 
                  src={qrCodeUrl} 
                  alt="Generated QR Code" 
                  className="w-full max-w-sm border-4 border-brand-border rounded-xl mb-4"
                />
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download QR Code
                </button>
              </>
            ) : (
              <div className="text-center py-12">
                <QrCode className="w-16 h-16 text-brand-medium/40 mx-auto mb-4" />
                <p className="text-brand-dark/60">Enter a URL and click generate to create your QR code</p>
              </div>
            )}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-brand-surface rounded-xl border border-brand-border p-5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
              <QrCode className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-brand-dark mb-1">Marketing Materials</h3>
            <p className="text-xs text-brand-dark/60">Add QR codes to flyers, posters, and brochures for easy access.</p>
          </div>

          <div className="bg-white dark:bg-brand-surface rounded-xl border border-brand-border p-5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-brand-dark mb-1">Event Registration</h3>
            <p className="text-xs text-brand-dark/60">Share event links and registration pages instantly.</p>
          </div>

          <div className="bg-white dark:bg-brand-surface rounded-xl border border-brand-border p-5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-sm font-bold text-brand-dark mb-1">Business Cards</h3>
            <p className="text-xs text-brand-dark/60">Make your contact info and website easily scannable.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlToQRCode;
