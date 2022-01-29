import * as React from 'react';

import { FormControlLabel, Switch, TextField } from '@mui/material';
import { DatePicker } from '@mui/lab';

const CustomerInformationForm = ({formErrors, inputChange, formValues}) => {
  const [forDelivery, setForDelivery] = React.useState(formValues['forDelivery']);

  return <>
    <TextField
      required
      autoFocus
      fullWidth
      error={!!formErrors['customerName']}
      helperText={formErrors['customerName']}
      margin="normal"
      id="customerName"
      label="Customer Name"
      type="text"
      variant="outlined"
      onChange={inputChange}
      value={formValues['customerName']}
    />
    <TextField
      required
      fullWidth
      error={!!formErrors['customerEmail']}
      helperText={formErrors['customerEmail']}
      margin="normal"
      id="customerEmail"
      label="Customer Email (Optional)"
      type="text"
      variant="outlined"
      onChange={inputChange}
      value={formValues['customerEmail']}
    />
    <TextField
      required
      fullWidth
      error={!!formErrors['customerContact']}
      helperText={formErrors['customerContact']}
      margin="normal"
      id="customerContact"
      label="Customer Contact Number (Optional)"
      type="text"
      variant="outlined"
      onChange={inputChange}
      value={formValues['customerContact']}
    />
    <FormControlLabel
      checked={forDelivery}
      control={
        <Switch
          id="forDelivery"
          onChange={(e) => {
            inputChange(e, 'checkbox');
            setForDelivery(!forDelivery);
          }}
        />
      }
      label="For Delivery"
    />
    {forDelivery &&
      <>
        <TextField
          required
          multiline
          fullWidth
          error={!!formErrors['customerAddress']}
          helperText={formErrors['customerAddress']}
          margin="normal"
          id="customerAddress"
          label="Customer Address"
          rows={4}
          variant="outlined"
          onChange={inputChange}
          value={formValues['customerAddress']}
        />
        <DatePicker
          label="Delivery Date"
          value={formValues['deliveryDate']}
          onChange={(value) => inputChange(value, 'deliveryDate')}
          renderInput={(params) =>
            <TextField
              required
              fullWidth
              error={!!formErrors['deliveryDate']}
              helperText={formErrors['deliveryDate']}
              margin="normal"
              variant="outlined"
              {...params}
            />
          }
        />
      </>
    }
  </>
}

export default CustomerInformationForm;
