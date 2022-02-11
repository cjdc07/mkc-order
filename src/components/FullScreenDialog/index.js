import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Dialog, IconButton, Slide, Toolbar, Typography } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenDialog = ({title, open, onClose, children}) => (
  <Dialog
    fullScreen
    open={open}
    onClose={onClose}
    TransitionComponent={Transition}
  >
    <AppBar sx={{ position: 'fixed' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <Typography pl={1}>{title}</Typography>
      </Toolbar>
    </AppBar>
    <Toolbar />
    {children}
  </Dialog>
);

export default FullScreenDialog;
