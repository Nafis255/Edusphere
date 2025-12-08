"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { createQuiz } from '@/actions/quiz-actions';

export default function CreateQuizPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (formData: FormData) => {
    setError("");
    startTransition(async () => {
        const result = await createQuiz(courseId, formData);
        if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/manage/${courseId}/kuis`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Buat Kuis Baru</h1>
      </div>

      <Card className="shadow-md">
        <CardHeader><CardTitle>Informasi Dasar Kuis</CardTitle></CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            
            {/* Judul */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Kuis</label>
              <Input name="title" required placeholder="Contoh: Kuis Pertemuan 1" />
            </div>

            {/* Durasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (Menit)</label>
              <Input 
                name="duration" 
                type="number" 
                min="5" 
                required 
                placeholder="Contoh: 30" 
              />
              <p className="text-xs text-gray-500 mt-1">Waktu pengerjaan dalam menit.</p>
            </div>

            {error && <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">{error}</div>}

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                Simpan & Lanjut ke Soal
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}