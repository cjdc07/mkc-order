import * as React from 'react';
import { AccountCircle, Logout as LogoutIcon } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';

import { Box } from '@mui/material';
import { UserContext } from '../../contexts/UserContext';

const Logout = ({ setIsLoggedIn }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { setUser } = React.useContext(UserContext);

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setAnchorEl(null);
    setIsLoggedIn(false);
  }

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={logout}><LogoutIcon />&nbsp;Logout</MenuItem>
      </Menu>
    </Box>
  )
}

export default Logout;
