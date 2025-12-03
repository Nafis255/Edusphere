"use client"; 

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockCourses } from '@/data/mockData';
import { Course } from '@/lib/types';
import { Select } from '@/components/ui/Select';
import { useRole } from '@/contexts/RoleContext'; // <-- 1. Impor hook role

// --- KARTU UNTUK MAHASISWA ---
function StudentCourseCard({ course }: { course: Course }) {
  return (
    <Card className="shadow-sm hover:shadow-md overflow-hidden flex flex-col">
      <img
        src={course.coverImage} 
        alt={course.title}
        className="w-full h-40 object-cover"
        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x160/E2E8F0/A0AEC0?text=IMG'; }}
      />
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">{course.title}</CardTitle>
        <p className="text-sm text-gray-500">Dr. {course.instructorName}</p>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        {/* Progress Bar (Hanya untuk Mahasiswa) */}
        <div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="gradient-primary h-2.5 rounded-full"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{course.progress}% selesai</p>
        </div>
        
        <Link href={`/courses/${course.id}/materi`} passHref className="mt-4">
          <Button variant="primary" className="w-full">Mulai Belajar</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// --- KARTU BARU UNTUK DOSEN ---
function DosenCourseCard({ course }: { course: Course }) {
  return (
    <Card className="shadow-sm hover:shadow-md overflow-hidden flex flex-col">
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
        {/* Tombol Aksi Dosen */}
        <div className="flex space-x-2">
          <Link href={`/courses/${course.id}/materi`} passHref className="flex-1">
            <Button variant="secondary" className="w-full">Lihat Materi</Button>
          </Link>
          <Link href={`/manage/${course.id}/materi`} passHref className="flex-1">
            <Button variant="primary" className="w-full">Kelola</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}


// Halaman utama /courses
export default function CoursesPage() {
  const { role } = useRole(); // <-- 2. Dapatkan role
  
  // 3. Tentukan judul & kartu berdasarkan role
  const pageTitle = role === 'dosen' ? 'Mata Kuliah Diampu' : 'Mata Kuliah Saya';

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-gray-900">
          {pageTitle} 
        </h1>
        
        <Select>
          <option value="all">All Semesters</option>
          <option value="1">Semester Ganjil 2023/2024</option>
          <option value="2">Semester Genap 2023/2024</option>
        </Select>
      </div>
      
      {/* 4. Tampilkan grid kartu yang sesuai */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {role === 'dosen' ? (
          mockCourses.map((course) => (
            <DosenCourseCard key={course.id} course={course} />
          ))
        ) : (
          mockCourses.map((course) => (
            <StudentCourseCard key={course.id} course={course} />
          ))
        )}
      </div>
    </div>
  );
}