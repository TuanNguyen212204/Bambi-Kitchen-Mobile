import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SIZES = {
  width,
  height,

  fontXS: 10,
  fontSM: 12,
  fontMD: 14,
  fontLG: 16,
  fontXL: 18,
  font2XL: 20,
  font3XL: 24,
  font4XL: 32,

  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,

  radiusXS: 4,
  radiusSM: 8,
  radiusMD: 12,
  radiusLG: 16,
  radiusXL: 20,
  radiusFull: 9999,

  iconXS: 16,
  iconSM: 20,
  iconMD: 24,
  iconLG: 32,
  iconXL: 40,
} as const;

export type SizeKey = keyof typeof SIZES;

