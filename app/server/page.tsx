import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { redirect } from 'next/navigation';
import UserCard from '../_components/user-card';

export default async function ServerPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/server')
  }

  return (
    <main>
      <UserCard user={session?.user} pagetype="server" />
    </main>
  )
}