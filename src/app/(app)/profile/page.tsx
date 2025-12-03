"use client"; 

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mail, CheckCircle, Briefcase, Calendar, Upload, Edit } from 'lucide-react';
import { 
  mockStudentUser, 
  mockDosen, // <-- 1. Impor data Dosen
  mockCourses, 
  mockBookRecommendations 
} from '@/data/mockData';
import Link from 'next/link';
import { useRole } from '@/contexts/RoleContext'; // <-- 2. Impor hook role

// Komponen 'EnrolledCourseItem' tetap sama...
function EnrolledCourseItem({ course }: { course: typeof mockCourses[0] }) {
  // ... (kode komponen ini tidak berubah) ...
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <h4 className="font-semibold text-gray-900">{course.title}</h4>
        <p className="text-sm text-gray-500">Dr. {course.instructorName}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{course.progress}%</p>
      </CardContent>
    </Card>
  );
}

// Halaman utama /profile
export default function ProfilePage() {
  const { role } = useRole(); // <-- 3. Dapatkan role saat ini

  // 4. Tentukan user mana yang akan ditampilkan datanya
  const user = role === 'dosen' ? mockDosen : mockStudentUser;
  
  // 5. Label dinamis berdasarkan role
  const idLabel = user.role === 'Dosen' ? 'NIDN/NIDK' : 'NIM';
  const coursesTitle = user.role === 'Dosen' ? 'Mata Kuliah Diampu' : 'Enrolled Courses';
  const coursesLabel = user.role === 'Dosen' ? 'Mengampu' : 'Enrolled';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
        
        {/* Kolom Kiri: Info Profil Utama */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-md text-center h-full">
            <CardContent className="p-6">
              <div className="relative w-32 h-32 mx-auto">
                <img 
                  src={user.avatarUrl} // <-- Dinamis
                  alt={user.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/128x128/E2E8F0/A0AEC0?text=${user.name.charAt(0)}`; }}
                />
                <Button size="icon" className="absolute bottom-1 right-1 rounded-full h-9 w-9">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-2xl font-bold mt-4 text-gray-900">{user.name}</h2>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${user.role === 'Dosen' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                {user.role}
              </span>
              <p className="text-gray-600 mt-2">{user.email}</p>
            </CardContent>
            <div className="border-t border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Member since Oct 2024
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Briefcase className="h-4 w-4 mr-2" />
                {mockCourses.length} {coursesLabel} {/* <-- Dinamis */}
              </div>
              <div className="flex items-center justify-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Email Verified
              </div>
            </div>
          </Card>
        </div>

        {/* Kolom Kanan: Detail & Mata Kuliah */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md h-full">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Profile Information</CardTitle>
              <Button variant="secondary" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="p-2 bg-gray-100 rounded-md mt-1">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email Address</label>
                <p className="p-2 bg-gray-100 rounded-md mt-1">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="p-2 bg-gray-100 rounded-md mt-1">{user.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">{idLabel}</label> {/* <-- Dinamis */}
                <p className="p-2 bg-gray-100 rounded-md mt-1">{user.academicId}</p>
              </div>
              <div className="md:col-span-2 ">
                <label className="text-sm font-medium text-gray-500">Bio</label>
                <textarea
                  className="w-full h-24 p-2 border rounded-lg bg-gray-100 mt-1 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Tell us about yourself..."
                  defaultValue={user.role === 'Dosen' ? 'Dosen di Departemen Teknik Informatika.' : 'Mahasiswa Teknik Informatika...'}
                ></textarea>
              </div>
            </CardContent>
          </Card>
        </div>
      </div> 

      {/* Bagian Bawah: Mata Kuliah & Rekomendasi */}
      <div className="space-y-6"> 
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>{coursesTitle}</CardTitle> {/* <-- Dinamis */}
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCourses.map(course => (
              <EnrolledCourseItem key={course.id} course={course} />
            ))}
          </CardContent>
        </Card>
        
        {/* 6. Hanya tampilkan Rekomendasi Buku untuk Mahasiswa */}
        {role === 'mahasiswa' && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Recommended Reading</CardTitle>
              <CardDescription>Berdasarkan mata kuliah yang Anda ambil</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockBookRecommendations.map(book => (
                <div key={book.id} className="text-center">
                  <img 
                    src={book.imageUrl} 
                    alt={book.title} 
                    className="w-full h-48 object-cover rounded-lg shadow-sm"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/150x200/E2E8F0/A0AEC0?text=Book`; }}
                  />
                  <p className="mt-2 font-semibold text-sm text-gray-900">{book.title}</p>
                  <p className="text-xs text-gray-500">{book.author}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}