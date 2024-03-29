import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
  }
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User & {
      /** The user's postal address. */
      id: string;
    };
    token: {
      id: string;
    };
  }
}
