import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#fbbf24' },
    background: {
      default: '#0f172a', // slate-950
      paper: '#1e293b', // slate-800
    },
  },
});

export default theme;
