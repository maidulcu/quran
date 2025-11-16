import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import storageService from '../services/storageService';
import { Bookmark } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function BookmarksScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [])
  );

  const loadBookmarks = async () => {
    try {
      const allBookmarks = await storageService.getBookmarks();
      // Sort by creation date, newest first
      const sorted = allBookmarks.sort((a, b) => b.createdAt - a.createdAt);
      setBookmarks(sorted);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const handleBookmarkPress = (bookmark: Bookmark) => {
    navigation.navigate('AyahReader', {
      surahNumber: bookmark.surahNumber,
      surahName: bookmark.surahName,
      ayahNumber: bookmark.ayahNumber,
    });
  };

  const handleDeleteBookmark = (bookmark: Bookmark) => {
    Alert.alert(
      'Remove Bookmark',
      'Are you sure you want to remove this bookmark?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.removeBookmark(bookmark.id);
              await loadBookmarks();
            } catch (error) {
              console.error('Error removing bookmark:', error);
              Alert.alert('Error', 'Failed to remove bookmark.');
            }
          },
        },
      ]
    );
  };

  const renderBookmark = ({ item }: { item: Bookmark }) => (
    <TouchableOpacity
      style={styles.bookmarkCard}
      onPress={() => handleBookmarkPress(item)}
    >
      <View style={styles.bookmarkIconContainer}>
        <Ionicons name="bookmark" size={24} color="#FFA000" />
      </View>

      <View style={styles.bookmarkInfo}>
        <Text style={styles.bookmarkSurah}>{item.surahName}</Text>
        <Text style={styles.bookmarkAyah}>Ayah {item.ayahNumber}</Text>
        <Text style={styles.bookmarkText} numberOfLines={2}>
          {item.ayahText}...
        </Text>
        <Text style={styles.bookmarkDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteBookmark(item)}
      >
        <Ionicons name="trash-outline" size={22} color="#D32F2F" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bookmark-outline" size={80} color="#CCC" />
      <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
      <Text style={styles.emptyText}>
        Bookmarks you save will appear here
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {bookmarks.length > 0 ? (
        <>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {bookmarks.length} {bookmarks.length === 1 ? 'Bookmark' : 'Bookmarks'}
            </Text>
          </View>
          <FlatList
            data={bookmarks}
            renderItem={renderBookmark}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        renderEmpty()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerText: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 15,
  },
  bookmarkCard: {
    flexDirection: 'row',
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
  bookmarkIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  bookmarkInfo: {
    flex: 1,
  },
  bookmarkSurah: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  bookmarkAyah: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  bookmarkText: {
    fontSize: 13,
    color: '#888',
    marginTop: 5,
    fontStyle: 'italic',
  },
  bookmarkDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  deleteButton: {
    padding: 5,
    justifyContent: 'center',
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
