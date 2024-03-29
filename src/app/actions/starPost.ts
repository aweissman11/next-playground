'use server';

import { getAuthServerSession } from '@/src/lib/auth';
import { db } from '@/src/lib/db';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

export async function starPost(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const session = await getAuthServerSession();

  if (!session) {
    return { message: 'Must be logged in to delete posts' };
  }

  const schema = z.object({
    id: z.string().min(1),
    post: z.string().min(1),
    starred: z.string(),
  });
  const data = schema.parse({
    id: formData.get('id'),
    post: formData.get('post'),
    starred: formData.get('starred'),
  });

  try {
    await db.post.update({
      data: {
        starred: !Boolean(data.starred),
      },
      where: {
        id: data.id,
      },
    });

    revalidatePath('/');
    return { message: `Deleted post ${data.post}` };
  } catch (e) {
    return { message: 'Failed to delete post' };
  }
}
