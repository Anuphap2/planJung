import { createTheme } from '@mui/material';
import { COINBASE_COLORS } from '../constants/coinbaseTokens';

export const theme = createTheme({
  typography: {
    fontFamily: '"Kanit", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 500,
      fontSize: '1.75rem',
      letterSpacing: '-0.5px',
      color: COINBASE_COLORS.ink,
    },
    h2: {
      fontWeight: 500,
      fontSize: '1.4rem',
      letterSpacing: '-0.4px',
      color: COINBASE_COLORS.ink,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.15rem',
      color: COINBASE_COLORS.ink,
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: '0.95rem',
      color: COINBASE_COLORS.ink,
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: '0.85rem',
      color: COINBASE_COLORS.body,
    },
    body1: {
      fontSize: '0.95rem',
      color: COINBASE_COLORS.ink,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.85rem',
      color: COINBASE_COLORS.body,
      lineHeight: 1.45,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.9rem',
      letterSpacing: '0px',
    },
    caption: {
      fontSize: '0.75rem',
      color: COINBASE_COLORS.muted,
      letterSpacing: '0.2px',
    },
  },
  shape: {
    borderRadius: 12,
  },
  palette: {
    mode: 'light',
    primary: {
      main: COINBASE_COLORS.primary,
      dark: COINBASE_COLORS.primaryActive,
      light: '#3375FF',
      contrastText: COINBASE_COLORS.onPrimary,
    },
    secondary: {
      main: COINBASE_COLORS.surfaceDark,
      light: '#23272F',
      contrastText: COINBASE_COLORS.onDark,
    },
    background: {
      default: '#FAFAFB',
      paper: COINBASE_COLORS.canvas,
    },
    text: {
      primary: COINBASE_COLORS.ink,
      secondary: COINBASE_COLORS.body,
      disabled: COINBASE_COLORS.mutedSoft,
    },
    divider: COINBASE_COLORS.hairline,
    success: {
      main: COINBASE_COLORS.semanticUp,
    },
    error: {
      main: COINBASE_COLORS.semanticDown,
    },
    warning: {
      main: COINBASE_COLORS.accentYellow,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100, // Pill button geometry from DESIGN.md
          boxShadow: 'none',
          padding: '8px 20px',
          fontWeight: 600,
          transition: 'all 0.15s ease-in-out',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: COINBASE_COLORS.primary,
          color: COINBASE_COLORS.onPrimary,
          '&:hover': {
            backgroundColor: COINBASE_COLORS.primaryActive,
          },
        },
        containedSecondary: {
          backgroundColor: COINBASE_COLORS.surfaceStrong,
          color: COINBASE_COLORS.ink,
          '&:hover': {
            backgroundColor: '#DFE3E8',
          },
        },
        outlined: {
          borderColor: COINBASE_COLORS.hairline,
          color: COINBASE_COLORS.ink,
          '&:hover': {
            borderColor: COINBASE_COLORS.body,
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
          border: `1px solid ${COINBASE_COLORS.hairline}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          padding: 8,
          border: `1px solid ${COINBASE_COLORS.hairline}`,
          boxShadow: '0 24px 48px rgba(10, 11, 13, 0.14)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: COINBASE_COLORS.canvas,
            '& fieldset': {
              borderColor: COINBASE_COLORS.hairline,
              transition: 'border-color 0.2s ease',
            },
            '&:hover fieldset': {
              borderColor: '#8A92A0',
            },
            '&.Mui-focused fieldset': {
              borderColor: COINBASE_COLORS.primary,
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          fontWeight: 600,
        },
      },
    },
  },
});
