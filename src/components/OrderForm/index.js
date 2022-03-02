import * as React from 'react';
import CustomerInformationForm from './CustomerInformationForm';
import DateAdapter from '@mui/lab/AdapterDateFns';
import OrderInformationForm from './OrderInformationForm';
import OrderSummary from './OrderSummary';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MobileStepper,
  Snackbar,
  useTheme
} from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/lab';

import FullScreenDialog from '../FullScreenDialog';
import PaymentInformationForm from './PaymentInformationForm';
import useOrderFormState from '../../hooks/useOrderFormState';
import { UserContext } from '../../contexts/UserContext';

const OrderForm = ({ open, onClose }) => {
  const theme = useTheme();
  const {
    formErrors,
    setFormErrors,
    formValues,
    setFormValues,
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
  const [loading, setLoading] = React.useState(false);
  const { handleAuthCheck } = React.useContext(UserContext);


  React.useEffect(() => {
    handleAuthCheck();
  }, [activeStep]);

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
      label: 'Enter Payment Information',
      component: 
        <PaymentInformationForm
          formErrors={formErrors}
          inputChange={inputChange}
          formValues={formValues}
        />,
    },
    {
      label: 'Order Summary',
      component:
        <OrderSummary
          productOrders={productOrders}
          {...formValues}
        />
    },
  ];

  const maxSteps = steps.length;

  const handleNext = async () => {
    if (activeStep === maxSteps - 1) {
      setLoading(true);

      try {
        const payload = {
          customerName: formValues.customerName,
          customerEmail: formValues.customerEmail,
          customerContact: formValues.customerContact,
          customerAddress: formValues.customerAddress,
          forDelivery: formValues.forDelivery,
          deliveryDate: formValues.forDelivery ? formValues.deliveryDate : null,
          productOrders: formValues.productOrders,
          paymentMethod: formValues.paymentMethod,
          paymentDueDate: formValues.paymentDueDate,
          initialPayment: formValues.initialPayment,
        }

        await create('orders', payload);

        onClose();
        clearFields();
        setActiveStep(0);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
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
    if (activeStep === 2) {
      // Reset initalPayment and initialPayment error when going back to OrderInfo Page
      delete formErrors['initialPayment'];
      setFormErrors({...formErrors});
      setFormValues({...formValues, initialPayment: 0})
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleOpenErrorSnackbar = () => setOpenErrorSnackbar(true);
  const handleCloseErrorSnackbar = () => setOpenErrorSnackbar(false);

  return (
    <>
      <FullScreenDialog title={steps[activeStep].label} open={open} onClose={onClose}>
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
            nextButton={ loading ? (
                <Box pr={2}>
                  <CircularProgress size={20} />
                </Box>
              ) : (
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
              )
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
      </FullScreenDialog>

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
