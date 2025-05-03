import React, { useState, useEffect } from 'react';
import { Table } from '../types/table';
import { tableService } from '../services/tableService';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  IconButton,
  Menu,
  MenuItem as MuiMenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton as MuiIconButton,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { MoreVert, Delete, Add, Remove } from '@mui/icons-material';
import { orderService } from '../services/orderService';
import { Order, OrderItem } from '../types/order';
import { MenuItem } from '../types/menu';
import { menuService } from '../services/menuService';

interface TableCardProps {
  table: Table;
  onStatusChange: () => void;
  onDelete?: () => void;
}

const TableCard: React.FC<TableCardProps> = ({ table, onStatusChange, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [newOrder, setNewOrder] = useState<Partial<Order>>({
    table: {
      id: table._id,
      number: table.number
    },
    items: [],
    status: 'pending',
    totalAmount: 0,
    notes: ''
  });

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const items = await menuService.getAllMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error('Erreur lors du chargement du menu:', error);
      }
    };
    fetchMenuItems();
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = async (newStatus: Table['status']) => {
    try {
      await tableService.updateTableStatus(table._id, newStatus);
      onStatusChange();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
    handleMenuClose();
  };

  const handleDeleteTable = async () => {
    handleMenuClose();
    
    if (!table._id) {
      alert("Impossible de supprimer: ID de table manquant");
      return;
    }
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la table ${table.number} ?`)) {
      try {
        console.log("Suppression de la table:", table._id);
        
        await tableService.deleteTable(table._id);
        
        alert(`Table ${table.number} supprimée avec succès`);
        
        if (onDelete) {
          onDelete();
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }
  };

  const handleAddItem = () => {
    if (!selectedItem) return;
    
    const menuItem = menuItems.find(item => item._id === selectedItem);
    if (!menuItem) return;

    const existingItem = newOrder.items?.find(item => item.menuItem._id === selectedItem);
    
    if (existingItem) {
      const updatedItems = newOrder.items?.map(item => 
        item.menuItem._id === selectedItem 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setNewOrder(prev => ({
        ...prev,
        items: updatedItems,
        totalAmount: (prev.totalAmount || 0) + menuItem.price
      }));
    } else {
      const newItem: OrderItem = {
        id: Math.random().toString(36).substr(2, 9),
        menuItem,
        quantity: 1,
        priceAtTime: menuItem.price,
        specialInstructions: '',
        status: 'pending'
      };
      setNewOrder(prev => ({
        ...prev,
        items: [...(prev.items || []), newItem],
        totalAmount: (prev.totalAmount || 0) + menuItem.price
      }));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const item = newOrder.items?.find(i => i.id === itemId);
    if (!item) return;

    if (item.quantity > 1) {
      const updatedItems = newOrder.items?.map(i => 
        i.id === itemId 
          ? { ...i, quantity: i.quantity - 1 }
          : i
      );
      setNewOrder(prev => ({
        ...prev,
        items: updatedItems,
        totalAmount: (prev.totalAmount || 0) - item.priceAtTime
      }));
    } else {
      const updatedItems = newOrder.items?.filter(i => i.id !== itemId);
      setNewOrder(prev => ({
        ...prev,
        items: updatedItems,
        totalAmount: (prev.totalAmount || 0) - item.priceAtTime
      }));
    }
  };

  const handleCreateOrder = async () => {
    try {
      await orderService.createOrder(newOrder);
      setOpenOrderDialog(false);
      setNewOrder({
        table: {
          id: table._id,
          number: table.number
        },
        items: [],
        status: 'pending',
        totalAmount: 0,
        notes: ''
      });
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
    }
  };

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'occupied':
        return 'error';
      case 'reserved':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'occupied':
        return 'Occupée';
      case 'reserved':
        return 'Réservée';
      default:
        return status;
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Table {table.number}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip 
                label={getStatusLabel(table.status)} 
                color={getStatusColor(table.status)}
                sx={{ mr: 1 }}
              />
              <IconButton onClick={handleMenuClick}>
                <MoreVert />
              </IconButton>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Capacité: {table.capacity} personnes
          </Typography>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MuiMenuItem onClick={() => handleStatusChange('available')}>
              Disponible
            </MuiMenuItem>
            <MuiMenuItem onClick={() => handleStatusChange('occupied')}>
              Occupée
            </MuiMenuItem>
            <MuiMenuItem onClick={() => handleStatusChange('reserved')}>
              Réservée
            </MuiMenuItem>
            <Divider />
            <MuiMenuItem onClick={() => setOpenOrderDialog(true)}>
              Créer une commande
            </MuiMenuItem>
            <Divider />
            <MuiMenuItem 
              onClick={handleDeleteTable}
              sx={{ color: 'error.main' }}
            >
              <Delete sx={{ mr: 1 }} />
              Supprimer
            </MuiMenuItem>
          </Menu>
        </CardContent>
      </Card>

      <Dialog open={openOrderDialog} onClose={() => setOpenOrderDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Créer une commande pour la table {table.number}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Plat</InputLabel>
              <Select
                value={selectedItem}
                onChange={(e: SelectChangeEvent) => setSelectedItem(e.target.value)}
                label="Plat"
              >
                {menuItems.map((item) => (
                  <MuiMenuItem key={item._id} value={item._id}>
                    {item.name} - {item.price}€
                  </MuiMenuItem>
                ))}
              </Select>
            </FormControl>

            <Button 
              variant="contained" 
              onClick={handleAddItem}
              disabled={!selectedItem}
              startIcon={<Add />}
            >
              Ajouter au panier
            </Button>

            <List>
              {newOrder.items?.map((item) => (
                <ListItem key={item.id}>
                  <ListItemText
                    primary={`${item.quantity}x ${item.menuItem.name}`}
                    secondary={`${item.priceAtTime}€ / unité`}
                  />
                  <ListItemSecondaryAction>
                    <MuiIconButton edge="end" onClick={() => handleRemoveItem(item.id)}>
                      <Remove />
                    </MuiIconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <TextField
              label="Notes"
              multiline
              rows={4}
              value={newOrder.notes}
              onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
            />

            <Typography variant="h6" align="right">
              Total: {newOrder.totalAmount?.toFixed(2)}€
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOrderDialog(false)}>Annuler</Button>
          <Button 
            onClick={handleCreateOrder} 
            variant="contained" 
            color="primary"
            disabled={!newOrder.items?.length}
          >
            Créer la commande
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TableCard; 