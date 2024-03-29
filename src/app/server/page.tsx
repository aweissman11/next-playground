import { db } from '@/src/lib/db';
import {
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';
import UserCard from '../../_components/UserCard';
import { ServerAddForm } from '../../_components/form/ServerAddForm';
import { DeleteForm } from '../../_components/form/ServerDeleteForm';
import { StarForm } from '../../_components/form/ServerStarForm';

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
        updatedAt: 'desc'
      }
    ]
  });

  return (
    <main>
      <UserCard user={session?.user} pagetype="server" />
      <h1 className="sr-only">Posts</h1>
      <ServerAddForm />
      <List className="max-w-64 mx-auto">
        {posts.map((post) => (
          <ListItem key={post.id}>
            <StarForm id={post.id} post={post.name} starred={!!post.starred} />
            <ListItemText primary={post.name} />
            <DeleteForm id={post.id} post={post.name} />
          </ListItem>
        ))}
      </List>
    </main>
  );
}
