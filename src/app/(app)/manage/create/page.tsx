"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input'; // Pastikan komponen ini ada
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { createCourse } from '@/actions/course-actions';

export default function CreateCoursePage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const handleSubmit = async (formData: FormData) => {
    setError("");
    startTransition(async () => {
        const result = await createCourse(formData);
        if (result?.error) {
            setError(result.error);
        }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/manage">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Buat Mata Kuliah Baru</h1>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Informasi Mata Kuliah</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            
            {/* Judul */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Mata Kuliah</label>
              <Input name="title" required placeholder="Contoh: Pemrograman Web Lanjut" />
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <Input name="semester" required placeholder="Contoh: Ganjil 2024/2025" />
            </div>

            {/* Deskripsi (Pakai textarea manual karena belum ada komponen UI Textarea) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
              <textarea 
                name="description" 
                required 
                className="w-full min-h-[100px] p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Jelaskan apa yang akan dipelajari di mata kuliah ini..."
              />
            </div>

            {/* Cover Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar Sampul (Opsional)</label>
              <Input name="coverImage" placeholder="https://..." />
              <p className="text-xs text-gray-500 mt-1">Biarkan kosong untuk menggunakan gambar default.</p>
            </div>

            {error && (
                <div className="p-3 bg-red-100 text-red-600 text-sm rounded-md">
                    {error}
                </div>
            )}

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isPending} className="min-w-[120px]">
                {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                Simpan
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}