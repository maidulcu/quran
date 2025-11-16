import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
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

export default function SettingsScreen() {
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
      ? Math.min(settings.fontSize + 2, 32)
      : Math.max(settings.fontSize - 2, 14);

    saveSettings({ ...settings, fontSize: newSize });
  };

  const handleThemeToggle = () => {
    saveSettings({
      ...settings,
      theme: settings.theme === 'light' ? 'dark' : 'light',
    });
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
      `Select ${type.charAt(0).toUpperCase() + type.slice(1)} Edition`,
      '',
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
          style: currentValue === edition.identifier ? 'default' : undefined,
        })),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  const getEditionName = (identifier: string) => {
    const allEditions = [...ARABIC_EDITIONS, ...TRANSLATION_EDITIONS, ...AUDIO_EDITIONS];
    const edition = allEditions.find(e => e.identifier === identifier);
    return edition?.name || identifier;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Reading Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reading Settings</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Arabic Edition</Text>
            <Text style={styles.settingValue}>
              {getEditionName(settings.arabicEdition)}
            </Text>
          </View>
          <TouchableOpacity onPress={() => showEditionPicker('arabic')}>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Translation</Text>
            <Text style={styles.settingValue}>
              {getEditionName(settings.translationEditions[0])}
            </Text>
          </View>
          <TouchableOpacity onPress={() => showEditionPicker('translation')}>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Font Size</Text>
            <Text style={styles.settingValue}>{settings.fontSize}px</Text>
          </View>
          <View style={styles.fontSizeButtons}>
            <TouchableOpacity
              style={styles.fontButton}
              onPress={() => handleFontSizeChange(false)}
            >
              <Ionicons name="remove" size={20} color="#2E7D32" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fontButton}
              onPress={() => handleFontSizeChange(true)}
            >
              <Ionicons name="add" size={20} color="#2E7D32" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Audio Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Audio Settings</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Reciter</Text>
            <Text style={styles.settingValue}>
              {getEditionName(settings.reciterEdition)}
            </Text>
          </View>
          <TouchableOpacity onPress={() => showEditionPicker('reciter')}>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              {settings.theme === 'dark' ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
          <Switch
            value={settings.theme === 'dark'}
            onValueChange={handleThemeToggle}
            trackColor={{ false: '#CCC', true: '#81C784' }}
            thumbColor={settings.theme === 'dark' ? '#2E7D32' : '#F5F5F5'}
          />
        </View>
      </View>

      {/* Offline Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offline Data</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Auto Download</Text>
            <Text style={styles.settingDescription}>
              Download surahs when viewing
            </Text>
          </View>
          <Switch
            value={settings.autoDownload}
            onValueChange={handleAutoDownloadToggle}
            trackColor={{ false: '#CCC', true: '#81C784' }}
            thumbColor={settings.autoDownload ? '#2E7D32' : '#F5F5F5'}
          />
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDownloadAllSurahs}
          disabled={downloading}
        >
          {downloading ? (
            <ActivityIndicator color="#2E7D32" />
          ) : (
            <>
              <Ionicons name="cloud-download" size={24} color="#2E7D32" />
              <Text style={styles.actionButtonText}>Download All Surahs</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={handleClearOfflineData}
        >
          <Ionicons name="trash-outline" size={24} color="#D32F2F" />
          <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
            Clear Offline Data
          </Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            This app uses the Al Quran Cloud API
          </Text>
          <Text style={styles.infoSubtext}>https://alquran.cloud/api</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Version 1.0.0</Text>
          <Text style={styles.infoSubtext}>Built with React Native & Expo</Text>
        </View>
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
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  settingDescription: {
    fontSize: 13,
    color: '#999',
    marginTop: 3,
  },
  fontSizeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  fontButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 10,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  dangerButtonText: {
    color: '#D32F2F',
  },
  infoCard: {
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
  infoText: {
    fontSize: 15,
    color: '#333',
  },
  infoSubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
  },
});
