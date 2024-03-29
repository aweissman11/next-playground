import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import SignOutButton from './SignOutButton';
import { getAuthServerSession } from '@/lib/auth';
import { AddCircleRounded } from '@mui/icons-material';

async function NavBar() {
  const session = await getAuthServerSession();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography component={Link} href="/" variant="h6" sx={{ flexGrow: 1 }}>
          Playground
        </Typography>
        {session ? (
          <SignOutButton />
        ) : (
          <Button component={Link} color="inherit" href="/sign-in">
            Sign In
          </Button>
        )}
        <Link href="/todos">
          <AddCircleRounded />
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
