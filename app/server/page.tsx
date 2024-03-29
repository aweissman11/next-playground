import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { redirect } from 'next/navigation';
import UserCard from '../_components/UserCard';
import { ServerAddForm } from '../_components/form/ServerAddForm';
import { db } from '@/lib/db';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { StarBorder } from '@mui/icons-material';
import { DeleteForm } from '../_components/form/ServerDeleteForm';

export default async function ServerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/server');
  }

  const posts = await db.post.findMany({
    where: {
      createdById: session.user.id,
    },
  });

  return (
    <main>
      <UserCard user={session?.user} pagetype="server" />
      <h1 className="sr-only">Posts</h1>
      <ServerAddForm />
      <List className="max-w-64 mx-auto">
        {posts.map((post) => (
          <ListItem key={post.id}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary={post.name} />
            <DeleteForm id={post.id} post={post.name} />
          </ListItem>
        ))}
      </List>
    </main>
  );
}
