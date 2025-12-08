"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { createThread } from '@/actions/forum-actions';

export default function CreateThreadPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (formData: FormData) => {
    setError("");
    startTransition(async () => {
        const result = await createThread(courseId, formData);
        if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/courses/${courseId}/forum`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Mulai Diskusi Baru</h1>
      </div>

      <Card className="shadow-md">
        <CardHeader><CardTitle>Topik Diskusi</CardTitle></CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
              <Input name="title" required placeholder="Contoh: Bingung tentang materi UseEffect" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Isi Pesan</label>
              <textarea 
                name="content" 
                required 
                className="w-full min-h-[150px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Jelaskan pertanyaan atau topik diskusi Anda..."
              />
            </div>

            {error && <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">{error}</div>}

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
                Posting Thread
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}