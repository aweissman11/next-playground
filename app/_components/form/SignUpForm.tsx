'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Snackbar } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const FormSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
    confirmPassword: z.string().min(1, 'Must confirm password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export default function SignUpForm() {
  const router = useRouter();
  const [snackOpen, setSnackOpen] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application-json',
      },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
      }),
    });

    if (response.ok) {
      router.push('/sign-in');
    } else {
      setSnackOpen(true);
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

  return (
    <Box className="flex flex-col justify-center items-center w-full h-max min-h-full my-auto">
      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
        >
          Oops! Something went wrong
        </Alert>
      </Snackbar>
      <Box
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        className="max-w-64 flex flex-col items-center justify-between gap-4"
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              variant="outlined"
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              fullWidth
              margin="normal"
            />
          )}
        />
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
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Confirm Password"
              type="password"
              variant="outlined"
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Button type="submit" variant="outlined" color="primary">
          Sign Up
        </Button>
        <p className="text-center text-sm text-gray-600 mt-2">
          If you already have an account, please&nbsp;
          <Link className="text-blue-500 hover:underline" href="/sign-in">
            Sign in
          </Link>
        </p>
      </Box>
    </Box>
  );
}
