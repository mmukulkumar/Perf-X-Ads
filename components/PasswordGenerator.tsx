import React, { useState, useEffect } from 'react';
import ToolHeader from './ToolHeader';
import { Shield, Copy, Check, RefreshCw, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const characterSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  // Generate password on component mount and when options change
  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  // Calculate password strength
  useEffect(() => {
    calculatePasswordStrength();
  }, [password]);

  const generatePassword = async () => {
    try {
      let charset = '';
      if (includeUppercase) charset += characterSets.uppercase;
      if (includeLowercase) charset += characterSets.lowercase;
      if (includeNumbers) charset += characterSets.numbers;
      if (includeSymbols) charset += characterSets.symbols;

      if (charset.length === 0) {
        setPassword('');
        return;
      }

      // Use Web Crypto API for cryptographically secure random generation
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);

      let result = '';
      for (let i = 0; i < length; i++) {
        result += charset[array[i] % charset.length];
      }

      setPassword(result);
    } catch (error) {
      console.error('Error generating password:', error);
      // Fallback to less secure method if crypto API fails
      generateFallbackPassword();
    }
  };

  const generateFallbackPassword = () => {
    let charset = '';
    if (includeUppercase) charset += characterSets.uppercase;
    if (includeLowercase) charset += characterSets.lowercase;
    if (includeNumbers) charset += characterSets.numbers;
    if (includeSymbols) charset += characterSets.symbols;

    if (charset.length === 0) {
      setPassword('');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }

    setPassword(result);
  };

  const calculatePasswordStrength = () => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (password.length >= 16) strength += 1;

    // Character variety check
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    // Complexity check
    if (password.length >= 20 && strength >= 4) strength += 1;

    setPasswordStrength(Math.min(strength, 5));
  };

  const getStrengthLabel = () => {
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return labels[passwordStrength] || 'Very Weak';
  };

  const getStrengthColor = () => {
    const colors = ['bg-red-500', 'bg-red-400', 'bg-yellow-500', 'bg-yellow-400', 'bg-green-500', 'bg-green-600'];
    return colors[passwordStrength] || 'bg-red-500';
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy password:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = password;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetOptions = () => {
    setLength(16);
    setIncludeUppercase(true);
    setIncludeLowercase(true);
    setIncludeNumbers(true);
    setIncludeSymbols(true);
  };

  const getPasswordEntropy = () => {
    let charsetSize = 0;
    if (includeUppercase) charsetSize += 26;
    if (includeLowercase) charsetSize += 26;
    if (includeNumbers) charsetSize += 10;
    if (includeSymbols) charsetSize += 32;

    if (charsetSize === 0) return 0;

    return Math.log2(Math.pow(charsetSize, length));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToolHeader
        title="Password Generator"
        description="Generate cryptographically secure passwords with customizable options. Create strong, random passwords for enhanced security."
        icon={Shield}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Password Options</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Length: {length}
              </label>
              <input
                type="range"
                min="4"
                max="64"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>4</span>
                <span>32</span>
                <span>64</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="uppercase"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="uppercase" className="ml-2 text-sm text-gray-700">
                  Include Uppercase Letters (A-Z)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lowercase"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="lowercase" className="ml-2 text-sm text-gray-700">
                  Include Lowercase Letters (a-z)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="numbers"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="numbers" className="ml-2 text-sm text-gray-700">
                  Include Numbers (0-9)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="symbols"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="symbols" className="ml-2 text-sm text-gray-700">
                  Include Symbols (!@#$%^&*)
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={generatePassword}
                className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Generate New Password
              </button>
              <button
                onClick={resetOptions}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Generated Password</h3>
            {password && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showPassword ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            {password ? (
              <div className="font-mono text-lg text-center break-all">
                {showPassword ? password : '•'.repeat(password.length)}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                Configure your options and generate a secure password.
              </div>
            )}
          </div>

          {password && (
            <>
              {/* Password Strength Indicator */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Password Strength</span>
                  <span className="text-sm text-gray-600">{getStrengthLabel()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Password Statistics */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-semibold mb-2 text-blue-800">Password Statistics</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Length:</strong> {password.length} characters</p>
                  <p><strong>Entropy:</strong> {getPasswordEntropy().toFixed(1)} bits</p>
                  <p><strong>Character Types:</strong> {
                    [includeUppercase && 'Uppercase',
                     includeLowercase && 'Lowercase',
                     includeNumbers && 'Numbers',
                     includeSymbols && 'Symbols']
                    .filter(Boolean).join(', ')
                  }</p>
                </div>
              </div>

              {/* Security Tips */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold mb-1 text-yellow-800">Security Tips</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Use unique passwords for each account</li>
                      <li>• Consider using a password manager</li>
                      <li>• Enable two-factor authentication when available</li>
                      <li>• Change passwords regularly for critical accounts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Password Examples */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold mb-3">Password Strength Examples</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Very Weak: "password123"</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">Fair: "MyPass123"</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Strong: "Tr@vel2024!Secure"</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-gray-600">Very Strong: "B7$mP9&kL2@vR8!qW4"</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;