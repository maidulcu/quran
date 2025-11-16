import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, Typography } from '../constants/theme';
import Button from './Button';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export default function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={80} color={colors.border} />
      <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textTertiary }]}>{message}</Text>
      {action && (
        <Button onPress={action.onPress} style={styles.button}>
          {action.label}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxxl,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  message: {
    fontSize: Typography.sizes.base,
    marginTop: Spacing.sm,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
  },
  button: {
    marginTop: Spacing.xl,
  },
});
