"use client"; 

import React, { useEffect, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Tambah useRouter
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  FileInput, Calendar, Plus, Edit2, Trash2, 
  Loader2, ArrowLeft, Users 
} from 'lucide-react';
import { getAssignments, deleteAssignment } from '@/actions/assignment-actions';
import { ConfirmModal } from '@/components/ui/ConfirmModal'; // <-- 1. Import Modal

// Tipe Data
type AssignmentData = {
  id: string;
  title: string;
  dueDate: Date;
  _count: {
    submissions: number;
  }
};

// Helper format tanggal
function formatDueDate(date: Date) {
  return new Date(date).toLocaleString('id-ID', {
    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
  });
}

export default function ManageTugasPage() {
  const params = useParams();
  const router = useRouter(); // <-- Init Router
  const courseId = params.courseId as string;
  
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [loading, setLoading] = useState(true);

  // --- STATE MODAL DELETE ---
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load Data
  useEffect(() => {
    if(!courseId) return;
    async function loadData() {
        try {
            const data = await getAssignments(courseId);
            // @ts-ignore
            setAssignments(data);
        } catch (e) { console.error(e) } 
        finally { setLoading(false); }
    }
    loadData();
  }, [courseId]);

  // 2. Handler saat tombol Sampah diklik (Buka Modal)
  const handleDeleteClick = (id: string) => {
      setDeleteId(id);
  };

  // 3. Handler Eksekusi Hapus (Dipanggil Modal)
  const handleConfirmDelete = () => {
      if (!deleteId) return;

      startTransition(async () => {
          const res = await deleteAssignment(deleteId, courseId);
          if(res.success) {
              // Hapus dari state lokal
              setAssignments(prev => prev.filter(a => a.id !== deleteId));
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
            <CardTitle className="text-xl font-semibold">Daftar Tugas</CardTitle>
        </div>
        <Link href={`/manage/${courseId}/tugas/create`}>
            <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Buat Tugas Baru
            </Button>
        </Link>
      </CardHeader>
      
      <CardContent className="px-4"> 
        {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-500" /></div>
        ) : assignments.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {assignments.map(assignment => (
               <div key={assignment.id} className="block py-4 px-2 rounded-lg hover:bg-gray-50 transition-colors">
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                   <div className="p-2 bg-green-100 rounded-lg">
                     <FileInput className="h-5 w-5 text-green-600" />
                   </div>
                   <div>
                     <p className="font-semibold text-gray-900">{assignment.title}</p>
                     <div className="flex flex-wrap items-center gap-x-4 text-sm text-gray-500 mt-1">
                       <span className="flex items-center text-red-500">
                         <Calendar className="h-3 w-3 mr-1" />
                         Due: {formatDueDate(assignment.dueDate)}
                       </span>
                       <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs font-medium">
                         <Users className="h-3 w-3 mr-1" />
                         {assignment._count.submissions} Dikumpulkan
                       </span>
                     </div>
                   </div>
                 </div>
         
                 <div className="flex space-x-2">
                   
                   {/* Tombol Lihat Submission */}
                   <Link href={`/manage/${courseId}/tugas/${assignment.id}/submissions`}>
                        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-100" title="Lihat Submission">
                            <Users className="h-4 w-4" />
                        </Button>
                   </Link>

                   {/* Tombol Edit */}
                   <Link href={`/manage/${courseId}/tugas/${assignment.id}/edit`}>
                        <Button variant="ghost" size="icon" className="text-orange-600 hover:bg-orange-100" title="Edit Tugas">
                            <Edit2 className="h-4 w-4" />
                        </Button>
                   </Link>

                   {/* TOMBOL HAPUS (Updated) */}
                   <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-600 hover:bg-red-100"
                        onClick={() => handleDeleteClick(assignment.id)} // <-- Buka Modal
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
            <p>Belum ada tugas.</p>
            <p className="text-xs mt-1">Buat tugas baru untuk evaluasi mahasiswa.</p>
          </div>
        )}
      </CardContent>

      {/* --- 4. RENDER MODAL --- */}
      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isPending}
        title="Hapus Tugas?"
        description="PERINGATAN: Menghapus tugas ini akan menghapus semua SUBMISSION (jawaban) dan NILAI mahasiswa yang terkait secara permanen."
      />

    </Card>
  );
}