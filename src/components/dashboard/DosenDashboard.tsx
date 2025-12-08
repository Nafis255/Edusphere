"use client"; 

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Book, Users, FileText, ClipboardCheck, Loader2, ArrowRight, Activity, BookOpen } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { getDosenStats } from '@/actions/dashboard-actions';

export default function DosenDashboard() {
  const [data, setData] = useState<any>({
    totalCourses: 0,
    totalStudents: 0,
    totalMaterials: 0,
    totalQuizzes: 0,
    recentCourses: [],
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getDosenStats();
        if (result.success && result.data) {
          setData(result.data);
        }
      } catch (err) {
        console.error("Gagal load stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Dosen</h1>
      
      {/* 1. Grid Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Mata Kuliah" value={data.totalCourses} icon={Book} color="text-blue-500" />
        <StatCard title="Total Mahasiswa" value={data.totalStudents} icon={Users} color="text-green-500" />
        <StatCard title="Materi Ter-upload" value={data.totalMaterials} icon={FileText} color="text-cyan-500" />
        <StatCard title="Total Kuis" value={data.totalQuizzes} icon={ClipboardCheck} color="text-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Kolom Kiri: Daftar Mata Kuliah (Real Data) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-md h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Mata Kuliah Anda</CardTitle>
              <Link href="/manage">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                    Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {data.recentCourses.length > 0 ? (
                <div className="space-y-4">
                    {data.recentCourses.map((course: any) => (
                        <div key={course.id} className="flex items-center justify-between p-4 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-4">
                                <img 
                                    src={course.coverImage || "https://placehold.co/100x100"} 
                                    alt={course.title}
                                    className="w-16 h-12 object-cover rounded"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-900">{course.title}</h4>
                                    <p className="text-xs text-gray-500">
                                        {course.semester || "Semester -"} • {course._count.enrollments} Mahasiswa
                                    </p>
                                </div>
                            </div>
                            <Link href={`/manage/${course.id}/materi`}>
                                <Button variant="secondary" size="sm">Kelola</Button>
                            </Link>
                        </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>Anda belum memiliki mata kuliah.</p>
                  <Link href="/manage/create">
                    <Button variant="outline" className="mt-2">Buat Sekarang</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 3. Kolom Kanan: Aktivitas Terbaru (Real Data) */}
        <div className="lg:col-span-1">
          <Card className="shadow-md h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-500" /> 
                  Aktivitas Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentActivities.length > 0 ? (
                  <div className="space-y-6 relative border-l border-gray-200 ml-3 pl-6 py-2">
                    {data.recentActivities.map((activity: any) => (
                      <div key={activity.id} className="relative">
                        {/* Dot Timeline */}
                        <span className={`absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-white ${activity.type === 'SUBMIT' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                        
                        <p className="text-sm font-medium text-gray-800 leading-tight">
                            {activity.text}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-10 text-gray-400 italic text-sm">
                      Belum ada aktivitas mahasiswa.
                  </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}