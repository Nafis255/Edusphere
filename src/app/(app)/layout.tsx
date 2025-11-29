import React, { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { RoleProvider } from '@/contexts/RoleContext'; 

export default function AppLayout({ children }: { children: ReactNode }) {
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