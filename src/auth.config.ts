import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Credentials({
        async authorize() { return null }
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      //console.log("Middleware Check:", { 
      // path: nextUrl.pathname, 
      //  isLoggedIn, 
      //  user: auth?.user 
      //});
      
      // Sekarang nextUrl sudah benar merujuk ke URL object, bukan Request object
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAuth = nextUrl.pathname === "/" || nextUrl.pathname === "/register";

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect ke login
      } else if (isLoggedIn && isOnAuth) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    }
  }
} satisfies NextAuthConfig;