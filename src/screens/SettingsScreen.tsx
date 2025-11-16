import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import storageService from '../services/storageService';
import quranApi from '../api/quranApi';
import { AppSettings } from '../types';
import {
  ARABIC_EDITIONS,
  TRANSLATION_EDITIONS,
  AUDIO_EDITIONS,
  DEFAULT_SETTINGS,
} from '../constants/editions';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, BorderRadius, Typography } from '../constants/theme';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SettingsScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const userSettings = await storageService.getSettings();
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await storageService.saveSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings.');
    }
  };

  const handleFontSizeChange = (increase: boolean) => {
    const newSize = increase
      ? Math.min(settings.fontSize + 2, 36)
      : Math.max(settings.fontSize - 2, 14);

    saveSettings({ ...settings, fontSize: newSize });
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleAutoDownloadToggle = () => {
    saveSettings({
      ...settings,
      autoDownload: !settings.autoDownload,
    });
  };

  const handleDownloadAllSurahs = async () => {
    Alert.alert(
      'Download All Surahs',
      'This will download all 114 Surahs for offline access. This may take a while and use data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: async () => {
            try {
              setDownloading(true);

              // Fetch entire Quran
              const surahs = await quranApi.getQuran(settings.arabicEdition);

              // Save all surahs
              await storageService.saveAllSurahs(surahs, settings.arabicEdition);

              // Also download translation if available
              if (settings.translationEditions.length > 0) {
                const translationSurahs = await quranApi.getQuran(
                  settings.translationEditions[0]
                );
                await storageService.saveAllSurahs(
                  translationSurahs,
                  settings.translationEditions[0]
                );
              }

              Alert.alert('Success', 'All Surahs downloaded successfully!');
            } catch (error) {
              console.error('Error downloading surahs:', error);
              Alert.alert('Error', 'Failed to download surahs. Please try again.');
            } finally {
              setDownloading(false);
            }
          },
        },
      ]
    );
  };

  const handleClearOfflineData = () => {
    Alert.alert(
      'Clear Offline Data',
      'This will delete all downloaded Surahs. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.clearOfflineData();
              Alert.alert('Success', 'Offline data cleared successfully!');
            } catch (error) {
              console.error('Error clearing offline data:', error);
              Alert.alert('Error', 'Failed to clear offline data.');
            }
          },
        },
      ]
    );
  };

  const showEditionPicker = (type: 'arabic' | 'translation' | 'reciter') => {
    const editions =
      type === 'arabic'
        ? ARABIC_EDITIONS
        : type === 'translation'
        ? TRANSLATION_EDITIONS
        : AUDIO_EDITIONS;

    const currentValue =
      type === 'arabic'
        ? settings.arabicEdition
        : type === 'translation'
        ? settings.translationEditions[0]
        : settings.reciterEdition;

    Alert.alert(
      `Select ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      'Choose your preferred edition',
      [
        ...editions.map(edition => ({
          text: edition.name,
          onPress: () => {
            if (type === 'arabic') {
              saveSettings({ ...settings, arabicEdition: edition.identifier });
            } else if (type === 'translation') {
              saveSettings({
                ...settings,
                translationEditions: [edition.identifier],
              });
            } else {
              saveSettings({ ...settings, reciterEdition: edition.identifier });
            }
          },
          style: (currentValue === edition.identifier ? 'default' : undefined) as any,
        })),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading settings..." />;
  }

  const getEditionName = (identifier: string) => {
    const allEditions = [...ARABIC_EDITIONS, ...TRANSLATION_EDITIONS, ...AUDIO_EDITIONS];
    const edition = allEditions.find(e => e.identifier === identifier);
    return edition?.name || identifier;
  };

  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container}>
      {/* Reading Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reading Settings</Text>

        <Card style={styles.settingCard} onPress={() => showEditionPicker('arabic')}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Arabic Edition</Text>
            <Text style={styles.settingValue}>
              {getEditionName(settings.arabicEdition)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
        </Card>

        <Card style={styles.settingCard} onPress={() => showEditionPicker('translation')}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Translation</Text>
            <Text style={styles.settingValue}>
              {getEditionName(settings.translationEditions[0])}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
        </Card>

        <Card style={styles.settingCard}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Arabic Font Size</Text>
            <Text style={styles.settingValue}>{settings.fontSize}px</Text>
          </View>
          <View style={styles.fontSizeButtons}>
            <Card
              style={styles.fontButton}
              onPress={() => handleFontSizeChange(false)}
              elevated={false}
            >
              <Ionicons name="remove" size={18} color={colors.primary} />
            </Card>
            <Card
              style={styles.fontButton}
              onPress={() => handleFontSizeChange(true)}
              elevated={false}
            >
              <Ionicons name="add" size={18} color={colors.primary} />
            </Card>
          </View>
        </Card>
      </View>

      {/* Audio Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Audio Settings</Text>

        <Card style={styles.settingCard} onPress={() => showEditionPicker('reciter')}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Reciter</Text>
            <Text style={styles.settingValue}>
              {getEditionName(settings.reciterEdition)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
        </Card>
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>

        <Card style={styles.settingCard}>
          <View style={styles.settingInfo}>
            <View style={styles.settingRow}>
              <Ionicons
                name={theme === 'dark' ? 'moon' : 'sunny'}
                size={22}
                color={colors.primary}
                style={styles.settingIcon}
              />
              <View>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  {theme === 'dark' ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={handleThemeToggle}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={theme === 'dark' ? colors.primary : colors.surface}
          />
        </Card>
      </View>

      {/* Offline Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offline Data</Text>

        <Card style={styles.settingCard}>
          <View style={styles.settingInfo}>
            <View style={styles.settingRow}>
              <Ionicons
                name="cloud-download"
                size={22}
                color={colors.download}
                style={styles.settingIcon}
              />
              <View>
                <Text style={styles.settingLabel}>Auto Download</Text>
                <Text style={styles.settingDescription}>
                  Download surahs when viewing
                </Text>
              </View>
            </View>
          </View>
          <Switch
            value={settings.autoDownload}
            onValueChange={handleAutoDownloadToggle}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={settings.autoDownload ? colors.primary : colors.surface}
          />
        </Card>

        <Button
          onPress={handleDownloadAllSurahs}
          loading={downloading}
          icon={<Ionicons name="cloud-download" size={20} color="#FFF" />}
          style={styles.actionButton}
        >
          Download All Surahs
        </Button>

        <Button
          onPress={handleClearOfflineData}
          variant="danger"
          icon={<Ionicons name="trash-outline" size={20} color="#FFF" />}
          style={styles.actionButton}
        >
          Clear Offline Data
        </Button>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <Card style={styles.infoCard}>
          <Ionicons
            name="cloud"
            size={20}
            color={colors.info}
            style={styles.infoIcon}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>Al Quran Cloud API</Text>
            <Text style={styles.infoSubtext}>https://alquran.cloud/api</Text>
          </View>
        </Card>

        <Card style={styles.infoCard}>
          <Ionicons
            name="code-slash"
            size={20}
            color={colors.success}
            style={styles.infoIcon}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>Version 1.0.0</Text>
            <Text style={styles.infoSubtext}>Built with React Native & Expo</Text>
          </View>
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
    section: {
      marginTop: Spacing.lg,
      paddingHorizontal: Spacing.base,
    },
    sectionTitle: {
      fontSize: Typography.sizes.lg,
      fontWeight: Typography.weights.bold,
      color: colors.text,
      marginBottom: Spacing.md,
    },
    settingCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.sm,
    },
    settingInfo: {
      flex: 1,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingIcon: {
      marginRight: Spacing.md,
    },
    settingLabel: {
      fontSize: Typography.sizes.base,
      fontWeight: Typography.weights.semibold,
      color: colors.text,
    },
    settingValue: {
      fontSize: Typography.sizes.sm,
      color: colors.textSecondary,
      marginTop: Spacing.xs,
    },
    settingDescription: {
      fontSize: Typography.sizes.sm,
      color: colors.textTertiary,
      marginTop: Spacing.xs,
    },
    fontSizeButtons: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    fontButton: {
      width: 36,
      height: 36,
      borderRadius: BorderRadius.md,
      backgroundColor: colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionButton: {
      marginTop: Spacing.sm,
    },
    infoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    infoIcon: {
      marginRight: Spacing.md,
    },
    infoContent: {
      flex: 1,
    },
    infoText: {
      fontSize: Typography.sizes.base,
      fontWeight: Typography.weights.medium,
      color: colors.text,
    },
    infoSubtext: {
      fontSize: Typography.sizes.sm,
      color: colors.textSecondary,
      marginTop: Spacing.xs,
    },
  });
