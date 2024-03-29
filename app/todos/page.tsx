import { getAuthServerSession } from '@/lib/auth'

const Page = async () => {
  const session = await getAuthServerSession();
  console.log('session', session)

  return (
    <div>Page</div>
  )
}

export default Page