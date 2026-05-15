import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google"
import prisma from "@/lib/prisma"
import NextAuth from "next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    }
  }
})