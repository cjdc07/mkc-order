import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';


import './App.css';
import OrderForm from './routes/OrderForm';

function App() {
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <div className="App">
      <Button variant="outlined" startIcon={<AddIcon />} onClick={handleDialogOpen}>
        New Order
      </Button>
      <OrderForm open={openDialog} onClose={handleDialogClose}  />
    </div>
  );
}

export default App;
