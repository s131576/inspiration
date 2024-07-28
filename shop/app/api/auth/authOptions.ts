import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/prisma/client';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        // Check if the user exists in the database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // If the user does not exist, create a new user
          await prisma.user.create({
            data: {
              name: user.name!,
              email: user.email!,
              img: user.image || '',
            },
          });
        }
        return true;
      } catch (error) {
        console.error("Error handling user sign-in:", error);
        return false;
      }
    },
  },
};
