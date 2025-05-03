import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TablesPage from './pages/TablesPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <TablesPage />
  </React.StrictMode>
); 