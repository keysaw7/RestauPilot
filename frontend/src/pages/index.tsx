import React, { useState, useEffect } from 'react';
import { Table } from '../types/table';
import TableGrid from '../components/TableGrid';
import OrderForm from '../components/OrderForm';
import MenuManager from '../components/MenuManager';

const Home: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'tables' | 'menu'>('tables');

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/tables');
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des tables:', error);
    }
  };

  const handleTableClick = (tableId: string) => {
    setSelectedTable(tableId);
  };

  const handleOrderCreated = () => {
    setSelectedTable(null);
    fetchTables();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">RestauPilot</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => setActiveView('tables')}
            className={`mr-4 px-4 py-2 rounded ${
              activeView === 'tables' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Tables
          </button>
          <button
            onClick={() => setActiveView('menu')}
            className={`px-4 py-2 rounded ${
              activeView === 'menu' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Menu
          </button>
        </div>

        {activeView === 'tables' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <TableGrid />
            </div>
            <div>
              {selectedTable && (
                <OrderForm
                  tableId={selectedTable}
                  onOrderCreated={handleOrderCreated}
                />
              )}
            </div>
          </div>
        ) : (
          <MenuManager />
        )}
      </main>
    </div>
  );
};

export default Home; 