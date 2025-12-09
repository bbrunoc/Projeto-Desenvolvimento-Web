import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Se tiver CSS global
import App from './App'; // <--- O IMPORTANTE ESTÁ AQUI

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);