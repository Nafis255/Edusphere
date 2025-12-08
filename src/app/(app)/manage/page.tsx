"use client"; 

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Edit, Settings } from 'lucide-react';
import { mockCourses } from '@/data/mockData';
import { Course } from '@/lib/types';
import Link from 'next/link'; // Pastikan Link diimpor

// Komponen Kartu untuk Dosen
function DosenCourseCard({ course }: { course: Course }) {
  return (
    <Card className="shadow-md overflow-hidden flex flex-col">
      <img
        src={course.coverImage} 
        alt={course.title}
        className="w-full h-40 object-cover"
        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x160/E2E8F0/A0AEC0?text=IMG'; }}
      />
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">{course.title}</CardTitle>
        <p className="text-sm text-gray-500">
          {course.semester} | {course.studentCount} Mahasiswa
        </p>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        <div className="space-y-2">
          
          {/* Tombol 1: Link ke tab Materi */}
          <Link href={`/manage/${course.id}/materi`} className="block">
            <Button variant="secondary" className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Kelola Materi & Kuis
            </Button>
          </Link>

          {/* --- PERBAIKAN DI SINI --- */}
          {/* Tombol 2: Link langsung ke tab Pengaturan */}
          <Link href={`/manage/${course.id}/settings`} className="block">
            <Button variant="ghost" className="w-full text-gray-600">
              <Settings className="h-4 w-4 mr-2" />
              Pengaturan Mata Kuliah
            </Button>
          </Link>
          
        </div>
      </CardContent>
    </Card>
  );
}

// Halaman utama /manage
export default function ManageCoursesPage() {
  
  const courses = mockCourses; 

  return (
    <div className="space-y-6">
      
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manajemen Mata Kuliah
          </h1>
          <p className="text-lg text-gray-600">
            Kelola materi, kuis, dan peserta mata kuliah Anda.
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Buat Mata Kuliah Baru
        </Button>
      </div>
      
      {/* Grid Kartu Mata Kuliah */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <DosenCourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}