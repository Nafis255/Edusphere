"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { 
  BookOpen, 
  ClipboardCheck, 
  MessageSquare, 
  Users, // Icon untuk Peserta
  User, 
  Calendar,
  FileInput
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { mockCourses } from '@/data/mockData';

// Update Tab Navigasi: Ganti 'Analitik' jadi 'Peserta'
const courseNavItems = [
  { href: '/materi', label: 'Materials', icon: BookOpen },
  { href: '/kuis', label: 'Quizzes', icon: ClipboardCheck },
  { href: '/tugas', label: 'Tugas', icon: FileInput },
  { href: '/peserta', label: 'Participants', icon: Users }, // <--- DIGANTI
  { href: '/forum', label: 'Forum', icon: MessageSquare },
];

export default function CourseDetailLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const courseId = params.courseId as string;
  
  const course = mockCourses.find(c => c.id === courseId);

  if (!course) {
    return <div>Mata Kuliah tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Bagian Atas: Banner & Info Course (Sesuai Screenshot) */}
      <Card className="border-none shadow-md overflow-hidden">
        
        {/* 1. Banner Image */}
        <div className="h-48 w-full bg-gray-200 relative">
          <img 
            src={course.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/1200x300/E2E8F0/A0AEC0?text=Course+Banner'; }}
          />
        </div>

        {/* 2. Info Card Content */}
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            {/* Kiri: Judul & Metadata */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {course.title}
              </h1>
              <p className="text-gray-600 mb-4 text-sm">
                Learn the fundamentals and advanced concepts of {course.title}.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1.5" />
                  <span>Instructor: {course.instructorName}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  <span>Semester: {course.semester}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1.5" />
                  <span>{course.studentCount} students</span>
                </div>
              </div>
            </div>

            {/* Kanan: Progress Bar */}
            <div className="w-full md:w-64">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 font-medium">Your Progress</span>
                <span className="font-bold text-blue-600">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Bagian Tengah: Tab Navigasi (Pill Shape) */}
      <div className="bg-gray-200 p-1 rounded-full inline-flex w-full md:w-auto">
        {courseNavItems.map((item) => {
          // Logika path yang sedikit di-tweak agar 'materi' aktif secara default jika root course diakses
          const href = `/courses/${courseId}${item.href}`;
          const isActive = pathname.includes(item.href); 
          
          return (
            <Link
              key={item.label}
              href={href}
              className={`
                flex-1 md:flex-none text-center px-6 py-2 rounded-full text-sm font-medium transition-all
                ${isActive
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Bagian Bawah: Konten Halaman (Materi, Kuis, Peserta, dll) */}
      <div className="min-h-[400px]">
        {children}
      </div>
    </div>
  );
}