import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallbackTitle="SIGUNTANG Sedang Menyiapkan Modul">
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
