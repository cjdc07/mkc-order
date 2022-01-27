import * as React from 'react';
import _ from 'lodash';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import RemoveIcon from '@mui/icons-material/RemoveCircleOutline';
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
  IconButton,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import useRequest from '../../hooks/useRequest';

const filterOptions = createFilterOptions({
  stringify: ({ code, name }) => `${code} ${name}`
});

const formatToCurrency = (value) => new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
}).format(value)

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
      quantity: value.quantity,
      total: value.quantity * value.srp1,
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

  const totalProductOrderPrice = () => {
    return productOrders.reduce((acc, { total }) => {
      acc += total;
      return acc; 
    }, 0);
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
      <TableContainer sx={{ height: '56vh' }}>
        <Table stickyHeader size="small" sx={{ width: '100%', paddingTop: 2}}>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productOrders && productOrders.length > 0 ?
              <>
                {productOrders.map((productOrder) => (
                  <TableRow
                    key={productOrder.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    onClick={() => editProductOrder(productOrder)}
                  >
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={(e) => removeProductOrder(e, productOrder.id)}
                        aria-label="close"
                      >
                        <RemoveIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>{productOrder.code}</TableCell>
                    <TableCell>{productOrder.name}</TableCell>
                    <TableCell>{formatToCurrency(productOrder.price)}</TableCell>
                    <TableCell>{productOrder.quantity}</TableCell>
                    <TableCell align="right">{formatToCurrency(productOrder.total)}</TableCell>
                  </TableRow>
                ))}
              </>:
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <p>No products added yet</p>
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={6}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell rowSpan={2} colSpan={3}/>
            </TableRow>
            <TableRow sx={{height: 56 }}>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell align="right">
                {formatToCurrency(totalProductOrderPrice())}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
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
