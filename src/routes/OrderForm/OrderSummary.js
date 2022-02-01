import * as React from 'react';
import ProductOrderTable from './ProductOrderTable';
import { Box } from '@mui/system';
import { TextField, Typography } from '@mui/material';

const OrderSummary = ({
  productOrders,
  customerName,
  customerEmail,
  customerContact,
  forDelivery,
  customerAddress,
  deliveryDate,
}) => {
  return <Box>
    <Box p={1}>
      <Typography color="text.secondary" sx={{marginBottom: 1}}>Customer Information</Typography>
      <TextField
        fullWidth
        margin="dense"
        id="customer-name-read-only"
        label="Customer Name"
        defaultValue={customerName}
        InputProps={{
          readOnly: true,
        }}
      />
      {customerEmail && customerEmail !== '' && (
        <TextField
          fullWidth
          margin="dense"
          id="customer-email-read-only"
          label="Customer Email"
          defaultValue={customerEmail}
          InputProps={{
            readOnly: true,
          }}
        />
      )}
      {customerContact && customerContact !== '' && (
        <TextField
          fullWidth
          margin="dense"
          id="customer-contact-read-only"
          label="Customer Contact"
          defaultValue={customerContact}
          InputProps={{
            readOnly: true,
          }}
        />
      )}
    </Box>
    {forDelivery &&
      <Box p={1}>
        <Typography color="text.secondary" sx={{marginBottom: 1}}>Delivery Information</Typography>
        <TextField
          fullWidth
          margin="dense"
          id="delivery-date-read-only"
          label="Delivery Date"
          defaultValue={new Date(deliveryDate).toLocaleString("en", {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          })}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          fullWidth
          multiline
          margin="dense"
          id="customer-address-read-only"
          label="Customer Address"
          rows={4}
          defaultValue={customerAddress}
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>
    }
    <Box p={1}>
      <Typography color="text.secondary">Product Orders</Typography>
      <ProductOrderTable
        productOrders={productOrders}
      />
    </Box>
  </Box>
}

export default OrderSummary;
