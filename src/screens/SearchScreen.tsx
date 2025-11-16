import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import quranApi from '../api/quranApi';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SearchResult {
  number: number;
  text: string;
  numberInSurah: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
}

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Empty Search', 'Please enter a search term.');
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const response = await quranApi.search(searchQuery.trim());

      if (response.matches && Array.isArray(response.matches)) {
        setResults(response.matches);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Error searching:', error);
      Alert.alert('Error', 'Failed to search. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResultPress = (result: SearchResult) => {
    navigation.navigate('AyahReader', {
      surahNumber: result.surah.number,
      surahName: result.surah.englishName,
      ayahNumber: result.numberInSurah,
    });
  };

  const highlightText = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <Text style={styles.resultText}>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <Text key={index} style={styles.highlightedText}>
              {part}
            </Text>
          ) : (
            part
          )
        )}
      </Text>
    );
  };

  const renderResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => handleResultPress(item)}
    >
      <View style={styles.resultHeader}>
        <Text style={styles.resultSurah}>
          {item.surah.englishName} - Ayah {item.numberInSurah}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>
      {highlightText(item.text, searchQuery)}
    </TouchableOpacity>
  );

  const renderEmpty = () => {
    if (!searched) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={80} color="#CCC" />
          <Text style={styles.emptyTitle}>Search the Quran</Text>
          <Text style={styles.emptyText}>
            Enter keywords to search across all verses
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={80} color="#CCC" />
        <Text style={styles.emptyTitle}>No Results Found</Text>
        <Text style={styles.emptyText}>
          Try different keywords or check your spelling
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for verses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          placeholderTextColor="#999"
          autoFocus
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => { setSearchQuery(''); setResults([]); setSearched(false); }}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.searchButton, loading && styles.searchButtonDisabled]}
        onPress={handleSearch}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.searchButtonText}>Search</Text>
        )}
      </TouchableOpacity>

      {/* Results */}
      {results.length > 0 && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </Text>
        </View>
      )}

      <FlatList
        data={results}
        renderItem={renderResult}
        keyExtractor={(item, index) => `${item.number}-${index}`}
        contentContainerStyle={
          results.length === 0 ? styles.emptyListContainer : styles.listContainer
        }
        ListEmptyComponent={renderEmpty}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 15,
    marginBottom: 10,
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
  searchButton: {
    backgroundColor: '#2E7D32',
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  searchButtonDisabled: {
    opacity: 0.7,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsHeader: {
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
  emptyListContainer: {
    flexGrow: 1,
  },
  resultCard: {
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
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultSurah: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  resultText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
  },
  highlightedText: {
    backgroundColor: '#FFF59D',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#BBB',
    marginTop: 10,
    textAlign: 'center',
  },
});
