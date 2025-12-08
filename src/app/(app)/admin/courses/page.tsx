"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Edit2, Trash2, Settings } from 'lucide-react';
import { mockCourses } from '@/data/mockData'; // <-- Impor semua mata kuliah
import { Course } from '@/lib/types';
import Link from 'next/link';

// Komponen untuk satu baris mata kuliah di tabel
function CourseTableRow({ course }: { course: Course }) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      {/* Nama Mata Kuliah */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <img
            src={course.coverImage}
            alt={course.title}
            className="w-16 h-10 rounded object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/64x40/E2E8F0/A0AEC0?text=IMG`; }}
          />
          <div>
            <p className="font-semibold text-gray-900">{course.title}</p>
            <p className="text-sm text-gray-500">{course.semester}</p>
          </div>
        </div>
      </td>
      {/* Dosen */}
      <td className="px-4 py-3 text-sm text-gray-600">
        {course.instructorName}
      </td>
      {/* Peserta */}
      <td className="px-4 py-3 text-sm text-gray-600">
        {course.studentCount}
      </td>
      {/* Aksi */}
      <td className="px-4 py-3">
        <div className="flex space-x-2">
          {/* Admin bisa langsung 'masuk' ke halaman manajemen Dosen */}
          <Link href={`/manage/${course.id}/materi`}>
            <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-100" title="Kelola Materi/Kuis">
              <Edit2 className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/manage/${course.id}/settings`}>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100" title="Pengaturan MK">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-100" title="Hapus MK">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

// Halaman utama /admin/courses
export default function ManageCoursesAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Logika filter (UI only)
  const filteredCourses = mockCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manajemen Mata Kuliah (Admin)
          </h1>
          <p className="text-lg text-gray-600">
            Kelola semua mata kuliah di platform.
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Buat Mata Kuliah Baru
        </Button>
      </div>
      
      {/* Kartu Tabel Mata Kuliah */}
      <Card className="shadow-md">
        <CardHeader>
          {/* Search Bar */}
          <div className="relative w-full md:w-1/3">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Cari mata kuliah atau nama dosen..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full w-full">
              {/* Header Tabel */}
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                  <th className="px-4 py-3">Mata Kuliah</th>
                  <th className="px-4 py-3">Dosen Pengampu</th>
                  <th className="px-4 py-3">Jumlah Peserta</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              {/* Isi Tabel */}
              <tbody>
                {filteredCourses.map(course => (
                  <CourseTableRow key={course.id} course={course} />
                ))}
              </tbody>
            </table>
          </div>
          {filteredCourses.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              Tidak ada mata kuliah yang cocok dengan pencarian.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}