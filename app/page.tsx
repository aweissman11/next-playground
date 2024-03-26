import { getServerSession } from 'next-auth';
import { options } from './api/auth/[...nextauth]/options';
import UserCard from './_components/user-card';

export default async function Home() {
  const session = await getServerSession(options);
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
