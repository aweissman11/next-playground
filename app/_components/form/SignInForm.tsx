'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, CircularProgress, Snackbar } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const FormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must have than 8 characters'),
});

export default function SignInForm() {
  const router = useRouter();
  const [snackOpen, setSnackOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signInData = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInData?.status !== 200) {
      setSnackOpen(true);
    } else {
      router.refresh();
      router.push('/server');
    }
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackOpen(false);
  };

  const loginWithGitHub = async () => {
    setIsLoading(true);
    try {
      await signIn('github', {
        callbackUrl: `${window.location.origin}/server`,
      });
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="flex flex-col justify-center items-center w-full h-max min-h-full my-auto">
      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" variant="filled">
          Oops! Something went wrong
        </Alert>
      </Snackbar>
      <Box
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        className="max-w-64 flex flex-col items-center justify-between gap-4"
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              variant="outlined"
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              variant="outlined"
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Button type="submit" variant="outlined" color="primary">
          Sign In
        </Button>
        <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
          or
        </div>
        <Button
          variant="outlined"
          color="primary"
          onClick={loginWithGitHub}
          disabled={isLoading}
          startIcon={
            isLoading ? <CircularProgress color="inherit" size="20" /> : null
          }
        >
          Sign in with GitHub
        </Button>
        <p className="text-center text-sm text-gray-600 mt-2">
          If you don&apos;t have an account, please&nbsp;
          <Link className="text-blue-500 hover:underline" href="/sign-up">
            Sign up
          </Link>
        </p>
      </Box>
    </Box>
  );
}
