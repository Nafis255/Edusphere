"use client";

import React, { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, Users, ArrowLeft, Loader2, Lock } from 'lucide-react';
import { Modal } from '@/components/ui/Modal'; // <-- 1. Import Modal kita
import { Input } from '@/components/ui/Input'; // <-- 2. Import Input
import { getAvailableCourses, enrollCourse } from '@/actions/enrollment-actions';
import { toast } from 'sonner';

// Tipe data untuk Kursus
type CourseData = {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  instructorName: string;
  studentCount: number;
  enrollmentKey: string | null; // Opsional: untuk menampilkan ikon gembok
};

export default function BrowseCoursesPage() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // --- STATE UNTUK MODAL ---
  // Apakah modal sedang terbuka?
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Kursus mana yang sedang coba dimasuki? (Kita butuh ID-nya)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  // Apa yang diketik user di dalam modal?
  const [enrollmentKeyInput, setEnrollmentKeyInput] = useState("");

  // Load Data Awal
  useEffect(() => {
    async function loadData() {
        const data = await getAvailableCourses();
        // @ts-ignore
        setCourses(data);
        setLoading(false);
    }
    loadData();
  }, []);

  // --- FUNGSI UTAMA ---

  // 1. Dipanggil saat tombol "Daftar Sekarang" diklik
  const handleEnrollClick = (courseId: string) => {
      // Kita coba daftar langsung (siapa tahu tidak dikunci)
      // Parameter kedua kosong (undefined)
      executeEnrollment(courseId);
  };

  // 2. Dipanggil saat tombol "Masuk Kelas" DI DALAM MODAL diklik
  const handleSubmitKey = () => {
      if (selectedCourseId) {
          // Kita coba daftar lagi, TAPI kali ini bawa kuncinya
          executeEnrollment(selectedCourseId, enrollmentKeyInput);
      }
  };

  // 3. Logika inti pendaftaran (menghubungi Server Action)
  const executeEnrollment = (courseId: string, key?: string) => {
      startTransition(async () => {
          // Panggil Server Action
          const res = await enrollCourse(courseId, key);

          // SKENARIO A: Gagal karena butuh kunci (Server menolak)
          if (res?.error === "Kunci pendaftaran salah atau diperlukan.") {
            // Khusus error ini mungkin tidak perlu toast merah karena akan buka modal
            // Tapi bisa juga kasih warning kecil
            toast.info("Memerlukan Kunci Akses");
            
            setSelectedCourseId(courseId);
            setEnrollmentKeyInput(""); 
            setIsModalOpen(true);
          } 
          else if (res?.success) {
            setIsModalOpen(false);
            router.refresh();
            router.push(`/courses/${courseId}/materi`);
            
            // Toast Sukses di halaman baru (Sonner support lintas halaman kalau di Root Layout)
            toast.success("Berhasil Mendaftar!", {
                description: "Selamat belajar."
            });
          } 
          else {
            toast.error("Gagal Mendaftar", { description: res?.error });
          }
      });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/courses">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Katalog Mata Kuliah</h1>
            <p className="text-gray-600">Temukan dan daftar mata kuliah baru.</p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>
      ) : courses.length > 0 ? (
        
        /* Grid Daftar Kursus */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Card key={course.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow relative">
               
               {/* Ikon Gembok di pojok kanan atas (Hiasan) */}
               {course.enrollmentKey && (
                   <div className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full z-10" title="Dikunci">
                       <Lock className="h-3 w-3" />
                   </div>
               )}

               <img
                src={course.coverImage || "https://placehold.co/600x400?text=Course"}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                    <User className="h-3 w-3 mr-1" /> {course.instructorName}
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between pt-0">
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {course.description || "Tidak ada deskripsi."}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-500 flex items-center">
                        <Users className="h-3 w-3 mr-1" /> {course.studentCount} Peserta
                    </span>
                    <Button 
                        size="sm" 
                        disabled={isPending}
                        // Saat diklik, panggil fungsi handleEnrollClick
                        onClick={() => handleEnrollClick(course.id)}
                    >
                        {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Daftar Sekarang"}
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Tidak ada mata kuliah baru yang tersedia saat ini.</p>
        </div>
      )}

      {/* --- KOMPONEN MODAL (Tersembunyi sampai isModalOpen = true) --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Masukkan Kunci Pendaftaran"
      >
        <div className="space-y-4">
            <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm border border-yellow-200">
                <p className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Mata kuliah ini dikunci oleh Dosen.
                </p>
            </div>
            
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Kode Akses</label>
                <Input 
                    placeholder="Contoh: KELAS-A-123"
                    value={enrollmentKeyInput}
                    onChange={(e) => setEnrollmentKeyInput(e.target.value)}
                    autoFocus // Agar keyboard langsung muncul / kursor aktif
                />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                    Batal
                </Button>
                {/* Tombol ini akan memanggil fungsi handleSubmitKey */}
                <Button onClick={handleSubmitKey} disabled={isPending}>
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Masuk Kelas"}
                </Button>
            </div>
        </div>
      </Modal>

    </div>
  );
}