'use client';

import { createPost } from '@/app/actions/createPost';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField } from '@mui/material';
import { useFormState, useFormStatus } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

const initialState = {
  message: '',
};

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} variant='outlined'>
      Add
    </Button>
  );
}

const FormSchema = z.object({
  post: z.string().min(1, 'Post is required'),
});

export function ServerAddForm() {
  const [state, formAction] = useFormState(createPost, initialState);
  const {
    control,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onBlur',
    defaultValues: {
      post: '',
    },
  });

  return (
    <form
      action={formAction}
      className="flex flex-col items-center max-w-64 mx-auto"
      onSubmit={() => reset()}
    >
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
        {state?.message}
      </p>
    </form>
  );
}
