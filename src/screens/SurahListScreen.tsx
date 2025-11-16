import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import quranApi from '../api/quranApi';
import storageService from '../services/storageService';
import { Surah } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SurahListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadedSurahs, setDownloadedSurahs] = useState<number[]>([]);

  useEffect(() => {
    loadSurahs();
    loadDownloadedSurahs();
  }, []);

  useEffect(() => {
    filterSurahs();
  }, [searchQuery, surahs]);

  const loadSurahs = async () => {
    try {
      setLoading(true);

      // Try to get from cache first
      let surahsList = await storageService.getSurahsList();

      if (!surahsList) {
        // Fetch from API
        surahsList = await quranApi.getSurahsList();
        // Cache it
        await storageService.saveSurahsList(surahsList);
      }

      setSurahs(surahsList);
      setFilteredSurahs(surahsList);
    } catch (error) {
      console.error('Error loading surahs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDownloadedSurahs = async () => {
    try {
      const downloaded = await storageService.getDownloadedSurahs();
      setDownloadedSurahs(downloaded);
    } catch (error) {
      console.error('Error loading downloaded surahs:', error);
    }
  };

  const filterSurahs = () => {
    if (!searchQuery.trim()) {
      setFilteredSurahs(surahs);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = surahs.filter(
      surah =>
        surah.englishName.toLowerCase().includes(query) ||
        surah.name.includes(query) ||
        surah.englishNameTranslation.toLowerCase().includes(query) ||
        surah.number.toString().includes(query)
    );

    setFilteredSurahs(filtered);
  };

  const handleSurahPress = (surah: Surah) => {
    navigation.navigate('AyahReader', {
      surahNumber: surah.number,
      surahName: surah.englishName,
      ayahNumber: 1,
    });
  };

  const renderSurah = ({ item }: { item: Surah }) => {
    const isDownloaded = downloadedSurahs.includes(item.number);

    return (
      <TouchableOpacity
        style={styles.surahCard}
        onPress={() => handleSurahPress(item)}
      >
        <View style={styles.surahNumber}>
          <Text style={styles.surahNumberText}>{item.number}</Text>
        </View>

        <View style={styles.surahInfo}>
          <Text style={styles.surahName}>{item.englishName}</Text>
          <Text style={styles.surahTranslation}>
            {item.englishNameTranslation} • {item.revelationType}
          </Text>
          <Text style={styles.surahAyahs}>{item.numberOfAyahs} Ayahs</Text>
        </View>

        <View style={styles.surahRight}>
          <Text style={styles.arabicName}>{item.name}</Text>
          {isDownloaded && (
            <Ionicons
              name="cloud-done"
              size={16}
              color="#2E7D32"
              style={styles.downloadIcon}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading Surahs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or number..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredSurahs.length} {filteredSurahs.length === 1 ? 'Surah' : 'Surahs'}
        </Text>
      </View>

      {/* Surahs List */}
      <FlatList
        data={filteredSurahs}
        renderItem={renderSurah}
        keyExtractor={item => item.number.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 15,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  resultsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  surahCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  surahNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  surahTranslation: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
  },
  surahAyahs: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  surahRight: {
    alignItems: 'flex-end',
  },
  arabicName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  downloadIcon: {
    marginTop: 5,
  },
});
