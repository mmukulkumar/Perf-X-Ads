# Password Generator

A cryptographically secure password generator tool that creates strong, random passwords with customizable options.

## Features

- **Cryptographically Secure**: Uses Web Crypto API for true randomness
- **Customizable Length**: Generate passwords from 4 to 64 characters
- **Character Options**: Mix uppercase, lowercase, numbers, and symbols
- **Password Strength Meter**: Real-time strength assessment
- **Security Statistics**: Entropy calculation and character analysis
- **Copy to Clipboard**: One-click copying with visual feedback
- **Show/Hide Password**: Toggle password visibility
- **Responsive Design**: Works on all device sizes

## Security Features

### Cryptographic Security
- Uses `crypto.getRandomValues()` for cryptographically secure random number generation
- Fallback to `Math.random()` only if Web Crypto API is unavailable
- No predictable patterns or sequences

### Password Strength Analysis
- **Length Assessment**: Longer passwords are stronger
- **Character Variety**: Mix of different character types increases strength
- **Entropy Calculation**: Measures password randomness in bits
- **Visual Strength Indicator**: Color-coded strength meter

### Character Sets
- **Uppercase**: A-Z (26 characters)
- **Lowercase**: a-z (26 characters)
- **Numbers**: 0-9 (10 characters)
- **Symbols**: !@#$%^&*()_+-=[]{}|;:,.<>? (32 characters)

## Usage

1. **Set Password Length**: Use the slider to choose length (4-64 characters)
2. **Select Character Types**: Check boxes for desired character types
3. **Generate Password**: Click "Generate New Password" or options auto-update
4. **Review Strength**: Check the strength meter and statistics
5. **Copy Password**: Click "Copy" to copy to clipboard
6. **Toggle Visibility**: Use "Show/Hide" to reveal or mask the password

## Password Strength Guidelines

### Very Weak (< 8 characters, single character type)
- Example: "password"
- Entropy: < 20 bits
- Easily cracked by brute force

### Weak (8-11 characters, limited variety)
- Example: "MyPass123"
- Entropy: 20-30 bits
- Vulnerable to dictionary attacks

### Fair (12-15 characters, good variety)
- Example: "SecurePass2024"
- Entropy: 30-50 bits
- Moderate protection

### Good (16-19 characters, full variety)
- Example: "Tr@vel2024!Secure"
- Entropy: 50-70 bits
- Strong protection

### Strong (20+ characters, full variety)
- Example: "B7$mP9&kL2@vR8!qW4#zX1"
- Entropy: 70+ bits
- Very strong protection

## Technical Implementation

### Web Crypto API
```javascript
// Generate cryptographically secure random bytes
const array = new Uint8Array(length);
crypto.getRandomValues(array);

// Map to character set
const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ...';
let password = '';
for (let i = 0; i < length; i++) {
  password += charset[array[i] % charset.length];
}
```

### Entropy Calculation
```javascript
// Calculate password entropy
const charsetSize = uppercase + lowercase + numbers + symbols;
const entropy = Math.log2(Math.pow(charsetSize, length));
```

### Strength Scoring
- Length bonuses (8, 12, 16+ characters)
- Character type bonuses (uppercase, lowercase, numbers, symbols)
- Complexity bonuses for long, varied passwords

## Browser Compatibility

- **Modern Browsers**: Full Web Crypto API support
- **Legacy Browsers**: Fallback to Math.random() (less secure)
- **Mobile Browsers**: Full support with touch-friendly controls

## Security Best Practices

### Password Creation
- Use at least 16 characters
- Include all character types
- Avoid common words or patterns
- Use unique passwords for each account

### Password Management
- Use a reputable password manager
- Enable two-factor authentication
- Change passwords regularly for critical accounts
- Never share passwords via email or chat

### Additional Security
- Use HTTPS everywhere
- Keep software updated
- Be wary of phishing attempts
- Use strong, unique master passwords

## API Reference

### Component Props
None - this is a standalone component.

### Internal Methods
- `generatePassword()`: Creates a new password
- `calculatePasswordStrength()`: Assesses password strength
- `copyToClipboard()`: Copies password to clipboard
- `getPasswordEntropy()`: Calculates password entropy

## Contributing

To improve the password generator:

1. Enhance the character sets
2. Add password validation rules
3. Implement additional strength checks
4. Add password generation presets
5. Improve accessibility features
6. Add export functionality

## License

This tool is part of the Perf-X-Ads suite. See main project license for details.