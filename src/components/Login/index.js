import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';

import ErrorSnackbar from '../ErrorSnackbar';
import useLoginPageState from '../../hooks/useLoginPageState';
import { UserContext } from '../../contexts/UserContext';
import { AUTH_STATUS } from '../../constants';

const Login = ({setIsLoggedIn}) => {
  const {
    formErrors,
    inputChange,
    onLogin,
    loading,
    openSnackbar,
    snackbarMessage,
    handleSnackbarClose,
  } = useLoginPageState();

  const { user, setUser, authStatus } = React.useContext(UserContext);

  React.useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    }
  });

  if (authStatus === AUTH_STATUS.CHECKING) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom component="div">
          MKC Order
        </Typography>
        <TextField
          required
          autoFocus
          error={!!formErrors['username']}
          helperText={formErrors['username']}
          margin="normal"
          id="username"
          label="Username"
          type="text"
          variant="outlined"
          style={{ width: '320px' }}
          onChange={inputChange}
        />
        <TextField
          required
          error={!!formErrors['password']}
          helperText={formErrors['password']}
          margin="normal"
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          style={{ width: '320px' }}
          onChange={inputChange}
        />
        {loading ? (
          <LoadingButton
            loading={true}
            style={{ width: '320px', marginTop: '16px' }}
          />
        ) : (
          <Button
            startIcon={<LoginIcon />}
            variant="contained"
            style={{ width: '320px', marginTop: '16px' }}
            onClick={async () => {
              const response = await onLogin();
              if (response && response.user && response.access_token) {
                setUser(response.user);
                localStorage.setItem('access_token', response.access_token);
              }
            }}
          >
            Login
          </Button>
        )}
      </Box>
      <ErrorSnackbar
        open={openSnackbar}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
}

export default Login;
