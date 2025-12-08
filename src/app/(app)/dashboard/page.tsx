"use client"; 

import React from 'react';
import { useRole } from '@/contexts/RoleContext';
import MahasiswaDashboard from '@/components/dashboard/MahasiswaDashboard';
import DosenDashboard from '@/components/dashboard/DosenDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import DebugSession from '@/components/DebugSession';

export default function DashboardPage() {
  const { role } = useRole(); 

  // Jika role entah kenapa masih null, jangan tampilkan apa-apa (atau loader)
  if (!role) return null;

  return (
    <div className="relative">

      {role === 'mahasiswa' && <MahasiswaDashboard />}
      {role === 'dosen' && <DosenDashboard />}
      {role === 'admin' && <AdminDashboard />}
      
    </div>
  );
}