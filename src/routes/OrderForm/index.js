import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CustomerInformationForm from './CustomerInformationForm';
import DateAdapter from '@mui/lab/AdapterDateFns';
import OrderInformationForm from './OrderInformationForm';
import OrderSummary from './OrderSummary';
import { AppBar, Box, Button, Dialog, IconButton, MobileStepper, Paper, Slide, Toolbar, Typography, useTheme } from '@mui/material';
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
    formValues,
    inputChange,
    productOrders,
    addToCart,
    removeProductOrder,
  } = useOrderFormState();
  const [activeStep, setActiveStep] = React.useState(0);

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
      component: <OrderSummary />
    },
  ];

  const maxSteps = steps.length;

  const handleNext = () => {
    console.log(formValues);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
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
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <Paper
          square
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyItems: 'center',
            height: 50,
            pl: 2,
            bgcolor: 'background.default',
          }}
        >
          <Typography>{steps[activeStep].label}</Typography>
        </Paper>
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
              disabled={activeStep === maxSteps - 1}
            >
              Next
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
  );
}

export default OrderForm;
