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
      error={!!formErrors['name']}
      helperText={formErrors['name']}
      margin="normal"
      id="name"
      label="Customer Name"
      type="text"
      variant="outlined"
      onChange={inputChange}
      value={formValues['name']}
    />
    <TextField
      required
      fullWidth
      error={!!formErrors['email']}
      helperText={formErrors['email']}
      margin="normal"
      id="email"
      label="Customer Email (Optional)"
      type="text"
      variant="outlined"
      onChange={inputChange}
      value={formValues['email']}
    />
    <TextField
      required
      fullWidth
      error={!!formErrors['contact']}
      helperText={formErrors['contact']}
      margin="normal"
      id="contact"
      label="Customer Contact Number (Optional)"
      type="text"
      variant="outlined"
      onChange={inputChange}
      value={formValues['contact']}
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
          error={!!formErrors['address']}
          helperText={formErrors['address']}
          margin="normal"
          id="address"
          label="Customer Address"
          rows={4}
          variant="outlined"
          onChange={inputChange}
          value={formValues['address']}
        />
        <DatePicker
          label="Delivery Date"
          value={formValues['deliveryDate']}
          onChange={(value) => inputChange(value, 'deliveryDate')}
          renderInput={(params) =>
            <TextField
              required
              fullWidth
              error={!!formErrors['address']}
              helperText={formErrors['address']}
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
