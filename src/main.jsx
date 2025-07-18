import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { DateRangeProvider } from './context/DateRangeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DateRangeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DateRangeProvider>
  </StrictMode>
);