"use client"; 

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, GraduationCap, Book } from 'lucide-react';
import { mockAdminStats } from '@/data/mockData';
import StatCard from '@/components/dashboard/StatCard';

export default function AdminDashboard() {
  const stats = mockAdminStats;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Dashboard Admin
      </h1>
      <p className="text-lg text-gray-600">
        Statistik keseluruhan platform Edusphere.
      </p>

      {/* Grid Kartu Statistik Admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Pengguna" 
          value={stats.totalUsers} 
          icon={Users} 
          color="text-blue-500"
        />
        <StatCard 
          title="Total Dosen" 
          value={stats.totalDosen} 
          icon={GraduationCap} 
          color="text-green-500"
        />
        <StatCard 
          title="Total Mahasiswa" 
          value={stats.totalMahasiswa}
          icon={Users} 
          color="text-cyan-500"
        />
        <StatCard 
          title="Total Mata Kuliah" 
          value={stats.totalCourses}
          icon={Book} 
          color="text-yellow-500"
        />
      </div>

      {/* Nanti di sini bisa ditambahkan chart aktivitas platform */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Aktivitas Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Chart aktivitas pengguna baru dan pembuatan mata kuliah akan tampil di sini.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}