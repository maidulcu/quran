import axios from 'axios';
import { QuranResponse, EditionsResponse, Surah, Ayah, Edition } from '../types';

const BASE_URL = 'http://api.alquran.cloud/v1';

class QuranApi {
  // Get all editions (translations, tafsirs, audio)
  async getEditions(format?: 'text' | 'audio', language?: string): Promise<Edition[]> {
    try {
      const params: any = {};
      if (format) params.format = format;
      if (language) params.language = language;

      const response = await axios.get<EditionsResponse>(`${BASE_URL}/edition`, { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching editions:', error);
      throw error;
    }
  }

  // Get complete Quran by edition
  async getQuran(edition: string = 'quran-simple'): Promise<Surah[]> {
    try {
      const response = await axios.get<QuranResponse>(`${BASE_URL}/quran/${edition}`);
      return response.data.data as Surah[];
    } catch (error) {
      console.error('Error fetching Quran:', error);
      throw error;
    }
  }

  // Get specific Surah by number
  async getSurah(surahNumber: number, edition: string = 'quran-simple'): Promise<Surah> {
    try {
      const response = await axios.get<QuranResponse>(`${BASE_URL}/surah/${surahNumber}/${edition}`);
      return response.data.data as Surah;
    } catch (error) {
      console.error(`Error fetching Surah ${surahNumber}:`, error);
      throw error;
    }
  }

  // Get multiple editions of a Surah
  async getSurahMultipleEditions(surahNumber: number, editions: string[]): Promise<Surah[]> {
    try {
      const editionsString = editions.join(',');
      const response = await axios.get<QuranResponse>(`${BASE_URL}/surah/${surahNumber}/editions/${editionsString}`);
      return response.data.data as Surah[];
    } catch (error) {
      console.error(`Error fetching Surah ${surahNumber} with multiple editions:`, error);
      throw error;
    }
  }

  // Get specific Ayah by number
  async getAyah(ayahNumber: number, edition: string = 'quran-simple'): Promise<Ayah> {
    try {
      const response = await axios.get<QuranResponse>(`${BASE_URL}/ayah/${ayahNumber}/${edition}`);
      return response.data.data as Ayah;
    } catch (error) {
      console.error(`Error fetching Ayah ${ayahNumber}:`, error);
      throw error;
    }
  }

  // Get Ayah by Surah:Ayah reference
  async getAyahBySurahAyah(surahNumber: number, ayahNumber: number, edition: string = 'quran-simple'): Promise<Ayah> {
    try {
      const response = await axios.get<QuranResponse>(`${BASE_URL}/ayah/${surahNumber}:${ayahNumber}/${edition}`);
      return response.data.data as Ayah;
    } catch (error) {
      console.error(`Error fetching Ayah ${surahNumber}:${ayahNumber}:`, error);
      throw error;
    }
  }

  // Get Juz by number
  async getJuz(juzNumber: number, edition: string = 'quran-simple'): Promise<{ ayahs: Ayah[] }> {
    try {
      const response = await axios.get<QuranResponse>(`${BASE_URL}/juz/${juzNumber}/${edition}`);
      return response.data.data as { ayahs: Ayah[] };
    } catch (error) {
      console.error(`Error fetching Juz ${juzNumber}:`, error);
      throw error;
    }
  }

  // Get page by number
  async getPage(pageNumber: number, edition: string = 'quran-simple'): Promise<{ ayahs: Ayah[] }> {
    try {
      const response = await axios.get<QuranResponse>(`${BASE_URL}/page/${pageNumber}/${edition}`);
      return response.data.data as { ayahs: Ayah[] };
    } catch (error) {
      console.error(`Error fetching Page ${pageNumber}:`, error);
      throw error;
    }
  }

  // Search in Quran
  async search(keyword: string, surahNumber?: number, edition: string = 'quran-simple'): Promise<any> {
    try {
      const url = surahNumber
        ? `${BASE_URL}/search/${keyword}/${surahNumber}/${edition}`
        : `${BASE_URL}/search/${keyword}/all/${edition}`;

      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      console.error(`Error searching for "${keyword}":`, error);
      throw error;
    }
  }

  // Get Sajda (prostration) ayahs
  async getSajdaAyahs(edition: string = 'quran-simple'): Promise<{ ayahs: Ayah[] }> {
    try {
      const response = await axios.get<QuranResponse>(`${BASE_URL}/sajda/${edition}`);
      return response.data.data as { ayahs: Ayah[] };
    } catch (error) {
      console.error('Error fetching Sajda ayahs:', error);
      throw error;
    }
  }

  // Get list of all Surahs metadata (without ayahs)
  async getSurahsList(): Promise<Surah[]> {
    try {
      const response = await axios.get<QuranResponse>(`${BASE_URL}/surah`);
      return response.data.data as Surah[];
    } catch (error) {
      console.error('Error fetching Surahs list:', error);
      throw error;
    }
  }
}

export default new QuranApi();
