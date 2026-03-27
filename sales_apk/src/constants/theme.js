// ============================
// Theme Constants - ServicePro App
// ============================

export const COLORS = {
  // Primary Palette
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  primaryDark: '#3730A3',
  primaryGradientStart: '#6366F1',
  primaryGradientEnd: '#4F46E5',

  // Secondary 
  secondary: '#0EA5E9',
  secondaryLight: '#38BDF8',
  secondaryDark: '#0284C7',

  // Accent
  accent: '#F59E0B',
  accentLight: '#FBBF24',
  accentDark: '#D97706',

  // Success / Error / Warning
  success: '#10B981',
  successLight: '#34D399',
  successBg: '#ECFDF5',
  error: '#EF4444',
  errorLight: '#F87171',
  errorBg: '#FEF2F2',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningBg: '#FFFBEB',
  info: '#3B82F6',
  infoLight: '#60A5FA',
  infoBg: '#EFF6FF',

  // Neutrals
  white: '#FFFFFF',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#E2E8F0',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',
  textLink: '#4F46E5',

  // Shadows
  shadow: 'rgba(15, 23, 42, 0.08)',
  shadowDark: 'rgba(15, 23, 42, 0.16)',

  // Overlay
  overlay: 'rgba(15, 23, 42, 0.5)',

  // Status colors
  statusNew: '#3B82F6',
  statusPending: '#F59E0B',
  statusActive: '#10B981',
  statusCompleted: '#6366F1',
  statusCancelled: '#EF4444',

  // Professional app specific
  proAccent: '#8B5CF6',
  proAccentLight: '#A78BFA',
  proBg: '#FAF5FF',

  // Gradients
  gradientPrimary: ['#6366F1', '#4F46E5', '#3730A3'],
  gradientSecondary: ['#0EA5E9', '#0284C7'],
  gradientAccent: ['#F59E0B', '#D97706'],
  gradientSuccess: ['#10B981', '#059669'],
  gradientPro: ['#8B5CF6', '#6D28D9'],
  gradientDark: ['#1E293B', '#0F172A'],
};

export const FONTS = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

export const SIZES = {
  // Font sizes
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  title: 32,
  hero: 40,

  // Spacing
  spacing2: 2,
  spacing4: 4,
  spacing6: 6,
  spacing8: 8,
  spacing10: 10,
  spacing12: 12,
  spacing16: 16,
  spacing20: 20,
  spacing24: 24,
  spacing28: 28,
  spacing32: 32,
  spacing40: 40,
  spacing48: 48,
  spacing56: 56,
  spacing64: 64,

  // Border radius
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 20,
  radiusXxl: 24,
  radiusFull: 999,

  // Screen padding
  screenPadding: 20,

  // Card
  cardPadding: 16,
  cardRadius: 16,

  // Input
  inputHeight: 52,
  inputRadius: 12,

  // Button
  buttonHeight: 52,
  buttonRadius: 12,

  // Bottom tab
  tabBarHeight: 70,

  // Header
  headerHeight: 56,

  // Icon
  iconSm: 18,
  iconMd: 22,
  iconLg: 26,
  iconXl: 32,
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
};
