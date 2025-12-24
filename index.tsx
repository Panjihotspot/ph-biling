
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.debug("PH Biling: Memulai mounting DOM...");

const rootEl = document.getElementById('root');

if (rootEl) {
  try {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Memberi tahu loader bahwa aplikasi sudah siap
    (window as any).reactLoaded = true;
    console.debug("PH Biling: Hydration Sukses.");
  } catch (err) {
    console.error("PH Biling: Gagal melakukan render!", err);
  }
} else {
  console.error("PH Biling: Elemen #root tidak ditemukan di index.html");
}
