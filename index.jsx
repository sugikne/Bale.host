
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

/**
 * Bale.Host Platform Entry Point
 * ------------------------------
 * File ini menginisialisasi aplikasi React dan memasangnya ke DOM.
 * Memastikan branding global dan tata letak konsisten sejak dari akar aplikasi.
 */

const Root = () => {
  return (
    <React.StrictMode>
      <div className="min-h-screen bg-[#f8f9fb] font-sans selection:bg-primary/10 selection:text-primary">
        <App />
      </div>
    </React.StrictMode>
  );
};

const mountNode = document.getElementById('root');
if (mountNode) {
  const root = ReactDOM.createRoot(mountNode);
  root.render(<Root />);
} else {
  console.error("Critical Error: Elemen root tidak ditemukan di DOM.");
}

export default Root;
