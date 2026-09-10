/**
 * Schedule Grid Constants & Theme Color Palettes
 * Aligned with Coinbase Design System
 */

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DAYS_TH = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];

// Day accent indicators (clean, subdued tones)
export const DAYS_COLORS = [
  '#FFB300', // Mon (Yellow / Amber)
  '#E91E63', // Tue (Pink)
  '#2E7D32', // Wed (Green)
  '#E65100', // Thu (Orange)
  '#0288D1', // Fri (Sky Blue)
  '#7B1FA2', // Sat (Purple)
  '#D32F2F', // Sun (Red)
];

// Refined, high-contrast preset color styles for course cards
export const PRESET_COLORS = [
  {
    name: 'Coinbase Blue',
    bg: '#EEF4FF',
    border: '#B9D5FF',
    text: '#0043CC',
    badgeBg: '#0052FF',
    badgeText: '#FFFFFF',
  },
  {
    name: 'Emerald Green',
    bg: '#EAF8F1',
    border: '#A7E8C7',
    text: '#047847',
    badgeBg: '#05B169',
    badgeText: '#FFFFFF',
  },
  {
    name: 'Amber Gold',
    bg: '#FEF8EA',
    border: '#FDE4A8',
    text: '#B77900',
    badgeBg: '#F4B000',
    badgeText: '#0A0B0D',
  },
  {
    name: 'Crimson Red',
    bg: '#FDF1F2',
    border: '#FAC0C4',
    text: '#B41825',
    badgeBg: '#CF202F',
    badgeText: '#FFFFFF',
  },
  {
    name: 'Royal Purple',
    bg: '#F6F2FF',
    border: '#D8C6FE',
    text: '#6422D4',
    badgeBg: '#7C3AED',
    badgeText: '#FFFFFF',
  },
  {
    name: 'Cyan Teal',
    bg: '#EDFAFB',
    border: '#B3ECEE',
    text: '#0E737B',
    badgeBg: '#0891B2',
    badgeText: '#FFFFFF',
  },
  {
    name: 'Slate Charcoal',
    bg: '#F1F3F5',
    border: '#CED4DA',
    text: '#343A40',
    badgeBg: '#495057',
    badgeText: '#FFFFFF',
  },
  {
    name: 'Coral Sunset',
    bg: '#FFF2ED',
    border: '#FFCDBC',
    text: '#C03D12',
    badgeBg: '#EA580C',
    badgeText: '#FFFFFF',
  },
];

export const START_HOUR = 8;
export const END_HOUR = 20;
export const PIXELS_PER_HOUR = 130;
export const HEADER_WIDTH = 96;
export const ROW_HEIGHT = 104;
