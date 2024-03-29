'use client';

import { starPost } from '@/src/app/actions/starPost';
import { Star, StarBorder } from '@mui/icons-material';
import { ListItemButton, ListItemIcon } from '@mui/material';
import { useFormState, useFormStatus } from 'react-dom';

const initialState = {
  message: '',
};

function StarButton({ starred }: { starred: boolean }) {
  const { pending } = useFormStatus();

  return (
    <ListItemButton component="button" type="submit" disabled={pending}>
      <ListItemIcon>{starred ? <Star /> : <StarBorder />}</ListItemIcon>
    </ListItemButton>
  );
}

export function StarForm({
  id,
  post,
  starred,
}: {
  id: string;
  post: string;
  starred: boolean;
}) {
  const [state, formAction] = useFormState(starPost, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="post" value={post} />
      <input type="hidden" name="starred" value={starred ? 'true' : ''} />
      <StarButton starred={starred} />
      <p aria-live="polite" className="sr-only" role="status">
        {state?.message}
      </p>
    </form>
  );
}
