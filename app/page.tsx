import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import UserCard from './_components/user-card';

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {session ? (
        <UserCard user={session?.user} pagetype="Home" />
      ) : (
        <h1 className="text-5xl">You shall not pass</h1>
      )}
    </main>
  );
}
