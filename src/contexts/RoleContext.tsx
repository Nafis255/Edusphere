"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
const FullScreenLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#111827', color: 'white' }}>
    Memuat Sesi...
  </div>
);

type Role = 'mahasiswa' | 'dosen' | 'admin';

type RoleContextType = {
  role: Role;
  setRole: (role: Role) => void;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Komponen RoleSwitcher
function RoleSwitcher({ role, setRole }: RoleContextType) {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white p-2 rounded-lg shadow-lg border-gray-200">
      <span className="text-xs font-bold mr-2">Role (Dev):</span>
      {(['mahasiswa', 'dosen', 'admin'] as Role[]).map((r) => (
        <button
          key={r}
          className={`px-2 py-1 text-xs rounded ${role === r ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setRole(r)}
        >
          {r.charAt(0).toUpperCase() + r.slice(1)}
        </button>
      ))}
    </div>
  );
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('mahasiswa'); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const savedRole = localStorage.getItem('edusphere-role') as Role | null;
    if (savedRole && ['mahasiswa', 'dosen', 'admin'].includes(savedRole)) {
      setRole(savedRole);
    }
    setLoading(false); 
  }, []); 

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('edusphere-role', role);
    }
  }, [role, loading]); 

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
      <RoleSwitcher role={role} setRole={setRole} />
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