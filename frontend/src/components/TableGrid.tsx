import React, { useEffect, useState, useRef } from 'react';
import { tableService } from '../services/tableService';
import TableCard from './TableCard';
import { 
  Container, 
  Typography, 
  Grid, 
  CircularProgress, 
  Alert, 
  Button, 
  Box, 
  TextField, 
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Snackbar } from '@mui/material';
import { Table } from '../types/table';
import { AxiosError } from 'axios';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SquareIcon from '@mui/icons-material/Square';
import CircleIcon from '@mui/icons-material/Circle';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';

interface AxiosErrorResponse {
  message: string;
}

// Définir l'interface pour l'état de nouvelle table
interface NewTableState {
  number: string;
  capacity: string;
  status: 'available' | 'occupied' | 'reserved';
  shape: 'square' | 'round' | 'rectangular';
  position: {
    x: number;
    y: number;
  };
}

const TableGrid: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const floorPlanRef = useRef<HTMLDivElement>(null);
  
  // États pour le menu contextuel
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    tableId: string;
  } | null>(null);
  
  // États pour la création de table
  const [openNewTableDialog, setOpenNewTableDialog] = useState(false);
  const [newTable, setNewTable] = useState<NewTableState>({
    number: '',
    capacity: '',
    status: 'available',
    shape: 'square',
    position: { x: 0, y: 0 }
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    console.log("Début de la récupération des tables");
    try {
      const data = await tableService.getAllTables();
      console.log("Tables récupérées avec succès:", data.length, "tables");
      console.log("Tables reçues du backend:", data);
      
      // Les propriétés position et shape existent maintenant dans le backend
      // Donc nous n'avons plus besoin de les ajouter manuellement
      setTables(data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des tables:", err);
      const error = err as AxiosError<AxiosErrorResponse>;
      setError(error.response?.data?.message || 'Erreur lors du chargement des tables');
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  // Fonction pour créer une nouvelle table
  const handleCreateTable = async () => {
    try {
      // Créer avec tous les champs, le backend prend maintenant en charge position et shape
      const tableData = {
        number: parseInt(newTable.number),
        capacity: parseInt(newTable.capacity),
        status: newTable.status,
        position: newTable.position,
        shape: newTable.shape
      };
      
      console.log("Tentative de création d'une table avec les données:", tableData);
      
      await tableService.createTable(tableData);
      setOpenNewTableDialog(false);
      setNewTable({ 
        number: '', 
        capacity: '', 
        status: 'available',
        shape: 'square',
        position: { x: 0, y: 0 } 
      });
      fetchTables();
    } catch (err) {
      console.error('Erreur lors de la création de la table:', err);
      const error = err as AxiosError<AxiosErrorResponse>;
      setError(error.response?.data?.message || 'Erreur lors de la création de la table');
    }
  };

  // Fonction pour calculer la taille d'une table en fonction de sa capacité
  const getTableSize = (capacity: number) => {
    // Taille de base
    const baseSize = 60;
    
    // Ajouter de la taille en fonction du nombre de couverts
    if (capacity <= 2) return baseSize;
    if (capacity <= 4) return baseSize * 1.2;
    if (capacity <= 6) return baseSize * 1.4;
    if (capacity <= 8) return baseSize * 1.6;
    return baseSize * 1.8; // Pour les grandes tables
  };

  // Fonction pour définir la position par défaut des tables selon leur numéro
  const getDefaultPosition = (tableNumber: number) => {
    // Calcul simple pour placer les tables en grille
    const row = Math.floor((tableNumber - 1) / 4);
    const col = (tableNumber - 1) % 4;
    
    return {
      x: 120 + col * 150,
      y: 120 + row * 150
    };
  };

  // Gestion du drag & drop des tables
  const handleMouseDown = (tableId: string, e: React.MouseEvent) => {
    // Si c'est un clic droit, on ouvre le menu contextuel
    if (e.button === 2) {
      e.preventDefault();
      e.stopPropagation();
      console.log("Clic droit détecté sur la table ID:", tableId);
      
      setContextMenu({
        mouseX: e.clientX,
        mouseY: e.clientY,
        tableId
      });
      return;
    }
    
    if (selectedTab !== 1) return; // Seulement dans la vue plan de salle
    
    // Récupérer la table
    const table = tables.find(t => t._id === tableId);
    if (!table) return;

    const tableElement = e.currentTarget as HTMLDivElement;
    const rect = tableElement.getBoundingClientRect();
    
    // Calculer le décalage entre le point de clic et le coin supérieur gauche de la table
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setDraggedTable(tableId);
    setIsDragging(true);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedTable || !floorPlanRef.current) return;
    
    e.preventDefault();
    
    // Calculer la nouvelle position par rapport au plan de salle
    const floorPlanRect = floorPlanRef.current.getBoundingClientRect();
    const newX = e.clientX - floorPlanRect.left - dragOffset.x;
    const newY = e.clientY - floorPlanRect.top - dragOffset.y;
    
    // Mettre à jour la position visuellement (sans l'enregistrer encore)
    setTables(prevTables => prevTables.map(table => 
      table._id === draggedTable 
        ? { 
            ...table, 
            position: { 
              x: newX, 
              y: newY 
            } 
          } 
        : table
    ));
  };
  
  const handleMouseUp = async () => {
    if (!isDragging || !draggedTable) return;
    
    // Sauvegarder la nouvelle position dans la base de données
    const table = tables.find(t => t._id === draggedTable);
    if (table && table.position) {
      try {
        await tableService.updateTablePosition(table._id, table.position);
      } catch (err) {
        console.error('Erreur lors de la mise à jour de la position:', err);
        setError('Erreur lors de la mise à jour de la position');
        // Recharger les tables pour restaurer les positions d'origine en cas d'erreur
        fetchTables();
      }
    }
    
    setDraggedTable(null);
    setIsDragging(false);
  };

  // Gestion du menu contextuel
  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const handleChangeTableShape = async (shape: Table['shape']) => {
    if (!contextMenu) return;
    
    try {
      // Log pour déboguer
      console.log("Table ID:", contextMenu.tableId);
      
      if (!contextMenu.tableId) {
        console.error("L'ID de la table est undefined");
        return;
      }
      
      // Mise à jour de l'UI immédiatement pour une meilleure réactivité
      setTables(prevTables => prevTables.map(table => 
        table._id === contextMenu.tableId 
          ? { ...table, shape } 
          : table
      ));
      
      // API call pour mettre à jour la forme de la table
      await tableService.updateTable(contextMenu.tableId, { shape });
      handleContextMenuClose();
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la forme:', err);
      setError('Erreur lors de la mise à jour de la forme');
      fetchTables();
    }
  };

  const handleChangeTableStatus = async (status: Table['status']) => {
    if (!contextMenu) return;
    
    try {
      // Log pour déboguer
      console.log("Table ID:", contextMenu.tableId);
      
      if (!contextMenu.tableId) {
        console.error("L'ID de la table est undefined");
        return;
      }
      
      // Mise à jour de l'UI immédiatement
      setTables(prevTables => prevTables.map(table => 
        table._id === contextMenu.tableId 
          ? { ...table, status } 
          : table
      ));
      
      // API call pour mettre à jour le statut
      await tableService.updateTableStatus(contextMenu.tableId, status);
      handleContextMenuClose();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      setError('Erreur lors de la mise à jour du statut');
      fetchTables();
    }
  };

  // Fonction spécifique pour gérer la suppression des tables
  const handleTableDelete = () => {
    console.log("handleTableDelete appelé - Rafraîchissement des tables après suppression");
    
    // Ajouter un délai pour permettre au backend de terminer sa tâche
    setTimeout(() => {
      fetchTables();
    }, 300);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Gestion des Tables
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenNewTableDialog(true)}
        >
          Ajouter une table
        </Button>
      </Box>
      
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Vue en grille" />
        <Tab label="Plan de salle" />
      </Tabs>

      {selectedTab === 0 ? (
        <Grid container spacing={3}>
          {tables.map((table) => (
            <Grid item xs={12} sm={6} md={4} key={table._id}>
              <TableCard
                table={table}
                onStatusChange={fetchTables}
                onDelete={handleTableDelete}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper 
          ref={floorPlanRef}
          sx={{ 
            position: 'relative', 
            height: 600, 
            mt: 2, 
            p: 2, 
            backgroundColor: '#f9f9f9',
            overflow: 'auto',
            cursor: isDragging ? 'grabbing' : 'default'
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onContextMenu={(e) => e.preventDefault()} // Désactiver le menu contextuel par défaut
        >
          <Typography variant="subtitle1" sx={{ mb: 2, fontStyle: 'italic' }}>
            Plan de salle - Déplacez les tables (glisser-déposer) ou clic-droit pour options
          </Typography>
          
          {tables.map((table) => {
            // Vérifier que la position existe, sinon utiliser une position par défaut
            const position = table.position && typeof table.position.x === 'number' && typeof table.position.y === 'number'
              ? table.position 
              : getDefaultPosition(table.number);
            
            // Calculer la taille en fonction de la capacité
            const size = getTableSize(table.capacity);
            
            // S'assurer que la forme est définie
            const shape = table.shape || 'square';
            
            // Styles spécifiques selon la forme
            const tableStyles: React.CSSProperties = {
              position: 'absolute',
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: (shape === 'rectangular') ? size * 1.5 : size,
              height: (shape === 'rectangular') ? size * 0.8 : size,
              borderRadius: (shape === 'round') ? '50%' : (shape === 'square') ? '8px' : '16px',
              backgroundColor: 
                table.status === 'available' ? '#4caf50' : 
                table.status === 'occupied' ? '#f44336' : 
                table.status === 'reserved' ? '#ff9800' : '#9e9e9e',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
              transition: draggedTable === table._id ? 'none' : 'all 0.3s ease',
              cursor: isDragging && draggedTable === table._id ? 'grabbing' : 'grab',
              userSelect: 'none',
              border: draggedTable === table._id ? '2px solid #1976d2' : '2px solid rgba(0,0,0,0.2)',
              padding: '8px',
              zIndex: draggedTable === table._id ? 1000 : 1
            };
            
            return (
              <div 
                key={table._id} 
                style={tableStyles}
                onMouseDown={(e) => handleMouseDown(table._id, e)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("onContextMenu détecté sur table ID:", table._id);
                  setContextMenu({
                    mouseX: e.clientX,
                    mouseY: e.clientY,
                    tableId: table._id
                  });
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '4px' }}>
                  {table.number}
                </div>
                <div style={{ fontSize: '0.8rem' }}>
                  {table.capacity} {table.capacity > 1 ? 'personnes' : 'personne'}
                </div>
              </div>
            );
          })}
          
          {/* Menu contextuel pour les tables */}
          <Menu
            open={contextMenu !== null}
            onClose={handleContextMenuClose}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            <Typography sx={{ p: 2, fontWeight: 'bold' }}>Options de la table</Typography>
            <Divider />
            <MenuItem onClick={() => {
              if (contextMenu) handleChangeTableStatus('available');
            }}>
              <ListItemIcon>
                <CheckCircleOutlineIcon sx={{ color: 'success.main' }} />
              </ListItemIcon>
              <ListItemText>Disponible</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              if (contextMenu) handleChangeTableStatus('occupied');
            }}>
              <ListItemIcon>
                <DoDisturbOnIcon sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText>Occupée</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              if (contextMenu) handleChangeTableStatus('reserved');
            }}>
              <ListItemIcon>
                <BookmarkIcon sx={{ color: 'warning.main' }} />
              </ListItemIcon>
              <ListItemText>Réservée</ListItemText>
            </MenuItem>
            <Divider />
            <Typography sx={{ p: 1, pl: 2, fontSize: '0.85rem', color: 'text.secondary' }}>
              Forme de la table
            </Typography>
            <MenuItem onClick={() => {
              if (contextMenu) handleChangeTableShape('square');
            }}>
              <ListItemIcon>
                <SquareIcon />
              </ListItemIcon>
              <ListItemText>Carrée</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              if (contextMenu) handleChangeTableShape('round');
            }}>
              <ListItemIcon>
                <CircleIcon />
              </ListItemIcon>
              <ListItemText>Ronde</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              if (contextMenu) handleChangeTableShape('rectangular');
            }}>
              <ListItemIcon>
                <TableRestaurantIcon />
              </ListItemIcon>
              <ListItemText>Rectangulaire</ListItemText>
            </MenuItem>
          </Menu>
        </Paper>
      )}

      {/* Dialog pour ajouter une nouvelle table */}
      <Dialog open={openNewTableDialog} onClose={() => setOpenNewTableDialog(false)}>
        <DialogTitle>Ajouter une nouvelle table</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Numéro de table"
            type="number"
            fullWidth
            value={newTable.number}
            onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Capacité"
            type="number"
            fullWidth
            value={newTable.capacity}
            onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
          />
          <TextField
            select
            margin="dense"
            label="Forme"
            fullWidth
            value={newTable.shape}
            onChange={(e) => setNewTable({ 
              ...newTable, 
              shape: e.target.value as NewTableState['shape'] 
            })}
            SelectProps={{ native: true }}
          >
            <option value="square">Carrée</option>
            <option value="round">Ronde</option>
            <option value="rectangular">Rectangulaire</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewTableDialog(false)}>Annuler</Button>
          <Button 
            onClick={handleCreateTable} 
            color="primary"
            disabled={!newTable.number || !newTable.capacity}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </Container>
  );
};

export default TableGrid; 