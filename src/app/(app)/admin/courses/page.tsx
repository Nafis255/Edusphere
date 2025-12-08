"use client";

import React, { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Trash2, Loader2, BookOpen } from 'lucide-react';
import { getAllCoursesAdmin, deleteCourseAdmin } from '@/actions/admin-actions';
import { ConfirmModal } from '@/components/ui/ConfirmModal'; // <-- 1. Import Modal

export default function ManageCoursesAdminPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();

  // --- STATE MODAL DELETE ---
  // Menyimpan ID dan Judul kursus yang akan dihapus
  const [deleteData, setDeleteData] = useState<{ id: string, title: string } | null>(null);

  useEffect(() => {
    async function loadData() {
        const data = await getAllCoursesAdmin();
        setCourses(data);
        setLoading(false);
    }
    loadData();
  }, []);

  // 2. Handler saat tombol Sampah diklik (Buka Modal)
  const handleDeleteClick = (id: string, title: string) => {
      setDeleteData({ id, title });
  };

  // 3. Handler Eksekusi Hapus (Dipanggil Modal)
  const handleConfirmDelete = () => {
      if (!deleteData) return;

      startTransition(async () => {
          const res = await deleteCourseAdmin(deleteData.id);
          
          if (res.success) {
              // Hapus dari state lokal
              setCourses(prev => prev.filter(c => c.id !== deleteData.id));
              setDeleteData(null); // Tutup Modal
          } else {
              alert("Gagal menghapus mata kuliah.");
          }
      });
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Mata Kuliah (Admin)</h1>
          <p className="text-lg text-gray-600">Kelola semua mata kuliah di platform.</p>
        </div>
      </div>
      
      <Card className="shadow-md">
        <CardHeader>
          <div className="relative w-full md:w-1/3">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Cari mata kuliah atau dosen..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 border-b">
                  <th className="px-4 py-3">Mata Kuliah</th>
                  <th className="px-4 py-3">Dosen Pengampu</th>
                  <th className="px-4 py-3">Peserta</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={course.coverImage || "https://placehold.co/60x40"}
                          alt={course.title}
                          className="w-16 h-10 rounded object-cover border"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{course.title}</p>
                          <p className="text-sm text-gray-500">{course.semester || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {course.instructor.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {course._count.enrollments}
                    </td>
                    <td className="px-4 py-3">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600 hover:bg-red-100"
                            // Panggil fungsi buka modal
                            onClick={() => handleDeleteClick(course.id, course.title)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCourses.length === 0 && (
            <p className="text-center text-gray-500 py-8">Tidak ada mata kuliah.</p>
          )}
        </CardContent>
      </Card>

      {/* --- 4. RENDER MODAL --- */}
      <ConfirmModal 
        isOpen={!!deleteData}
        onClose={() => setDeleteData(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isPending}
        title={`Hapus "${deleteData?.title}"?`}
        description="PERINGATAN ADMIN: Menghapus mata kuliah ini akan menghapus SELURUH data materi, tugas, kuis, dan nilai mahasiswa yang terkait secara permanen."
      />

    </div>
  );
}