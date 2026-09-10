/**
 * Coinbase Design System Tokens
 * Source: DESIGN.md (Coinbase brand design guidelines)
 */

export const COINBASE_COLORS = {
  // Brand & Action
  primary: '#0052ff',          // Signature Coinbase Blue
  primaryActive: '#003ecc',    // Pressed/active state
  primaryDisabled: '#a8b8cc',  // Disabled state

  // Ink & Typography
  ink: '#0a0b0d',              // Headings and high-contrast text
  body: '#5b616e',             // Running body copy
  bodyStrong: '#0a0b0d',       // Bold text
  muted: '#7c828a',            // Secondary subtitles, captions
  mutedSoft: '#a8acb3',        // Faint text / disabled links

  // Canvas & Surfaces
  canvas: '#ffffff',           // Page background
  surfaceSoft: '#f7f7f7',      // Subtle alternating bands
  surfaceCard: '#ffffff',      // Card surfaces
  surfaceStrong: '#eef0f3',    // Secondary buttons, badges, search pills
  surfaceDark: '#0a0b0d',      // Dark hero sections
  surfaceDarkElevated: '#16181c', // Floating card on dark surface

  // Hairlines & Borders
  hairline: '#dee1e6',         // 1px hairline border on white surfaces
  hairlineSoft: '#eef0f3',     // Lighter subtle divider

  // Contrast text
  onPrimary: '#ffffff',
  onDark: '#ffffff',
  onDarkSoft: '#a8acb3',

  // Semantic Trading Colors (Text only, not fills)
  semanticUp: '#05b169',       // Positive green
  semanticDown: '#cf202f',     // Warning / negative red
  accentYellow: '#f4b000',     // Subtle accent
};

export const COINBASE_TYPOGRAPHY = {
  fontFamilyDisplay: "'Coinbase Display', 'Inter', -apple-system, system-ui, sans-serif",
  fontFamilySans: "'Coinbase Sans', 'Inter', -apple-system, system-ui, sans-serif",
  fontFamilyMono: "'Coinbase Mono', 'JetBrains Mono', 'SF Mono', Consolas, monospace",
};

export const COINBASE_ROUNDED = {
  none: '0px',
  xs: '4px',
  sm: '8px',
  md: '12px',    // Form inputs
  lg: '16px',
  xl: '24px',    // Container cards & dialogs
  pill: '100px', // Buttons, search bars, badges
  full: '9999px' // Circular icon badges
};

export const COINBASE_SPACING = {
  xxs: '4px',
  xs: '8px',
  sm: '12px',
  base: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  section: '96px',
};

export const COINBASE_SHADOWS = {
  none: 'none',
  card: '0 1px 3px rgba(0, 0, 0, 0.05)',
  cardHover: '0 4px 16px rgba(0, 0, 0, 0.08)',
  dialog: '0 20px 48px rgba(0, 0, 0, 0.16)',
  dragging: '0 12px 32px rgba(0, 82, 255, 0.25)',
};
