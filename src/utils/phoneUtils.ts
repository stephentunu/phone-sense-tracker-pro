
interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

// List of country codes with their respective countries and flags
export const countryCodes: CountryCode[] = [
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
];

/**
 * Detects country based on phone number prefix
 * @param phoneNumber Phone number to analyze
 * @returns Country information or undefined if not detected
 */
export const detectCountry = (phoneNumber: string): CountryCode | undefined => {
  if (!phoneNumber) return undefined;
  
  // Clean the phone number
  const cleanedNumber = phoneNumber.replace(/\s+/g, '');
  
  // Try to find a matching country code
  return countryCodes.find(country => 
    cleanedNumber.startsWith(country.code)
  );
};

/**
 * Format phone number with country information
 */
export const formatPhoneWithCountry = (phoneNumber: string): string => {
  const country = detectCountry(phoneNumber);
  if (!country) return phoneNumber;
  
  return `${phoneNumber} ${country.flag} (${country.country})`;
};
