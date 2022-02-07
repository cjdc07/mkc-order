import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import { AppBar, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';

import FullScreenDialog from './components/FullScreenDialog';
import OrderForm from './routes/OrderForm';
import OrderSummary from './routes/OrderForm/OrderSummary';
import useRequest from './hooks/useRequest';
import { formatDate } from './utils';

import './App.css';

const ORDER_STATUS = {
  PREPARING: 'Preparing',
  FOR_DELIVERY: 'For Delivery',
  FOR_PAYMENT: 'For Payment',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

function App() {
  const { getList, update } = useRequest();
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [openOrderSummaryDialog, setOpenOrderSummaryDialog] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const [openOrderFormDialog, setOpenOrderFormDialog] = React.useState(false);
  const [openCancelOrderDialog, setOpenCancelOrderDialog] = React.useState(false);
  const [openPaymentOrderDialog, setOpenPaymentOrderDialog] = React.useState(false);

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

  const handleDialogOpen = () => {
    setOpenOrderFormDialog(true);
  };

  const handleDialogClose = () => {
    setOpenOrderFormDialog(false);
    getOrders(); // TODO: inefficient. refactor this
  };

  const handleOrderSummaryDialogClose = () => {
    setOpenOrderSummaryDialog(false);
    setSelectedOrder(null);
  }

  const handleCancelOrderDialogOpen = () => setOpenCancelOrderDialog(true);
  const handleCancelOrderDialogClose = () => setOpenCancelOrderDialog(false);
  const cancelOrder = async () => {
    try {
      await update(
        'orders',
        {
          ...selectedOrder,
          id: selectedOrder._id,
          status: ORDER_STATUS.CANCELLED,
        },
      );
      handleCancelOrderDialogClose();
      handleOrderSummaryDialogClose();
      getOrders();
    } catch (error) {
      console.log(error);
    }
  }

  const handlePaymentOrderDialogOpen = () => setOpenPaymentOrderDialog(true);
  const handlePaymentOrderDialogClose = () => setOpenPaymentOrderDialog(false);
  const confirmPayment = async () => {
    try {
      await update(
        'orders',
        {
          ...selectedOrder,
          id: selectedOrder._id,
          isPaid: true,
        },
      );
      handlePaymentOrderDialogClose();
      handleOrderSummaryDialogClose();
      getOrders();
    } catch (error) {
      console.log(error);
    }
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
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleDialogOpen}>
            New Order
          </Button>
        </Box>
        {orders && orders.length > 0 &&
          <>
            {Object.values(ORDER_STATUS).map((statusName) => {
              const ordersPerStatus = orders.find(({ status }) => status === statusName)
              return (
                <Box key={statusName}>
                  <Typography color="text.secondary" sx={{marginBottom: 1}}>{statusName}</Typography>
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
                                    <VerifiedIcon />&nbsp;Paid
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
                      <p>Nothing!</p>
                    }
                  </Box>
                </Box>
              );
            })}
          </>
        }

        <OrderForm open={openOrderFormDialog} onClose={handleDialogClose}  />

        <FullScreenDialog
          title={`Order: ${selectedOrder && selectedOrder.code}`}
          open={openOrderSummaryDialog}
          onClose={handleOrderSummaryDialogClose}
        >
          <Box sx={{pb: 8, pl: 2, pr: 2, flexGrow: 1}}>
            {selectedOrder && (
              <>
                <OrderSummary {...selectedOrder} />

                {![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(selectedOrder.status) && (
                  <>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="success"
                      sx={{mt: 2}}
                      onClick={!selectedOrder.isPaid ? handlePaymentOrderDialogOpen : undefined}
                    >
                      {selectedOrder.isPaid ?
                        (<><VerifiedIcon/>&nbsp;Payment Complete</>) :
                        (<><VerifiedIcon sx={{ color: '#ccc' }}/>&nbsp;Payment Received?</>)
                      }
                    </Button>
                    <Dialog
                      open={openPaymentOrderDialog}
                      onClose={handlePaymentOrderDialogClose}
                    >
                      <DialogTitle>
                        {`Order ${selectedOrder.code} Payment`}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          {`Recieved full payment from ${selectedOrder.customerName}?`}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handlePaymentOrderDialogClose}>No</Button>
                        <Button onClick={confirmPayment} autoFocus>
                          Yes
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )}

                {[ORDER_STATUS.PREPARING, ORDER_STATUS.FOR_DELIVERY].includes(selectedOrder.status) && !selectedOrder.isPaid &&
                  (
                    <>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        sx={{mt: 6}}
                        onClick={handleCancelOrderDialogOpen}
                      >
                        Cancel Order
                      </Button>
                      <Dialog
                        open={openCancelOrderDialog}
                        onClose={handleCancelOrderDialogClose}
                      >
                        <DialogTitle>
                          {`Cancel Order`}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            {`Are you sure you want to cancel order ${selectedOrder.code}?`}
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCancelOrderDialogClose}>No</Button>
                          <Button onClick={cancelOrder} autoFocus>
                            Yes
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </>
                  )
                }
              </>
            )}
          </Box>
        </FullScreenDialog>
      </Box>
    </>
  );
}

export default App;
