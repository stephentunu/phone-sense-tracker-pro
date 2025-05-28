
interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

// List of country codes with their respective countries and flags
export const countryCodes: CountryCode[] = [
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+1', country: 'United States/Canada', flag: '🇺🇸/🇨🇦' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+45', country: 'Denmark', flag: '🇩🇰' },
  { code: '+358', country: 'Finland', flag: '🇫🇮' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+30', country: 'Greece', flag: '🇬🇷' },
  { code: '+972', country: 'Israel', flag: '🇮🇱' },
  { code: '+90', country: 'Turkey', flag: '🇹🇷' },
  { code: '+380', country: 'Ukraine', flag: '🇺🇦' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭' },
];

/**
 * Normalizes Kenyan phone numbers to international format
 */
export const normalizeKenyanNumber = (phoneNumber: string): string => {
  // Remove all non-digit characters first
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // Handle different Kenyan number formats
  if (cleaned.startsWith('254')) {
    // Already in international format without +
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    // Local format (07xxxxxxxx or 01xxxxxxxx)
    return `+254${cleaned.substring(1)}`;
  } else if (cleaned.length === 9 && (cleaned.startsWith('7') || cleaned.startsWith('1'))) {
    // 9 digits starting with 7 or 1 (missing leading 0)
    return `+254${cleaned}`;
  }
  
  // If it doesn't match Kenyan patterns, return with + if it looks international
  if (cleaned.length > 10) {
    return `+${cleaned}`;
  }
  
  return phoneNumber; // Return original if we can't normalize
};

/**
 * Detects country based on phone number prefix
 * @param phoneNumber Phone number to analyze
 * @returns Country information or undefined if not detected
 */
export const detectCountry = (phoneNumber: string): CountryCode | undefined => {
  if (!phoneNumber) return undefined;
  
  // Normalize the phone number first
  const normalizedNumber = normalizeKenyanNumber(phoneNumber);
  
  // Clean the phone number - remove spaces, dashes, parentheses, etc.
  const cleanedNumber = normalizedNumber.replace(/[\s\-\(\)\.]/g, '');
  
  // Sort country codes by length (longest first) to match most specific code
  const sortedCodes = [...countryCodes].sort((a, b) => b.code.length - a.code.length);
  
  // Try to find a matching country code
  return sortedCodes.find(country => 
    cleanedNumber.startsWith(country.code)
  );
};

/**
 * Format phone number with country information
 */
export const formatPhoneWithCountry = (phoneNumber: string): string => {
  const normalizedNumber = normalizeKenyanNumber(phoneNumber);
  const country = detectCountry(normalizedNumber);
  if (!country) return phoneNumber;
  
  return `${normalizedNumber} ${country.flag} (${country.country})`;
};

/**
 * Format phone number in a standardized way
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Normalize first for Kenyan numbers
  const normalizedNumber = normalizeKenyanNumber(phoneNumber);
  
  // Clean the phone number
  const cleaned = normalizedNumber.replace(/\D/g, '');
  
  // Handle Kenyan numbers specifically
  if (cleaned.startsWith('254')) {
    return `+254 ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9, 12)}`;
  }
  
  // Check if it's likely a US/Canada number (length 10 or 11 with country code)
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 11)}`;
  }
  
  // For international numbers, try to format with the country code
  const country = detectCountry(normalizedNumber);
  if (country) {
    const codeLength = country.code.length - 1; // -1 for the + symbol
    const nationalNumber = cleaned.substring(codeLength);
    
    // Group the remaining digits in pairs
    let formatted = '';
    for (let i = 0; i < nationalNumber.length; i += 2) {
      formatted += nationalNumber.substring(i, Math.min(i + 2, nationalNumber.length));
      if (i + 2 < nationalNumber.length) formatted += ' ';
    }
    
    return `${country.code} ${formatted}`;
  }
  
  // Default formatting for unknown patterns
  return normalizedNumber;
};
