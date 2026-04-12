import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './app.jsx';
import { AuthProvider } from './contexts/AuthContext'; // <-- 1. Import the provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider> {/* <-- 2. Wrap your <App /> component */}
        <App />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);