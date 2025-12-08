"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import SimpleBarChart from '@/components/charts/SimpleBarChart';
import StatCard from '@/components/dashboard/StatCard';
import { Award, Target, CheckCircle, PieChart, Loader2 } from 'lucide-react';
import { getStudentAnalytics } from '@/actions/analytics-actions'; // Import Action

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        const res = await getStudentAnalytics();
        setData(res);
        setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;
  if (!data) return <div className="text-center py-20">Gagal memuat data analitik.</div>;

  const { stats, courseProgressData, quizScoreData } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Analytics
      </h1>
      <p className="text-lg text-gray-600">
        Ringkasan progres belajar dan pencapaian Anda.
      </p>

      {/* 1. GRID STAT CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Kursus Selesai" 
          value={stats.completedCourses} 
          icon={Award} 
          color="text-blue-500"
        />
        <StatCard 
          title="Sedang Berjalan" 
          value={stats.inProgressCourses} 
          icon={Target} 
          color="text-green-500"
        />
        {/* Kita ganti "Study Hours" dengan "Materi Selesai" karena lebih akurat */}
        <StatCard 
          title="Materi Diselesaikan" 
          value={stats.totalMaterialsDone} 
          icon={CheckCircle} 
          color="text-cyan-500"
        />
        <StatCard 
          title="Rata-rata Progress" 
          value={`${stats.averageProgress}%`} 
          icon={PieChart} 
          color="text-purple-500"
        />
      </div>

      {/* 2. CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Progres per Mata Kuliah */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Progres Mata Kuliah</CardTitle>
            <CardDescription>Persentase penyelesaian setiap mata kuliah.</CardDescription>
          </CardHeader>
          <CardContent>
            {courseProgressData.length > 0 ? (
                <SimpleBarChart 
                  data={courseProgressData} 
                  barKey="progress" 
                  fillColor="#3b82f6" // biru
                />
            ) : (
                <p className="text-center text-gray-400 py-10">Belum ada data kursus.</p>
            )}
          </CardContent>
        </Card>
        
        {/* Chart 2: Riwayat Nilai Kuis (Menggantikan Study Time) */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Riwayat Nilai Kuis</CardTitle>
            <CardDescription>Skor perolehan pada 5 kuis terakhir.</CardDescription>
          </CardHeader>
          <CardContent>
            {quizScoreData.length > 0 ? (
                <SimpleBarChart 
                  data={quizScoreData} 
                  barKey="score" 
                  fillColor="#f59e0b" // kuning/orange
                />
            ) : (
                <p className="text-center text-gray-400 py-10">Belum ada kuis yang dikerjakan.</p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}