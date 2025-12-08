import React, { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { RoleProvider } from '@/contexts/RoleContext';
import { auth } from '@/auth'; 
import db from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function AppLayout({ children }: { children: ReactNode }) {
  // 1. Ambil Session Server-Side
  const session = await auth();
  
  // 2. Cek Config Maintenance dari Database
  const config = await db.systemConfig.findUnique({ where: { id: "global" } });

  // 3. LOGIKA BLOKIR
  // Jika Maintenance ON --DAN-- User BUKAN Admin
  if (config?.maintenanceMode && session?.user?.role !== "ADMIN") {
      redirect("/maintenance"); // Lempar ke halaman maintenance
  }

  return (
    <RoleProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </RoleProvider>
  );
}