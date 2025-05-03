import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import TableList from './components/TableList';
import OrderList from './components/OrderList';

const App: React.FC = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            RestauPilot
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Tables
          </Button>
          <Button color="inherit" component={Link} to="/orders">
            Commandes
          </Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Box sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<TableList />} />
            <Route path="/orders" element={<OrderList />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
};

export default App; 