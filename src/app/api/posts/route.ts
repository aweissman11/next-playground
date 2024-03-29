import { getAuthServerSession } from '@/src/lib/auth';
import { db } from '@/src/lib/db';
import { NextResponse } from 'next/server';
import * as z from 'zod';

export const GET = async () => {
  const session = await getAuthServerSession();
  if (!session) {
    return NextResponse.json(
      { message: 'Must be logged in to GET posts' },
      { status: 403 },
    );
  }

  const data = await db.post.findMany({
    where: {
      createdById: session?.user.id,
    },
    orderBy: [
      {
        updatedAt: 'desc',
      },
    ],
  });

  return NextResponse.json(
    {
      data,
    },
    { status: 200 },
  );
};

export const DELETE = async (req: Request) => {
  const session = await getAuthServerSession();
  if (!session) {
    return NextResponse.json(
      { message: 'Must be logged in to DELETE posts' },
      { status: 403 },
    );
  }

  const { id, name } = await req.json();

  try {
    await db.post.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(
      { message: `Deleted post: ${name}` },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: `Could not DELETE post: ${name}` },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: Request) => {
  const session = await getAuthServerSession();
  if (!session) {
    return NextResponse.json(
      { message: 'Must be logged in to PATCH posts' },
      { status: 403 },
    );
  }

  const { post, action } = await req.json();

  try {
    if (action === 'star') {
      await db.post.update({
        where: {
          id: post.id,
        },
        data: {
          starred: !Boolean(post.starred),
        },
      });
      return NextResponse.json(
        { message: `Starred post: ${post.name}` },
        { status: 200 },
      );
    }
  } catch (err) {
    return NextResponse.json(
      { message: `Could not ${action} post: ${post.name}` },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  const session = await getAuthServerSession();
  if (!session) {
    return NextResponse.json(
      { message: 'Must be logged in to POST posts' },
      { status: 403 },
    );
  }
  const formData = await req.formData();

  const schema = z.object({
    post: z.string().min(1),
  });
  const parse = schema.safeParse({
    post: formData.get('post'),
  });

  if (!parse.success) {
    return NextResponse.json(
      { message: 'Failed to create post' },
      { status: 400 },
    );
  }

  const data = parse.data;

  try {
    const newPost = await db.post.create({
      data: {
        name: data.post,
        createdById: session.user.id,
      },
    });
    return NextResponse.json(
      { message: `Created post: ${data.post}`, data: newPost },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: `Could not create post: ${data.post}` },
      { status: 500 },
    );
  }
};
