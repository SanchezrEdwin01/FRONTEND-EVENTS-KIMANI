import React from 'react';

import Theme from './Theme';
import { BrowserRouter } from 'react-router-dom';
const BASE_PATH = import.meta.env.DEV
  ? '/'
  : import.meta.env.VITE_EVENTS_APP_BASE_PATH || '/events';

export default function Context({ children }) {
  return (
    <BrowserRouter basename={'/events'}>
      <Theme />
      <>{children}</>
    </BrowserRouter>
  );
}
