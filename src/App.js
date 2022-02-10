import * as React from 'react';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaidIcon from '@mui/icons-material/Paid';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppBar, Button, Card, CardContent,  Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';

import OrderForm from './routes/OrderForm';
import useRequest from './hooks/useRequest';
import { ORDER_STATUS } from './constants';
import { formatDate } from './utils';

import './App.css';
import ManageOrderPage from './routes/ManageOrderPage';

function App() {
  const { getList } = useRequest();
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [openOrderSummaryDialog, setOpenOrderSummaryDialog] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const [openOrderFormDialog, setOpenOrderFormDialog] = React.useState(false);

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
    getOrders();
  }, [])

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
          <>
            {Object.values(ORDER_STATUS).map((statusName) => {
              const ordersPerStatus = orders.find(({ status }) => status === statusName)
              return (
                <Box key={statusName}>
                  <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    { statusName === ORDER_STATUS.PREPARING && <ShoppingCartIcon sx={{color: '#1976d2'}}/>}
                    { statusName === ORDER_STATUS.FOR_DELIVERY && <LocalShippingIcon sx={{color: '#1976d2'}}/>}
                    { statusName === ORDER_STATUS.FOR_PAYMENT && <AttachMoneyIcon sx={{color: '#1976d2'}} />}
                    { statusName === ORDER_STATUS.COMPLETED && <CheckCircleIcon sx={{color: 'green'}} />}
                    { statusName === ORDER_STATUS.CANCELLED && <CancelIcon sx={{color: 'red'}} />}
                    <Typography color="text.secondary" sx={{marginBottom: 1}}>&nbsp;{statusName}</Typography>
                  </Box>
                  <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                    {ordersPerStatus ?
                      ordersPerStatus.orders.map(
                        (order) => (
                          <Card
                            key={order._id}
                            variant="outlined"
                            sx={{ display: 'flex', margin: 1, width: '40vw' }}
                            onClick={() => {
                              setSelectedOrder(order);
                              setOpenOrderSummaryDialog(true);
                            }}
                          >
                            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', flex:1 }}>
                              <Box>
                                {order.isPaid &&
                                  <Box mb={1} sx={{color: 'green', display: 'flex', alignItems: 'center'}}>
                                    <PaidIcon />&nbsp;Paid
                                  </Box>
                                }
                                <Box>
                                  <Typography color="text.secondary">Order Code</Typography>
                                  <Typography>{order.code}</Typography>
                                </Box>
                                <Box mt={1}>
                                  <Typography color="text.secondary">Customer Name</Typography>
                                  <Typography>{order.customerName}</Typography>
                                </Box>
                                {order.forDelivery &&
                                  <Box mt={1}>
                                    <Typography color="text.secondary">Delivery Date</Typography>
                                    <Typography>{formatDate(order.deliveryDate)}</Typography>
                                  </Box>
                                }
                                <Box mt={1}>
                                    <Typography color="text.secondary">Created</Typography>
                                    <Typography>{formatDate(order.createdAt)}</Typography>
                                  </Box>
                              </Box>
                              <Box><ArrowCircleRightIcon /></Box>
                            </CardContent>
                          </Card>
                        )
                      ) :
                      <Box pl={2}>
                        <p>-</p>
                      </Box> 
                    }
                  </Box>
                </Box>
              );
            })}
          </>
        }

        <OrderForm open={openOrderFormDialog} onClose={handleOrderFormDialogClose}  />
        
        <ManageOrderPage
          open={openOrderSummaryDialog}
          onClose={handleOrderSummaryDialogClose}
          selectedOrder={selectedOrder}
        />
      </Box>
    </>
  );
}

export default App;
