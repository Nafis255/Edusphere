"use client"; // Kita butuh hook untuk baca query param

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Award, Check, X, ArrowLeft } from 'lucide-react';

export default function QuizResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.courseId as string;

  // Ambil data dari query URL
  const score = searchParams.get('score') || '0';
  const total = searchParams.get('total') || '0';
  const correct = searchParams.get('correct') || '0';
  const incorrect = parseInt(total) - parseInt(correct);

  const isPass = parseInt(score) >= 70; // Anggap KKM 70

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className={`shadow-lg ${isPass ? 'border-green-500' : 'border-red-500'}`}>
        <CardHeader className="text-center">
          <Award className={`h-20 w-20 mx-auto ${isPass ? 'text-green-500' : 'text-red-500'}`} />
          <CardTitle className="text-3xl font-bold mt-4">
            {isPass ? 'Selamat, Anda Lulus!' : 'Tetap Semangat, Coba Lagi!'}
          </CardTitle>
          <p className="text-lg text-gray-600">Skor Akhir Anda</p>
          <p className={`text-7xl font-bold ${isPass ? 'text-green-600' : 'text-red-600'}`}>
            {score}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Rincian Skor */}
          <div className="grid grid-cols-3 divide-x bg-gray-50 p-4 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Soal</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Jawaban Benar</p>
              <p className="text-2xl font-bold text-green-600">{correct}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Jawaban Salah</p>
              <p className="text-2xl font-bold text-red-600">{incorrect}</p>
            </div>
          </div>
          
          {/* Tombol Aksi */}
          <div className="flex justify-center space-x-4 pt-4">
            <Link href={`/courses/${courseId}/materi`}>
              <Button variant="secondary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Materi
              </Button>
            </Link>
            <Link href={`/courses/${courseId}/kuis`}>
              <Button>Lihat Kuis Lain</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}