# Al-Quran Mobile App

A beautiful, feature-rich mobile application for reading the Holy Quran, built with React Native and Expo. The app provides access to the complete Quran with translations in multiple languages, audio recitations, and offline support.

## Features

### Core Features
- **Complete Quran**: Access all 114 Surahs with 6,236 Ayahs
- **Multiple Translations**: Choose from 20+ translations in various languages (English, Urdu, Arabic, French, Spanish, German, Turkish, Indonesian, Malay, Bengali, Hindi, and more)
- **Audio Recitations**: Listen to beautiful recitations from renowned reciters including:
  - Mishary Rashid Alafasy
  - Abdul Basit
  - Mahmoud Khalil Al-Husary
  - Mohamed Siddiq Al-Minshawi
  - And more
- **Offline Support**: Download Surahs for offline reading and listening
- **Search Functionality**: Search across all verses in the Quran
- **Bookmarks**: Save your favorite verses for quick access
- **Recent Reads**: Track your reading history

### User Interface
- **Clean & Modern Design**: Beautiful, intuitive interface
- **Adjustable Font Size**: Customize Arabic text size for comfortable reading
- **Dark Mode**: Eye-friendly dark theme (coming soon)
- **Bottom Tab Navigation**: Easy navigation between Home, Surahs, Bookmarks, and Settings

### Advanced Features
- **Quick Access**: Direct access to popular Surahs (Al-Fatihah, Ya-Sin, Al-Kahf)
- **Multiple Arabic Editions**: Choose from Uthmani, Simple, or Simple Clean scripts
- **Ayah-by-Ayah Audio**: Play individual verses
- **Auto-Download**: Automatically cache Surahs as you read
- **Translation Viewer**: Read Arabic text alongside translations

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Storage**: AsyncStorage for offline data
- **Audio**: Expo AV for audio playback
- **API**: Al Quran Cloud API (https://alquran.cloud/api)

## Project Structure

```
quran/
├── src/
│   ├── api/              # API service layer
│   │   └── quranApi.ts   # Al Quran Cloud API integration
│   ├── components/       # Reusable UI components
│   ├── constants/        # App constants and editions
│   │   └── editions.ts   # Available Arabic, Translation, and Audio editions
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/          # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── SurahListScreen.tsx
│   │   ├── AyahReaderScreen.tsx
│   │   ├── BookmarksScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/         # Business logic services
│   │   ├── storageService.ts  # Offline storage management
│   │   └── audioService.ts    # Audio playback handling
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   └── utils/            # Utility functions
├── App.tsx               # App entry point
└── package.json          # Dependencies
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quran
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - **iOS**: Press `i` in the terminal or run `npm run ios`
   - **Android**: Press `a` in the terminal or run `npm run android`
   - **Web**: Press `w` in the terminal or run `npm run web`

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run in web browser

## API Reference

This app uses the [Al Quran Cloud API](https://alquran.cloud/api), which provides:

- **Editions**: Multiple Quran editions (Arabic, translations, tafsir, audio)
- **Surahs**: Complete chapters with metadata
- **Ayahs**: Individual verses with detailed information
- **Juz**: 30 parts of the Quran
- **Pages**: 604 pages of the Quran
- **Search**: Full-text search across all verses
- **Sajda**: Prostration verses
- **And more**

## Features by Screen

### Home Screen
- Welcome message
- Quick stats (114 Surahs, 6,236 Ayahs, 30 Juz)
- Recent reading history
- Quick access to popular Surahs
- Search button

### Surah List Screen
- All 114 Surahs with metadata
- Search by name, number, or translation
- Shows number of Ayahs and revelation type
- Offline download indicators
- Arabic names alongside English

### Ayah Reader Screen
- Bismillah header (except for Surah 1 and 9)
- Arabic text with customizable font size
- Side-by-side translations
- Audio playback for each Ayah
- Bookmark functionality
- Ayah number badges
- Play/Pause controls

### Bookmarks Screen
- List of saved bookmarks
- Quick navigation to bookmarked verses
- Delete bookmarks
- Shows Surah name, Ayah number, and preview text

### Search Screen
- Full-text search across the Quran
- Highlighted search results
- Navigate directly to matching verses
- Result count display

### Settings Screen
- **Reading Settings**:
  - Choose Arabic edition
  - Select translation language
  - Adjust font size
- **Audio Settings**:
  - Select reciter
- **Appearance**:
  - Toggle dark mode
- **Offline Data**:
  - Download all Surahs
  - Clear offline data
  - Auto-download toggle
- **About**: App version and API information

## Offline Support

The app intelligently caches data for offline use:

1. **Automatic Caching**: Surahs are cached when you read them
2. **Bulk Download**: Download all 114 Surahs at once from Settings
3. **Translation Caching**: Both Arabic text and translations are saved
4. **Metadata Caching**: Surah list is cached for faster loading
5. **Recent Reads & Bookmarks**: Always available offline

## Customization

### Adding New Translations
Edit `src/constants/editions.ts` and add new translation editions:

```typescript
{ identifier: 'language.translator', name: 'Language - Translator Name', language: 'lang' }
```

### Adding New Reciters
Edit `src/constants/editions.ts` and add new audio editions:

```typescript
{ identifier: 'ar.reciter', name: 'Reciter Name' }
```

## Performance Optimizations

- Lazy loading of Surahs
- Efficient caching strategy
- Optimized re-renders with React hooks
- Image and audio asset optimization
- Minimal API calls with local storage

## Future Enhancements

- [ ] Dark mode implementation
- [ ] Prayer times integration
- [ ] Qibla direction finder
- [ ] Daily Quran reminders
- [ ] Reading progress tracking
- [ ] Multiple translation viewing
- [ ] Tafsir (commentary) support
- [ ] Notes for verses
- [ ] Share verses as images
- [ ] Continuous audio playback
- [ ] Tajweed highlighting
- [ ] Arabic text customization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- **Al Quran Cloud API** for providing the comprehensive Quran data
- **Expo Team** for the amazing development framework
- All the translators and reciters whose work makes this app possible

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**May Allah accept this work and make it beneficial for the Ummah. Ameen.**
