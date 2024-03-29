'use server'

import { getAuthServerSession } from '@/src/lib/auth';
import { db } from '@/src/lib/db';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

export async function createPost(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const session = await getAuthServerSession();

  const schema = z.object({
    post: z.string().min(1),
  });
  const parse = schema.safeParse({
    post: formData.get('post'),
  });

  if (!session) {
    return { message: 'Must be logged in' };
  }

  if (!parse.success) {
    return { message: 'Failed to create post' };
  }

  const data = parse.data;

  try {
    await db.post.create({
      data: {
        name: data.post,
        createdById: session.user.id,
      },
    });

    revalidatePath('/server');
    return { message: `Added post ${data.post}` };
  } catch (e) {
    return { message: 'Failed to create post' };
  }
}
