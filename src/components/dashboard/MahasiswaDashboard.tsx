import React from 'react';
import { Book, Award, Clock, BarChart2 } from 'lucide-react'; // Ikon untuk StatCard

// Impor komponen dashboard
import StatCard from '@/components/dashboard/StatCard';
import CourseProgressCard from '@/components/dashboard/CourseProgressCard';
import InfoCard from '@/components/dashboard/InfoCard'; // Tetap diimpor

// Impor data dummy
import { 
  mockStudentUser,
  mockDashboardStats, 
  mockCourses,
  mockUpcomingDeadlines,
  mockRecentAchievements
} from '@/data/mockData';

export default function DashboardPage() {
  const { enrolledCourses, avgScore, totalHours, certificates } = mockDashboardStats;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Mahasiswa
        </h1>
        <p className="text-lg text-gray-600">
          Lanjutkan pembelajaran Anda, {mockStudentUser.name.split(' ')[0]}!
        </p>
      </div>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Enrolled Courses" 
          value={enrolledCourses} 
          icon={Book} 
          color="text-blue-500"
        />
        <StatCard 
          title="Avg Score" 
          value={avgScore} 
          icon={Award} 
          color="text-cyan-500"
        />
        <StatCard 
          title="Total Hours" 
          value={totalHours} 
          icon={Clock} 
          color="text-green-500"
        />
        <StatCard 
          title="Certificates" 
          value={certificates} 
          icon={BarChart2} 
          color="text-yellow-500"
        />
      </div>

      {/* Grid Konten Utama (Kursus & Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Lanjutkan Belajar (Ini tetap 2 kolom di layar besar) */}
        <div className="lg:col-span-3 space-y-6"> {/* UBAH INI: lg:col-span-2 menjadi lg:col-span-3 */}
          <h2 className="text-2xl font-semibold text-gray-900">Recently Accessed</h2>
          {mockCourses.map((course) => (
            <CourseProgressCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Bagian Baru: Upcoming Deadlines & Recent Achievements di bawah */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"> {/* Tambahkan grid baru di sini */}
        <InfoCard 
          title="Upcoming Deadlines" 
          items={mockUpcomingDeadlines} 
        />
        <InfoCard 
          title="Recent Achievements" 
          items={mockRecentAchievements} 
        />
      </div>

      {/* Nanti kita tambahkan chart analitik di sini */}

    </div>
  );
}