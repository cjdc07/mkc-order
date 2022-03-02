import * as React from 'react';
import ProductOrderTable from './ProductOrderTable';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { formatDate, formatCurrency } from '../../utils';

const OrderSummary = ({
  code,
  productOrders,
  customerName,
  customerEmail,
  customerContact,
  forDelivery,
  customerAddress,
  deliveryDate,
  paymentMethod,
  paymentDueDate,
  initialPayment,
}) => {
  return <Box>
    <Box p={1}>
      {code && (
        <>
          <Typography color="text.secondary" sx={{marginBottom: 1}}>Order Code</Typography>
          <Typography sx={{marginBottom: 1}}>{code}</Typography>
        </>
      )}
      <Typography color="text.secondary" sx={{marginBottom: 1}}>Customer Name</Typography>
      <Typography sx={{marginBottom: 1}}>{customerName}</Typography>
      {customerEmail && customerEmail !== '' && (
        <>
          <Typography color="text.secondary" sx={{marginBottom: 1}}>Customer Email</Typography>
          <Typography sx={{marginBottom: 1}}>{customerEmail}</Typography>
        </>
      )}
      {customerContact && customerContact !== '' && (
        <>
          <Typography color="text.secondary" sx={{marginBottom: 1}}>Customer Contact</Typography>
          <Typography sx={{marginBottom: 1}}>{customerContact}</Typography>
        </>
      )}
    </Box>
    {forDelivery &&
      <Box p={1}>
        <Typography color="text.secondary" sx={{marginBottom: 1}}>Delivery Date</Typography>
        <Typography sx={{marginBottom: 1}}>{formatDate(deliveryDate)}</Typography>
        <Typography color="text.secondary" sx={{marginBottom: 1}}>Delivery Address</Typography>
        <Typography sx={{marginBottom: 1}}>{customerAddress}</Typography>
      </Box>
    }
    <Box p={1}>
      <Typography color="text.secondary" sx={{marginBottom: 1}}>Payment Method</Typography>
      <Typography sx={{marginBottom: 1}}>{paymentMethod}</Typography>
      <Typography color="text.secondary" sx={{marginBottom: 1}}>Payment Due Date</Typography>
      <Typography sx={{marginBottom: 1}}>{formatDate(paymentDueDate)}</Typography>
      <Typography color="text.secondary" sx={{marginBottom: 1}}>Initial Payment</Typography>
      <Typography sx={{marginBottom: 1}}>{formatCurrency(initialPayment)}</Typography>
    </Box>
    <Box p={1}>
      <Typography color="text.secondary">Product Orders</Typography>
      <ProductOrderTable
        productOrders={productOrders}
      />
    </Box>
  </Box>
}

export default OrderSummary;
