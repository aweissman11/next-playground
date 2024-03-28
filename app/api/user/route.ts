import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import * as z from 'zod';

const userSchema = z.object({
  name: z.string(),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must have than 8 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = userSchema.parse(body);

    const existingUserByEmail = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: 'User with this email already exists' },
        { status: 409 },
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json({ user: rest }, { status: 201 });
  } catch (err) {
    console.error('err:', err);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}
