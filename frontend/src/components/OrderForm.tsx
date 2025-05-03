import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types/menu';

interface OrderFormProps {
  tableId: string;
  onOrderCreated: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ tableId, onOrderCreated }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/menu');
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Erreur lors de la récupération du menu:', error);
    }
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = Object.entries(selectedItems)
        .filter(([_, quantity]) => quantity > 0)
        .map(([itemId, quantity]) => ({
          menuItem: itemId,
          quantity
        }));

      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table: tableId,
          items: orderItems,
          status: 'pending'
        }),
      });

      if (response.ok) {
        setSelectedItems({});
        onOrderCreated();
      }
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Nouvelle Commande</h2>
      
      <div className="space-y-4">
        {menuItems.map(item => (
          <div key={item._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-sm font-medium">{item.price}€</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => handleQuantityChange(item._id, (selectedItems[item._id] || 0) - 1)}
                className="px-3 py-1 bg-gray-200 rounded"
                disabled={!selectedItems[item._id]}
              >
                -
              </button>
              <span>{selectedItems[item._id] || 0}</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(item._id, (selectedItems[item._id] || 0) + 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading || Object.values(selectedItems).every(qty => qty === 0)}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Création en cours...' : 'Créer la commande'}
      </button>
    </form>
  );
};

export default OrderForm; 