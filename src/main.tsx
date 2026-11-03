import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { SiteProvider } from '@/context/SiteProvider';
import { ThemeProvider } from '@/context/ThemeProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SiteProvider>
          <App />
        </SiteProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
