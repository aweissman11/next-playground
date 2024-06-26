'use client';

import { deletePost } from '@/src/actions/deletePost';
import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useFormState, useFormStatus } from 'react-dom';

const initialState = {
  message: '',
};

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <IconButton type="submit" disabled={pending}>
      <Delete />
    </IconButton>
  );
}

export function DeleteForm({ id, post }: { id: string; post: string }) {
  const [state, formAction] = useFormState(deletePost, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="post" value={post} />
      <DeleteButton />
      <p aria-live="polite" className="sr-only" role="status">
        {state?.message}
      </p>
    </form>
  );
}
