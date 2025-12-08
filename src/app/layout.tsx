import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { SessionProvider } from "next-auth/react"; // <-- 1. Import ini
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Edusphere",
  description: "Learning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50`}>
        {/* 2. Bungkus RoleProvider dengan SessionProvider */}
        <SessionProvider>
          <ThemeProvider>
            <RoleProvider>
              {children}
              <Toaster position="top-center" richColors />
            </RoleProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}