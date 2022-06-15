import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './index.scss';
import './common/styles/global.scss';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
