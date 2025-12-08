"use client"; 

import React, { useEffect, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Tambah useRouter
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ClipboardCheck, Clock, Plus, Edit2, Trash2, 
  Loader2, ArrowLeft, Trophy 
} from 'lucide-react';
import { getQuizzes, deleteQuiz } from '@/actions/quiz-actions';
import { ConfirmModal } from '@/components/ui/ConfirmModal'; // <-- 1. Import Modal

type QuizData = {
  id: string;
  title: string;
  duration: number;
  _count: {
    questions: number;
  }
};

export default function ManageKuisPage() {
  const params = useParams();
  const router = useRouter(); // <-- Init Router
  const courseId = params.courseId as string;
  
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [loading, setLoading] = useState(true);

  // --- STATE MODAL DELETE ---
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load Data
  useEffect(() => {
    if(!courseId) return;
    async function loadData() {
        try {
            const data = await getQuizzes(courseId);
            // @ts-ignore
            setQuizzes(data);
        } catch (e) { console.error(e) } 
        finally { setLoading(false); }
    }
    loadData();
  }, [courseId]);

  // 2. Handler saat tombol Sampah diklik
  const handleDeleteClick = (id: string) => {
      setDeleteId(id); // Buka Modal
  };

  // 3. Handler Eksekusi Hapus (Dipanggil Modal)
  const handleConfirmDelete = () => {
      if (!deleteId) return;

      startTransition(async () => {
          const res = await deleteQuiz(deleteId, courseId);
          if(res.success) {
              // Hapus dari state lokal
              setQuizzes(prev => prev.filter(q => q.id !== deleteId));
              setDeleteId(null); // Tutup Modal
              router.refresh();
          } else {
              alert("Gagal menghapus.");
          }
      });
  };

  if (!courseId) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href="/manage">
                <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <CardTitle className="text-xl font-semibold">Daftar Kuis</CardTitle>
        </div>
        <Link href={`/manage/${courseId}/kuis/create`}>
            <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kuis Baru
            </Button>
        </Link>
      </CardHeader>
      
      <CardContent className="px-4"> 
        {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-500" /></div>
        ) : quizzes.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {quizzes.map(quiz => (
               <div key={quiz.id} className="block py-4 px-2 rounded-lg hover:bg-gray-50 transition-colors">
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                   <ClipboardCheck className="h-5 w-5 text-blue-400" />
                   <div>
                     <p className="font-semibold text-gray-900">{quiz.title}</p>
                     <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mt-1">
                       <span className="flex items-center">
                         <Clock className="h-3 w-3 mr-1" />
                         {quiz.duration} Menit
                       </span>
                       <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
                         {quiz._count.questions} Soal
                       </span>
                     </div>
                   </div>
                 </div>
         
                 <div className="flex space-x-2">
                   {/* Tombol Edit Soal */}
                   <Link href={`/manage/${courseId}/kuis/${quiz.id}/edit`}>
                        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-100" title="Kelola Soal">
                            <Edit2 className="h-4 w-4" />
                        </Button>
                   </Link>
                   
                   {/* Tombol Lihat Hasil */}
                   <Link href={`/manage/${courseId}/kuis/${quiz.id}/results`}>
                        <Button variant="ghost" size="icon" className="text-yellow-600 hover:bg-yellow-100" title="Lihat Hasil Mahasiswa">
                            <Trophy className="h-4 w-4" />
                        </Button>
                   </Link>
                   
                   {/* TOMBOL DELETE (Updated) */}
                   <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-600 hover:bg-red-100"
                        onClick={() => handleDeleteClick(quiz.id)} // <-- Panggil fungsi buka modal
                    >
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </div>
               </div>
             </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p>Belum ada kuis.</p>
            <p className="text-xs mt-1">Buat kuis baru untuk menguji pemahaman mahasiswa.</p>
          </div>
        )}
      </CardContent>

      {/* --- 4. RENDER MODAL --- */}
      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isPending}
        title="Hapus Kuis?"
        description="PERINGATAN: Menghapus kuis ini akan menghapus SEMUA SOAL dan NILAI MAHASISWA yang terkait secara permanen."
      />

    </Card>
  );
}