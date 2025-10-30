export const COLORS = {
  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryLight: '#5AC8FA',

  secondary: '#FF9500',
  secondaryDark: '#FF6B00',
  secondaryLight: '#FFB340',

  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  lightGray: '#C7C7CC',
  extraLightGray: '#F2F2F7',

  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',

  background: '#F5F5F5',
  surface: '#FFFFFF',
  
  textPrimary: '#000000',
  textSecondary: '#8E8E93',
  textDisabled: '#C7C7CC',
  
  border: '#C6C6C8',
  divider: '#E5E5EA',
} as const;

export type ColorKey = keyof typeof COLORS;

