'use client';

import { createPost } from '@/src/app/actions/createPost';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Snackbar, TextField } from '@mui/material';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

const initialState = {
  message: '',
};

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} variant="outlined">
      Add
    </Button>
  );
}

const FormSchema = z.object({
  post: z.string().min(1, 'Post is required'),
});

export function ServerAddForm() {
  const [formState] = useFormState(createPost, initialState);
  const [errorSnackOpen, setErrorSnackOpen] = useState(false);

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      post: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const formData = new FormData();
    // Assuming 'post' is the key for your form data
    formData.append('post', data.post);

    // Call the server action here only if the form is valid
    await createPost(
      initialState, // You might want to update this according to where you get the prevState from
      formData,
    );

    // Optionally reset the form
    reset();
  };

  // Optional: handle form submission errors
  const onError = (errors: any) => {
    setErrorSnackOpen(true);
  };

  const handleErrorSnackClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setErrorSnackOpen(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex flex-col items-center max-w-64 mx-auto"
    >
      <Snackbar
        open={errorSnackOpen}
        autoHideDuration={6000}
        onClose={handleErrorSnackClose}
      >
        <Alert
          onClose={handleErrorSnackClose}
          severity="error"
          variant="filled"
        >
          Oops! Something went wrong
        </Alert>
      </Snackbar>
      <Controller
        name="post"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Post"
            variant="outlined"
            error={Boolean(errors.post)}
            helperText={errors.post?.message}
            fullWidth
            margin="normal"
          />
        )}
      />

      <SubmitButton disabled={!!errors.post} />
      <p aria-live="polite" className="sr-only" role="status">
        {formState?.message}
      </p>
    </form>
  );
}
