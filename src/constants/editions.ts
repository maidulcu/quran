export const ARABIC_EDITIONS = [
  { identifier: 'quran-uthmani', name: 'Uthmani (Original Arabic)' },
  { identifier: 'quran-simple', name: 'Simple (Simplified Arabic)' },
  { identifier: 'quran-simple-clean', name: 'Simple Clean' },
];

export const TRANSLATION_EDITIONS = [
  // English
  { identifier: 'en.asad', name: 'English - Muhammad Asad', language: 'en' },
  { identifier: 'en.sahih', name: 'English - Saheeh International', language: 'en' },
  { identifier: 'en.pickthall', name: 'English - Pickthall', language: 'en' },
  { identifier: 'en.yusufali', name: 'English - Yusuf Ali', language: 'en' },
  { identifier: 'en.hilali', name: 'English - Hilali & Khan', language: 'en' },

  // Urdu
  { identifier: 'ur.ahmedali', name: 'Urdu - Ahmed Ali', language: 'ur' },
  { identifier: 'ur.jalandhry', name: 'Urdu - Jalandhry', language: 'ur' },

  // Arabic
  { identifier: 'ar.muyassar', name: 'Arabic - Tafsir al-Muyassar', language: 'ar' },

  // French
  { identifier: 'fr.hamidullah', name: 'French - Hamidullah', language: 'fr' },

  // Spanish
  { identifier: 'es.cortes', name: 'Spanish - Cortes', language: 'es' },

  // German
  { identifier: 'de.bubenheim', name: 'German - Bubenheim & Elyas', language: 'de' },

  // Turkish
  { identifier: 'tr.diyanet', name: 'Turkish - Diyanet', language: 'tr' },

  // Indonesian
  { identifier: 'id.indonesian', name: 'Indonesian - Ministry of Religious Affairs', language: 'id' },

  // Malay
  { identifier: 'ms.basmeih', name: 'Malay - Basmeih', language: 'ms' },

  // Bengali
  { identifier: 'bn.bengali', name: 'Bengali - Muhiuddin Khan', language: 'bn' },

  // Hindi
  { identifier: 'hi.hindi', name: 'Hindi - Suhel Farooq Khan', language: 'hi' },
];

export const AUDIO_EDITIONS = [
  { identifier: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  { identifier: 'ar.abdulbasitmurattal', name: 'Abdul Basit (Murattal)' },
  { identifier: 'ar.abdulsamad', name: 'Abdul Samad' },
  { identifier: 'ar.husary', name: 'Mahmoud Khalil Al-Husary' },
  { identifier: 'ar.minshawi', name: 'Mohamed Siddiq Al-Minshawi' },
  { identifier: 'ar.shaatree', name: 'Abu Bakr Al-Shatri' },
  { identifier: 'ar.sudais', name: 'Abdurrahmaan As-Sudais' },
];

export const DEFAULT_SETTINGS = {
  arabicEdition: 'quran-uthmani',
  translationEditions: ['en.sahih'],
  reciterEdition: 'ar.alafasy',
  fontSize: 18,
  theme: 'light' as const,
  autoDownload: false,
};
