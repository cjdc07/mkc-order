import * as React from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import FullScreenDialog from "../../components/FullScreenDialog";
import OrderSummary from '../OrderForm/OrderSummary';
import useRequest from '../../hooks/useRequest';
import { ORDER_STATUS } from '../../constants';

const ManageOrderPage = ({open, onClose, selectedOrder}) => {
  const { update } = useRequest();
  const [openCancelOrderDialog, setOpenCancelOrderDialog] = React.useState(false);
  const [openPaymentOrderDialog, setOpenPaymentOrderDialog] = React.useState(false);

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
      onClose();
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
      onClose();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <FullScreenDialog
      title={`Order: ${selectedOrder && selectedOrder.code}`}
      open={open}
      onClose={onClose}
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
  );
}

export default ManageOrderPage;
