import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // Logika redirect sudah ditangani oleh callback 'authorized' di auth.config.ts
});

export const config = {
  // UPDATE MATCHER INI:
  // Tambahkan pengecualian untuk file berekstensi (jpg, png, css, dll)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|js|css|woff|woff2|ttf|eot)).*)"],
};