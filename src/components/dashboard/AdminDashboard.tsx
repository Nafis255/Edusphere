"use client"; 

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, GraduationCap, Book, Loader2 } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { getAdminStats } from '@/actions/admin-actions'; // Import action

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDosen: 0,
    totalMahasiswa: 0,
    totalCourses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        const data = await getAdminStats();
        if (data) {
            setStats(data);
        }
        setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;

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

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-green-700 font-medium">Semua sistem berjalan normal.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}