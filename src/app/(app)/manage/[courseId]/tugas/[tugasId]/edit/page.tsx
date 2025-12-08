"use client";

import React, { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { getAssignmentById, updateAssignment } from '@/actions/assignment-actions';

// Helper: Convert Date object to "YYYY-MM-DDTHH:mm" string for input
const formatDateForInput = (date: Date) => {
  const d = new Date(date);
  // Mengatasi timezone offset agar jam tidak bergeser saat masuk ke input
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

export default function EditAssignmentPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const tugasId = params.tugasId as string;
  
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  
  // State Form
  const [formData, setFormData] = useState({
      title: "",
      description: "",
      dueDate: ""
  });

  // Load Data Lama
  useEffect(() => {
      async function loadData() {
          const data = await getAssignmentById(tugasId);
          if (data) {
              setFormData({
                  title: data.title,
                  description: data.description,
                  dueDate: formatDateForInput(data.dueDate)
              });
          }
          setLoading(false);
      }
      loadData();
  }, [tugasId]);

  const handleSubmit = (form: FormData) => {
    setError("");
    startTransition(async () => {
        // Kita panggil updateAssignment (pastikan action ini sudah Anda buat di langkah sebelumnya)
        const result = await updateAssignment(tugasId, courseId, form);
        if (result?.error) setError(result.error);
    });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/manage/${courseId}/tugas`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Tugas</h1>
      </div>

      <Card className="shadow-md">
        <CardHeader><CardTitle>Perbarui Informasi Tugas</CardTitle></CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            
            {/* Judul */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Tugas</label>
              <Input 
                name="title" 
                required 
                placeholder="Contoh: Makalah Studi Kasus" 
                defaultValue={formData.title} 
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instruksi Pengerjaan</label>
              <textarea 
                name="description" 
                required 
                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Jelaskan detail tugas..."
                defaultValue={formData.description}
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batas Pengumpulan (Deadline)</label>
              <Input 
                name="dueDate" 
                type="datetime-local" 
                required 
                className="w-full md:w-auto"
                defaultValue={formData.dueDate}
              />
            </div>

            {error && <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">{error}</div>}

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                Simpan Perubahan
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}