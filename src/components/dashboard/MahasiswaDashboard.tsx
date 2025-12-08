"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Book, Award, BarChart2, Loader2, AlertCircle } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import CourseProgressCard from '@/components/dashboard/CourseProgressCard';
import InfoCard from '@/components/dashboard/InfoCard'; 
import { getStudentDashboardStats } from '@/actions/student-dashboard-actions';
import { useSession } from 'next-auth/react';

export default function MahasiswaDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  
  const [data, setData] = useState({
    stats: {
        enrolledCourses: 0,
        avgScore: 0,
        pendingAssignments: 0,
        completedMaterials: 0
    },
    recentCourses: [] as any[],
    upcomingDeadlines: [] as any[], 
    recentAchievements: [] as any[] 
  });

  useEffect(() => {
    async function loadData() {
        const res = await getStudentDashboardStats();
        if (res.success && res.stats) {
            // @ts-ignore
            setData(res);
        }
        setLoading(false);
    }
    loadData();
  }, []);

  const firstName = session?.user?.name?.split(' ')[0] || "Mahasiswa";

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-8"> {/* Tambah jarak antar section */}
      
      {/* 1. Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Mahasiswa
        </h1>
        <p className="text-lg text-gray-600">
          Selamat datang kembali, {firstName}!
        </p>
      </div>

      {/* 2. Grid Kartu Statistik (Tetap di Atas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Kelas Diambil" 
          value={data.stats.enrolledCourses} 
          icon={Book} 
          color="text-blue-500"
        />
        <StatCard 
          title="Rata-rata Nilai" 
          value={data.stats.avgScore} 
          icon={Award} 
          color="text-cyan-500"
        />
        <StatCard 
          title="Tugas Pending" 
          value={data.stats.pendingAssignments} 
          icon={AlertCircle} 
          color="text-yellow-500"
        />
        <StatCard 
          title="Materi Selesai" 
          value={data.stats.completedMaterials} 
          icon={BarChart2} 
          color="text-green-500"
        />
      </div>

      {/* 3. Mata Kuliah Aktif (Sekarang Bersusun / Full Width List) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Mata Kuliah Aktif</h2>
            <Link href="/courses">
                <span className="text-sm text-blue-600 hover:underline cursor-pointer">Lihat Semua</span>
            </Link>
        </div>
        
        {data.recentCourses.length > 0 ? (
            // UBAH GRID: grid-cols-1 agar bersusun ke bawah
            <div className="grid grid-cols-1 gap-4"> 
                {data.recentCourses.map((course) => (
                    <CourseProgressCard key={course.id} course={course} />
                ))}
            </div>
        ) : (
            <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">Anda belum mengambil mata kuliah apapun.</p>
                <Link href="/courses/browse">
                    <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer">
                        Cari Mata Kuliah
                    </span>
                </Link>
            </div>
        )}
      </div>

      {/* 4. Info Cards (Sekarang di Bawah & Bersebelahan) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
        {/* Kiri: Tenggat Waktu */}
        <InfoCard 
            title="Tenggat Waktu Terdekat" 
            items={data.upcomingDeadlines.length > 0 
                ? data.upcomingDeadlines 
                : [{ id: '0', title: 'Tidak ada tugas', subtitle: 'Hore! Anda bebas tugas.', badge: 'Santai' }]
            } 
        />

        {/* Kanan: Pencapaian */}
        <InfoCard 
            title="Pencapaian Terbaru" 
            items={data.recentAchievements.length > 0 
                ? data.recentAchievements 
                : [{ id: '0', title: 'Belum ada pencapaian', subtitle: 'Selesaikan kuis dengan nilai > 80!' }]
            } 
        />

      </div>

    </div>
  );
}