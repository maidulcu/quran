import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens (will be created next)
import HomeScreen from '../screens/HomeScreen';
import SurahListScreen from '../screens/SurahListScreen';
import AyahReaderScreen from '../screens/AyahReaderScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SearchScreen from '../screens/SearchScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  AyahReader: {
    surahNumber: number;
    surahName: string;
    ayahNumber?: number;
  };
  Search: undefined;
};

export type TabParamList = {
  Home: undefined;
  Surahs: undefined;
  Bookmarks: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Surahs') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Bookmarks') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Al-Quran' }}
      />
      <Tab.Screen
        name="Surahs"
        component={SurahListScreen}
        options={{ title: 'Surahs' }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{ title: 'Bookmarks' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AyahReader"
          component={AyahReaderScreen}
          options={({ route }) => ({
            title: route.params.surahName,
            headerBackTitle: 'Back'
          })}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: 'Search Quran',
            presentation: 'modal'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
