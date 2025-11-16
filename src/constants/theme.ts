export const Colors = {
  light: {
    primary: '#2E7D32',
    primaryDark: '#1B5E20',
    primaryLight: '#4CAF50',
    secondary: '#FFA000',
    secondaryLight: '#FFB300',
    accent: '#1976D2',

    background: '#F8F9FA',
    surface: '#FFFFFF',
    card: '#FFFFFF',

    text: '#1A1A1A',
    textSecondary: '#424242',
    textTertiary: '#757575',
    textDisabled: '#9E9E9E',

    arabic: '#1A1A1A',
    translation: '#424242',

    border: '#E0E0E0',
    divider: '#EEEEEE',

    success: '#4CAF50',
    error: '#D32F2F',
    warning: '#F57C00',
    info: '#1976D2',

    bookmark: '#FFA000',
    audio: '#2E7D32',
    download: '#1976D2',

    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    primary: '#4CAF50',
    primaryDark: '#2E7D32',
    primaryLight: '#66BB6A',
    secondary: '#FFB300',
    secondaryLight: '#FFC107',
    accent: '#42A5F5',

    background: '#121212',
    surface: '#1E1E1E',
    card: '#2C2C2C',

    text: '#FFFFFF',
    textSecondary: '#E0E0E0',
    textTertiary: '#BDBDBD',
    textDisabled: '#757575',

    arabic: '#FFFFFF',
    translation: '#E0E0E0',

    border: '#3A3A3A',
    divider: '#2C2C2C',

    success: '#66BB6A',
    error: '#EF5350',
    warning: '#FF9800',
    info: '#42A5F5',

    bookmark: '#FFB300',
    audio: '#4CAF50',
    download: '#42A5F5',

    overlay: 'rgba(0, 0, 0, 0.7)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 15,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 15,
  xl: 20,
  round: 9999,
};

export const Typography = {
  sizes: {
    xs: 12,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    huge: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const Animations = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
};
