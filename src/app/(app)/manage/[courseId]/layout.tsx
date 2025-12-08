import React, { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, ClipboardCheck, Settings, FileInput } from 'lucide-react';
// Hapus import mockCourses dan useParams/usePathname client
import { getCourseById } from '@/actions/course-actions';
import { redirect } from 'next/navigation';

// Definisikan Nav Items
const manageNavItems = [
  { href: '/materi', label: 'Kelola Materi', icon: Edit },
  { href: '/kuis', label: 'Kelola Kuis', icon: ClipboardCheck },
  { href: '/tugas', label: 'Kelola Tugas', icon: FileInput },
  { href: '/settings', label: 'Pengaturan', icon: Settings },
];

// Di Next.js 15, params adalah Promise
type Props = {
  children: ReactNode;
  params: Promise<{ courseId: string }>;
};

export default async function CourseManageLayout({ children, params }: Props) {
  // 1. Await params untuk mendapatkan ID
  const { courseId } = await params;

  // 2. Fetch data asli dari Database
  const course = await getCourseById(courseId);

  // 3. Jika tidak ketemu, redirect atau tampilkan error
  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-xl font-bold text-gray-800">Mata Kuliah Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-4">Mata kuliah ini tidak ada atau Anda tidak memiliki akses.</p>
        <Link href="/manage" className="text-blue-600 hover:underline">
          Kembali ke Manajemen
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
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

      {/* Tab Navigasi */}
      {/* Karena ini Server Component, kita tidak bisa pakai usePathname untuk active state dengan mudah.
          Kita buat komponen Client kecil untuk Navigasi agar tetap interaktif,
          ATAU kita biarkan sederhana tanpa active state highlight untuk sementara.
          
          Solusi terbaik: Kita buat komponen Client terpisah untuk Navigasi.
      */}
      <ManageNav courseId={courseId} />

      {/* Konten */}
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}

// --- KOMPONEN CLIENT KECIL UNTUK NAVIGASI (Agar Active State Jalan) ---
import { ManageNav } from './ManageNav'; // Kita akan buat file ini di bawah