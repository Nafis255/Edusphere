"use client";

import React, { useEffect, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle, Save, Loader2, Trash2 } from 'lucide-react';
import { getCourseById, updateCourse, deleteCourse } from '@/actions/course-actions';
import { ConfirmModal } from '@/components/ui/ConfirmModal'; // <-- 1. Import Modal
import { toast } from 'sonner';

export default function ManageSettingsPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  
  // State untuk Modal Delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
      title: "",
      semester: "",
      enrollmentKey: "",
      description: "",
      coverImage: ""
  });

  // Load Data
  useEffect(() => {
    async function loadData() {
        const data = await getCourseById(courseId);
        if (data) {
            setFormData({
                title: data.title,
                semester: data.semester || "",
                enrollmentKey: data.enrollmentKey || "",
                description: data.description || "",
                coverImage: data.coverImage || ""
            });
        }
        setLoading(false);
    }
    loadData();
  }, [courseId]);

  // Handle Update (Simpan Perubahan)
  const handleSave = () => {
      startTransition(async () => {
          const form = new FormData();
          form.append("title", formData.title);
          form.append("semester", formData.semester);
          form.append("enrollmentKey", formData.enrollmentKey);
          form.append("description", formData.description);
          form.append("coverImage", formData.coverImage);

          const res = await updateCourse(courseId, form);
          if (res.success) {
            toast.success("Pengaturan berhasil disimpan!");
            router.refresh();
          } else {
            toast.error(res.error || "Gagal menyimpan.");
          }
      });
  };

  // Handle Delete (Eksekusi Penghapusan)
  const handleConfirmDelete = () => {
      startTransition(async () => {
          const res = await deleteCourse(courseId);
          
          if (res.success) {
              // Tutup modal dulu (opsional karena kita akan redirect)
              setShowDeleteModal(false);
              // Redirect ke dashboard manajemen
              router.push("/manage"); 
              router.refresh();
          } else {
              alert("Gagal menghapus mata kuliah.");
              setShowDeleteModal(false);
          }
      });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Kartu Informasi Umum */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Pengaturan Umum</CardTitle>
          <CardDescription>Ubah detail dasar mata kuliah Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Mata Kuliah</label>
                <Input 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <Input 
                    value={formData.semester} 
                    onChange={(e) => setFormData({...formData, semester: e.target.value})}
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
            <textarea 
                className="w-full min-h-[80px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Cover Image</label>
            <Input 
                value={formData.coverImage} 
                onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                placeholder="https://..."
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <label className="block text-sm font-bold text-blue-800 mb-1">Kunci Pendaftaran (Enrollment Key)</label>
            <Input 
                value={formData.enrollmentKey} 
                onChange={(e) => setFormData({...formData, enrollmentKey: e.target.value})}
                placeholder="Kosongkan agar pendaftaran terbuka untuk umum"
                type="text"
                className="bg-white"
            />
            <p className="text-xs text-blue-600 mt-1">
                Jika diisi, mahasiswa harus memasukkan kode ini saat mendaftar.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                Simpan Perubahan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kartu Zona Berbahaya */}
      <Card className="shadow-md border-red-200 bg-red-50/30">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            Zona Berbahaya
          </CardTitle>
          <CardDescription>Tindakan ini bersifat permanen dan tidak dapat dibatalkan.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
          <div>
            <h4 className="font-semibold text-gray-900">Hapus Mata Kuliah</h4>
            <p className="text-sm text-gray-600">
              Menghapus kelas ini beserta seluruh materi, tugas, dan nilai mahasiswa di dalamnya.
            </p>
          </div>
          
          <Button 
            variant="ghost" 
            className="bg-white text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-colors"
            onClick={() => setShowDeleteModal(true)} // <-- 2. Buka Modal saat diklik
            disabled={isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus Permanen
          </Button>
          
        </CardContent>
      </Card>

      {/* --- 3. KOMPONEN MODAL --- */}
      <ConfirmModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isPending}
        title="HAPUS MATA KULIAH?" // Judul Huruf Besar agar lebih waspada
        description="PERINGATAN: Apakah Anda yakin ingin menghapus mata kuliah ini? Semua data materi, tugas, kuis, dan nilai mahasiswa akan hilang selamanya."
      />

    </div>
  );
}