import React, { ReactNode } from 'react';
import Link from 'next/link';
import { 
  BookOpen, ClipboardCheck, MessageSquare, 
  Users, User, Calendar, FileInput 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { getStudentCourseDetail } from '@/actions/student-actions';
import { redirect } from 'next/navigation';
// Kita butuh komponen client untuk navigasi aktif
import { CourseNav } from './CourseNav';
import { updateLastAccessed } from '@/actions/student-actions'; 

// Menu Navigasi
const courseNavItems = [
  { href: '/materi', label: 'Materials', icon: BookOpen },
  { href: '/kuis', label: 'Quizzes', icon: ClipboardCheck },
  { href: '/tugas', label: 'Assignments', icon: FileInput },
  { href: '/forum', label: 'Forum', icon: MessageSquare },
];

type Props = {
    children: ReactNode;
    params: Promise<{ courseId: string }>;
};

export default async function CourseDetailLayout({ children, params }: Props) {
  const { courseId } = await params;

  updateLastAccessed(courseId);

  // 1. Fetch Data Asli
  const course = await getStudentCourseDetail(courseId);

  // 2. Jika tidak ketemu (belum enroll), redirect atau error
  if (!course) {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
            <h2 className="text-xl font-bold text-gray-800">Akses Ditolak</h2>
            <p className="text-gray-500 mb-4">Anda belum terdaftar di mata kuliah ini.</p>
            <Link href="/courses/browse" className="text-blue-600 hover:underline">
                Cari Mata Kuliah
            </Link>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner & Info */}
      <Card className="border-none shadow-md overflow-hidden">
        <div className="h-48 w-full bg-gray-200 relative">
          <img 
            src={course.coverImage || "https://placehold.co/1200x300?text=Course+Banner"} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        </div>

        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1.5" />
                  <span>{course.instructorName}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  <span>{course.semester}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1.5" />
                  <span>{course.studentCount} students</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-64">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 font-medium">Your Progress</span>
                <span className="font-bold text-blue-600">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigasi (Client Component) */}
      <CourseNav courseId={courseId} />

      {/* Konten Halaman */}
      <div className="min-h-[400px]">
        {children}
      </div>
    </div>
  );
}