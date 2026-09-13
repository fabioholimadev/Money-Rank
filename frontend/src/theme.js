import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#58cc02', dark: '#46a302', contrastText: '#13210f' },
    secondary: { main: '#49c0f8' },
    warning: { main: '#ffc800' },
    error: { main: '#ff4b4b' },
    background: { default: '#131f24', paper: '#1f2d33' },
    text: { primary: '#f1f7fb', secondary: '#a5b7c2' },
    divider: '#37464f',
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'Nunito, "Segoe UI", system-ui, sans-serif',
    button: { fontWeight: 900, textTransform: 'none' },
    h1: { fontWeight: 900 },
    h2: { fontWeight: 900 },
    h3: { fontWeight: 800 },
  },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { backgroundColor: '#131f24' } } },
  },
});

export default theme;
