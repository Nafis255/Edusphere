"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input'; // Kita gunakan Input yg sudah ada
import { mockCourses } from '@/data/mockData';
import { AlertCircle } from 'lucide-react';

export default function ManageSettingsPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const course = mockCourses.find(c => c.id === courseId);

  if (!course) return <div>Mata Kuliah tidak ditemukan.</div>;
  
  // Fungsi dummy (UI Only)
  const handleDelete = () => {
    // Tampilkan konfirmasi
    const isConfirmed = window.confirm(
      `APAKAH ANDA YAKIN INGIN MENGHAPUS MATA KULIAH INI?\n\n"${course.title}"\n\nTindakan ini tidak dapat dibatalkan.`
    );
    
    if (isConfirmed) {
      alert('Mata kuliah (dummy) telah dihapus. Mengarahkan kembali ke /manage');
      // Arahkan (opsional)
      // window.location.href = '/manage';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Kartu Informasi Umum */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Pengaturan Umum</CardTitle>
          <CardDescription>Ubah detail dasar mata kuliah Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul Mata Kuliah
            </label>
            <Input type="text" defaultValue={course.title} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <Input type="text" defaultValue={course.semester} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kunci Pendaftaran (Enrollment Key)
            </label>
            <Input type="text" placeholder="Kosongkan agar pendaftaran terbuka" />
          </div>
          <div className="flex justify-end">
            <Button>Simpan Perubahan</Button>
          </div>
        </CardContent>
      </Card>

      {/* --- INI JAWABANNYA --- */}
      {/* Kartu Zona Berbahaya (Danger Zone) */}
      <Card className="shadow-md dark:shadow-lg border-red-500">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            Danger Zone
          </CardTitle>
          <CardDescription>Tindakan-tindakan berikut bersifat permanen.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
          <div>
            <h4 className="font-semibold text-gray-900">Hapus Mata Kuliah Ini</h4>
            <p className="text-sm text-gray-600">
              Semua materi, kuis, dan data pendaftaran akan dihapus permanen.
            </p>
          </div>
          
          <Button 
            variant="secondary" 
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDelete}
          >
            Hapus Mata Kuliah
          </Button>
          
        </CardContent>
      </Card>

    </div>
  );
}