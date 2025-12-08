"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { createAssignment } from '@/actions/assignment-actions';

export default function CreateAssignmentPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (formData: FormData) => {
    setError("");
    startTransition(async () => {
        const result = await createAssignment(courseId, formData);
        if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/manage/${courseId}/tugas`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Buat Tugas Baru</h1>
      </div>

      <Card className="shadow-md">
        <CardHeader><CardTitle>Detail Tugas</CardTitle></CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            
            {/* Judul */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Tugas</label>
              <Input name="title" required placeholder="Contoh: Makalah Studi Kasus" />
            </div>

            {/* Deskripsi / Instruksi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instruksi Pengerjaan</label>
              <textarea 
                name="description" 
                required 
                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Jelaskan detail tugas, format pengumpulan, dll..."
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
              />
              <p className="text-xs text-gray-500 mt-1">Siswa tidak dapat mengumpulkan setelah waktu ini.</p>
            </div>

            {error && <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">{error}</div>}

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                Terbitkan Tugas
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}