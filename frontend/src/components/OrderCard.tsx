import React from 'react';
import { Order } from '../types/order';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Box, 
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { MoreVert, Add, Remove, Delete } from '@mui/icons-material';
import { orderService } from '../services/orderService';

interface OrderCardProps {
  order: Order;
  onStatusChange: () => void;
  onDelete: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusChange, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = async (newStatus: Order['status']) => {
    try {
      await orderService.updateOrderStatus(order.id, newStatus);
      onStatusChange();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
    handleMenuClose();
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'preparing':
        return 'secondary';
      case 'ready':
        return 'success';
      case 'served':
        return 'primary';
      case 'paid':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'preparing':
        return 'En préparation';
      case 'ready':
        return 'Prête';
      case 'served':
        return 'Servie';
      case 'paid':
        return 'Payée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Commande pour la table {order.table.number}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip 
              label={getStatusLabel(order.status)} 
              color={getStatusColor(order.status)}
              sx={{ mr: 1 }}
            />
            <IconButton onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleStatusChange('pending')}>
            En attente
          </MenuItem>
          <MenuItem onClick={() => handleStatusChange('confirmed')}>
            Confirmer
          </MenuItem>
          <MenuItem onClick={() => handleStatusChange('preparing')}>
            En préparation
          </MenuItem>
          <MenuItem onClick={() => handleStatusChange('ready')}>
            Prête
          </MenuItem>
          <MenuItem onClick={() => handleStatusChange('served')}>
            Servie
          </MenuItem>
          <MenuItem onClick={() => handleStatusChange('paid')}>
            Payée
          </MenuItem>
          <MenuItem onClick={() => handleStatusChange('cancelled')}>
            Annuler
          </MenuItem>
          <Divider />
          <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
            Supprimer
          </MenuItem>
        </Menu>

        <List>
          {order.items.map((item) => (
            <ListItem key={item.id} sx={{ py: 1 }}>
              <ListItemText
                primary={`${item.quantity}x ${item.menuItem.name}`}
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {item.specialInstructions && `Instructions: ${item.specialInstructions}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prix unitaire: {item.priceAtTime}€
                    </Typography>
                  </>
                }
              />
              <Typography variant="body2" color="text.primary">
                {(item.priceAtTime * item.quantity).toFixed(2)}€
              </Typography>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {order.notes && `Notes: ${order.notes}`}
          </Typography>
          <Typography variant="h6">
            Total: {order.totalAmount.toFixed(2)}€
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderCard; 