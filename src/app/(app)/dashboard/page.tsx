"use client"; 

import React from 'react';
import { useRole } from '@/contexts/RoleContext';
import MahasiswaDashboard from '@/components/dashboard/MahasiswaDashboard';
import DosenDashboard from '@/components/dashboard/DosenDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard'; // <-- 1. Impor Admin Dashboard

// Halaman Dashboard Utama
export default function DashboardPage() {
  const { role } = useRole(); 

  return (
    <div className="relative">
      
      {role === 'mahasiswa' && (
        <MahasiswaDashboard />
      )}
      
      {role === 'dosen' && (
        <DosenDashboard />
      )}

      {/* 2. Tambahkan render untuk Admin */}
      {role === 'admin' && (
        <AdminDashboard />
      )}
      
    </div>
  );
}