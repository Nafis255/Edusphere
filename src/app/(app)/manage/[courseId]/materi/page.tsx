"use client";

import React, { useEffect, useState, useTransition } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  PlayCircle, FileText, Calendar, Presentation, TextIcon, 
  Plus, Edit2, Trash2, Loader2, ArrowLeft 
} from 'lucide-react';
import { getMaterials, deleteMaterial } from '@/actions/material-actions';
import { ConfirmModal } from '@/components/ui/ConfirmModal'; // <-- IMPORT MODAL

// Tipe Data
type MaterialData = {
  id: string;
  title: string;
  type: string;
  createdAt: Date;
};

// Helper format tanggal
function formatDate(date: Date | string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ManageMateriPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [materials, setMaterials] = useState<MaterialData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- STATE BARU UNTUK MODAL DELETE ---
  const [deleteId, setDeleteId] = useState<string | null>(null); // Menyimpan ID materi yang mau dihapus
  const [isPending, startTransition] = useTransition(); // Untuk loading saat menghapus

  useEffect(() => {
    if (!courseId) return;

    async function loadData() {
      try {
        const data = await getMaterials(courseId);
        // @ts-ignore
        setMaterials(data);
      } catch (error) {
        console.error("Gagal load data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [courseId]);

  // 1. Fungsi saat tombol SAMPAH diklik (Buka Modal)
  const handleClickDelete = (id: string) => {
      setDeleteId(id); // Simpan ID ke state, otomatis Modal terbuka karena deleteId tidak null
  };

  // 2. Fungsi saat tombol "YA, HAPUS" di Modal diklik
  const handleConfirmDelete = () => {
      if (!deleteId) return;

      startTransition(async () => {
          const res = await deleteMaterial(deleteId, courseId);
          
          if(res.success) {
              // Hapus dari tampilan
              setMaterials(prev => prev.filter(m => m.id !== deleteId));
              // Tutup Modal
              setDeleteId(null);
          } else {
              alert("Gagal menghapus materi.");
          }
      });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <PlayCircle className="h-5 w-5 text-blue-400" />;
      case 'PDF': return <FileText className="h-5 w-5 text-red-400" />;
      case 'PPT': return <Presentation className="h-5 w-5 text-orange-400" />;
      case 'TEXT': return <TextIcon className="h-5 w-5 text-gray-400" />;
      default: return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  if (!courseId) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href="/manage">
                <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <CardTitle className="text-xl font-semibold">Daftar Materi</CardTitle>
        </div>
        <Link href={`/manage/${courseId}/materi/create`}>
            <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Materi
            </Button>
        </Link>
      </CardHeader>
      
      <CardContent className="px-4"> 
        {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-500" /></div>
        ) : materials.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {materials.map(material => (
               <div key={material.id} className="block py-4 px-2 rounded-lg hover:bg-gray-50 transition-colors">
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                   {getIcon(material.type)}
                   <div>
                     <p className="font-semibold text-gray-900">{material.title}</p>
                     <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mt-1">
                       <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">{material.type}</span>
                       <span className="flex items-center">
                         <Calendar className="h-3 w-3 mr-1" />
                         {formatDate(material.createdAt)} 
                       </span>
                     </div>
                   </div>
                 </div>
         
                 <div className="flex space-x-2">
                   <Link href={`/manage/${courseId}/materi/${material.id}/edit`}>
                        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-100">
                            <Edit2 className="h-4 w-4" />
                        </Button>
                   </Link>

                   {/* TOMBOL DELETE: Panggil handleClickDelete */}
                   <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-600 hover:bg-red-100"
                        onClick={() => handleClickDelete(material.id)}
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
            <p>Belum ada materi di mata kuliah ini.</p>
            <p className="text-xs mt-1">Klik tombol hijau di atas untuk menambahkan.</p>
          </div>
        )}
      </CardContent>

      {/* --- RENDER MODAL DI SINI (Di luar loop) --- */}
      <ConfirmModal 
        isOpen={!!deleteId} // Modal buka jika deleteId tidak null
        onClose={() => setDeleteId(null)} // Tutup modal (set null)
        onConfirm={handleConfirmDelete} // Fungsi eksekusi
        isLoading={isPending}
        title="Hapus Materi?"
        description="Materi ini akan dihapus permanen dari database. Mahasiswa tidak akan bisa mengaksesnya lagi."
      />

    </Card>
  );
}