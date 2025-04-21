import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryProvider } from '@/providers/query-provider';
import App from '@/App';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </React.StrictMode>
);
