import * as React from 'react';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';

import OrderForm from './components/OrderForm';
import useRequest from './hooks/useRequest';

import './App.css';
import ManageOrderPage from './components/ManageOrderPage';
import OrdersList from './components/OrdersList';
import Login from './components/Login';
import { UserProvider } from './contexts/UserContext';

function App() {
  const { getList } = useRequest();
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [openOrderSummaryDialog, setOpenOrderSummaryDialog] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const [openOrderFormDialog, setOpenOrderFormDialog] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const getOrders = async () => {
    try {
      const data = await getList('orders', {
        pagination: {
          page: 0,
          perPage: 0,
        },
        sort: {
          field: 'createdAt',
          order: 'ASC',
        },
        filter: {},
      });

      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    if (isLoggedIn) {
      getOrders();
    }
  }, [isLoggedIn])

  const handleOrderFormDialogOpen = () => {
    setOpenOrderFormDialog(true);
  };

  const handleOrderFormDialogClose = () => {
    setOpenOrderFormDialog(false);
    getOrders(); // TODO: inefficient. refactor this
  };

  const handleOrderSummaryDialogClose = () => {
    setOpenOrderSummaryDialog(false);
    setSelectedOrder(null);
    getOrders();
  }

  return (
    <UserProvider>
      {isLoggedIn ? (
        <>
          <AppBar sx={{ position: 'fixed' }}>
            <Toolbar>
              <Typography>MKC Order</Typography>
            </Toolbar>
          </AppBar>
          <Toolbar />

          <Box pl={2} pr={2}>
            <Box mt={2} sx={{ display: 'flex', justifyContent: 'end'}}>
              <Button variant="outlined" startIcon={<ShoppingCartCheckoutIcon />} onClick={handleOrderFormDialogOpen}>
                New Order
              </Button>
            </Box>

            {orders && orders.length > 0 &&
              <OrdersList orders={orders} onItemClick={(order) => {
                setSelectedOrder(order);
                setOpenOrderSummaryDialog(true);
              }} />
            }

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
