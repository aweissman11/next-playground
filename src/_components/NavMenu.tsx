'use client';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { MouseEvent, useState } from 'react';
import Link from 'next/link';

export default function NavMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="post-menu-button"
        aria-controls={open ? 'post-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ color: 'white' }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="post-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'post-menu-button',
        }}
      >
        <MenuItem onClick={handleClose} component={Link} href="/server">
          Server
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} href="/client">
          Client
        </MenuItem>
      </Menu>
    </div>
  );
}
