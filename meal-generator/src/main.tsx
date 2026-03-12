import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Providers } from './app/providers';
import { ErrorBoundary } from './components/ErrorBoundary';
import { setupAccessibility } from './utils/accessibility';
import './styles/index.css';

// Setup accessibility features
setupAccessibility();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Providers>
        <App />
      </Providers>
    </ErrorBoundary>
  </React.StrictMode>
);
