import * as React from 'react';
import _ from 'lodash';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { 
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

import useRequest from '../../hooks/useRequest';
import ProductOrderTable from './ProductOrderTable';
import {formatToCurrency} from '../../utils'

const filterOptions = createFilterOptions({
  stringify: ({ code, name }) => `${code} ${name}`
});

const OrderInformationForm = ({productOrders, addToCart, removeProductOrder}) => {
  const { getList } = useRequest();
  const [autocompleteKey, setAutocompleteKey] = React.useState(_.uniqueId("acf_"))
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [productOrder, setProductOrder] = React.useState(null);
  const [openAutocomplete, setOpenAutocomplete] = React.useState(false);
  const [openProductOrderDialog, setOpenProductOrderDialog] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = openAutocomplete && options.length === 0;

  React.useEffect(() => {
    if (!loading) {
      return undefined;
    }

    const fetchList = async () => {  
      try {
        const { data } = await getList('products', {
          pagination: {
            page: 0, // TODO
            perPage: 10, // TODO
          },
          sort: {
            field: 'id',
            order: 'ASC',
          },
          filter: {},
        });

        setOptions(data);
      } catch (error) {
        if (error.statusCode !== 401) {
          // TODO:
        }
      }
    }

    fetchList();
  }, [loading]);

  React.useEffect(() => {
    if (!openAutocomplete) {
      setOptions([]);
    }
  }, [openAutocomplete]);

  const handleChangeAutocomplete = (_, value) => {
    setSelectedProduct(value);
    setProductOrder({
      id: value.id,
      code: value.code,
      name: value.name,
      price: value.srp1,
      quantity: 1,
      total: 1 * value.srp1,
      data: value,
    })
    handleOpenProductOrderDialog()
  };

  const handleOpenAutocomplete = () => setOpenAutocomplete(true);
  const handleCloseAutocomplete = () => setOpenAutocomplete(false);
  const handleOpenProductOrderDialog = () => setOpenProductOrderDialog(true);
  const handlCloseProductOrderDialog = () => {
    setOpenProductOrderDialog(false);
    setSelectedProduct(null);
    setAutocompleteKey(_.uniqueId("acf_"));
  };

  const setQuantity = (e) => {
    const quantity = +e.target.value;
    const total = quantity * productOrder.price
    setProductOrder({ ...productOrder, quantity, total });
  };

  const setPrice = (e) => {
    const price = +e.target.value;
    const total = price * productOrder.quantity
    setProductOrder({ ...productOrder, price, total });
  };

  const editProductOrder = (productOrder) => {
    setSelectedProduct(productOrder.data);
    setProductOrder(productOrder)
    handleOpenProductOrderDialog();
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
    }}>
      <Autocomplete
        key={autocompleteKey}
        fullWidth
        open={openAutocomplete}
        onOpen={handleOpenAutocomplete}
        onClose={handleCloseAutocomplete}
        onChange={handleChangeAutocomplete}
        filterOptions={filterOptions}
        isOptionEqualToValue={(option, value) => option.code === value.name || option.name === value.name}
        getOptionLabel={({ code, name }) => `(${code}) ${name}`}
        options={options}
        loading={loading}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            [{option.code}] {option.name}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Enter Product Code or Name"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
      <Box sx={{ height: '56vh' }}>
        <ProductOrderTable
          productOrders={productOrders}
          editProductOrder={editProductOrder}
          removeProductOrder={removeProductOrder}
        />
      </Box>
      {openProductOrderDialog && selectedProduct &&
        <Dialog
          open={openProductOrderDialog}
          onClose={handlCloseProductOrderDialog}
        >
          <DialogTitle>{`[${selectedProduct.code}] ${selectedProduct.name}`}</DialogTitle>
          <DialogContent>
            <FormControl>
              <FormLabel>Set Price</FormLabel>
              <RadioGroup
                value={productOrder.price}
                onChange={setPrice}
              >
                <FormControlLabel
                  value={selectedProduct.srp1}
                  control={<Radio />}
                  label={`${formatToCurrency(selectedProduct.srp1)} (SRP1)`}
                />
                <FormControlLabel
                  value={selectedProduct.srp2}
                  control={<Radio />}
                  label={`${formatToCurrency(selectedProduct.srp2)} (SRP2)`}
                />
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              value={productOrder.quantity}
              margin="normal"
              label="Quantity"
              type="number"
              variant="outlined"
              helperText={`Max quantity: ${selectedProduct.quantity}`}
              onChange={setQuantity}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handlCloseProductOrderDialog}>Cancel</Button>
            <Button
              onClick={() => {
                addToCart(productOrder);
                handlCloseProductOrderDialog();
              }}>
              Add to Cart
            </Button>
          </DialogActions>
        </Dialog>
      }
    </Box>
  );
}

export default OrderInformationForm;
