// API Response Types
export interface Edition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: 'text' | 'audio';
  type: 'translation' | 'tafsir' | 'quran' | 'versebyverse';
  direction: 'rtl' | 'ltr';
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | {
    id: number;
    recommended: boolean;
    obligatory: boolean;
  };
  audio?: string;
  audioSecondary?: string[];
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  ayahs?: Ayah[];
}

export interface QuranResponse {
  code: number;
  status: string;
  data: Surah | Surah[] | Ayah | Ayah[];
}

export interface EditionsResponse {
  code: number;
  status: string;
  data: Edition[];
}

// App State Types
export interface Bookmark {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  ayahText: string;
  createdAt: number;
}

export interface RecentRead {
  surahNumber: number;
  ayahNumber: number;
  timestamp: number;
}

export interface AppSettings {
  arabicEdition: string;
  translationEditions: string[];
  reciterEdition: string;
  fontSize: number;
  theme: 'light' | 'dark';
  autoDownload: boolean;
}

export interface DownloadProgress {
  surahNumber: number;
  progress: number;
  completed: boolean;
}

// Storage Types
export interface OfflineData {
  surahs: Record<number, Surah>;
  translations: Record<string, Record<number, Surah>>;
  lastUpdated: number;
}
