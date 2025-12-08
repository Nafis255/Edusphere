"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSession } from "next-auth/react"; 

const FullScreenLoader = ({ message }: { message?: string }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f3f4f6', color: '#374151' }}>
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="font-semibold text-sm">{message || "Memuat Data..."}</p>
    </div>
  </div>
);

type Role = 'mahasiswa' | 'dosen' | 'admin';

type RoleContextType = {
  role: Role | null;
  setRole: (role: Role | null) => void;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [role, setRole] = useState<Role | null>(null); 
  
  useEffect(() => {
    // 1. Jika masih loading atau belum login, jangan lakukan apa-apa
    if (status === "loading") return;
    
    // 2. Jika Unauthenticated (Logout), reset role
    if (status === "unauthenticated") {
      setRole(null);
      return;
    }

    // 3. Jika Authenticated, coba ambil role
    const rawRole = (session?.user as any)?.role; 

    if (rawRole) {
      const normalizedRole = String(rawRole).toLowerCase() as Role;
      if (['mahasiswa', 'dosen', 'admin'].includes(normalizedRole)) {
        setRole(normalizedRole);
      } else {
        console.warn("Role tidak dikenali:", normalizedRole);
      }
    } 
  }, [session, status]);

  // --- LOGIC LOADING YANG DIPERBAIKI ---
  // Tampilkan loader jika:
  // 1. Status session masih "loading"
  // 2. ATAU Status "authenticated" TAPI role belum terset (sedang proses mapping)
  const shouldShowLoader = status === "loading" || (status === "authenticated" && role === null);

  if (shouldShowLoader) {
    return <FullScreenLoader message="Menyiapkan Dashboard..." />;
  }

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}