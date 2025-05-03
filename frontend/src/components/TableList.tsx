import React, { useEffect, useState } from 'react';
import { Table } from '../types/table';
import { tableService } from '../services/tableService';
import { Container, Typography, CircularProgress, Alert, Box } from '@mui/material';
import TableCard from './TableCard';

const TableList: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = async () => {
    try {
      const data = await tableService.getAllTables();
      setTables(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des tables');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

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

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Gestion des Tables
        </Typography>
        {tables.map((table) => (
          <TableCard
            key={table._id}
            table={table}
            onStatusChange={fetchTables}
            onDelete={fetchTables}
          />
        ))}
      </Box>
    </Container>
  );
};

export default TableList;

 