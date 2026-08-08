export const Colors = {
  primary: '#7b2ffc',
  primaryLight: '#a855f7',
  primaryDark: '#5b21b6',
  secondary: '#00d2ff',
  secondaryLight: '#67e8f9',
  secondaryDark: '#0284c7',
  accent: '#f43f5e',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  darkBg: '#0f0e17',
  darkCard: 'rgba(255,255,255,0.05)',
  lightBg: '#f8fafc',
  lightCard: '#ffffff',
  darkText: '#e2e8f0',
  lightText: '#1e293b',
  mutedText: '#94a3b8',
  glassDark: 'rgba(255,255,255,0.08)',
  glassLight: 'rgba(255,255,255,0.2)',
  glassBorder: 'rgba(255,255,255,0.15)',
} as const;

export type ColorType = keyof typeof Colors;
