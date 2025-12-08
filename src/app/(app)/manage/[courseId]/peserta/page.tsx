"use client";

import React, { useEffect, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Tambah useRouter
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, UserX, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getCourseParticipants, removeParticipant } from '@/actions/participant-actions';
import { ConfirmModal } from '@/components/ui/ConfirmModal'; // <-- 1. Import Modal

export default function ManageParticipantsPage() {
  const params = useParams();
  const router = useRouter(); // <-- Init Router
  const courseId = params.courseId as string;
  
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- STATE MODAL KICK ---
  // Kita simpan ID dan Nama mahasiswa agar pesan konfirmasinya jelas
  const [kickData, setKickData] = useState<{ id: string, name: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load Data
  useEffect(() => {
    if (!courseId) return;
    async function loadData() {
        try {
            const data = await getCourseParticipants(courseId);
            setParticipants(data);
        } catch (e) { console.error(e) } 
        finally { setLoading(false); }
    }
    loadData();
  }, [courseId]);

  // 2. Handler saat tombol Kick diklik (Buka Modal)
  const handleKickClick = (studentId: string, studentName: string) => {
      setKickData({ id: studentId, name: studentName });
  };

  // 3. Handler Eksekusi Kick (Dipanggil Modal)
  const handleConfirmKick = () => {
      if (!kickData) return;

      startTransition(async () => {
          const res = await removeParticipant(kickData.id, courseId);
          if(res.success) {
              // Hapus dari state lokal
              setParticipants(prev => prev.filter(p => p.student.id !== kickData.id));
              setKickData(null); // Tutup Modal
              router.refresh();
          } else {
              alert("Gagal menghapus peserta.");
          }
      });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href="/manage">
                <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <CardTitle className="text-xl font-semibold">Daftar Peserta ({participants.length})</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="px-4">
        {participants.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Belum ada mahasiswa yang mendaftar.</p>
        ) : (
            <div className="divide-y divide-gray-200">
                {participants.map((p) => (
                    <div key={p.student.id} className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {p.student.avatarUrl ? (
                                    <img src={p.student.avatarUrl} className="w-full h-full object-cover" />
                                ) : <User className="h-5 w-5 text-gray-500" />}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{p.student.name}</p>
                                <p className="text-xs text-gray-500">{p.student.academicId} • {p.student.email}</p>
                            </div>
                        </div>
                        
                        {/* Tombol Kick (Updated) */}
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleKickClick(p.student.id, p.student.name)} // <-- Panggil fungsi buka modal
                        >
                            <UserX className="h-4 w-4 mr-2" /> Keluarkan
                        </Button>
                    </div>
                ))}
            </div>
        )}
      </CardContent>

      {/* --- 4. RENDER MODAL --- */}
      <ConfirmModal 
        isOpen={!!kickData}
        onClose={() => setKickData(null)}
        onConfirm={handleConfirmKick}
        isLoading={isPending}
        title={`Keluarkan ${kickData?.name}?`}
        description={`PERINGATAN: Mengeluarkan mahasiswa ini akan MENGHAPUS SEMUA PROGRES belajar, nilai tugas, dan nilai kuis mereka di mata kuliah ini.`}
      />

    </Card>
  );
}