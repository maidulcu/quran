import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import storageService from '../services/storageService';
import quranApi from '../api/quranApi';
import { RecentRead, Surah } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, BorderRadius, Typography, Shadows } from '../constants/theme';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const [recentReads, setRecentReads] = useState<RecentRead[]>([]);
  const [surahsList, setSurahsList] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadRecentReads();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);

      // Load recent reads
      await loadRecentReads();

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

  const loadRecentReads = async () => {
    const recents = await storageService.getRecentReads();
    setRecentReads(recents);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
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
    return <LoadingSpinner message="Loading..." />;
  }

  const styles = createStyles(colors);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Assalamu Alaikum</Text>
          <Text style={styles.headerSubtitle}>Continue your reading journey</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="book" size={40} color="rgba(255, 255, 255, 0.9)" />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <Pressable onPress={handleSearchPress} style={{ flex: 1 }}>
          <View pointerEvents="none">
            <SearchBar
              value=""
              onChangeText={() => {}}
              placeholder="Search Quran..."
              editable={false}
            />
          </View>
        </Pressable>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Card style={styles.statBox}>
          <Ionicons name="book" size={28} color={colors.primary} />
          <Text style={styles.statNumber}>114</Text>
          <Text style={styles.statLabel}>Surahs</Text>
        </Card>
        <Card style={styles.statBox}>
          <Ionicons name="document-text" size={28} color={colors.primary} />
          <Text style={styles.statNumber}>6,236</Text>
          <Text style={styles.statLabel}>Ayahs</Text>
        </Card>
        <Card style={styles.statBox}>
          <Ionicons name="layers" size={28} color={colors.primary} />
          <Text style={styles.statNumber}>30</Text>
          <Text style={styles.statLabel}>Juz</Text>
        </Card>
      </View>

      {/* Recent Reads */}
      {recentReads.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Reading</Text>
          {recentReads.slice(0, 5).map((recent, index) => (
            <Card
              key={index}
              onPress={() => handleRecentPress(recent)}
              style={styles.recentCard}
            >
              <View style={styles.recentIconContainer}>
                <Ionicons name="time" size={22} color={colors.primary} />
              </View>
              <View style={styles.recentInfo}>
                <Text style={styles.recentSurah}>{getSurahName(recent.surahNumber)}</Text>
                <Text style={styles.recentAyah}>Ayah {recent.ayahNumber}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
            </Card>
          ))}
        </View>
      )}

      {/* Quick Access */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>

        <Card
          onPress={() =>
            navigation.navigate('AyahReader', {
              surahNumber: 1,
              surahName: 'Al-Fatihah',
              ayahNumber: 1,
            })
          }
          style={styles.actionCard}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.secondary + '20' }]}>
            <Ionicons name="star" size={24} color={colors.secondary} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Surah Al-Fatihah</Text>
            <Text style={styles.actionSubtitle}>The Opening</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
        </Card>

        <Card
          onPress={() =>
            navigation.navigate('AyahReader', {
              surahNumber: 36,
              surahName: 'Ya-Sin',
              ayahNumber: 1,
            })
          }
          style={styles.actionCard}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.error + '20' }]}>
            <Ionicons name="heart" size={24} color={colors.error} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Surah Ya-Sin</Text>
            <Text style={styles.actionSubtitle}>Heart of the Quran</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
        </Card>

        <Card
          onPress={() =>
            navigation.navigate('AyahReader', {
              surahNumber: 18,
              surahName: 'Al-Kahf',
              ayahNumber: 1,
            })
          }
          style={styles.actionCard}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.info + '20' }]}>
            <Ionicons name="calendar" size={24} color={colors.info} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Surah Al-Kahf</Text>
            <Text style={styles.actionSubtitle}>Friday Special</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
        </Card>

        <Card
          onPress={() =>
            navigation.navigate('AyahReader', {
              surahNumber: 67,
              surahName: 'Al-Mulk',
              ayahNumber: 1,
            })
          }
          style={styles.actionCard}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="moon" size={24} color={colors.primary} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Surah Al-Mulk</Text>
            <Text style={styles.actionSubtitle}>Before Sleep</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
        </Card>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      paddingBottom: Spacing.xl,
    },
    header: {
      backgroundColor: colors.primary,
      padding: Spacing.lg,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.xl,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: Typography.sizes.xxxl,
      fontWeight: Typography.weights.bold,
      color: '#FFFFFF',
      marginBottom: Spacing.xs,
    },
    headerSubtitle: {
      fontSize: Typography.sizes.base,
      color: 'rgba(255, 255, 255, 0.9)',
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: BorderRadius.round,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchSection: {
      paddingHorizontal: Spacing.base,
      marginTop: -Spacing.lg,
      marginBottom: Spacing.lg,
      zIndex: 10,
    },
    statsContainer: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.base,
      marginBottom: Spacing.lg,
      gap: Spacing.sm,
    },
    statBox: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: Spacing.lg,
    },
    statNumber: {
      fontSize: Typography.sizes.xl,
      fontWeight: Typography.weights.bold,
      color: colors.text,
      marginTop: Spacing.sm,
    },
    statLabel: {
      fontSize: Typography.sizes.sm,
      color: colors.textSecondary,
      marginTop: Spacing.xs,
    },
    section: {
      paddingHorizontal: Spacing.base,
      marginBottom: Spacing.lg,
    },
    sectionTitle: {
      fontSize: Typography.sizes.lg,
      fontWeight: Typography.weights.bold,
      color: colors.text,
      marginBottom: Spacing.md,
    },
    recentCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    recentIconContainer: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.round,
      backgroundColor: colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    recentInfo: {
      flex: 1,
    },
    recentSurah: {
      fontSize: Typography.sizes.base,
      fontWeight: Typography.weights.semibold,
      color: colors.text,
    },
    recentAyah: {
      fontSize: Typography.sizes.sm,
      color: colors.textSecondary,
      marginTop: Spacing.xs,
    },
    actionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    actionIcon: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    actionInfo: {
      flex: 1,
    },
    actionTitle: {
      fontSize: Typography.sizes.base,
      fontWeight: Typography.weights.semibold,
      color: colors.text,
    },
    actionSubtitle: {
      fontSize: Typography.sizes.sm,
      color: colors.textSecondary,
      marginTop: Spacing.xs,
    },
  });
