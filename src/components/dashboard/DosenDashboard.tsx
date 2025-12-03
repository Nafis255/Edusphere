"use client"; // Kita akan pakai chart

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Book, Users, FileText, ClipboardCheck, Activity } from 'lucide-react';
import { mockDosenStats, mockDosenActivity } from '@/data/mockData';
import StatCard from '@/components/dashboard/StatCard'; 
import Link from 'next/link';
import { Button } from '../ui/Button';

export default function DosenDashboard() {
  const stats = mockDosenStats;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Dashboard Dosen
      </h1>
      
      {/* Grid Kartu Statistik Dosen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Mata Kuliah" 
          value={stats.totalCourses} 
          icon={Book} 
          color="text-blue-500"
        />
        <StatCard 
          title="Total Mahasiswa" 
          value={stats.totalStudents} 
          icon={Users} 
          color="text-green-500"
        />
        <StatCard 
          title="Materi Ter-upload" 
          value={stats.totalMaterials}
          icon={FileText} 
          color="text-cyan-500"
        />
        <StatCard 
          title="Total Kuis" 
          value={stats.totalQuizzes}
          icon={ClipboardCheck} 
          color="text-yellow-500"
        />
      </div>

      {/* Grid: Mata Kuliah Saya & Aktivitas Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Mata Kuliah Saya (Simple) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-md h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Mata Kuliah yang Diampu</CardTitle>
              <Link href="/courses">
                <Button variant="secondary" size="sm">Lihat Semua</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {/* Ini bisa kita isi dengan list mata kuliah nanti */}
              <p className="text-gray-600">
                Akan menampilkan daftar mata kuliah yang diampu, dengan tombol "Kelola Materi" dan "Kelola Kuis".
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Aktivitas Terbaru */}
        <div className="lg:col-span-1">
          <Card className="shadow-md h-full">
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 divide-y divide-gray-300">
                {mockDosenActivity.map(activity => (
                  <div key={activity.id} className="pt-4 first:pt-0">
                    <p className="font-medium text-gray-800">{activity.text}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}