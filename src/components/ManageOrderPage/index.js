import * as React from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaidIcon from '@mui/icons-material/Paid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Typography } from '@mui/material';

import FullScreenDialog from "../FullScreenDialog";
import OrderSummary from '../OrderForm/OrderSummary';
import useRequest, { API_URL } from '../../hooks/useRequest';
import { ORDER_STATUS } from '../../constants';
import { UserContext } from '../../contexts/UserContext';
import { formatDate } from '../../utils';

const ManageOrderPage = ({open, onClose, selectedOrder}) => {
  const { update } = useRequest();
  const { handleAuthCheck } = React.useContext(UserContext);
  const [openCancelOrderDialog, setOpenCancelOrderDialog] = React.useState(false);
  const [openPaymentOrderDialog, setOpenPaymentOrderDialog] = React.useState(false);
  const [openConfirmStatusChangeDialog, setOpenConfirmStatusChangeDialog] = React.useState(false);
  const [invoiceUrl, setInvoiceUrl] = React.useState(null);

  const onComponentLoad = async () => {
    await handleAuthCheck();

    if (selectedOrder) {
      getInvoice(selectedOrder._id);
    }
  }

  React.useEffect(() => {
    onComponentLoad();
  }, [selectedOrder]);

  const getInvoice = async (id) => {
    const response = await fetch(`${API_URL}/orders/${id}/invoice`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    const newBlob = new Blob([await response.blob()], { type: 'application/pdf' });
    const objUrl = window.URL.createObjectURL(newBlob);
    setInvoiceUrl(objUrl);
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
      close();
    } catch (error) {
      console.log(error);
    }
  }

  const handlePaymentOrderDialogOpen = () => setOpenPaymentOrderDialog(true);
  const handlePaymentOrderDialogClose = () => setOpenPaymentOrderDialog(false);
  const confirmPayment = async (order) => {
    const status = order.status === ORDER_STATUS.FOR_PAYMENT ? ORDER_STATUS.COMPLETED : order.status;

    try {
      await update(
        'orders',
        {
          ...order,
          id: order._id,
          isPaid: true,
          status,
        },
      );
      handlePaymentOrderDialogClose();
      close();
    } catch (error) {
      console.log(error);
    }
  }

  const handleConfirmStatusChangeDialogOpen = () => setOpenConfirmStatusChangeDialog(true);
  const handleConfirmStatusChangeDialogClose = () => setOpenConfirmStatusChangeDialog(false);
  const confirmStatusChange = async (status) => {
    try {
      await update(
        'orders',
        {
          ...selectedOrder,
          id: selectedOrder._id,
          status,
        },
      );
      handleConfirmStatusChangeDialogClose();
      close();
    } catch (error) {
      console.log(error);
    }
  }

  const getNextStatus = (order) => {
    switch(order.status) {
      case ORDER_STATUS.PREPARING:
        if (order.forDelivery) {
          return ORDER_STATUS.FOR_DELIVERY;
        }

        if (!order.forDelivery && order.isPaid) {
          return ORDER_STATUS.COMPLETED;
        }

        return ORDER_STATUS.FOR_PAYMENT;
      case ORDER_STATUS.FOR_DELIVERY:
        if (order.isPaid) {
          return ORDER_STATUS.COMPLETED;
        }

        return ORDER_STATUS.FOR_PAYMENT;
      default:
        return null;
    }
  }

  const close = () => {
    setInvoiceUrl(null);
    onClose();
  };

  return (
    <FullScreenDialog
      title={`Order: ${selectedOrder && selectedOrder.code}`}
      open={open}
      onClose={close}
    >
      <Box sx={{pb: 8, pl: 2, pr: 2, flexGrow: 1}}>
        {selectedOrder && (
          <>
            <Box p={1} mt={1} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                { selectedOrder.status === ORDER_STATUS.PREPARING && <ShoppingCartIcon sx={{color: '#1976d2'}}/>}
                { selectedOrder.status === ORDER_STATUS.FOR_DELIVERY && <LocalShippingIcon sx={{color: '#1976d2'}}/>}
                { selectedOrder.status === ORDER_STATUS.FOR_PAYMENT && <AttachMoneyIcon sx={{color: '#1976d2'}} />}
                { selectedOrder.status === ORDER_STATUS.COMPLETED && <CheckCircleIcon sx={{color: 'green'}} />}
                { selectedOrder.status === ORDER_STATUS.CANCELLED && <CancelIcon sx={{color: 'red'}} />}
                <Typography>&nbsp;{selectedOrder.status}</Typography>
              </Box>
              
              <Link
                
                href={invoiceUrl}
                target="_blank"
                rel="noreferrer"
                variant="button"
                underline="none"
              >
                Show Invoice
              </Link>
            </Box>
            
            <Box p={1}>
              <>
                <Typography color="text.secondary" sx={{marginBottom: 1}}>Created on</Typography>
                <Typography sx={{marginBottom: 1}}>{formatDate(selectedOrder.createdAt)}</Typography>
              </>
              {selectedOrder.status === ORDER_STATUS.COMPLETED &&
                <>
                  <Typography color="text.secondary" sx={{marginBottom: 1}}>Completed on</Typography>
                  <Typography sx={{marginBottom: 1}}>{formatDate(selectedOrder.updatedAt)}</Typography>
                </>
              }
            </Box>

            <OrderSummary {...selectedOrder} />

            {getNextStatus(selectedOrder) && (
              <>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{mt: 2}}
                  onClick={handleConfirmStatusChangeDialogOpen}
                >
                  {`Update status to "${getNextStatus(selectedOrder)}"`}
                </Button>
                <Dialog
                  open={openConfirmStatusChangeDialog}
                  onClose={handleConfirmStatusChangeDialogClose}
                >
                  <DialogTitle>
                    {`Update order ${selectedOrder.code} status to "${getNextStatus(selectedOrder)}"`}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {`Are you sure you want to update order ${selectedOrder.code} status from "${selectedOrder.status}" to "${getNextStatus(selectedOrder)}"?`}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleConfirmStatusChangeDialogClose}>No</Button>
                    <Button onClick={() => confirmStatusChange(getNextStatus(selectedOrder))} autoFocus>
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}

            {![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(selectedOrder.status) && (
              <>
                <Button
                  fullWidth
                  variant="outlined"
                  color="success"
                  sx={{mt: 6}}
                  onClick={!selectedOrder.isPaid ? handlePaymentOrderDialogOpen : undefined}
                >
                  {selectedOrder.isPaid ?
                    (<><PaidIcon/>&nbsp;Payment Complete</>) :
                    (<><PaidIcon sx={{ color: '#ccc' }}/>&nbsp;Payment Received?</>)
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
                    <Button onClick={() => confirmPayment(selectedOrder)} autoFocus>
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
  );
}

export default ManageOrderPage;
