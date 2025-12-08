"use client"; 

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRole } from '@/contexts/RoleContext'; 
import { getEnrolledCourses } from '@/actions/enrollment-actions';
import { getMyCourses } from '@/actions/course-actions'; // Untuk Dosen
import { Loader2, Plus, BookOpen, ArrowRight, Eye, Settings } from 'lucide-react';

// Tipe Data Gabungan (Sederhana)
type CourseDisplay = {
  id: string;
  title: string;
  instructorName?: string; // Untuk Mhs
  coverImage: string | null;
  progress?: number; // Untuk Mhs
  studentCount?: number; // Untuk Dosen
  semester?: string | null;
};

export default function CoursesPage() {
  const { role } = useRole(); 
  const [courses, setCourses] = useState<CourseDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        if (role === 'mahasiswa') {
            const data = await getEnrolledCourses();
            // @ts-ignore
            setCourses(data);
        } else if (role === 'dosen') {
            // Gunakan action lama untuk dosen
            const data = await getMyCourses(); 
            // Mapping agar sesuai tipe CourseDisplay
            const mapped = data.map((c: any) => ({
                ...c,
                studentCount: c._count.enrollments
            }));
            setCourses(mapped);
        }
        setLoading(false);
    }
    
    // Jalankan fetch hanya jika role sudah ada
    if (role) loadData();
  }, [role]);

  // Judul Halaman
  const pageTitle = role === 'dosen' ? 'Mata Kuliah Diampu' : 'Mata Kuliah Saya';

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
        
        {/* Tombol Aksi Berdasarkan Role */}
        {role === 'dosen' ? (
            <Link href="/manage/create">
                <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" /> Buat Baru
                </Button>
            </Link>
        ) : (
            <Link href="/courses/browse">
                <Button>
                    <BookOpen className="h-4 w-4 mr-2" /> Katalog Mata Kuliah
                </Button>
            </Link>
        )}
      </div>
      
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
              <img
                src={course.coverImage || "https://placehold.co/600x400"}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                <p className="text-sm text-gray-500">
                    {role === 'dosen' 
                        ? `${course.semester} • ${course.studentCount} Mhs` 
                        : `Dosen: ${course.instructorName}`}
                </p>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end pt-0 mt-4">
                {role === 'mahasiswa' && (
                    <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                        </div>
                        <p className="text-xs text-right text-gray-500 mt-1">{course.progress}% Selesai</p>

                        <Link href={`/courses/${course.id}/materi`}>
                            <Button className="w-full mt-2">
                                Lanjutkan Belajar <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                )}

                {role === 'dosen' && (
                    <div className="flex gap-2 mt-2">
                        {/* Tombol Preview (Lihat Tampilan Mahasiswa) */}
                        <Link href={`/courses/${course.id}/materi`} className="flex-1">
                            <Button variant="ghost" className="w-full border border-gray-200 hover:bg-gray-50 text-gray-600">
                                <Eye className="h-4 w-4 mr-2" /> Lihat
                            </Button>
                        </Link>

                        {/* Tombol Kelola (Masuk ke Dapur/Admin) */}
                        <Link href={`/manage/${course.id}/materi`} className="flex-1">
                            <Button variant="secondary" className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                                <Settings className="h-4 w-4 mr-2" /> Kelola 
                            </Button>
                        </Link>
                    </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">
                {role === 'dosen' ? "Anda belum membuat mata kuliah." : "Anda belum mengambil mata kuliah apapun."}
            </p>
            {role === 'mahasiswa' && (
                <Link href="/courses/browse">
                    <Button>Cari Mata Kuliah</Button>
                </Link>
            )}
        </div>
      )}
    </div>
  );
}