'use client';

import { Button } from '@mui/material';
import { signOut } from 'next-auth/react';

const SignOutButton = () => {
  return (
    <Button
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/sign-in`,
        })
      }
      color="inherit"
    >
      Sign out
    </Button>
  );
};

export default SignOutButton;
