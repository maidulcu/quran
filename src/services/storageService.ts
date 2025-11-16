import AsyncStorage from '@react-native-async-storage/async-storage';
import { Surah, Bookmark, AppSettings, RecentRead, OfflineData } from '../types';

const KEYS = {
  OFFLINE_DATA: 'quran_offline_data',
  BOOKMARKS: 'quran_bookmarks',
  RECENT_READS: 'quran_recent_reads',
  SETTINGS: 'quran_settings',
  DOWNLOADED_SURAHS: 'quran_downloaded_surahs',
};

class StorageService {
  // Settings Management
  async getSettings(): Promise<AppSettings> {
    try {
      const settings = await AsyncStorage.getItem(KEYS.SETTINGS);
      if (settings) {
        return JSON.parse(settings);
      }
      // Default settings
      return {
        arabicEdition: 'quran-uthmani',
        translationEditions: ['en.asad'],
        reciterEdition: 'ar.alafasy',
        fontSize: 18,
        theme: 'light',
        autoDownload: false,
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      throw error;
    }
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  // Bookmarks Management
  async getBookmarks(): Promise<Bookmark[]> {
    try {
      const bookmarks = await AsyncStorage.getItem(KEYS.BOOKMARKS);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  }

  async addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks();
      const newBookmark: Bookmark = {
        ...bookmark,
        id: `${bookmark.surahNumber}-${bookmark.ayahNumber}-${Date.now()}`,
        createdAt: Date.now(),
      };
      bookmarks.push(newBookmark);
      await AsyncStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  }

  async removeBookmark(id: string): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks();
      const filtered = bookmarks.filter(b => b.id !== id);
      await AsyncStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  }

  async isBookmarked(surahNumber: number, ayahNumber: number): Promise<boolean> {
    try {
      const bookmarks = await this.getBookmarks();
      return bookmarks.some(
        b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
      );
    } catch (error) {
      console.error('Error checking bookmark:', error);
      return false;
    }
  }

  // Recent Reads Management
  async getRecentReads(): Promise<RecentRead[]> {
    try {
      const recents = await AsyncStorage.getItem(KEYS.RECENT_READS);
      return recents ? JSON.parse(recents) : [];
    } catch (error) {
      console.error('Error getting recent reads:', error);
      return [];
    }
  }

  async addRecentRead(surahNumber: number, ayahNumber: number): Promise<void> {
    try {
      let recents = await this.getRecentReads();

      // Remove if already exists
      recents = recents.filter(
        r => !(r.surahNumber === surahNumber && r.ayahNumber === ayahNumber)
      );

      // Add to beginning
      recents.unshift({
        surahNumber,
        ayahNumber,
        timestamp: Date.now(),
      });

      // Keep only last 20
      if (recents.length > 20) {
        recents = recents.slice(0, 20);
      }

      await AsyncStorage.setItem(KEYS.RECENT_READS, JSON.stringify(recents));
    } catch (error) {
      console.error('Error adding recent read:', error);
      throw error;
    }
  }

  // Offline Data Management
  async saveSurah(surahNumber: number, surah: Surah, edition: string = 'default'): Promise<void> {
    try {
      const key = `surah_${surahNumber}_${edition}`;
      await AsyncStorage.setItem(key, JSON.stringify(surah));

      // Track downloaded surahs
      const downloaded = await this.getDownloadedSurahs();
      if (!downloaded.includes(surahNumber)) {
        downloaded.push(surahNumber);
        await AsyncStorage.setItem(KEYS.DOWNLOADED_SURAHS, JSON.stringify(downloaded));
      }
    } catch (error) {
      console.error(`Error saving Surah ${surahNumber}:`, error);
      throw error;
    }
  }

  async getSurah(surahNumber: number, edition: string = 'default'): Promise<Surah | null> {
    try {
      const key = `surah_${surahNumber}_${edition}`;
      const surah = await AsyncStorage.getItem(key);
      return surah ? JSON.parse(surah) : null;
    } catch (error) {
      console.error(`Error getting Surah ${surahNumber}:`, error);
      return null;
    }
  }

  async getDownloadedSurahs(): Promise<number[]> {
    try {
      const downloaded = await AsyncStorage.getItem(KEYS.DOWNLOADED_SURAHS);
      return downloaded ? JSON.parse(downloaded) : [];
    } catch (error) {
      console.error('Error getting downloaded surahs:', error);
      return [];
    }
  }

  async saveAllSurahs(surahs: Surah[], edition: string = 'default'): Promise<void> {
    try {
      const promises = surahs.map(surah =>
        this.saveSurah(surah.number, surah, edition)
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Error saving all surahs:', error);
      throw error;
    }
  }

  async clearOfflineData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const surahKeys = keys.filter(key => key.startsWith('surah_'));
      await AsyncStorage.multiRemove(surahKeys);
      await AsyncStorage.removeItem(KEYS.DOWNLOADED_SURAHS);
    } catch (error) {
      console.error('Error clearing offline data:', error);
      throw error;
    }
  }

  // Metadata cache
  async saveSurahsList(surahs: Surah[]): Promise<void> {
    try {
      await AsyncStorage.setItem('surahs_list', JSON.stringify(surahs));
    } catch (error) {
      console.error('Error saving surahs list:', error);
      throw error;
    }
  }

  async getSurahsList(): Promise<Surah[] | null> {
    try {
      const surahs = await AsyncStorage.getItem('surahs_list');
      return surahs ? JSON.parse(surahs) : null;
    } catch (error) {
      console.error('Error getting surahs list:', error);
      return null;
    }
  }
}

export default new StorageService();
