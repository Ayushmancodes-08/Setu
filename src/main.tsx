import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AppProvider } from './context/AppContext';
import { HealthDataProvider } from './context/HealthDataContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HealthDataProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </HealthDataProvider>
  </React.StrictMode>
);
