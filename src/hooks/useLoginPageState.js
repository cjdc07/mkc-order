import * as React from 'react';
import useAuth from './useAuth';

const defaultFormValues = {
  username: '',
  password: '',
};

const useLoginPageState = () => {
  const { login } = useAuth();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  const [formValues, setFormValues] = React.useState(defaultFormValues);
  const [formErrors, setFormErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const inputChange = (e) => {
    let {id, value} = e.target;

    if (!value || value === '') {
      setFormErrors({
        ...formErrors,
        [id]: 'This field is required.'
      });
    } else {
      setFormErrors({...formErrors, [id]: null});
    }

    setFormValues({ ...formValues, [id]: value });
  }

  const onLogin = async () => {
    setLoading(true);

    Object.keys(formValues).forEach((key) => {
      if (typeof formValues[key] === 'string') {
        formValues[key] = formValues[key].trim();
      }
    });

    const errors = Object.keys(formValues).reduce((acc, key) => {
      if (formValues[key] === '') {
        acc[key] = 'This field is required.';
      }

      return acc;
    }, {});

    if (Object.keys(errors).length > 0) {
      setFormErrors({...formErrors, ...errors});
      setLoading(false);
      return;
    }

    try {
      const user = await login(formValues);
      return user;
    } catch (error) {
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  }

  return {
    formErrors,
    openSnackbar,
    snackbarMessage,
    handleSnackbarClose,
    inputChange,
    onLogin,
    loading,
  }
}

export default useLoginPageState;
