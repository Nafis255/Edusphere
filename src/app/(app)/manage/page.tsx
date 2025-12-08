"use client"; 

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Edit, Settings, BookOpen, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getMyCourses } from '@/actions/course-actions'; // <-- Import Action

// Kita definisikan tipe lokal sesuai hasil query Prisma
type CourseWithCount = {
  id: string;
  title: string;
  coverImage: string | null;
  semester: string | null;
  _count: {
    enrollments: number;
    materials: number;
    quizzes: number;
  }
};

function DosenCourseCard({ course }: { course: CourseWithCount }) {
  return (
    <Card className="shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
      <img
        src={course.coverImage || "https://placehold.co/600x400?text=No+Image"} 
        alt={course.title}
        className="w-full h-40 object-cover"
        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Error'; }}
      />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-gray-900 line-clamp-1" title={course.title}>
            {course.title}
        </CardTitle>
        <p className="text-sm text-gray-500">
          {course.semester || "Semester tidak diatur"}
        </p>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between pt-0">
        
        {/* Statistik Singkat */}
        <div className="flex space-x-4 text-xs text-gray-500 mb-4 mt-2">
            <span className="flex items-center"><BookOpen className="h-3 w-3 mr-1"/> {course._count.materials} Materi</span>
            <span className="flex items-center"><Settings className="h-3 w-3 mr-1"/> {course._count.enrollments} Mhs</span>
        </div>

        <div className="space-y-2 mt-auto">
          <Link href={`/manage/${course.id}/materi`} className="block">
            <Button variant="secondary" className="w-full text-sm h-9">
              <Edit className="h-3 w-3 mr-2" />
              Kelola Konten
            </Button>
          </Link>
          <Link href={`/manage/${course.id}/settings`} className="block">
            <Button variant="ghost" className="w-full text-gray-600 text-sm h-9">
              <Settings className="h-3 w-3 mr-2" />
              Pengaturan
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<CourseWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data saat halaman dimuat
  useEffect(() => {
    async function loadCourses() {
        const data = await getMyCourses();
        // @ts-ignore (Prisma return type kadang butuh penyesuaian di client)
        setCourses(data);
        setLoading(false);
    }
    loadCourses();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manajemen Mata Kuliah
          </h1>
          <p className="text-lg text-gray-600">
            Kelola materi, kuis, dan peserta mata kuliah Anda.
          </p>
        </div>
        
        {/* Tombol Buat Baru (Sekarang Link ke Halaman Create) */}
        <Link href="/manage/create">
            <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Buat Mata Kuliah Baru
            </Button>
        </Link>
      </div>
      
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        /* Grid Kartu */
        courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                <DosenCourseCard key={course.id} course={course} />
            ))}
            </div>
        ) : (
            /* Empty State */
            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">Anda belum memiliki mata kuliah.</p>
                <Link href="/manage/create">
                    <Button variant="secondary">Buat Mata Kuliah Pertama</Button>
                </Link>
            </div>
        )
      )}
    </div>
  );
}