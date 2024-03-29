'use client';

import ClientPost from '@/src/_components/ClientPost';
import UserCard from '@/src/_components/UserCard';
import { ClientAddForm } from '@/src/_components/form/ClientAddForm';
import { Post } from '@/src/types/post';
import { List } from '@mui/material';
// Remember you must use an AuthProvider for
// client components to useSession
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClientPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/client');
    },
  });

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const getPosts = async () => {
      if (!session) return null;

      const response = await fetch('/api/posts');
      const { data } = await response.json();
      setPosts(data);
    };

    getPosts();
  }, [session]);

  return (
    <main>
      <section className="flex flex-col gap-6">
        <UserCard user={session?.user} pagetype={'Client'} />
      </section>
      <h1 className="sr-only">Posts</h1>
      <ClientAddForm setPosts={setPosts} />
      <List className="max-w-64 mx-auto">
        {posts.map((post) => (
          <ClientPost key={post.id} post={post} setPosts={setPosts} />
        ))}
      </List>
    </main>
  );
}
