import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import storageService from '../services/storageService';
import quranApi from '../api/quranApi';
import { RecentRead, Surah } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [recentReads, setRecentReads] = useState<RecentRead[]>([]);
  const [surahsList, setSurahsList] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load recent reads
      const recents = await storageService.getRecentReads();
      setRecentReads(recents);

      // Load or fetch surahs list for metadata
      let surahs = await storageService.getSurahsList();
      if (!surahs) {
        surahs = await quranApi.getSurahsList();
        await storageService.saveSurahsList(surahs);
      }
      setSurahsList(surahs);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSurahName = (surahNumber: number): string => {
    const surah = surahsList.find(s => s.number === surahNumber);
    return surah ? surah.englishName : `Surah ${surahNumber}`;
  };

  const handleRecentPress = (recent: RecentRead) => {
    navigation.navigate('AyahReader', {
      surahNumber: recent.surahNumber,
      surahName: getSurahName(recent.surahNumber),
      ayahNumber: recent.ayahNumber,
    });
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assalamu Alaikum</Text>
        <Text style={styles.headerSubtitle}>Continue your reading journey</Text>
      </View>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
        <Ionicons name="search" size={20} color="#666" />
        <Text style={styles.searchButtonText}>Search Quran...</Text>
      </TouchableOpacity>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Ionicons name="book" size={30} color="#2E7D32" />
          <Text style={styles.statNumber}>114</Text>
          <Text style={styles.statLabel}>Surahs</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="document-text" size={30} color="#2E7D32" />
          <Text style={styles.statNumber}>6,236</Text>
          <Text style={styles.statLabel}>Ayahs</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="layers" size={30} color="#2E7D32" />
          <Text style={styles.statNumber}>30</Text>
          <Text style={styles.statLabel}>Juz</Text>
        </View>
      </View>

      {/* Recent Reads */}
      {recentReads.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reads</Text>
          {recentReads.slice(0, 5).map((recent, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentCard}
              onPress={() => handleRecentPress(recent)}
            >
              <View style={styles.recentIconContainer}>
                <Ionicons name="time-outline" size={24} color="#2E7D32" />
              </View>
              <View style={styles.recentInfo}>
                <Text style={styles.recentSurah}>{getSurahName(recent.surahNumber)}</Text>
                <Text style={styles.recentAyah}>Ayah {recent.ayahNumber}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('AyahReader', {
            surahNumber: 1,
            surahName: 'Al-Fatihah',
            ayahNumber: 1,
          })}
        >
          <View style={styles.actionIconContainer}>
            <Ionicons name="star" size={24} color="#FFA000" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Surah Al-Fatihah</Text>
            <Text style={styles.actionSubtitle}>The Opening</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('AyahReader', {
            surahNumber: 36,
            surahName: 'Ya-Sin',
            ayahNumber: 1,
          })}
        >
          <View style={styles.actionIconContainer}>
            <Ionicons name="heart" size={24} color="#D32F2F" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Surah Ya-Sin</Text>
            <Text style={styles.actionSubtitle}>The Heart of Quran</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('AyahReader', {
            surahNumber: 18,
            surahName: 'Al-Kahf',
            ayahNumber: 1,
          })}
        >
          <View style={styles.actionIconContainer}>
            <Ionicons name="calendar" size={24} color="#1976D2" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Surah Al-Kahf</Text>
            <Text style={styles.actionSubtitle}>Friday Special</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 15,
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  recentCard: {
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
  recentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  recentInfo: {
    flex: 1,
  },
  recentSurah: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recentAyah: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  actionCard: {
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
  actionIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
