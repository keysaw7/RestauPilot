import React, { useEffect, useState } from 'react';
import { Order } from '../types/order';
import { orderService } from '../services/orderService';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Alert,
  Box,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import OrderCard from './OrderCard';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all');

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des commandes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = () => {
    fetchOrders();
  };

  const handleDelete = async (orderId: string) => {
    try {
      await orderService.deleteOrder(orderId);
      fetchOrders();
    } catch (err) {
      console.error('Erreur lors de la suppression de la commande:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </Container>
    );
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    served: orders.filter(o => o.status === 'served').length,
    paid: orders.filter(o => o.status === 'paid').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Gestion des Commandes
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Statistiques</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ textAlign: 'center', minWidth: 100 }}>
              <Typography variant="h6">{stats.total}</Typography>
              <Typography variant="body2" color="text.secondary">Total</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', minWidth: 100 }}>
              <Typography variant="h6" color="warning.main">{stats.pending}</Typography>
              <Typography variant="body2" color="text.secondary">En attente</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', minWidth: 100 }}>
              <Typography variant="h6" color="secondary.main">{stats.preparing}</Typography>
              <Typography variant="body2" color="text.secondary">En préparation</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', minWidth: 100 }}>
              <Typography variant="h6" color="success.main">{stats.ready}</Typography>
              <Typography variant="body2" color="text.secondary">Prêtes</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', minWidth: 100 }}>
              <Typography variant="h6" color="primary.main">{stats.served}</Typography>
              <Typography variant="body2" color="text.secondary">Servies</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', minWidth: 100 }}>
              <Typography variant="h6" color="success.main">{stats.paid}</Typography>
              <Typography variant="body2" color="text.secondary">Payées</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', minWidth: 100 }}>
              <Typography variant="h6" color="error.main">{stats.cancelled}</Typography>
              <Typography variant="body2" color="text.secondary">Annulées</Typography>
            </Box>
          </Box>
        </Paper>

        <Tabs 
          value={filter} 
          onChange={(_, newValue) => setFilter(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab value="all" label="Toutes" />
          <Tab value="pending" label="En attente" />
          <Tab value="preparing" label="En préparation" />
          <Tab value="ready" label="Prêtes" />
          <Tab value="served" label="Servies" />
          <Tab value="paid" label="Payées" />
          <Tab value="cancelled" label="Annulées" />
        </Tabs>

        {filteredOrders.length === 0 ? (
          <Alert severity="info">Aucune commande à afficher</Alert>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              onDelete={() => handleDelete(order.id)}
            />
          ))
        )}
      </Box>
    </Container>
  );
};

export default OrderList; 