import * as React from 'react';
import { AccountCircle, Logout as LogoutIcon } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';

import { Box } from '@mui/material';
import { UserContext } from '../../contexts/UserContext';

const Logout = ({ setIsLoggedIn }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user, setUser } = React.useContext(UserContext);

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setAnchorEl(null);
    setIsLoggedIn(false);
  }

  if (!user) {
    return <></>
  }

  return (
    <Box>
      <Box onClick={(e) => setAnchorEl(e.currentTarget)}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        {user.username}
      </Box>
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
