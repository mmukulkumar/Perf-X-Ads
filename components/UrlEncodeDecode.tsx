import React, { useState, useEffect } from 'react';
import { Link2, Copy, CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import ToolHeader from './ToolHeader';

type EncodingType = 'url' | 'base64' | 'html' | 'unicode' | 'hex' | 'binary' | 'rot13' | 'jwt';
type Mode = 'encode' | 'decode';

const UrlEncodeDecode: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [mode, setMode] = useState<Mode>('encode');
  const [encodingType, setEncodingType] = useState<EncodingType>('url');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(false);

  const encodeText = (text: string, type: EncodingType): string => {
    try {
      switch (type) {
        case 'url':
          return encodeURIComponent(text);
        case 'base64':
          return btoa(text);
        case 'html':
          return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        case 'unicode':
          return text.split('').map(char => {
            const code = char.charCodeAt(0);
            return code > 127 ? '\\u' + ('0000' + code.toString(16)).slice(-4) : char;
          }).join('');
        case 'hex':
          return Array.from(text).map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
        case 'binary':
          return Array.from(text).map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        case 'rot13':
          return text.replace(/[a-zA-Z]/g, (char) => {
            const code = char.charCodeAt(0);
            const isUpperCase = code >= 65 && code <= 90;
            const base = isUpperCase ? 65 : 97;
            return String.fromCharCode(((code - base + 13) % 26) + base);
          });
        case 'jwt':
          const base64urlEncode = (str: string) => {
            return btoa(str)
              .replace(/\+/g, '-')
              .replace(/\//g, '_')
              .replace(/=/g, '');
          };
          try {
            const parts = text.split('.');
            if (parts.length === 3) {
              return text;
            }
            const header = base64urlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
            const payload = base64urlEncode(text);
            return `${header}.${payload}.[signature-required]`;
          } catch {
            return text;
          }
        default:
          return text;
      }
    } catch (error) {
      throw new Error(`Failed to encode with ${type}`);
    }
  };

  const decodeText = (text: string, type: EncodingType): string => {
    try {
      switch (type) {
        case 'url':
          return decodeURIComponent(text);
        case 'base64':
          return atob(text);
        case 'html':
          return text
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
        case 'unicode':
          return text.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
        case 'hex':
          return text.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
        case 'binary':
          return text.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
        case 'rot13':
          return encodeText(text, 'rot13');
        case 'jwt':
          const base64urlDecode = (str: string) => {
            let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) {
              base64 += '=';
            }
            return atob(base64);
          };
          try {
            const parts = text.split('.');
            if (parts.length >= 2) {
              const header = base64urlDecode(parts[0]);
              const payload = base64urlDecode(parts[1]);
              return `Header: ${header}\n\nPayload: ${payload}`;
            }
            return text;
          } catch {
            throw new Error('Invalid JWT format');
          }
        default:
          return text;
      }
    } catch (error) {
      throw new Error(`Failed to decode with ${type}`);
    }
  };

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setStatus({ type: null, message: '' });
      return;
    }

    try {
      const result = mode === 'encode' ? encodeText(input, encodingType) : decodeText(input, encodingType);
      setOutput(result);
      setStatus({ type: 'success', message: `✓ ${mode === 'encode' ? 'Encoded' : 'Decoded'} successfully` });
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || `Failed to ${mode}` });
      setOutput('');
    }
  }, [input, mode, encodingType]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setStatus({ type: null, message: '' });
  };

  const encodingOptions: { value: EncodingType; label: string; description: string }[] = [
    { value: 'url', label: 'URL Encoding', description: 'Special characters for URLs' },
    { value: 'base64', label: 'Base64', description: 'Binary-to-text encoding' },
    { value: 'jwt', label: 'JWT', description: 'JSON Web Token format' },
    { value: 'html', label: 'HTML Entities', description: 'HTML special character encoding' },
    { value: 'unicode', label: 'Unicode', description: 'Unicode escape sequences' },
    { value: 'hex', label: 'Hexadecimal', description: 'Hexadecimal representation' },
    { value: 'binary', label: 'Binary', description: 'Binary representation' },
    { value: 'rot13', label: 'ROT13', description: 'Caesar cipher rotation' },
  ];

  const professionalTips: Record<EncodingType, { title: string; tip: string }> = {
    url: {
      title: 'URL Encoding',
      tip: 'Use URL encoding when you need to pass special characters in URLs. This ensures your links work properly across all browsers and platforms.'
    },
    base64: {
      title: 'Base64 Encoding',
      tip: 'Perfect for encoding binary data, images, or sensitive information for transmission. Commonly used in email attachments and API responses.'
    },
    jwt: {
      title: 'JWT (JSON Web Token)',
      tip: 'Industry standard for secure token-based authentication. Used extensively in API authentication and authorization workflows.'
    },
    html: {
      title: 'HTML Entity Encoding',
      tip: 'Essential for displaying special characters in HTML without breaking the page structure. Prevents XSS attacks by escaping dangerous characters.'
    },
    unicode: {
      title: 'Unicode Encoding',
      tip: 'Convert international characters to ASCII-safe format for cross-platform compatibility and data transmission.'
    },
    hex: {
      title: 'Hexadecimal Encoding',
      tip: 'Useful for debugging, color codes, and low-level data representation. Each byte is represented by two hex digits.'
    },
    binary: {
      title: 'Binary Encoding',
      tip: 'Represents data at the bit level. Useful for understanding data structure and digital communications.'
    },
    rot13: {
      title: 'ROT13 Cipher',
      tip: 'Simple letter substitution cipher. Not for security, but useful for obscuring spoilers or puzzle solutions.'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-light/50 dark:from-brand-dark dark:via-brand-surface dark:to-brand-dark py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <ToolHeader
          title="URL Encode / Decode"
          description="Encode and decode text using URL, Base64, HTML entities, Unicode, Hex, Binary, and ROT13 formats."
          icon={Link2}
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

        {/* Professional Tip */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">
                  {professionalTips[encodingType].title}
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Click to {showTips ? 'hide' : 'view'} professional tips
                </p>
              </div>
            </div>
            <div className={`transition-transform ${showTips ? 'rotate-180' : ''}`}>
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </button>
          
          {showTips && (
            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800 animate-in fade-in slide-in-from-top-2">
              <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                {professionalTips[encodingType].tip}
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-brand-surface rounded-2xl shadow-lg border border-brand-border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-2">Mode</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('encode')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                    mode === 'encode' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-brand-light dark:bg-brand-dark/50 text-brand-dark hover:bg-brand-medium/20'
                  }`}
                >
                  Encode
                </button>
                <button
                  onClick={() => setMode('decode')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                    mode === 'decode' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-brand-light dark:bg-brand-dark/50 text-brand-dark hover:bg-brand-medium/20'
                  }`}
                >
                  Decode
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-dark mb-2">Encoding Type</label>
              <select
                value={encodingType}
                onChange={(e) => setEncodingType(e.target.value as EncodingType)}
                className="w-full px-4 py-2 rounded-lg border border-brand-border bg-brand-light dark:bg-brand-dark/50 text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              >
                {encodingOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Instant Results Badge */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-brand-dark/60">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Instant real-time {mode === 'encode' ? 'encoding' : 'decoding'} as you type</span>
          </div>
        </div>

        {/* Input/Output */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-brand-surface rounded-2xl shadow-lg border border-brand-border p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-brand-dark">Input</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-brand-dark/60">{input.length} characters</span>
                {input && (
                  <button
                    onClick={handleClear}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-all"
                    title="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter text to ${mode}... (real-time processing)`}
              className="w-full h-64 px-4 py-3 rounded-xl border border-brand-border bg-brand-light dark:bg-brand-dark/50 text-brand-dark placeholder-brand-dark/40 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none font-mono text-sm"
            />
          </div>

          <div className="bg-white dark:bg-brand-surface rounded-2xl shadow-lg border border-brand-border p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-brand-dark">Output</label>
              <div className="flex items-center gap-2">
                {output && (
                  <>
                    <span className="text-xs text-brand-dark/60">{output.length} characters</span>
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 bg-brand-light dark:bg-brand-dark/50 hover:bg-brand-medium/20 text-brand-dark rounded-lg font-semibold text-xs transition-all flex items-center gap-2"
                    >
                      {isCopied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </>
                )}
              </div>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Result will appear here instantly..."
              className="w-full h-64 px-4 py-3 rounded-xl border border-brand-border bg-brand-light dark:bg-brand-dark/50 text-brand-dark placeholder-brand-dark/40 font-mono text-sm resize-none focus:outline-none"
            />
          </div>
        </div>

        {/* Features & Use Cases */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* 8+ Formats */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
            <h4 className="text-sm font-bold text-purple-900 dark:text-purple-200 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              8+ Formats Supported
            </h4>
            <p className="text-xs text-purple-800 dark:text-purple-300 mb-3">
              All encoding formats in one professional tool
            </p>
            <ul className="text-xs text-purple-700 dark:text-purple-400 space-y-1.5">
              <li>• <strong>URL Encoding</strong> - Special characters for URLs</li>
              <li>• <strong>Base64</strong> - Binary data encoding</li>
              <li>• <strong>JWT</strong> - JSON Web Token format</li>
              <li>• <strong>HTML</strong> - HTML entity encoding</li>
              <li>• <strong>Unicode</strong> - Universal character encoding</li>
              <li>• <strong>Hex</strong> - Hexadecimal format</li>
              <li>• <strong>Binary</strong> - Binary representation</li>
              <li>• <strong>ROT13</strong> - Caesar cipher</li>
            </ul>
          </div>

          {/* Real-World Use Cases */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Real-World Use Cases
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-2.5">
              <li>
                <strong className="block mb-1">🔌 API Development</strong>
                Encode query parameters and special characters for seamless API integration and RESTful services
              </li>
              <li>
                <strong className="block mb-1">🔐 Security & Authentication</strong>
                Encode sensitive data with Base64 or JWT for secure transmission and token generation
              </li>
              <li>
                <strong className="block mb-1">📱 Cross-Platform Transfer</strong>
                Convert data between formats for compatibility across web, mobile, and server applications
              </li>
              <li>
                <strong className="block mb-1">🌐 Web Development</strong>
                Handle special characters in URLs, forms, and HTML content safely
              </li>
            </ul>
          </div>
        </div>

        {/* Professional Features */}
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <h4 className="text-sm font-bold text-green-900 dark:text-green-200 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Professional Features
          </h4>
          <div className="grid md:grid-cols-3 gap-4 text-xs text-green-800 dark:text-green-300">
            <div>
              <strong className="block mb-1">⚡ Instant Results</strong>
              Real-time encoding/decoding as you type - no button clicks needed
            </div>
            <div>
              <strong className="block mb-1">📋 Copy Results</strong>
              One-click copy to clipboard for immediate use in your projects
            </div>
            <div>
              <strong className="block mb-1">🔄 Two-Way Processing</strong>
              Seamlessly switch between encoding and decoding modes
            </div>
            <div>
              <strong className="block mb-1">📊 Character Count</strong>
              Track input and output lengths for data validation
            </div>
            <div>
              <strong className="block mb-1">🎯 Format Descriptions</strong>
              Clear explanations for each encoding type
            </div>
            <div>
              <strong className="block mb-1">💡 Professional Tips</strong>
              Expert guidance for each encoding format
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlEncodeDecode;
