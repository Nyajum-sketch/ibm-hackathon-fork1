// MyMemory translation API integration

// Translation Cache to prevent redundant API calls
const translationCache = new Map();

// Supported languages list with flag emojis
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English (Default)', flag: 'EN' },
  { code: 'es', name: 'Spanish', flag: 'ES' },
  { code: 'ta', name: 'Tamil', flag: 'TA' },
  { code: 'hi', name: 'Hindi', flag: 'HI' },
  { code: 'fr', name: 'French', flag: 'FR' },
  { code: 'de', name: 'German', flag: 'DE' },
  { code: 'ja', name: 'Japanese', flag: 'JA' },
  { code: 'ko', name: 'Korean', flag: 'KO' },
  { code: 'zh', name: 'Chinese (Simplified)', flag: 'ZH' },
  { code: 'ar', name: 'Arabic', flag: 'AR' },
  { code: 'pt', name: 'Portuguese', flag: 'PT' },
  { code: 'it', name: 'Italian', flag: 'IT' },
  { code: 'ru', name: 'Russian', flag: 'RU' },
  { code: 'bn', name: 'Bengali', flag: 'BN' },
  { code: 'te', name: 'Telugu', flag: 'TE' },
  { code: 'mr', name: 'Marathi', flag: 'MR' },
  { code: 'ur', name: 'Urdu', flag: 'UR' },
  { code: 'vi', name: 'Vietnamese', flag: 'VI' },
  { code: 'th', name: 'Thai', flag: 'TH' },
  { code: 'nl', name: 'Dutch', flag: 'NL' },
  { code: 'sv', name: 'Swedish', flag: 'SV' },
  { code: 'no', name: 'Norwegian', flag: 'NO' },
  { code: 'da', name: 'Danish', flag: 'DA' },
  { code: 'fi', name: 'Finnish', flag: 'FI' },
  { code: 'pl', name: 'Polish', flag: 'PL' },
  { code: 'cs', name: 'Czech', flag: 'CS' },
  { code: 'sk', name: 'Slovak', flag: 'SK' },
  { code: 'hu', name: 'Hungarian', flag: 'HU' },
  { code: 'ro', name: 'Romanian', flag: 'RO' },
  { code: 'bg', name: 'Bulgarian', flag: 'BG' },
  { code: 'hr', name: 'Croatian', flag: 'HR' },
  { code: 'sr', name: 'Serbian', flag: 'SR' },
  { code: 'sl', name: 'Slovenian', flag: 'SL' },
  { code: 'et', name: 'Estonian', flag: 'ET' },
  { code: 'lv', name: 'Latvian', flag: 'LV' },
  { code: 'lt', name: 'Lithuanian', flag: 'LT' },
  { code: 'uk', name: 'Ukrainian', flag: 'UK' },
  { code: 'el', name: 'Greek', flag: 'EL' },
  { code: 'tr', name: 'Turkish', flag: 'TR' },
  { code: 'he', name: 'Hebrew', flag: 'HE' },
  { code: 'fa', name: 'Persian', flag: 'FA' },
  { code: 'ms', name: 'Malay', flag: 'MS' },
  { code: 'id', name: 'Indonesian', flag: 'ID' },
  { code: 'tl', name: 'Filipino', flag: 'TL' },
  { code: 'sw', name: 'Swahili', flag: 'SW' },
  { code: 'zu', name: 'Zulu', flag: 'ZU' },
  { code: 'af', name: 'Afrikaans', flag: 'AF' },
  { code: 'ca', name: 'Catalan', flag: 'CA' },
  { code: 'gl', name: 'Galician', flag: 'GL' },
  { code: 'eu', name: 'Basque', flag: 'EU' }
];

/**
 * Translates English text to a target language code using MyMemory free API.
 * Uses a caching layer to avoid duplicate requests.
 * @param {string} text - Text to translate.
 * @param {string} targetLang - Two-letter ISO language code (e.g. 'es', 'fr').
 * @returns {Promise<string>} - The translated string.
 */
export async function translateText(text, targetLang) {
  if (!text || !text.trim()) return '';
  if (targetLang === 'en') return text; // Already English

  const cacheKey = `${targetLang}:${text.trim()}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const cleanText = encodeURIComponent(text.trim());
    const url = `https://api.mymemory.translated.net/get?q=${cleanText}&langpair=en|${targetLang}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`MyMemory API response was not OK: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.responseData && data.responseData.translatedText) {
      const result = data.responseData.translatedText;
      translationCache.set(cacheKey, result);
      return result;
    } else {
      console.warn('MyMemory Response format invalid or empty:', data);
      return text; // Fallback to source
    }
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to source on error
  }
}
