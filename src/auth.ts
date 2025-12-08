import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { z } from "zod";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authConfig from "@/auth.config";
import Credentials from "next-auth/providers/credentials";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await db.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) return null;

          // Cek Config Global
          const config = await db.systemConfig.findUnique({ where: { id: "global" } });
          
          // Jika Mode Maintenance AKTIF dan User BUKAN Admin
          if (config?.maintenanceMode && user.role !== "ADMIN") {
              // Kita bisa melempar error agar ditangkap di frontend
              // Note: NextAuth v5 kadang hanya menampilkan "CredentialsSignin" untuk keamanan
              throw new Error("Sistem sedang dalam perbaikan (Maintenance Mode).");
          }

          if (!user.emailVerified) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) { 
      // Log untuk debugging (Opsional)
      //console.log("JWT Callback:", { tokenID: token.sub, userRole: user?.role });
      
      if (!token.sub) return token;

      // Kita fetch user dari DB untuk memastikan role selalu update
      const existingUser = await db.user.findUnique({ where: { id: token.sub } });
      if (!existingUser) return token;

      // Masukkan role ke token
      token.role = existingUser.role;
      return token;
    },
    // Pastikan session juga menerima token dengan benar
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        // @ts-ignore
        session.user.role = token.role; 
      }
      return session;
    }
  }
});