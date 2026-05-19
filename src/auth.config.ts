import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export default {
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard") || 
                               nextUrl.pathname.startsWith("/setup") ||
                               nextUrl.pathname.startsWith("/settings")

      if (isProtectedRoute) {
        if (isLoggedIn) return true
        return false 
      }
      return true
    },
  },
} satisfies NextAuthConfig