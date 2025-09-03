import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider } from '@mui/material/styles';
import ErrorBoundary from './components/ErrorBoundary';
import theme from './theme';
import App from './App';
import { store } from './store';
import './assets/css/main.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={theme}>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </ThemeProvider>
        </LocalizationProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);