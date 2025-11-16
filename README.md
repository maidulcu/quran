# Al-Quran Mobile App

A beautiful, feature-rich mobile application for reading the Holy Quran, built with React Native and Expo. The app provides access to the complete Quran with translations in multiple languages, audio recitations, offline support, and a polished dark mode.

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

### User Interface & Design
- **Modern Material Design**: Polished, card-based UI with consistent design language
- **Full Dark Mode Support**: Complete dark theme implementation with automatic switching
- **Comprehensive Theme System**: Professional color schemes for both light and dark modes
- **Reusable Components**: Card, Button, SearchBar, EmptyState, and LoadingSpinner components
- **Pull-to-Refresh**: Refresh content by pulling down on the Home screen
- **Adjustable Font Size**: Customize Arabic text size (14-36px) for comfortable reading
- **Smooth Animations**: Polished transitions and interactions
- **Bottom Tab Navigation**: Easy navigation between Home, Surahs, Bookmarks, and Settings
- **Responsive Layouts**: Optimized for various screen sizes

### Advanced Features
- **Quick Access**: Direct access to popular Surahs (Al-Fatihah, Ya-Sin, Al-Kahf, Al-Mulk)
- **Multiple Arabic Editions**: Choose from Uthmani, Simple, or Simple Clean scripts
- **Ayah-by-Ayah Audio**: Play individual verses with visual feedback
- **Auto-Download**: Automatically cache Surahs as you read
- **Translation Viewer**: Read Arabic text alongside translations
- **Theme Persistence**: Your theme preference is saved and restored
- **Improved Loading States**: Beautiful loading indicators throughout the app
- **Enhanced Error Handling**: User-friendly error messages and recovery

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Storage**: AsyncStorage for offline data
- **Audio**: Expo AV for audio playback
- **API**: Al Quran Cloud API (https://alquran.cloud/api)
- **State Management**: React Context (Theme)
- **Design System**: Custom theme with colors, typography, and spacing constants

## Project Structure

```
quran/
├── src/
│   ├── api/              # API service layer
│   │   └── quranApi.ts   # Al Quran Cloud API integration
│   ├── components/       # Reusable UI components
│   │   ├── Card.tsx      # Pressable card component
│   │   ├── Button.tsx    # Custom button with variants
│   │   ├── SearchBar.tsx # Search input component
│   │   ├── LoadingSpinner.tsx  # Loading indicator
│   │   └── EmptyState.tsx      # Empty state placeholder
│   ├── constants/        # App constants
│   │   ├── editions.ts   # Available Arabic, Translation, and Audio editions
│   │   └── theme.ts      # Theme colors, spacing, typography
│   ├── contexts/         # React contexts
│   │   └── ThemeContext.tsx    # Theme management context
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
├── App.tsx               # App entry point with ThemeProvider
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
- Welcome message with greeting
- Quick stats (114 Surahs, 6,236 Ayahs, 30 Juz)
- Recent reading history with quick navigation
- Quick access to popular Surahs (Al-Fatihah, Ya-Sin, Al-Kahf, Al-Mulk)
- Search button for quick access
- Pull-to-refresh functionality

### Surah List Screen
- All 114 Surahs with detailed metadata
- Search by name, number, or translation
- Shows number of Ayahs and revelation type (Meccan/Medinan)
- Offline download indicators
- Arabic names alongside English names
- Filterable and searchable list

### Ayah Reader Screen
- Bismillah header (except for Surah 1 and 9)
- Arabic text with customizable font size (14-36px)
- Side-by-side translations
- Audio playback for each Ayah with play/pause controls
- Bookmark functionality for quick saving
- Ayah number badges for easy reference
- Smooth scrolling and navigation

### Bookmarks Screen
- List of all saved bookmarks
- Quick navigation to bookmarked verses
- Delete bookmarks with confirmation
- Shows Surah name, Ayah number, and preview text
- Sorted by creation date (newest first)
- Empty state when no bookmarks

### Search Screen
- Full-text search across the entire Quran
- Highlighted search results for easy identification
- Navigate directly to matching verses
- Result count display
- Search history (future enhancement)
- Filters by Surah (future enhancement)

### Settings Screen
- **Reading Settings**:
  - Choose Arabic edition (Uthmani, Simple, Simple Clean)
  - Select translation language from 20+ options
  - Adjust font size (14-36px)
- **Audio Settings**:
  - Select from multiple renowned reciters
- **Appearance**:
  - Toggle dark mode with moon/sun icon
  - Automatic theme switching
- **Offline Data**:
  - Download all 114 Surahs at once
  - Clear offline data
  - Auto-download toggle for automatic caching
  - View download progress
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

### Customizing Theme
Edit `src/constants/theme.ts` to modify:
- Colors for light and dark modes
- Spacing and padding values
- Typography (font sizes, weights, line heights)
- Border radius values
- Shadow styles

## Performance Optimizations

- Lazy loading of Surahs
- Efficient caching strategy with AsyncStorage
- Optimized re-renders with React hooks and Context
- Memoization of expensive calculations
- Minimal API calls with local storage fallback
- Image and audio asset optimization

## Recent Improvements (v1.0.0)

- ✅ **Full Dark Mode**: Complete dark theme with automatic switching
- ✅ **Professional Design System**: Comprehensive theming with colors, spacing, and typography
- ✅ **Reusable Components**: Card, Button, SearchBar, LoadingSpinner, EmptyState
- ✅ **Theme Context**: Centralized theme management with React Context
- ✅ **Pull-to-Refresh**: Refresh functionality on Home screen
- ✅ **Improved Layouts**: Better spacing, shadows, and visual hierarchy
- ✅ **Enhanced Settings**: Better organized settings with icons and improved UX
- ✅ **Font Size Range**: Increased range to 14-36px for better accessibility
- ✅ **Better Empty States**: Improved messaging when no data is available
- ✅ **Loading Indicators**: Consistent loading states across all screens

## Future Enhancements

- [ ] Prayer times integration with location services
- [ ] Qibla direction finder using compass
- [ ] Daily Quran reminders with customizable times
- [ ] Reading progress tracking and statistics
- [ ] Multiple translation viewing (side-by-side comparison)
- [ ] Tafsir (commentary) support
- [ ] Personal notes for verses
- [ ] Share verses as beautiful images
- [ ] Continuous audio playback (auto-play next ayah)
- [ ] Tajweed highlighting with color coding
- [ ] Custom Arabic fonts selection
- [ ] Verse-by-verse breakdown mode
- [ ] Reading goals and streaks
- [ ] Widget support for home screen
- [ ] Apple Watch / Wear OS companion app

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- **Al Quran Cloud API** for providing the comprehensive Quran data
- **Expo Team** for the amazing development framework
- All the translators and reciters whose work makes this app possible
- The Muslim community for continuous feedback and support

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**May Allah accept this work and make it beneficial for the Ummah. Ameen.**

**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**
