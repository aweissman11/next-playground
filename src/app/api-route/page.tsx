import ClientPost from '@/src/_components/ClientPost';
import { ClientAddForm } from '@/src/_components/form/ClientAddForm';
import { db } from '@/src/lib/db';
import { List } from '@mui/material';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import UserCard from '../../_components/UserCard';
import { authOptions } from '../../lib/auth';

export default async function ServerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/server');
  }

  const posts = await db.post.findMany({
    where: {
      createdById: session.user.id,
    },
    orderBy: [
      {
        updatedAt: 'desc',
      },
    ],
  });

  return (
    <main>
      <UserCard user={session?.user} pagetype="server" />
      <h1 className="sr-only">Posts</h1>
      <ClientAddForm inServerComponent />
      <List className="max-w-64 mx-auto">
        {posts.map((post) => (
          <ClientPost key={post.id} post={post} inServerComponent />
        ))}
      </List>
    </main>
  );
}
