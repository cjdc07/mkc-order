import * as React from 'react';
import _ from 'lodash';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';

import OrderForm from './components/OrderForm';

import './App.css';

import Login from './components/Login';
import Logout from './components/Logout';
import ManageOrderPage from './components/ManageOrderPage';
import OrdersList from './components/OrdersList';
import { UserProvider } from './contexts/UserContext';

function App() {
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [openOrderSummaryDialog, setOpenOrderSummaryDialog] = React.useState(false);
  const [openOrderFormDialog, setOpenOrderFormDialog] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [orderListKey, setOrderListKey] = React.useState(_.uniqueId('ol_'));

  const handleOrderFormDialogOpen = () => {
    setOpenOrderFormDialog(true);
  };

  const handleOrderFormDialogClose = () => {
    setOpenOrderFormDialog(false);
    setOrderListKey(_.uniqueId('ol_')); // TODO: inefficient. loads all orders again
  };

  const handleOrderSummaryDialogClose = () => {
    setOpenOrderSummaryDialog(false);
    setSelectedOrder(null);
    setOrderListKey(_.uniqueId('ol_')); // TODO: inefficient. loads all orders again
  }

  return (
    <UserProvider>
      {isLoggedIn ? (
        <>
          <AppBar sx={{ position: 'fixed' }}>
            <Toolbar sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <Typography>MKC Order</Typography>
              <Logout setIsLoggedIn={setIsLoggedIn}/>
            </Toolbar>
          </AppBar>
          <Toolbar />

          <Box pl={2} pr={2}>
            <Box mt={2} sx={{ display: 'flex', justifyContent: 'end'}}>
              <Button variant="outlined" startIcon={<ShoppingCartCheckoutIcon />} onClick={handleOrderFormDialogOpen}>
                New Order
              </Button>
            </Box>

            <OrdersList key={orderListKey} onItemClick={(order) => {
              setSelectedOrder(order);
              setOpenOrderSummaryDialog(true);
            }} />

            <OrderForm open={openOrderFormDialog} onClose={handleOrderFormDialogClose}  />
            
            <ManageOrderPage
              open={openOrderSummaryDialog}
              onClose={handleOrderSummaryDialogClose}
              selectedOrder={selectedOrder}
            />
          </Box>
        </>
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn}/>
      )}
    </UserProvider>
  )
}

export default App;
