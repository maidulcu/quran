import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import quranApi from '../api/quranApi';
import storageService from '../services/storageService';
import audioService from '../services/audioService';
import { Surah, Ayah, AppSettings } from '../types';

type AyahReaderRouteProp = RouteProp<RootStackParamList, 'AyahReader'>;

export default function AyahReaderScreen() {
  const route = useRoute<AyahReaderRouteProp>();
  const { surahNumber, ayahNumber } = route.params;

  const [loading, setLoading] = useState(true);
  const [arabicSurah, setArabicSurah] = useState<Surah | null>(null);
  const [translationSurah, setTranslationSurah] = useState<Surah | null>(null);
  const [audioSurah, setAudioSurah] = useState<Surah | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [playingAyahNumber, setPlayingAyahNumber] = useState<number | null>(null);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadData();
    return () => {
      audioService.cleanup();
    };
  }, [surahNumber]);

  useEffect(() => {
    if (ayahNumber && arabicSurah) {
      // Scroll to specific ayah if needed
      storageService.addRecentRead(surahNumber, ayahNumber);
    }
  }, [ayahNumber, arabicSurah]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load settings
      const userSettings = await storageService.getSettings();
      setSettings(userSettings);

      // Initialize audio service
      await audioService.initialize();

      // Try to load from offline storage first
      let arabic = await storageService.getSurah(surahNumber, userSettings.arabicEdition);
      let translation = await storageService.getSurah(
        surahNumber,
        userSettings.translationEditions[0]
      );

      // If not available offline, fetch from API
      if (!arabic || !translation) {
        const editions = [
          userSettings.arabicEdition,
          ...userSettings.translationEditions,
          userSettings.reciterEdition,
        ];

        const surahs = await quranApi.getSurahMultipleEditions(surahNumber, editions);

        arabic = surahs.find(s => s.number === surahNumber) || surahs[0];
        translation = surahs[1] || surahs[0];
        const audio = surahs[2] || surahs[0];

        // Save to offline storage
        await storageService.saveSurah(surahNumber, arabic, userSettings.arabicEdition);
        await storageService.saveSurah(
          surahNumber,
          translation,
          userSettings.translationEditions[0]
        );
        setAudioSurah(audio);
      }

      setArabicSurah(arabic);
      setTranslationSurah(translation);

      // Load bookmarks for this surah
      await loadBookmarks();
    } catch (error) {
      console.error('Error loading surah:', error);
      Alert.alert('Error', 'Failed to load Surah. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarks = async () => {
    try {
      const allBookmarks = await storageService.getBookmarks();
      const surahBookmarks = allBookmarks
        .filter(b => b.surahNumber === surahNumber)
        .map(b => b.ayahNumber);
      setBookmarkedAyahs(new Set(surahBookmarks));
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const handlePlayAudio = async (ayah: Ayah) => {
    try {
      if (!ayah.audio && !audioSurah?.ayahs) {
        Alert.alert('No Audio', 'Audio is not available for this ayah.');
        return;
      }

      const audioUrl = ayah.audio || audioSurah?.ayahs?.find(a => a.number === ayah.number)?.audio;

      if (!audioUrl) {
        Alert.alert('No Audio', 'Audio URL not found.');
        return;
      }

      if (playingAyahNumber === ayah.numberInSurah) {
        await audioService.stop();
        setPlayingAyahNumber(null);
      } else {
        await audioService.playAyah(audioUrl);
        setPlayingAyahNumber(ayah.numberInSurah);

        // Auto-stop tracking after playback
        setTimeout(() => {
          if (!audioService.getIsPlaying()) {
            setPlayingAyahNumber(null);
          }
        }, 500);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'Failed to play audio.');
    }
  };

  const handleBookmark = async (ayah: Ayah) => {
    try {
      const isBookmarked = bookmarkedAyahs.has(ayah.numberInSurah);

      if (isBookmarked) {
        // Find and remove bookmark
        const allBookmarks = await storageService.getBookmarks();
        const bookmark = allBookmarks.find(
          b => b.surahNumber === surahNumber && b.ayahNumber === ayah.numberInSurah
        );
        if (bookmark) {
          await storageService.removeBookmark(bookmark.id);
          const newBookmarks = new Set(bookmarkedAyahs);
          newBookmarks.delete(ayah.numberInSurah);
          setBookmarkedAyahs(newBookmarks);
        }
      } else {
        // Add bookmark
        await storageService.addBookmark({
          surahNumber,
          ayahNumber: ayah.numberInSurah,
          surahName: arabicSurah?.englishName || '',
          ayahText: ayah.text.substring(0, 100),
        });
        const newBookmarks = new Set(bookmarkedAyahs);
        newBookmarks.add(ayah.numberInSurah);
        setBookmarkedAyahs(newBookmarks);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      Alert.alert('Error', 'Failed to update bookmark.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading Surah...</Text>
      </View>
    );
  }

  if (!arabicSurah || !arabicSurah.ayahs) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load Surah</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Bismillah */}
      {surahNumber !== 1 && surahNumber !== 9 && (
        <View style={styles.bismillahContainer}>
          <Text style={styles.bismillahText}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
        </View>
      )}

      {/* Ayahs */}
      {arabicSurah.ayahs.map((ayah, index) => {
        const translation = translationSurah?.ayahs?.[index];
        const isBookmarked = bookmarkedAyahs.has(ayah.numberInSurah);
        const isPlaying = playingAyahNumber === ayah.numberInSurah;

        return (
          <View key={ayah.number} style={styles.ayahContainer}>
            {/* Ayah Number Badge */}
            <View style={styles.ayahHeader}>
              <View style={styles.ayahNumberBadge}>
                <Text style={styles.ayahNumberText}>{ayah.numberInSurah}</Text>
              </View>

              <View style={styles.ayahActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handlePlayAudio(ayah)}
                >
                  <Ionicons
                    name={isPlaying ? 'pause-circle' : 'play-circle'}
                    size={28}
                    color={isPlaying ? '#2E7D32' : '#666'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleBookmark(ayah)}
                >
                  <Ionicons
                    name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={24}
                    color={isBookmarked ? '#FFA000' : '#666'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Arabic Text */}
            <Text style={[styles.arabicText, { fontSize: settings?.fontSize || 24 }]}>
              {ayah.text}
            </Text>

            {/* Translation */}
            {translation && (
              <Text style={styles.translationText}>{translation.text}</Text>
            )}

            {/* Divider */}
            {index < arabicSurah.ayahs.length - 1 && <View style={styles.divider} />}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  contentContainer: {
    padding: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
  },
  bismillahContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
  bismillahText: {
    fontSize: 24,
    color: '#2E7D32',
    textAlign: 'center',
  },
  ayahContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ayahHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  ayahNumberBadge: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ayahNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  ayahActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
  arabicText: {
    fontSize: 24,
    lineHeight: 40,
    textAlign: 'right',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  translationText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
    textAlign: 'left',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 15,
  },
});
