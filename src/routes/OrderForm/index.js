import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CustomerInformationForm from './CustomerInformationForm';
import DateAdapter from '@mui/lab/AdapterDateFns';
import OrderInformationForm from './OrderInformationForm';
import OrderSummary from './OrderSummary';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Dialog,
  IconButton,
  MobileStepper,
  Slide,
  Snackbar,
  Toolbar,
  Typography,
  useTheme
} from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/lab';

import useOrderFormState from '../../hooks/useOrderFormState';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OrderForm = ({ open, onClose }) => {
  const theme = useTheme();
  const {
    formErrors,
    setFormErrors,
    formValues,
    inputChange,
    productOrders,
    addToCart,
    removeProductOrder,
    create,
    clearFields,
  } = useOrderFormState();
  const [activeStep, setActiveStep] = React.useState(0);
  const [openErrorSnackbar, setOpenErrorSnackbar] = React.useState(false);
  const [errorSnackbarMessage, setErrorSnackbarMessage] = React.useState(null);

  const steps = [
    {
      label: 'Enter Customer Information',
      component: 
        <CustomerInformationForm
          formErrors={formErrors}
          inputChange={inputChange}
          formValues={formValues}
        />,
    },
    {
      label: 'Enter Order Information',
      component: 
        <OrderInformationForm 
          productOrders={productOrders}
          addToCart={addToCart}
          removeProductOrder={removeProductOrder}
        />,
    },
    {
      label: 'Order Summary',
      component:
        <OrderSummary
          productOrders={productOrders}
          customerName={formValues.customerName}
          customerEmail={formValues.customerEmail}
          customerContact={formValues.customerContact}
          customerAddress={formValues.customerAddress}
          forDelivery={formValues.forDelivery}
          deliveryDate={formValues.deliveryDate}
        />
    },
  ];

  const maxSteps = steps.length;

  const handleNext = async () => {
    if (activeStep === maxSteps - 1) {
      try {
        const payload = {
          customerName: formValues.customerName,
          customerEmail: formValues.customerEmail,
          customerContact: formValues.customerContact,
          customerAddress: formValues.customerAddress,
          forDelivery: formValues.forDelivery,
          deliveryDate: formValues.deliveryDate,
          productOrders: formValues.productOrders.map(
            ({ id, price, quantity}) => ({ productId: id, price, quantity})
          ),
        }

        await create('orders', payload);

        onClose();
        clearFields();
        setActiveStep(0);
      } catch (error) {
        console.log(error);
      }

      return;
    }

    if (activeStep === 0) {
      if (!formValues.customerName || formValues.customerName === '') {
        setFormErrors({...formErrors, customerName: 'This field is required.'});
        return;
      }

      if (formValues.forDelivery && (!formValues.customerAddress || formValues.customerAddress === '')) {
        setFormErrors({...formErrors, customerAddress: 'This field is required.'});
        return;
      }
    } else if (activeStep === 1) {
      setErrorSnackbarMessage(null);

      if (!formValues.productOrders || formValues.productOrders.length < 1) {
        setErrorSnackbarMessage('No Added Products!')
        handleOpenErrorSnackbar()
        return;
      }
    }

    if (Object.values(formErrors).length < 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleOpenErrorSnackbar = () => setOpenErrorSnackbar(true);
  const handleCloseErrorSnackbar = () => setOpenErrorSnackbar(false);

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
              <Typography pl={1}>{steps[activeStep].label}</Typography>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          paddingTop: 2,
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <Box sx={{pl: 2, pr: 2, flexGrow: 1}}>
              {steps[activeStep].component}
            </Box>
          </LocalizationProvider>
          <MobileStepper
            variant="progress"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
              >
                {activeStep === maxSteps - 1 ? 'Finish' : 'Next'}
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
            }
          />
        </Box>
      </Dialog>

      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseErrorSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseErrorSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorSnackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default OrderForm;
