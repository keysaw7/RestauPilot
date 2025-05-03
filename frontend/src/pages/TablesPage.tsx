import React from 'react';
import TableGrid from '../components/TableGrid';

const TablesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des Tables</h1>
      <TableGrid />
    </div>
  );
};

export default TablesPage; 