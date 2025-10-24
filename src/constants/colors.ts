export const COLORS = {
  // Primary colors
  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryLight: '#5AC8FA',

  // Secondary colors
  secondary: '#FF9500',
  secondaryDark: '#FF6B00',
  secondaryLight: '#FFB340',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  lightGray: '#C7C7CC',
  extraLightGray: '#F2F2F7',

  // Status colors
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',

  // Background colors
  background: '#F5F5F5',
  surface: '#FFFFFF',
  
  // Text colors
  textPrimary: '#000000',
  textSecondary: '#8E8E93',
  textDisabled: '#C7C7CC',
  
  // Border colors
  border: '#C6C6C8',
  divider: '#E5E5EA',
} as const;

export type ColorKey = keyof typeof COLORS;

