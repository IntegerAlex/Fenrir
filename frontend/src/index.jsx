import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../style/base.css'; // Optionally import your CSS here (or base.css)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

