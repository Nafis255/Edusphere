"use client"; 

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
// 1. Impor Ikon Settings
import { ArrowLeft, Edit, ClipboardCheck, Settings, FileInput } from 'lucide-react'; 
import { mockCourses } from '@/data/mockData';

// 2. Definisikan tab navigasi manajemen
const manageNavItems = [
  { href: '/materi', label: 'Kelola Materi', icon: Edit },
  { href: '/kuis', label: 'Kelola Kuis', icon: ClipboardCheck },
  { href: '/tugas', label: 'Kelola Tugas', icon: FileInput }, 
  { href: '/settings', label: 'Pengaturan', icon: Settings }, // <-- 3. TAMBAHKAN INI
];

export default function CourseManageLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const courseId = params.courseId as string;
  
  const course = mockCourses.find(c => c.id === courseId);

  if (!course) {
    return <div>Mata Kuliah tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-4">
      {/* 1. Header (Judul & Tombol Kembali) */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/manage" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Manajemen
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">
            Kelola: {course.title}
          </h1>
        </div>
      </div>

      {/* 2. Tab Navigasi */}
      <nav className="bg-white rounded-lg shadow-sm">
        <div className="flex space-x-1 p-1">
          {manageNavItems.map((item) => {
            const href = `/manage/${courseId}${item.href}`;
            const isActive = pathname.startsWith(href);
            
            return (
              <Link
                key={item.label}
                href={href}
                className={`
                  flex items-center space-x-2 px-4 py-2.5 rounded-md font-medium text-sm
                  transition-colors
                  ${isActive
                    ? 'bg-blue-500 text-white shadow'
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 3. Konten (Halaman Tab) */}
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}