import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/list/:listName" element={<App />} />
        <Route path="/admin" element={<App />} />
        <Route path="/admin/list/:listName" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
