// types/next-auth.d.ts
import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string; // Add the id field to the user object
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession['user']; // Extend with default session properties
  }

  interface User {
    id: string;
  }
}
