import { createTheme } from '@mui/material';

export const theme = createTheme({
    typography: {
        fontFamily: '"Kanit", "Prompt", "Segoe UI", sans-serif',
        button: { textTransform: 'none', fontWeight: 600 },
        h6: { fontWeight: 600 },
        h1: { fontWeight: 700, fontSize: '1.25rem' },
    },
    shape: { borderRadius: 24 },
    palette: {
        primary: { main: '#7C4DFF', light: '#B388FF' },
        secondary: { main: '#FF4081', light: '#FF80AB' },
        background: { default: '#FDFBF7', paper: '#FFFFFF' },
        text: { primary: '#455A64', secondary: '#78909C' },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: { backgroundImage: 'none', boxShadow: '0px 10px 40px -10px rgba(0,0,0,0.08)' }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 50 },
                contained: { boxShadow: '0px 8px 20px -5px rgba(124, 77, 255, 0.4)' }
            }
        },
        MuiDialog: {
            styleOverrides: {
                paper: { borderRadius: 28, padding: 8 }
            }
        }
    }
});
