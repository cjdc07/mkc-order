import * as React from 'react';

import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DatePicker } from '@mui/lab';
import { formatCurrency } from '../../utils';

const PaymentInformationForm = ({formErrors, inputChange, formValues, total}) => {
  return <>
    <FormControl fullWidth>
      <InputLabel id="payment-method-label">Payment Method</InputLabel>
      <Select
        id="paymentMethod"
        labelId="payment-method-label"
        value={formValues['paymentMethod']}
        label="Payment Method"
        onChange={(e) => inputChange(e, 'paymentMethod')}
      >
        <MenuItem value={'Cash'}>Cash</MenuItem>
        <MenuItem value={'GCash'}>GCash</MenuItem>
        <MenuItem value={'Bank Transfer'}>Bank Transfer</MenuItem>
      </Select>
    </FormControl>
    <DatePicker
      label="Payment Due Date"
      value={formValues['paymentDueDate']}
      onChange={(value) => inputChange(value, 'paymentDueDate')}
      renderInput={(params) =>
        <TextField
          required
          fullWidth
          error={!!formErrors['paymentDueDate']}
          helperText={formErrors['paymentDueDate']}
          margin="normal"
          variant="outlined"
          {...params}
        />
      }
    />
    <TextField
      fullWidth
      id="initialPayment"
      value={formValues['initialPayment']}
      margin="normal"
      label="Initial Payment"
      type="number"
      variant="outlined"
      error={!!formErrors['initialPayment']}
      helperText={
        formErrors['initialPayment'] ?
          formErrors['initialPayment'] :
          `Total amount due: ${formatCurrency(total)}`
      }
      onChange={inputChange}
    />
  </>
}

export default PaymentInformationForm;
