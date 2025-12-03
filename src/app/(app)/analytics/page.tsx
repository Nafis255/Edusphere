import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import SimpleBarChart from '@/components/charts/SimpleBarChart';
import { mockGlobalAnalytics, mockAnalyticsStats } from '@/data/mockData'; // <-- 1. Impor data baru
import StatCard from '@/components/dashboard/StatCard'; // <-- 2. Impor StatCard
import { Award, Target, Clock, PieChart } from 'lucide-react'; // <-- 3. Impor ikon

export default function AnalyticsPage() {
  const { courseProgressData, quizScoreData, studyTimeData } = mockGlobalAnalytics;
  const stats = mockAnalyticsStats; // <-- 4. Ambil data stats

  const formattedStudyTimeData = studyTimeData.map(d => ({ name: d.day, Waktu: d.hours }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Analytics
      </h1>
      <p className="text-lg text-gray-600">
        Ringkasan progres belajar Anda secara keseluruhan.
      </p>

      {/* 5. TAMBAHKAN GRID STAT CARD DI SINI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Completed Courses" 
          value={stats.completedCourses} 
          icon={Award} 
          color="text-blue-500"
        />
        <StatCard 
          title="In Progress" 
          value={stats.inProgressCourses} 
          icon={Target} 
          color="text-green-500"
        />
        <StatCard 
          title="Total Study Hours" 
          value={`${stats.totalStudyHours}h`} // Tambah 'h'
          icon={Clock} 
          color="text-cyan-500"
        />
        <StatCard 
          title="Average Progress" 
          value={`${stats.averageProgress}%`} // Tambah '%'
          icon={PieChart} 
          color="text-purple-500"
        />
      </div>

      {/* Grid untuk chart (tetap ada) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Progres Mata Kuliah */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Progres Mata Kuliah</CardTitle>
            <CardDescription>Persentase penyelesaian setiap mata kuliah.</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart 
              data={courseProgressData} 
              barKey="progress" 
              fillColor="#3b82f6" // biru
            />
          </CardContent>
        </Card>
        
        {/* Chart 2: Waktu Belajar */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Waktu Belajar (Jam)</CardTitle>
            <CardDescription>Total jam belajar Anda 7 hari terakhir.</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart 
              data={formattedStudyTimeData} 
              barKey="Waktu" 
              fillColor="#10b981" // hijau
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Chart 3: Skor Kuis */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Skor Kuis</CardTitle>
          <CardDescription>Skor rata-rata kuis yang telah Anda kerjakan.</CardDescription>
        </CardHeader>
        <CardContent>
            <SimpleBarChart 
              data={quizScoreData} 
              barKey="score" 
              fillColor="#f59e0b" // kuning
            />
        </CardContent>
      </Card>

    </div>
  );
}